'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAvatarUrl } from '@/hooks/use-avatar-url'
import { UserAvatarProps } from '@/types'

export function UserAvatar({ avatarUrl, fullName, username }: UserAvatarProps) {
  const url = useAvatarUrl(avatarUrl)

  return (
    <Avatar className="h-12 w-12">
      <AvatarImage src={url || undefined} alt="Avatar" />
      <AvatarFallback>
        {fullName?.charAt(0) || username?.charAt(0) || "U"}
      </AvatarFallback>
    </Avatar>
  )
}