import { supabase, handleSupabaseError } from './supabase.js';

// ========================================
// USER MANAGEMENT SERVICES
// ========================================

export const userService = {
  // Get user by ID
  async getUserById(userId) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: handleSupabaseError(error, 'getUserById') };
    }
  },

  // Create or update user role
  async updateUserRole(userId, role) {
    try {
      // First try to get the user
      const { data: existingUser, error: getError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (getError && getError.code !== 'PGRST116') {
        // If it's not a "not found" error, throw it
        throw getError;
      }

      if (existingUser) {
        // User exists, update the role
        const { data, error } = await supabase
          .from('users')
          .update({ role })
          .eq('id', userId)
          .select()
          .single();

        if (error) throw error;
        return { success: true, data };
      } else {
        // User doesn't exist, create new user record
        const { data, error } = await supabase
          .from('users')
          .insert([{
            id: userId,
            role: role,
            is_kyc_complete: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }])
          .select()
          .single();

        if (error) throw error;
        return { success: true, data };
      }
    } catch (error) {
      return { success: false, error: handleSupabaseError(error, 'updateUserRole') };
    }
  },

  // Update KYC status
  async updateKYCStatus(userId, isComplete) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({ is_kyc_complete: isComplete })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: handleSupabaseError(error, 'updateKYCStatus') };
    }
  },

  // Get all users (admin only)
  async getAllUsers() {
    try {
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          user_profiles(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: handleSupabaseError(error, 'getAllUsers') };
    }
  }
};

// ========================================
// USER PROFILE SERVICES
// ========================================

export const profileService = {
  // Get user profile
  async getProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select(`
          *,
          distributor:distributors(name)
        `)
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: handleSupabaseError(error, 'getProfile') };
    }
  },

  // Create or update profile
  async upsertProfile(profileData) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .upsert(profileData, { 
          onConflict: 'user_id',
          ignoreDuplicates: false 
        })
        .select(`
          *,
          distributor:distributors(name)
        `)
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: handleSupabaseError(error, 'upsertProfile') };
    }
  },

  // Update wallet balance
  async updateWalletBalance(userId, amount) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update({ 
          wallet_balance: amount 
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: handleSupabaseError(error, 'updateWalletBalance') };
    }
  }
};

// ========================================
// DISTRIBUTOR SERVICES
// ========================================

export const distributorService = {
  // Get all active distributors
  async getActiveDistributors() {
    try {
      const { data, error } = await supabase
        .from('distributors')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: handleSupabaseError(error, 'getActiveDistributors') };
    }
  },

  // Get distributor by ID
  async getDistributorById(distributorId) {
    try {
      const { data, error } = await supabase
        .from('distributors')
        .select('*')
        .eq('id', distributorId)
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: handleSupabaseError(error, 'getDistributorById') };
    }
  }
};

// ========================================
// PROJECT SERVICES
// ========================================

