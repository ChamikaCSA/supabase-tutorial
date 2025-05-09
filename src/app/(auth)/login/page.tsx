'use client'
import { login } from '../actions'
import { AuthForm } from '@/components/auth-form'

export default function Login() {
  return (
    <AuthForm
      type="login"
      onSubmit={login}
      title="Welcome Back"
      description="Sign in to your account"
      submitText="Sign In"
      loadingText="Signing in..."
      linkText="Don't have an account?"
      linkHref="/signup"
      linkLabel="Sign up"
    />
  )
}