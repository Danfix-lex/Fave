# Fave Platform - Full Development Plan

## Project Overview
**Fave** is a full-stack web application that enables creators (musicians, filmmakers, authors) to tokenize their future royalties and sell them to fans (investors). The platform handles user authentication, KYC verification, token creation/management, payment processing, and revenue distribution.

## Technical Architecture

### Core Stack
- **Frontend**: React + Vite + Tailwind CSS + Relume.io components
- **Backend**: Node.js + Express.js
- **Database**: PostgreSQL with Supabase
- **Authentication**: Supabase Auth (email/password)
- **Payments**: Flutterwave/Paystack (test mode)
- **File Storage**: Supabase Storage (profile photos, project assets)

### Database Schema Design

#### Users Table
```sql
users (
  id uuid PRIMARY KEY,
  email text UNIQUE NOT NULL,
  role text CHECK (role IN ('creator', 'fan', 'admin')) NOT NULL,
  is_kyc_complete boolean DEFAULT false,
  is_approved boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
)
```

#### User Profiles Table
```sql
user_profiles (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  stage_name text, -- For creators only
  distributor_id uuid, -- For creators only
  id_number text NOT NULL,
  profile_photo_url text,
  wallet_balance decimal(10,2) DEFAULT 0.00,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
)
```

#### Distributors Table
```sql
distributors (
  id uuid PRIMARY KEY,
  name text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
)
```

#### Projects Table
```sql
projects (
  id uuid PRIMARY KEY,
  creator_id uuid REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  project_type text CHECK (project_type IN ('album', 'book', 'movie')) NOT NULL,
  royalty_percentage integer NOT NULL CHECK (royalty_percentage > 0 AND royalty_percentage <= 100),
  token_price decimal(10,2) NOT NULL,
  total_tokens integer NOT NULL, -- royalty_percentage * 1000
  tokens_sold integer DEFAULT 0,
  total_raised decimal(10,2) DEFAULT 0.00,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
)
```

#### Token Holdings Table
```sql
token_holdings (
  id uuid PRIMARY KEY,
  fan_id uuid REFERENCES users(id) ON DELETE CASCADE,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  tokens_owned integer NOT NULL,
  total_invested decimal(10,2) NOT NULL,
  purchased_at timestamptz DEFAULT now(),
  UNIQUE(fan_id, project_id)
)
```

#### Transactions Table
```sql
transactions (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES users(id),
  project_id uuid REFERENCES projects(id),
  transaction_type text CHECK (transaction_type IN ('token_purchase', 'revenue_payout', 'wallet_deposit')) NOT NULL,
  amount decimal(10,2) NOT NULL,
  tokens integer, -- For token purchases
  payment_reference text,
  status text CHECK (status IN ('pending', 'completed', 'failed')) DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
)
```

#### Revenue Payouts Table
```sql
revenue_payouts (
  id uuid PRIMARY KEY,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  total_amount decimal(10,2) NOT NULL,
  payout_date timestamptz DEFAULT now(),
  created_by uuid REFERENCES users(id),
  processed_at timestamptz DEFAULT now()
)
```

## Development Phases

### Phase 1: Foundation & Authentication (Day 1)
**Deliverables:**
1. Project setup with React + Vite + Tailwind + Relume.io
2. Supabase database configuration with complete schema
3. Authentication system (signup, login, logout)
4. Role-based routing protection
5. Basic layout with navigation

**Key Features:**
- User registration with role selection (Creator/Fan)
- Email/password authentication
- Protected routes based on user role
- Responsive navigation with role-specific menus

