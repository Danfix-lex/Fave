import { testSupabaseConnection, handleSupabaseError } from './supabase.js';
import { 
  userService, 
  profileService, 
  distributorService, 
  projectService,
  tokenService,
  transactionService,
  analyticsService 
} from './database.js';

// ========================================
// BACKEND TESTING UTILITY
// ========================================

export class BackendTester {
  constructor() {
    this.results = [];
    this.errors = [];
  }

  async runAllTests() {
    console.log('🧪 Starting Backend Tests...\n');
    
    const tests = [
      { name: 'Supabase Connection', fn: this.testConnection },
      { name: 'Distributors Service', fn: this.testDistributors },
      { name: 'User Service', fn: this.testUserService },
      { name: 'Profile Service', fn: this.testProfileService },
      { name: 'Project Service', fn: this.testProjectService },
      { name: 'Token Service', fn: this.testTokenService },
      { name: 'Transaction Service', fn: this.testTransactionService },
      { name: 'Analytics Service', fn: this.testAnalyticsService },
    ];

    for (const test of tests) {
      await this.runTest(test.name, test.fn);
    }

    this.printResults();
    return this.results;
  }

  async runTest(name, testFunction) {
    try {
      console.log(`⏳ Running ${name}...`);
      const result = await testFunction.call(this);
      this.results.push({ name, status: 'PASS', result });
      console.log(`✅ ${name} - PASSED\n`);
    } catch (error) {
      this.results.push({ name, status: 'FAIL', error: error.message });
      this.errors.push({ name, error });
      console.log(`❌ ${name} - FAILED: ${error.message}\n`);
    }
  }

  async testConnection() {
    const result = await testSupabaseConnection();
    if (!result.success) {
      throw new Error('Failed to connect to Supabase');
    }
    return result;
  }

  async testDistributors() {
    const result = await distributorService.getActiveDistributors();
    if (!result.success) {
      throw new Error(`Failed to fetch distributors: ${result.error.message}`);
    }
    if (!result.data || result.data.length === 0) {
      throw new Error('No distributors found');
    }
    return { count: result.data.length, distributors: result.data.slice(0, 3) };
  }

  async testUserService() {
    // Test getting a non-existent user (should return error, not throw)
    const result = await userService.getUserById('00000000-0000-0000-0000-000000000000');
    if (result.success) {
      throw new Error('Expected error for non-existent user');
    }
    return { message: 'User service error handling works correctly' };
  }

  async testProfileService() {
    // Test getting a non-existent profile (should return error, not throw)
    const result = await profileService.getProfile('00000000-0000-0000-0000-000000000000');
    if (result.success) {
      throw new Error('Expected error for non-existent profile');
    }
    return { message: 'Profile service error handling works correctly' };
  }

  async testProjectService() {
    const result = await projectService.getActiveProjects();
    if (!result.success) {
      throw new Error(`Failed to fetch projects: ${result.error.message}`);
    }
    return { count: result.data.length, projects: result.data.slice(0, 3) };
  }

  async testTokenService() {
    // Test getting holdings for non-existent user
    const result = await tokenService.getUserHoldings('00000000-0000-0000-0000-000000000000');
    if (!result.success) {
      throw new Error(`Failed to fetch token holdings: ${result.error.message}`);
    }
    return { message: 'Token service error handling works correctly' };
  }

  async testTransactionService() {
    // Test getting transactions for non-existent user
    const result = await transactionService.getUserTransactions('00000000-0000-0000-0000-000000000000');
    if (!result.success) {
      throw new Error(`Failed to fetch transactions: ${result.error.message}`);
    }
    return { message: 'Transaction service error handling works correctly' };
  }

  async testAnalyticsService() {
    const result = await analyticsService.getPlatformStats();
    if (!result.success) {
      throw new Error(`Failed to fetch platform stats: ${result.error.message}`);
    }
    return result.data;
  }

