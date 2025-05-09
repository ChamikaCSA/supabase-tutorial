'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { toast } from "sonner"
import { useState } from "react"
import { Loader2 } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { FcGoogle } from 'react-icons/fc'
import { FaGithub } from 'react-icons/fa'
import Link from 'next/link'
import { signInWithProvider } from '@/app/(auth)/actions'

interface AuthFormProps {
  type: 'login' | 'signup'
  onSubmit: (formData: FormData) => Promise<void>
  title: string
  description: string
  submitText: string
  loadingText: string
  linkText: string
  linkHref: string
  linkLabel: string
}

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string()
    .min(6, "Password must be at least 6 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
})

export function AuthForm({
  type,
  onSubmit,
  title,
  description,
  submitText,
  loadingText,
  linkText,
  linkHref,
  linkLabel,
}: AuthFormProps) {
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true)
      const formData = new FormData()
      formData.append('email', values.email)
      formData.append('password', values.password)
      await onSubmit(formData)
    } catch (error) {
      toast.error(type === 'login' ? "Invalid email or password" : "Error creating account")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md p-8 space-y-8">
      <Card>
        <CardHeader className="text-center space-y-4">
          <CardTitle className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/90 to-secondary drop-shadow-sm">
            {title}
          </CardTitle>
          <CardDescription className="text-lg">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                onClick={() => signInWithProvider('google')}
                disabled={loading}
                className="flex items-center justify-center gap-2"
              >
                <FcGoogle className="h-5 w-5" />
                Google
              </Button>
              <Button
                variant="outline"
                onClick={() => signInWithProvider('github')}
                disabled={loading}
                className="flex items-center justify-center gap-2"
              >
                <FaGithub className="h-5 w-5" />
                GitHub
              </Button>
            </div>

            <div className="relative flex items-center gap-2">
              <Separator className="flex-1" />
              <span className="text-xs uppercase text-muted-foreground px-2">
                Or continue with
              </span>
              <Separator className="flex-1" />
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="you@example.com"
                          {...field}
                          type="email"
                          autoComplete="email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                          autoComplete={type === 'login' ? 'current-password' : 'new-password'}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  variant={type === 'login' ? 'default' : 'secondary'}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {loadingText}
                    </>
                  ) : (
                    submitText
                  )}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  {linkText}{' '}
                  <Link
                    href={linkHref}
                    className="text-primary hover:text-primary/80 transition-colors"
                  >
                    {linkLabel}
                  </Link>
                </p>
              </form>
            </Form>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}