export interface AuthFormProps {
  type: 'login' | 'signup';
  onSubmit: (formData: FormData) => Promise<void>;
  title: string;
  description: string;
  submitText: string;
  loadingText: string;
  linkText: string;
  linkHref: string;
  linkLabel: string;
}

export interface AuthFormValues {
  email: string;
  password: string;
}