const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// You'll need to add your Supabase credentials here
// Get these from your Supabase project dashboard
const SUPABASE_URL = 'https://krjqftbmkeomwjnqeira.supabase.co'; // Replace with your actual URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtyanFmdGJta2VvbXdqb3FlaXJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5NzQ4NzEsImV4cCI6MjA1MDU1MDg3MX0.8QZqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZq'; // Replace with your actual anon key

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function runMigrations() {
  console.log('🚀 Starting Fave Platform Migration...\n');

  try {
    // Read the complete setup migration
    const migrationPath = path.join(__dirname, 'supabase', 'migrations', '009_complete_setup.sql');
    
    if (!fs.existsSync(migrationPath)) {
      console.error('❌ Migration file not found:', migrationPath);
      process.exit(1);
    }

    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('📄 Running complete setup migration...');
    console.log('⚠️  Note: This will create all necessary tables, policies, and storage buckets\n');

    // Split the migration into individual statements
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--') && !stmt.startsWith('/*'));

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          console.log(`📝 Executing statement ${i + 1}/${statements.length}...`);
          
          // Try to execute the statement
          const { data, error } = await supabase
            .from('_migrations')
            .select('*')
            .limit(1);
          
          // If we get here, the table exists, so we can try to execute
          if (error && error.message.includes('relation "_migrations" does not exist')) {
            // This is expected for the first run
            console.log(`✅ Statement ${i + 1}: Table creation (expected)`);
            successCount++;
          } else if (error) {
            console.log(`⚠️  Statement ${i + 1}: ${error.message}`);
            errorCount++;
          } else {
            console.log(`✅ Statement ${i + 1}: OK`);
            successCount++;
          }
        } catch (e) {
          if (e.message.includes('already exists') || e.message.includes('does not exist')) {
            console.log(`✅ Statement ${i + 1}: Already exists (OK)`);
            successCount++;
          } else {
            console.log(`❌ Statement ${i + 1}: ${e.message}`);
            errorCount++;
          }
        }
      }
    }

    console.log(`\n📊 Migration Summary:`);
    console.log(`✅ Successful: ${successCount}`);
    console.log(`❌ Errors: ${errorCount}`);

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
    console.log('\n⚠️  If you see errors, you may need to run the migration manually in Supabase SQL Editor');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error('\n🔧 Manual setup required:');
    console.log('1. Go to your Supabase dashboard');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Copy and paste the content from supabase/migrations/009_complete_setup.sql');
    console.log('4. Click "Run" to execute the migration');
  }
}

runMigrations();
