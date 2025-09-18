// Shared constants for the application

export const MUSIC_GENRES = [
  'Electronic', 'Hip-Hop', 'Indie', 'Pop', 'Rock', 'Jazz', 
  'R&B', 'Country', 'Classical', 'Reggae', 'Afrobeat', 'Gospel'
];

export const SONG_STATUSES = {
  PENDING: 'pending',
  COMING_SOON: 'coming_soon',
  LIVE: 'live',
  SOLD_OUT: 'sold_out',
  ENDED: 'ended'
};

export const USER_ROLES = {
  FAN: 'fan',
  CREATOR: 'creator',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin'
};

export const ADMIN_PERMISSIONS = {
  CAN_MANAGE_USERS: 'can_manage_users',
  CAN_MANAGE_ADMINS: 'can_manage_admins',
  CAN_MANAGE_SONGS: 'can_manage_songs',
  CAN_MANAGE_SUBMISSIONS: 'can_manage_submissions',
  CAN_VIEW_ANALYTICS: 'can_view_analytics',
  CAN_MANAGE_SYSTEM: 'can_manage_system',
  CAN_APPROVE_SONGS: 'can_approve_songs',
  CAN_REJECT_SONGS: 'can_reject_songs',
  CAN_REQUEST_REVISIONS: 'can_request_revisions',
  CAN_VIEW_ALL_DATA: 'can_view_all_data'
};
