export interface ProfileFormValues {
  fullname?: string;
  username?: string;
  website?: string;
}

export interface AvatarUploadProps {
  uid: string | null;
  url: string | null;
  size: number;
  onUpload: (url: string) => void;
}
