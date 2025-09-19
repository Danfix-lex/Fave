import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { userService, profileService } from '../lib/database';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fallback timeout to ensure loading is never stuck
    const fallbackTimeout = setTimeout(() => {
      console.warn('Auth loading timeout - forcing loading to false');
      setLoading(false);
    }, 10000); // Increased to 10 seconds

    // Get initial session
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          // Fetch user profile from database with timeout
          await fetchFullProfile(session.user.id);
        }
        setLoading(false);
      } catch (error) {
        console.error('Session fetch error:', error);
        setLoading(false);
      }
    };

    getSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);
        // Fetch full profile from database with timeout
        await fetchFullProfile(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
      clearTimeout(fallbackTimeout);
    };
  }, []);

  const fetchUserProfile = async (userId) => {
    try {
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Profile fetch timeout')), 3000)
      );
      
      const profilePromise = userService.getUserById(userId);
      const userResult = await Promise.race([profilePromise, timeoutPromise]);
      
      if (userResult.success && userResult.data) {
        // User exists in public.users
        setUserProfile({
          ...userResult.data,
          profile: null // Profile will be fetched separately when needed
        });
      } else {
        // User doesn't exist in public.users, create a basic user profile
        setUserProfile({
          id: userId,
          email: user?.email || '',
          role: 'fan',
          is_kyc_complete: false
        });
      }
    } catch (error) {
      // Set a basic profile to prevent infinite loading
      setUserProfile({
        id: userId,
        email: user?.email || '',
        role: 'fan',
        is_kyc_complete: false
      });
    }
  };

  const fetchFullProfile = async (userId) => {
    console.log('AuthContext - fetchFullProfile called for userId:', userId);
    try {
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Profile fetch timeout')), 5000)
      );
      
      const profilePromise = (async () => {
        // First, get the user's role and basic info from users table
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('role, is_kyc_complete, email, created_at, updated_at')
          .eq('id', userId)
          .single();

        if (userError) {
          console.log('User not found in database, creating new user:', userId);
          // If user doesn't exist in users table, create them
          const { error: insertError } = await supabase
            .from('users')
            .insert([{
              id: userId,
              email: user?.email || '',
              role: 'fan',
              is_kyc_complete: false,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }]);

          if (insertError) {
            console.error('Failed to create user:', insertError);
            // Set default profile if database operations fail
            setUserProfile({
              id: userId,
              email: user?.email || '',
              role: 'fan',
              is_kyc_complete: false
            });
            return;
          }

          // Set default profile for new user
          setUserProfile({
            id: userId,
            email: user?.email || '',
            role: 'fan',
            is_kyc_complete: false
          });
          return;
        }

        console.log('Found existing user data:', userData);

        // Fetch the detailed profile data from user_profiles table
        const profileResult = await profileService.getProfile(userId);
        console.log('Profile fetch result:', profileResult);

        // Merge user data with profile data
        const mergedProfile = {
          id: userId,
          email: userData.email || user?.email || '',
          role: userData.role || 'fan',
          is_kyc_complete: userData.is_kyc_complete || false,
          created_at: userData.created_at,
          updated_at: userData.updated_at,
          // Merge profile data directly into the main userProfile object
          ...(profileResult.success && profileResult.data ? profileResult.data : {})
        };

        console.log('Setting merged user profile:', mergedProfile);
        setUserProfile(mergedProfile);
      })();

      // Race between profile fetch and timeout
      await Promise.race([profilePromise, timeoutPromise]);
      
    } catch (error) {
      console.error('Profile fetch error:', error);
      // Set a basic profile to prevent infinite loading
      setUserProfile({
        id: userId,
        email: user?.email || '',
        role: 'fan',
        is_kyc_complete: false
      });
    }
  };

  const signUp = async (email, password, role) => {
    try {
      // First, create user in Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        }
      });

      if (error) {
        // Handle specific error cases
        if (error.message.includes('User already registered')) {
          throw new Error('An account with this email already exists. Please sign in instead.');
        } else if (error.message.includes('Invalid email')) {
          throw new Error('Please enter a valid email address.');
        } else if (error.message.includes('Password should be at least')) {
          throw new Error('Password must be at least 6 characters long.');
        }
        
        throw error;
      }

      if (data.user) {
        // Create user record in database immediately
        try {
          const { error: dbError } = await supabase
            .from('users')
            .insert([{
              id: data.user.id,
              email: data.user.email,
              role: role || 'fan',
              is_kyc_complete: false,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }]);

          if (dbError) {
            // Don't fail the signup for database errors
          }
        } catch (dbError) {
          // Don't fail the signup for database errors
        }
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        }
      });

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        // Handle signout error silently
      }
      setUser(null);
      setUserProfile(null);
    } catch (error) {
      // Handle signout error silently
    }
  };

  const updateProfile = async (profileData) => {
    console.log('AuthContext - updateProfile called with:', profileData);
    try {
      if (user?.id) {
        // Prepare profile data for upsert
        const profileDataToSave = {
          user_id: user.id,
          ...profileData
        };

        console.log('AuthContext - upserting profile data:', profileDataToSave);
        const result = await profileService.upsertProfile(profileDataToSave);
        console.log('AuthContext - profile upsert result:', result);
        
        if (result.success) {
          // Update KYC status in users table
          console.log('AuthContext - updating KYC status for user:', user.id);
          const kycResult = await userService.updateKYCStatus(user.id, true);
          console.log('AuthContext - KYC update result:', kycResult);
          
          // Update userProfile with both profile data and KYC status
          setUserProfile(prev => {
            const newProfile = {
              ...prev,
              is_kyc_complete: true,
              profile: result.data
            };
            console.log('AuthContext - updated userProfile with profile and KYC:', newProfile);
            return newProfile;
          });

          return { success: true };
        } else {
          console.error('AuthContext - profile upsert failed:', result.error);
          return { error: result.error };
        }
      }
      return { error: new Error('User not found') };
    } catch (error) {
      console.error('Profile update error:', error);
      return { error: error };
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    updateProfile,
    fetchFullProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};