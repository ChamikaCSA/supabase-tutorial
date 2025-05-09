'use client'

import { createClient } from '@/utils/supabase/client'
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

export function SignOutButton() {
  const supabase = createClient()
  const router = useRouter()
  const [signingOut, setSigningOut] = useState(false)

  const handleSignOut = async () => {
    try {
      setSigningOut(true)
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      router.push('/')
      router.refresh()
    } catch (error) {
      toast.error("Error signing out")
    } finally {
      setSigningOut(false)
    }
  }

  return (
    <Button
      variant="secondary"
      onClick={handleSignOut}
      disabled={signingOut}
    >
      {signingOut ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Signing out...
        </>
      ) : (
        'Sign out'
      )}
    </Button>
  )
}