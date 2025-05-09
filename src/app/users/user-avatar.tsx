'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"

interface UserAvatarProps {
  avatarUrl: string | null
  fullName: string | null
  username: string | null
}

export function UserAvatar({ avatarUrl, fullName, username }: UserAvatarProps) {
  const supabase = createClient()
  const [url, setUrl] = useState<string | null>(null)

  useEffect(() => {
    async function downloadImage(path: string) {
      try {
        const { data, error } = await supabase.storage.from('avatars').download(path)
        if (error) {
          throw error
        }

        const url = URL.createObjectURL(data)
        setUrl(url)
      } catch (error) {
        toast.error("Error loading avatar")
      }
    }

    if (avatarUrl) {
      downloadImage(avatarUrl)
    }

    return () => {
      if (url) {
        URL.revokeObjectURL(url)
      }
    }
  }, [avatarUrl, supabase])

  return (
    <Avatar className="h-12 w-12">
      <AvatarImage src={url || undefined} alt="Avatar" />
      <AvatarFallback>
        {fullName?.charAt(0) || username?.charAt(0) || "U"}
      </AvatarFallback>
    </Avatar>
  )
}