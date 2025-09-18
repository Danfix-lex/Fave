// Script to create storage buckets in Supabase
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://krjqftbmkeomwjnqeira.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtyanFmdGJta2VvbXdqbnFlaXJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5Nzc0MzAsImV4cCI6MjA3MzU1MzQzMH0.P6xfa7JHl28y87EAmx02rfLSuTv_EbsQeP8wzuld0UM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createStorageBuckets() {
  console.log('Creating storage buckets...');

  const buckets = [
    {
      id: 'profile-photos',
      name: 'profile-photos',
      public: true
    },
    {
      id: 'identity-documents',
      name: 'identity-documents',
      public: false
    },
    {
      id: 'song-files',
      name: 'song-files',
      public: true
    }
  ];

  for (const bucket of buckets) {
    try {
      console.log(`Creating bucket: ${bucket.id}`);
      const { data, error } = await supabase.storage.createBucket(bucket.id, {
        public: bucket.public,
        allowedMimeTypes: bucket.public 
          ? ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'audio/mpeg', 'audio/wav', 'audio/mp3']
          : ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'],
        fileSizeLimit: bucket.public ? 52428800 : 10485760 // 50MB for public, 10MB for private
      });

      if (error) {
        if (error.message.includes('already exists')) {
          console.log(`✅ Bucket ${bucket.id} already exists`);
        } else {
          console.error(`❌ Error creating bucket ${bucket.id}:`, error.message);
        }
      } else {
        console.log(`✅ Successfully created bucket: ${bucket.id}`);
      }
    } catch (err) {
      console.error(`❌ Error creating bucket ${bucket.id}:`, err.message);
    }
  }

  // List all buckets to verify
  console.log('\n📋 Current storage buckets:');
  const { data: bucketsList, error: listError } = await supabase.storage.listBuckets();
  
  if (listError) {
    console.error('Error listing buckets:', listError.message);
  } else {
    bucketsList.forEach(bucket => {
      console.log(`- ${bucket.id} (public: ${bucket.public})`);
    });
  }
}

createStorageBuckets().catch(console.error);
