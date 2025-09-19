# 🚀 Deploy Fave to Render

## Step 1: Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with your GitHub account
3. Connect your GitHub repository

## Step 2: Deploy Your App
1. **Click "New +"** → **"Static Site"**
2. **Connect Repository**: Select your Fave repository
3. **Configure Settings**:
   - **Name**: `fave-app` (or any name you prefer)
   - **Branch**: `main`
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
   - **Node Version**: `18` (or latest)

## Step 3: Set Environment Variables
In the Render dashboard, go to your service → **Environment** tab and add:

```
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
VITE_SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

## Step 4: Deploy
1. Click **"Create Static Site"**
2. Render will automatically build and deploy your app
3. You'll get a URL like: `https://fave-app.onrender.com`

## Step 5: Update Supabase Settings
1. Go to your Supabase dashboard
2. Go to **Authentication** → **URL Configuration**
3. Add your Render URL to **Site URL** and **Redirect URLs**:
   - Site URL: `https://fave-app.onrender.com`
   - Redirect URLs: `https://fave-app.onrender.com/auth/callback`

## Step 6: Update Google OAuth (if using)
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Go to **APIs & Services** → **Credentials**
3. Edit your OAuth 2.0 Client ID
4. Add your Render URL to **Authorized JavaScript origins** and **Authorized redirect URIs**:
   - `https://fave-app.onrender.com`
   - `https://fave-app.onrender.com/auth/callback`

## Benefits of Render:
- ✅ **Free tier** with generous limits
- ✅ **Automatic deployments** from GitHub
- ✅ **Custom domains** support
- ✅ **Environment variables** management
- ✅ **HTTPS** by default
- ✅ **Global CDN**

## Render vs Netlify:
- **Render**: Better for full-stack apps, more generous free tier
- **Netlify**: Better for static sites, more features for frontend

Your app will work exactly the same on Render! 🎉
