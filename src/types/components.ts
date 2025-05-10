export interface AvatarUploadProps {
  uid: string | null;
  url: string | null;
  size: number;
  onUpload: (url: string) => void;
}