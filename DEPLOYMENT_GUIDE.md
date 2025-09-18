# 🚀 Production Deployment Guide

## Quick Fix for Current Issue

The website isn't displaying because Supabase credentials are missing. Here's how to fix it:

### **Step 1: Get Your Supabase Credentials**

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Sign in and select your Fave project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** (starts with `https://`)
   - **Anon public key** (starts with `eyJ`)

### **Step 2: Deploy with Environment Variables**

#### **For Vercel:**
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add:
   - `VITE_SUPABASE_URL` = your Supabase URL
   - `VITE_SUPABASE_ANON_KEY` = your Supabase anon key
5. Redeploy your project

#### **For Netlify:**
1. Go to [netlify.com/dashboard](https://netlify.com/dashboard)
2. Select your site
3. Go to **Site settings** → **Environment variables**
4. Add:
   - `VITE_SUPABASE_URL` = your Supabase URL
   - `VITE_SUPABASE_ANON_KEY` = your Supabase anon key
5. Redeploy your site

### **Step 3: Build and Deploy**

```bash
# Build for production
npm run build

# Deploy (choose your platform)
# For Vercel: vercel --prod
# For Netlify: netlify deploy --prod --dir=dist
```

## 🔧 **Alternative: Quick Local Fix**

If you want to test locally first, update your `.env` file:

```env
VITE_SUPABASE_URL=https://your-actual-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 📋 **Production Checklist**

- [ ] Supabase credentials configured
- [ ] Environment variables set in deployment platform
- [ ] Database migrations run in production
- [ ] Storage buckets created
- [ ] RLS policies configured
- [ ] Domain configured (if custom)
- [ ] SSL certificate active

## 🚨 **Common Issues**

1. **"Invalid supabaseUrl"** → Missing or incorrect VITE_SUPABASE_URL
2. **"Invalid API key"** → Missing or incorrect VITE_SUPABASE_ANON_KEY
3. **Database errors** → Run migrations in production
4. **File upload errors** → Create storage buckets

## 🎯 **Next Steps After Deployment**

1. Test user registration
2. Test KYC flow
3. Test file uploads
4. Verify all features work
5. Set up monitoring

Your app should work perfectly once the environment variables are set!
