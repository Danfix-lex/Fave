# Fave Platform - Creator Royalty Tokenization

A platform where creators can tokenize their future royalties and sell them to fans/investors.

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

2. **Environment Setup**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Edit .env and add your Supabase credentials:
   # VITE_SUPABASE_URL=https://your-project-id.supabase.co
   # VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

3. **Database Setup**
   - Create a new Supabase project at https://supabase.com
   - Copy your Project URL and Anon Key from Settings > API
   - Update your .env file with these credentials
   - Run the migration: The database schema will be created automatically

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## Project Structure

- `/src/pages/` - Main application pages (Landing, Login, Signup, Dashboard, KYC)
- `/src/components/` - Reusable components (Layout, ProtectedRoute)
- `/src/contexts/` - React contexts (AuthContext)
- `/src/lib/` - Utility libraries (Supabase client)
- `/supabase/migrations/` - Database migrations

## User Roles

- **Creators**: Musicians, authors, filmmakers who tokenize royalties
- **Fans**: Investors who buy creator tokens
- **Admins**: Platform administrators

## Features

- ✅ User authentication with role-based access
- ✅ KYC profile completion with photo upload
- ✅ Creator distributor selection
- ✅ Role-specific dashboards
- 🚧 Project creation and token management
- 🚧 Payment integration
- 🚧 Revenue distribution system

## Environment Variables

Required environment variables:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Database Schema

The application uses the following main tables:
- `users` - User authentication and roles
- `user_profiles` - KYC information and profiles
- `distributors` - Music distribution platforms
- `projects` - Creator tokenized projects
- `token_holdings` - Fan token investments
- `transactions` - All platform transactions
- `revenue_payouts` - Revenue distribution tracking

## Development

This project uses:
- React + Vite
- Tailwind CSS + Relume.io components
- Supabase (Database + Auth + Storage)
- React Router for navigation
- Lucide React for icons

## Support

For setup issues or questions, please check:
1. Your .env file has the correct Supabase credentials
2. Your Supabase project is active and accessible
3. The database migrations have been applied
