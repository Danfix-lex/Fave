import { createContext, useContext, useEffect, useState } from 'react';
import { supabase, signInWithGoogle as signInWithGoogleHelper } from '../lib/supabase';
import { userService, profileService } from '../lib/database';

const AuthContext = createContext({});

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
      console.log('Fallback timeout - forcing loading to false');
      setLoading(false);
    }, 2000);

    // Get initial session
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          // Set basic profile immediately
          setUserProfile({
            id: session.user.id,
            email: session.user.email,
            role: 'fan',
            is_kyc_complete: false,
            profile: null
          });
          console.log('Initial session - basic profile set');
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        clearTimeout(fallbackTimeout);
        setLoading(false);
        console.log('Initial loading set to false');
      }
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event, session?.user?.email);
      
      if (session?.user) {
        setUser(session.user);
        // Set a basic user profile immediately without database calls
        setUserProfile({
          id: session.user.id,
          email: session.user.email,
          role: 'fan',
          is_kyc_complete: false,
          profile: null
        });
        console.log('Basic user profile set immediately');
      } else {
        setUser(null);
        setUserProfile(null);
      }
      
      // Always set loading to false
      setLoading(false);
      console.log('Loading set to false');
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId) => {
    try {
      console.log('Fetching user profile for user:', userId);
      
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Profile fetch timeout')), 3000)
      );
      
      const profilePromise = userService.getUserById(userId);
      const userResult = await Promise.race([profilePromise, timeoutPromise]);
      
      console.log('userResult:', userResult);
      
      if (userResult.success && userResult.data) {
        // User exists in public.users
        console.log('User found in public.users');
        setUserProfile({
          ...userResult.data,
          profile: null // Profile will be fetched separately when needed
        });
        console.log('User profile set successfully');
      } else {
        // User doesn't exist in public.users, create a basic user profile
        console.log('User not found in public.users, creating basic profile');
        setUserProfile({
          id: userId,
          email: user?.email || '',
          role: 'fan',
          is_kyc_complete: false,
          profile: null
        });
        console.log('Basic user profile set successfully');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // Set a basic user profile even if there's an error
      setUserProfile({
        id: userId,
        email: user?.email || '',
        role: 'fan',
        is_kyc_complete: false,
        profile: null
      });
      console.log('Fallback user profile set after error');
    }
  };

  const signUp = async (email, password, role) => {
    try {
      console.log('Starting signup process for:', email, 'role:', role);
      
      // First, create user in Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        }
      });

      console.log('Supabase signup response:', { data, error });

      if (error) {
        console.error('Supabase signup error:', error);
        
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
        console.log('User created, creating user record...');
        
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
            console.error('Database error during user creation:', dbError);
            // Don't fail the signup for database errors, but log them
          } else {
            console.log('User record created in database');
          }
        } catch (dbError) {
          console.error('Database error during user creation:', dbError);
        }
        
        console.log('User created, verification email sent');
      }

      console.log('Signup completed successfully');
      return { data, error: null };
    } catch (error) {
      console.error('Signup error:', error);
      return { data: null, error };
    }
  };

  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const signInWithGoogle = async (role) => {
    return await signInWithGoogleHelper(role);
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setUserProfile(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      // Use profile service to upsert profile
      const profileResult = await profileService.upsertProfile({
        user_id: user.id,
        ...profileData,
      });

      if (!profileResult.success) {
        throw new Error(profileResult.error.message);
      }

      // Update KYC completion status
      const kycResult = await userService.updateKYCStatus(user.id, true);
      if (!kycResult.success) {
        console.error('Error updating KYC status:', kycResult.error);
      }

      // Refresh user profile
      await fetchUserProfile(user.id);
      return { error: null };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { error };
    }
  };

  const refreshProfile = async () => {
    if (user?.id) {
      await fetchUserProfile(user.id);
    }
  };

  const fetchFullProfile = async () => {
    if (!user?.id) return null;
    
    try {
      const profileResult = await profileService.getProfile(user.id);
      if (profileResult.success) {
        setUserProfile(prev => ({
          ...prev,
          profile: profileResult.data
        }));
        return profileResult.data;
      }
    } catch (error) {
      console.error('Error fetching full profile:', error);
    }
    return null;
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
    refreshProfile,
    fetchFullProfile,
  };

  // Debug logging
  console.log('AuthContext value:', value);
  console.log('signUp in context:', signUp);
  console.log('typeof signUp in context:', typeof signUp);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
