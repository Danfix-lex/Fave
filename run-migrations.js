const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials!');
  console.error('Make sure VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in your .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigrations() {
  console.log('🚀 Starting Fave Platform Migration...\n');

  try {
    // Read and run the complete setup migration
    const migrationPath = path.join(__dirname, 'supabase', 'migrations', '009_complete_setup.sql');
    
    if (!fs.existsSync(migrationPath)) {
      console.error('❌ Migration file not found:', migrationPath);
      process.exit(1);
    }

    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('📄 Running complete setup migration...');
    
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: migrationSQL
    });

    if (error) {
      // If exec_sql doesn't exist, try direct query
      console.log('⚠️  exec_sql not available, trying direct execution...');
      
      // Split the migration into individual statements
      const statements = migrationSQL
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

      for (const statement of statements) {
        if (statement.trim()) {
          try {
            const { error: stmtError } = await supabase
              .from('_migrations')
              .select('*')
              .limit(1); // This will fail but we don't care, just testing connection
            
            // Execute the statement directly
            const { error: execError } = await supabase
              .rpc('exec', { sql: statement });
            
            if (execError && !execError.message.includes('already exists') && !execError.message.includes('does not exist')) {
              console.log(`⚠️  Statement warning: ${execError.message}`);
            }
          } catch (e) {
            console.log(`⚠️  Statement skipped: ${e.message}`);
          }
        }
      }
    } else {
      console.log('✅ Migration executed successfully!');
    }

    // Verify tables were created
    console.log('\n🔍 Verifying database setup...');
    
    const tables = ['users', 'user_profiles', 'distributors', 'songs', 'song_submissions', 'admin_users', 'token_purchases'];
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1);
        
        if (error) {
          console.log(`❌ Table ${table}: ${error.message}`);
        } else {
          console.log(`✅ Table ${table}: OK`);
        }
      } catch (e) {
        console.log(`❌ Table ${table}: ${e.message}`);
      }
    }

    // Check storage buckets
    console.log('\n🪣 Checking storage buckets...');
    
    try {
      const { data: buckets, error: bucketError } = await supabase
        .storage
        .listBuckets();
      
      if (bucketError) {
        console.log(`❌ Storage error: ${bucketError.message}`);
      } else {
        const bucketNames = buckets.map(b => b.name);
        const requiredBuckets = ['profile-photos', 'identity-documents', 'song-files'];
        
        for (const bucket of requiredBuckets) {
          if (bucketNames.includes(bucket)) {
            console.log(`✅ Bucket ${bucket}: OK`);
          } else {
            console.log(`❌ Bucket ${bucket}: Missing`);
          }
        }
      }
    } catch (e) {
      console.log(`❌ Storage check failed: ${e.message}`);
    }

    console.log('\n🎉 Migration process completed!');
    console.log('\n📋 Next steps:');
    console.log('1. Check your Supabase dashboard for the created tables and buckets');
    console.log('2. Test file uploads in your KYC and Profile sections');
    console.log('3. Verify that user roles are displaying correctly');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error('\n🔧 Manual setup required:');
    console.log('1. Go to your Supabase dashboard');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Copy and paste the content from supabase/migrations/009_complete_setup.sql');
    console.log('4. Click "Run" to execute the migration');
    process.exit(1);
  }
}

runMigrations();
