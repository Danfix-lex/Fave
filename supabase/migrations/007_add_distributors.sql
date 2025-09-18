-- Add sample distributors for the platform
INSERT INTO distributors (name, description, website, is_active, created_at) VALUES 
  ('DistroKid', 'Leading music distribution platform for independent artists', 'https://distrokid.com', true, NOW()),
  ('CD Baby', 'Full-service music distribution and promotion platform', 'https://cdbaby.com', true, NOW()),
  ('TuneCore', 'Music distribution and publishing administration', 'https://tunecore.com', true, NOW()),
  ('Amuse', 'Free music distribution and label services', 'https://amus.io', true, NOW()),
  ('Ditto Music', 'Independent music distribution and label services', 'https://dittomusic.com', true, NOW()),
  ('ReverbNation', 'Music distribution and artist development platform', 'https://reverbnation.com', true, NOW()),
  ('SoundCloud Pro', 'Distribution through SoundCloud''s monetization platform', 'https://soundcloud.com', true, NOW()),
  ('AWAL', 'Artist-friendly distribution and label services', 'https://awal.com', true, NOW()),
  ('Symphonic Distribution', 'Full-service music distribution and marketing', 'https://symphonicdistribution.com', true, NOW()),
  ('Record Union', 'Music distribution and promotion services', 'https://recordunion.com', true, NOW())
ON CONFLICT (name) DO NOTHING;
