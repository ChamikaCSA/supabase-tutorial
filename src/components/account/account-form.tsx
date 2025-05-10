'use client'
import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { type User } from '@supabase/supabase-js'
import AvatarUpload from './avatar-upload'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { ProfileFormValues } from '@/types'

const formSchema = z.object({
  fullname: z.string().optional(),
  username: z.string().optional(),
  website: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
})

export default function AccountForm({ user }: { user: User | null }) {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [avatar_url, setAvatarUrl] = useState<string | null>(null)

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullname: "",
      username: "",
      website: "",
    },
  })

  const getProfile = useCallback(async () => {
    try {
      setLoading(true)

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`full_name, username, website, avatar_url`)
        .eq('id', user?.id)
        .single()

      if (error && status !== 406) {
        throw error
      }

      if (data) {
        form.reset({
          fullname: data.full_name || "",
          username: data.username || "",
          website: data.website || "",
        })
        setAvatarUrl(data.avatar_url)
      }
    } catch (error) {
      toast.error("Error loading user data!")
    } finally {
      setLoading(false)
    }
  }, [user, supabase, form])

  useEffect(() => {
    getProfile()
  }, [user, getProfile])

  async function updateProfile(values: ProfileFormValues) {
    try {
      setLoading(true)

      const { error } = await supabase.from('profiles').upsert({
        id: user?.id as string,
        full_name: values.fullname || null,
        username: values.username || null,
        website: values.website || null,
        avatar_url,
        updated_at: new Date().toISOString(),
      })
      if (error) throw error
      toast.success("Profile updated successfully!")
    } catch (error) {
      toast.error("Error updating profile!")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-6">
        <AvatarUpload
          uid={user?.id ?? null}
          url={avatar_url}
          size={100}
          onUpload={(url) => {
            setAvatarUrl(url)
          }}
        />
        <div className="flex-1">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(updateProfile)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="text" value={user?.email || ""} disabled />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fullname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input {...field} type="url" value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4 pt-2">
                <Button
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Update Profile'
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}