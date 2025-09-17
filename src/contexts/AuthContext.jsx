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
    // Get initial session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        await fetchUserProfile(session.user.id);
      }
      setLoading(false);
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        await fetchUserProfile(session.user.id);
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId) => {
    try {
      console.log('Fetching user profile for user:', userId);
      const userResult = await userService.getUserById(userId);
      console.log('userResult:', userResult);
      if (userResult.success && userResult.data) {
        const profileResult = await profileService.getProfile(userId);
        console.log('profileResult:', profileResult);
        setUserProfile({
          ...userResult.data,
          profile: profileResult.success ? profileResult.data : null
        });
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
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
        throw error;
      }

      if (data.user) {
        console.log('User created, OTP sent to email. User record will be created after verification.');
        // User record will be created in OTPVerification component after verification
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

  const value = {
    user,
    userProfile,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    updateProfile,
    refreshProfile: () => fetchUserProfile(user?.id),
  };

  // Debug logging
  console.log('AuthContext value:', value);
  console.log('signUp in context:', signUp);
  console.log('typeof signUp in context:', typeof signUp);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
