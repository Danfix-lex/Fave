import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Fave Platform Migration Helper\n');

// Read the migration file
const migrationPath = path.join(__dirname, 'supabase', 'migrations', '009_complete_setup.sql');

if (!fs.existsSync(migrationPath)) {
  console.error('❌ Migration file not found:', migrationPath);
  process.exit(1);
}

const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

console.log('📄 Migration file loaded successfully!');
console.log('📋 This migration will create:');
console.log('   • All necessary database tables');
console.log('   • Row Level Security (RLS) policies');
console.log('   • Storage buckets for file uploads');
console.log('   • Sample distributor data');
console.log('   • Database indexes and triggers\n');

console.log('🔧 To run this migration:');
console.log('1. Go to your Supabase dashboard: https://app.supabase.com/');
console.log('2. Select your project');
console.log('3. Go to SQL Editor (in the left sidebar)');
console.log('4. Click "New Query"');
console.log('5. Copy and paste the SQL below:');
console.log('\n' + '='.repeat(80));
console.log(migrationSQL);
console.log('='.repeat(80));
console.log('\n6. Click "Run" to execute the migration');
console.log('\n✅ After running the migration, your file uploads should work!');

// Also create a backup file
const backupPath = path.join(__dirname, 'migration-backup.sql');
fs.writeFileSync(backupPath, migrationSQL);
console.log(`\n💾 Migration SQL also saved to: ${backupPath}`);
