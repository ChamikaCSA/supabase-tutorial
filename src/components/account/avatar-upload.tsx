'use client'
import React, { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { useAvatarUrl } from '@/hooks/use-avatar-url'
import { AvatarUploadProps } from '@/types'

export default function AvatarUpload({
  uid,
  url,
  size,
  onUpload,
}: AvatarUploadProps) {
  const supabase = createClient()
  const avatarUrl = useAvatarUrl(url)
  const [uploading, setUploading] = useState(false)

  const uploadAvatar: React.ChangeEventHandler<HTMLInputElement> = async (event) => {
    try {
      setUploading(true)

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const filePath = `${uid}-${Math.random()}.${fileExt}`

      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      onUpload(filePath)
    } catch (error) {
      toast.error("Error uploading avatar")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative group">
        <Avatar className={cn(
          "h-[150px] w-[150px]",
          "border-2 border-dashed border-muted-foreground/25",
          "hover:border-primary/50 transition-colors",
          "cursor-pointer",
          uploading && "opacity-50"
        )}>
          <AvatarImage
            src={avatarUrl || undefined}
            alt="Avatar"
            className="object-cover"
          />
          <AvatarFallback className="bg-muted">
            {uploading ? (
              <Loader2 className="h-12 w-12 text-muted-foreground animate-spin" />
            ) : (
              <svg
                className="h-12 w-12 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            )}
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="relative">
        <input
          className="hidden"
          type="file"
          id="single"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading}
        />
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => document.getElementById('single')?.click()}
          disabled={uploading}
        >
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            'Upload Avatar'
          )}
        </Button>
      </div>
    </div>
  )
}