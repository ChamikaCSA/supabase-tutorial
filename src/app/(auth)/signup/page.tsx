'use client'
import { signup } from '../actions'
import { AuthForm } from '@/components/auth-form'

export default function SignUp() {
  return (
    <AuthForm
      type="signup"
      onSubmit={signup}
      title="Create Account"
      description="Join us and start your journey"
      submitText="Create Account"
      loadingText="Creating account..."
      linkText="Already have an account?"
      linkHref="/login"
      linkLabel="Login"
    />
  )
}