'use client'
import { signup } from '../../../lib/auth'
import { AuthForm } from '@/components/auth/auth-form'

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