export const projectService = {
  // Get all active projects
  async getActiveProjects() {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          creator:users!creator_id(
            id,
            email,
            user_profiles(full_name, stage_name, profile_photo_url)
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: handleSupabaseError(error, 'getActiveProjects') };
    }
  },

  // Get project by ID
  async getProjectById(projectId) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          creator:users!creator_id(
            id,
            email,
            user_profiles(full_name, stage_name, profile_photo_url)
          )
        `)
        .eq('id', projectId)
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: handleSupabaseError(error, 'getProjectById') };
    }
  },

  // Create new project
  async createProject(projectData) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([projectData])
        .select(`
          *,
          creator:users!creator_id(
            id,
            email,
            user_profiles(full_name, stage_name, profile_photo_url)
          )
        `)
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: handleSupabaseError(error, 'createProject') };
    }
  },

  // Update project
  async updateProject(projectId, updateData) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update(updateData)
        .eq('id', projectId)
        .select(`
          *,
          creator:users!creator_id(
            id,
            email,
            user_profiles(full_name, stage_name, profile_photo_url)
          )
        `)
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: handleSupabaseError(error, 'updateProject') };
    }
  },

  // Get projects by creator
  async getProjectsByCreator(creatorId) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('creator_id', creatorId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: handleSupabaseError(error, 'getProjectsByCreator') };
    }
  }
};

// ========================================
// TOKEN HOLDINGS SERVICES
// ========================================

export const tokenService = {
  // Get user's token holdings
  async getUserHoldings(userId) {
    try {
      const { data, error } = await supabase
        .from('token_holdings')
        .select(`
          *,
          project:projects(
            id,
            title,
            description,
            token_price,
            total_tokens,
            tokens_sold,
            is_active,
            creator:users!creator_id(
              user_profiles(full_name, stage_name)
            )
          )
        `)
        .eq('fan_id', userId)
        .order('purchased_at', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: handleSupabaseError(error, 'getUserHoldings') };
    }
  },

  // Purchase tokens
  async purchaseTokens(holdingData) {
    try {
      const { data, error } = await supabase
        .from('token_holdings')
        .upsert(holdingData, { 
          onConflict: 'fan_id,project_id',
          ignoreDuplicates: false 
        })
        .select(`
          *,
          project:projects(
            id,
            title,
            token_price,
            total_tokens,
            tokens_sold
          )
        `)
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: handleSupabaseError(error, 'purchaseTokens') };
    }
  },

  // Get project token holders
  async getProjectHolders(projectId) {
    try {
      const { data, error } = await supabase
        .from('token_holdings')
        .select(`
          *,
          fan:users!fan_id(
            id,
            email,
            user_profiles(full_name)
          )
        `)
        .eq('project_id', projectId)
        .order('purchased_at', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: handleSupabaseError(error, 'getProjectHolders') };
    }
  }
};

// ========================================
// TRANSACTION SERVICES
// ========================================

export const transactionService = {
  // Get user transactions
  async getUserTransactions(userId) {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          project:projects(
            id,
            title,
            creator:users!creator_id(
              user_profiles(full_name, stage_name)
            )
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: handleSupabaseError(error, 'getUserTransactions') };
    }
  },

  // Create transaction
  async createTransaction(transactionData) {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert([transactionData])
        .select(`
          *,
          project:projects(
            id,
            title,
            creator:users!creator_id(
              user_profiles(full_name, stage_name)
            )
          )
        `)
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: handleSupabaseError(error, 'createTransaction') };
    }
  },

  // Update transaction status
  async updateTransactionStatus(transactionId, status) {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .update({ status })
        .eq('id', transactionId)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: handleSupabaseError(error, 'updateTransactionStatus') };
    }
  }
};

// ========================================
// REVENUE PAYOUT SERVICES
// ========================================

export const revenueService = {
  // Get project revenue payouts
  async getProjectPayouts(projectId) {
    try {
      const { data, error } = await supabase
        .from('revenue_payouts')
        .select(`
          *,
          project:projects(
            id,
            title,
            creator:users!creator_id(
              user_profiles(full_name, stage_name)
            )
          )
        `)
        .eq('project_id', projectId)
        .order('payout_date', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: handleSupabaseError(error, 'getProjectPayouts') };
    }
  },

  // Create revenue payout
  async createPayout(payoutData) {
    try {
      const { data, error } = await supabase
        .from('revenue_payouts')
        .insert([payoutData])
        .select(`
          *,
          project:projects(
            id,
            title,
            creator:users!creator_id(
              user_profiles(full_name, stage_name)
            )
          )
        `)
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: handleSupabaseError(error, 'createPayout') };
    }
  }
};

// ========================================
// ANALYTICS SERVICES
// ========================================

export const analyticsService = {
  // Get platform statistics
  async getPlatformStats() {
    try {
      const [
        usersResult,
        projectsResult,
        transactionsResult,
        revenueResult
      ] = await Promise.all([
        supabase.from('users').select('count', { count: 'exact' }),
        supabase.from('projects').select('count', { count: 'exact' }).eq('is_active', true),
        supabase.from('transactions').select('count', { count: 'exact' }).eq('status', 'completed'),
        supabase.from('revenue_payouts').select('total_amount')
      ]);

      const stats = {
        totalUsers: usersResult.count || 0,
        activeProjects: projectsResult.count || 0,
        completedTransactions: transactionsResult.count || 0,
        totalRevenue: revenueResult.data?.reduce((sum, payout) => sum + parseFloat(payout.total_amount), 0) || 0
      };

      return { success: true, data: stats };
    } catch (error) {
      return { success: false, error: handleSupabaseError(error, 'getPlatformStats') };
    }
  },

  // Get user dashboard data
  async getUserDashboardData(userId, userRole) {
    try {
      let data = {};

      if (userRole === 'creator') {
        const [projectsResult, payoutsResult] = await Promise.all([
          projectService.getProjectsByCreator(userId),
          supabase
            .from('revenue_payouts')
            .select('total_amount')
            .eq('project_id', supabase.from('projects').select('id').eq('creator_id', userId))
        ]);

        data = {
          projects: projectsResult.data || [],
          totalPayouts: payoutsResult.data?.reduce((sum, payout) => sum + parseFloat(payout.total_amount), 0) || 0
        };
      } else if (userRole === 'fan') {
        const [holdingsResult, transactionsResult] = await Promise.all([
          tokenService.getUserHoldings(userId),
          transactionService.getUserTransactions(userId)
        ]);

        data = {
          holdings: holdingsResult.data || [],
          transactions: transactionsResult.data || []
        };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: handleSupabaseError(error, 'getUserDashboardData') };
    }
  }
};
