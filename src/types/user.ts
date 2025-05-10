export interface User {
  id: string;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  website?: string | null;
  updated_at?: string;
}

export interface UserAvatarProps {
  avatarUrl: string | null;
  fullName: string | null;
  username: string | null;
}

export interface ProfileFormValues {
  fullname?: string;
  username?: string;
  website?: string;
}