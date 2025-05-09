import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { toast } from "sonner"

export function useAvatarUrl(avatarUrl: string | null) {
  const supabase = createClient()
  const [url, setUrl] = useState<string | null>(null)

  useEffect(() => {
    async function downloadImage(path: string) {
      try {
        if (path.startsWith('http')) {
          setUrl(path)
          return
        }

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
      if (url && !avatarUrl?.startsWith('http')) {
        URL.revokeObjectURL(url)
      }
    }
  }, [avatarUrl, supabase])

  return url
}