// Setup Super Admin Script
// Run this in your browser console after logging in to get your user ID

console.log('🔧 Super Admin Setup Script');
console.log('========================');

// Get current user info
const getCurrentUser = async () => {
  try {
    // This will work if you're logged in
    const response = await fetch('/api/auth/user', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('sb-access-token')}`
      }
    });
    
    if (response.ok) {
      const user = await response.json();
      return user;
    }
  } catch (error) {
    console.log('Could not fetch user from API, trying localStorage...');
  }
  
  // Fallback: try to get from localStorage
  const supabaseData = localStorage.getItem('sb-gilded-biscuit-743340-netlify-app-auth-token');
  if (supabaseData) {
    try {
      const parsed = JSON.parse(supabaseData);
      return parsed.currentSession?.user;
    } catch (e) {
      console.log('Could not parse localStorage data');
    }
  }
  
  return null;
};

// Main setup function
const setupSuperAdmin = async () => {
  console.log('1. Getting current user...');
  const user = await getCurrentUser();
  
  if (!user) {
    console.log('❌ No user found. Please log in first.');
    return;
  }
  
  console.log('✅ User found:', user.email);
  console.log('🆔 User ID:', user.id);
  
  console.log('\n2. SQL Query to run in Supabase Dashboard:');
  console.log('==========================================');
  console.log(`
INSERT INTO public.admin_users (user_id, role, permissions)
VALUES (
  '${user.id}',
  'super_admin',
  '{
    "can_manage_users": true,
    "can_manage_admins": true,
    "can_manage_songs": true,
    "can_manage_submissions": true,
    "can_view_analytics": true,
    "can_manage_system": true,
    "can_approve_songs": true,
    "can_reject_songs": true,
    "can_request_revisions": true,
    "can_view_all_data": true
  }'::jsonb
);
  `);
  
  console.log('\n3. Steps to complete setup:');
  console.log('===========================');
  console.log('1. Copy the SQL query above');
  console.log('2. Go to your Supabase Dashboard');
  console.log('3. Navigate to SQL Editor');
  console.log('4. Paste and run the query');
  console.log('5. Refresh your admin dashboard');
  console.log('6. You should now see "Super Admin" badge!');
  
  console.log('\n🎉 Setup complete! You will have full admin privileges.');
};

// Run the setup
setupSuperAdmin();
