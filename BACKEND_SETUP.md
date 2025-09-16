# 🚀 Fave Platform Backend Setup Guide

This guide will help you set up and troubleshoot your Supabase backend for the Fave Platform.

## 📋 Prerequisites

1. **Supabase Account**: Create a free account at [supabase.com](https://supabase.com)
2. **Node.js**: Version 16 or higher
3. **Git**: For version control

## 🔧 Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `fave-platform`
   - **Database Password**: Choose a strong password
   - **Region**: Select closest to your users
5. Click "Create new project"
6. Wait for the project to be created (2-3 minutes)

## 🔑 Step 2: Get API Keys

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (starts with `https://`)
   - **Anon public key** (starts with `eyJ`)

## 📁 Step 3: Environment Configuration

1. Create a `.env` file in your project root:
```bash
cp env.example .env
```

2. Update the `.env` file with your Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## 🗄️ Step 4: Database Setup

### Option A: Using Supabase Dashboard (Recommended)

1. Go to **SQL Editor** in your Supabase dashboard
2. Copy and paste the contents of `supabase/migrations/001_initial_schema.sql`
3. Click "Run" to execute the migration
4. Repeat for `002_verify_schema.sql` and `003_fix_verification_schema.sql`

### Option B: Using Supabase CLI

1. Install Supabase CLI:
```bash
npm install -g supabase
```

2. Login to Supabase:
```bash
supabase login
```

3. Link your project:
```bash
supabase link --project-ref your-project-ref
```

4. Run migrations:
```bash
supabase db push
```

## 🔒 Step 5: Configure Authentication

1. Go to **Authentication** → **Settings** in your Supabase dashboard
2. Configure the following:

### Site URL
- **Development**: `http://localhost:5173`
- **Production**: `https://yourdomain.com`

### Redirect URLs
Add these URLs to the allowed redirect URLs:
- `http://localhost:5173/**`
- `https://yourdomain.com/**`

### Email Settings
- Enable email confirmations (optional)
- Configure email templates if needed

## 📊 Step 6: Verify Database Setup

1. Go to **Table Editor** in your Supabase dashboard
2. Verify these tables exist:
   - `users`
   - `user_profiles`
   - `distributors`
   - `projects`
   - `token_holdings`
   - `transactions`
   - `revenue_payouts`

3. Check that the `distributors` table has data (15 distributors should be inserted)

## 🧪 Step 7: Test Connection

1. Start your development server:
```bash
npm run dev
```

2. Open browser console and check for:
   - ✅ "Supabase connection successful" message
   - ❌ Any error messages

3. Try signing up a new user to test authentication

## 🚨 Troubleshooting Common Issues

### Issue 1: "Missing Supabase environment variables"
**Solution**: 
- Ensure `.env` file exists in project root
- Check that environment variables are correctly named
- Restart your development server after adding `.env`

### Issue 2: "Invalid API key" or "Invalid URL"
**Solution**:
- Double-check your Supabase URL and API key
- Ensure no extra spaces or characters
- Verify the project is active in Supabase dashboard

### Issue 3: "Row Level Security policy violation"
**Solution**:
- Check that RLS policies are properly created
- Ensure user is authenticated before making requests
- Verify user has correct permissions

### Issue 4: "Foreign key constraint violation"
**Solution**:
- Ensure referenced records exist before creating relationships
- Check that IDs are valid UUIDs
- Verify data integrity

### Issue 5: Database connection timeout
**Solution**:
- Check your internet connection
- Verify Supabase project is not paused
- Try refreshing the page

## 🔧 Advanced Configuration

### Storage Setup
1. Go to **Storage** in your Supabase dashboard
2. Create a new bucket called `profile-photos`
3. Set it as public
4. Configure RLS policies for file uploads

### Real-time Subscriptions
Enable real-time for tables that need live updates:
1. Go to **Database** → **Replication**
2. Enable replication for:
   - `projects`
   - `token_holdings`
   - `transactions`

### Database Functions
The schema includes several PostgreSQL functions:
- `calculate_total_tokens()`: Auto-calculates token count
- `update_wallet_balance_on_transaction()`: Updates wallet on payouts

## 📈 Monitoring & Analytics

### Database Performance
1. Go to **Database** → **Logs** to monitor queries
2. Use **Database** → **Reports** for performance insights

### Authentication Monitoring
1. Go to **Authentication** → **Users** to see registered users
2. Check **Authentication** → **Logs** for auth events

## 🚀 Production Deployment

### Environment Variables
Update your production environment with:
```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your_production_anon_key
```

### Security Checklist
- [ ] RLS policies are enabled on all tables
- [ ] API keys are properly secured
- [ ] CORS is configured correctly
- [ ] Rate limiting is enabled
- [ ] Database backups are scheduled

## 📞 Support

If you're still experiencing issues:

1. **Check Supabase Status**: [status.supabase.com](https://status.supabase.com)
2. **Supabase Documentation**: [supabase.com/docs](https://supabase.com/docs)
3. **Community Discord**: [discord.supabase.com](https://discord.supabase.com)

## 🎯 Next Steps

Once your backend is set up:

1. Test user registration and login
2. Create sample projects
3. Test token purchases
4. Verify revenue payouts
5. Set up monitoring and alerts

---

**Need help?** Check the console logs for detailed error messages and refer to the troubleshooting section above.