  printResults() {
    console.log('📊 Backend Test Results Summary');
    console.log('================================');
    
    const passed = this.results.filter(r => r.status === 'PASS').length;
    const failed = this.results.filter(r => r.status === 'FAIL').length;
    
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📈 Success Rate: ${Math.round((passed / this.results.length) * 100)}%\n`);

    if (this.errors.length > 0) {
      console.log('🚨 Errors Found:');
      this.errors.forEach(({ name, error }) => {
        console.log(`  • ${name}: ${error.message}`);
      });
      console.log('\n💡 Troubleshooting Tips:');
      console.log('  1. Check your Supabase connection');
      console.log('  2. Verify environment variables');
      console.log('  3. Ensure database migrations are applied');
      console.log('  4. Check RLS policies');
    } else {
      console.log('🎉 All tests passed! Your backend is working correctly.');
    }
  }
}

// ========================================
// QUICK DIAGNOSTIC FUNCTIONS
// ========================================

export const quickDiagnostic = {
  // Check if environment variables are set
  checkEnvironment() {
    const issues = [];
    
    if (!import.meta.env.VITE_SUPABASE_URL) {
      issues.push('VITE_SUPABASE_URL is not set');
    }
    
    if (!import.meta.env.VITE_SUPABASE_ANON_KEY) {
      issues.push('VITE_SUPABASE_ANON_KEY is not set');
    }
    
    if (import.meta.env.VITE_SUPABASE_URL?.includes('your-project-ref')) {
      issues.push('VITE_SUPABASE_URL contains placeholder value');
    }
    
    if (import.meta.env.VITE_SUPABASE_ANON_KEY?.includes('your-anon-key')) {
      issues.push('VITE_SUPABASE_ANON_KEY contains placeholder value');
    }
    
    return {
      isValid: issues.length === 0,
      issues
    };
  },

  // Check database schema
  async checkSchema() {
    try {
      const { supabase } = await import('./supabase.js');
      
      const tables = [
        'users',
        'user_profiles', 
        'distributors',
        'projects',
        'token_holdings',
        'transactions',
        'revenue_payouts'
      ];
      
      const results = {};
      
      for (const table of tables) {
        try {
          const { data, error } = await supabase
            .from(table)
            .select('count', { count: 'exact' })
            .limit(1);
          
          results[table] = {
            exists: !error,
            error: error?.message,
            count: data?.length || 0
          };
        } catch (err) {
          results[table] = {
            exists: false,
            error: err.message,
            count: 0
          };
        }
      }
      
      return results;
    } catch (error) {
      return { error: error.message };
    }
  },

  // Check RLS policies
  async checkRLS() {
    try {
      const { supabase } = await import('./supabase.js');
      
      const { data, error } = await supabase
        .rpc('get_rls_policies');
      
      if (error) {
        // Fallback: try to query each table
        const tables = ['users', 'user_profiles', 'distributors', 'projects'];
        const results = {};
        
        for (const table of tables) {
          try {
            const { error: tableError } = await supabase
              .from(table)
              .select('*')
              .limit(1);
            
            results[table] = {
              rlsEnabled: !tableError || tableError.code === 'PGRST301',
              error: tableError?.message
            };
          } catch (err) {
            results[table] = {
              rlsEnabled: false,
              error: err.message
            };
          }
        }
        
        return results;
      }
      
      return { policies: data };
    } catch (error) {
      return { error: error.message };
    }
  }
};

// ========================================
// USAGE EXAMPLES
// ========================================

// Run all tests
export const runBackendTests = async () => {
  const tester = new BackendTester();
  return await tester.runAllTests();
};

// Quick environment check
export const checkEnvironment = () => {
  const result = quickDiagnostic.checkEnvironment();
  if (!result.isValid) {
    console.error('❌ Environment Issues:');
    result.issues.forEach(issue => console.error(`  • ${issue}`));
  } else {
    console.log('✅ Environment variables are properly configured');
  }
  return result;
};

// Check database schema
export const checkDatabase = async () => {
  console.log('🔍 Checking database schema...');
  const result = await quickDiagnostic.checkSchema();
  console.log('Database check result:', result);
  return result;
};

// Export everything for easy importing
export default {
  BackendTester,
  runBackendTests,
  checkEnvironment,
  checkDatabase,
  quickDiagnostic
};
