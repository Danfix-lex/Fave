-- Create songs table for approved songs
CREATE TABLE IF NOT EXISTS public.songs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  artist_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  artist_name VARCHAR(255) NOT NULL,
  genre VARCHAR(100) NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  audio_file_url TEXT,
  release_date DATE NOT NULL,
  price_per_token_usd DECIMAL(10, 4) NOT NULL,
  total_tokens INTEGER NOT NULL DEFAULT 1000,
  tokens_sold INTEGER NOT NULL DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'coming_soon' CHECK (status IN ('coming_soon', 'live', 'sold_out', 'ended')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by UUID REFERENCES public.users(id)
);

-- Create song submissions table for artist submissions
CREATE TABLE IF NOT EXISTS public.song_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  artist_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  genre VARCHAR(100) NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  audio_file_url TEXT,
  proposed_release_date DATE NOT NULL,
  proposed_price_per_token_usd DECIMAL(10, 4) NOT NULL,
  proposed_total_tokens INTEGER NOT NULL DEFAULT 1000,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'revision_requested')),
  admin_notes TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin users table
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  permissions JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create token purchases table
CREATE TABLE IF NOT EXISTS public.token_purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  song_id UUID NOT NULL REFERENCES public.songs(id) ON DELETE CASCADE,
  tokens_purchased INTEGER NOT NULL,
  price_per_token_usd DECIMAL(10, 4) NOT NULL,
  total_amount_usd DECIMAL(10, 2) NOT NULL,
  currency_code VARCHAR(3) NOT NULL,
  local_amount DECIMAL(15, 2) NOT NULL,
  transaction_hash TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_songs_artist_id ON public.songs(artist_id);
CREATE INDEX IF NOT EXISTS idx_songs_status ON public.songs(status);
CREATE INDEX IF NOT EXISTS idx_songs_release_date ON public.songs(release_date);
CREATE INDEX IF NOT EXISTS idx_song_submissions_artist_id ON public.song_submissions(artist_id);
CREATE INDEX IF NOT EXISTS idx_song_submissions_status ON public.song_submissions(status);
CREATE INDEX IF NOT EXISTS idx_token_purchases_user_id ON public.token_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_token_purchases_song_id ON public.token_purchases(song_id);

-- Enable RLS
ALTER TABLE public.songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.song_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.token_purchases ENABLE ROW LEVEL SECURITY;

-- RLS Policies for songs
CREATE POLICY "Anyone can view approved songs" ON public.songs
  FOR SELECT USING (true);

CREATE POLICY "Artists can view their own songs" ON public.songs
  FOR SELECT USING (auth.uid() = artist_id);

CREATE POLICY "Admins can manage all songs" ON public.songs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for song submissions
CREATE POLICY "Artists can view their own submissions" ON public.song_submissions
  FOR SELECT USING (auth.uid() = artist_id);

CREATE POLICY "Artists can create submissions" ON public.song_submissions
  FOR INSERT WITH CHECK (auth.uid() = artist_id);

CREATE POLICY "Artists can update their own pending submissions" ON public.song_submissions
  FOR UPDATE USING (
    auth.uid() = artist_id AND status = 'pending'
  );

CREATE POLICY "Admins can view all submissions" ON public.song_submissions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can update submissions" ON public.song_submissions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for admin users
CREATE POLICY "Admins can view admin users" ON public.admin_users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for token purchases
CREATE POLICY "Users can view their own purchases" ON public.token_purchases
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create purchases" ON public.token_purchases
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all purchases" ON public.token_purchases
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE user_id = auth.uid()
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_songs_updated_at BEFORE UPDATE ON public.songs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_song_submissions_updated_at BEFORE UPDATE ON public.song_submissions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_token_purchases_updated_at BEFORE UPDATE ON public.token_purchases
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create song from approved submission
CREATE OR REPLACE FUNCTION create_song_from_submission(submission_id UUID, admin_user_id UUID)
RETURNS UUID AS $$
DECLARE
  new_song_id UUID;
  submission_record RECORD;
BEGIN
  -- Get submission details
  SELECT * INTO submission_record 
  FROM public.song_submissions 
  WHERE id = submission_id AND status = 'approved';
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Submission not found or not approved';
  END IF;
  
  -- Create song
  INSERT INTO public.songs (
    title,
    artist_id,
    artist_name,
    genre,
    description,
    cover_image_url,
    audio_file_url,
    release_date,
    price_per_token_usd,
    total_tokens,
    approved_by
  ) VALUES (
    submission_record.title,
    submission_record.artist_id,
    (SELECT email FROM public.users WHERE id = submission_record.artist_id),
    submission_record.genre,
    submission_record.description,
    submission_record.cover_image_url,
    submission_record.audio_file_url,
    submission_record.proposed_release_date,
    submission_record.proposed_price_per_token_usd,
    submission_record.proposed_total_tokens,
    admin_user_id
  ) RETURNING id INTO new_song_id;
  
  -- Update submission status
  UPDATE public.song_submissions 
  SET 
    status = 'approved',
    reviewed_at = NOW(),
    reviewed_by = admin_user_id
  WHERE id = submission_id;
  
  RETURN new_song_id;
END;
$$ LANGUAGE plpgsql;