### Phase 2: KYC & Profile Management (Day 1-2)
**Deliverables:**
1. KYC profile completion forms for both user types
2. File upload system for profile photos
3. Distributor selection system for creators
4. Profile approval workflow for admins
5. Profile completion gate (users can't access platform until KYC complete)

**Key Features:**
- Creator KYC: name, stage name, distributor, email, ID number, photo
- Fan KYC: name, email, ID number, photo
- Profile photo upload with preview
- Distributor dropdown with pre-populated options
- Admin approval system

### Phase 3: Creator Dashboard & Project Creation (Day 2)
**Deliverables:**
1. Creator dashboard with project overview
2. Project creation form with validation
3. Token calculation logic (royalty % × 1000)
4. Project management interface
5. Revenue simulation tools

**Key Features:**
- Create projects (album/book/movie)
- Define royalty percentage to tokenize
- Set token pricing
- Automatic token supply calculation
- Project status tracking

### Phase 4: Fan Dashboard & Token Purchasing (Day 2-3)
**Deliverables:**
1. Fan dashboard with portfolio overview
2. Project browsing and discovery
3. Token purchase flow with payment integration
4. Wallet system for managing balances
5. Investment tracking and analytics

**Key Features:**
- Browse available projects
- View project details and token availability
- Purchase tokens with fiat payment
- Portfolio tracking with ownership percentages
- Transaction history

### Phase 5: Payment Integration & Token Management (Day 3)
**Deliverables:**
1. Flutterwave/Paystack integration (test mode)
2. Token minting and allocation system
3. Wallet top-up functionality
4. Payment verification and processing
5. Transaction logging and audit trail

**Key Features:**
- Secure payment processing
- Automatic token allocation after payment
- Real-time wallet balance updates
- Payment status tracking
- Refund handling for failed transactions

### Phase 6: Revenue Distribution System (Day 3-4)
**Deliverables:**
1. Mock distributor payout system
2. Revenue calculation and distribution logic
3. Automatic payout to token holders
4. Payout history and reporting
5. Creator revenue tracking

**Key Features:**
- "Distributor pays revenue" button for creators
- Proportional revenue distribution to token holders
- Automatic wallet credits for fans
- Revenue history and analytics
- Creator earnings tracking

### Phase 7: Admin Dashboard & Management (Day 4)
**Deliverables:**
1. Admin dashboard with system overview
2. User management and KYC approval
3. Project monitoring and analytics
4. Transaction oversight
5. Platform statistics and reporting

**Key Features:**
- Approve creators after KYC review
- Monitor all projects and token sales
- View comprehensive transaction logs
- Platform-wide analytics and insights
- User management tools

### Phase 8: Testing, Polish & Deployment (Day 4-5)
**Deliverables:**
1. Comprehensive testing across all user flows
2. UI/UX refinements and polish
3. Security hardening and validation
4. Performance optimization
5. Deployment configuration

**Key Features:**
- End-to-end testing of all workflows
- Mobile responsiveness verification
- Security audit and fixes
- Performance optimization
- Production deployment setup

## Key Technical Considerations

### Security & Compliance
- Row Level Security (RLS) for all database tables
- Input validation and sanitization
- Secure file upload with type/size restrictions
- HTTPS enforcement
- Payment data security (PCI compliance considerations)

### Scalability Features
- Database indexing for performance
- Pagination for large data sets
- Efficient token calculation algorithms
- Caching strategies for frequently accessed data
- Modular component architecture

### User Experience Focus
- Intuitive onboarding flows
- Clear progress indicators for multi-step processes
- Responsive design for all device types
- Real-time updates for critical actions
- Comprehensive error handling and user feedback

### Business Logic Implementation
- Token supply calculation: `royalty_percentage * 1000`
- Revenue distribution: Proportional to token ownership
- Wallet management: Secure balance tracking
- Project lifecycle: Creation → Token Sale → Revenue Distribution

## Success Metrics
- User registration and KYC completion rates
- Project creation and funding success rates
- Token purchase conversion rates
- Revenue distribution accuracy
- Platform transaction volume

This plan ensures a robust, scalable platform that can handle the complex workflows of creator-fan token interactions while maintaining security and user experience standards.
