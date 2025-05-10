import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'sonner'

type PresenceStatus = 'online' | 'offline' | 'away'

export function usePresence() {
  const supabase = createClient()
  const [status, setStatus] = useState<PresenceStatus>('offline')

  useEffect(() => {
    let timeoutId: NodeJS.Timeout
    let awayTimeoutId: NodeJS.Timeout

    const updatePresence = async (action: 'online' | 'offline' | 'away') => {
      try {
        const { error } = await supabase.functions.invoke('handle-user-presence', {
          body: { action },
        })

        if (error) throw error
        setStatus(action)
      } catch (error) {
        toast.error('Failed to update presence status')
      }
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        updatePresence('online')
        clearTimeout(awayTimeoutId)
      } else {
        updatePresence('away')
      }
    }

    const handleWindowFocus = () => {
      updatePresence('online')
      clearTimeout(awayTimeoutId)
    }

    const handleWindowBlur = () => {
      updatePresence('away')
    }

    const handleBeforeUnload = () => {
      updatePresence('offline')
    }

    updatePresence('online')

    const resetAwayTimeout = () => {
      clearTimeout(awayTimeoutId)
      if (status === 'away') {
        updatePresence('online')
      }
      awayTimeoutId = setTimeout(() => {
        updatePresence('away')
      }, 5 * 60 * 1000) // 5 minutes
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', handleWindowFocus)
    window.addEventListener('blur', handleWindowBlur)
    window.addEventListener('beforeunload', handleBeforeUnload)
    document.addEventListener('mousemove', resetAwayTimeout)
    document.addEventListener('keydown', resetAwayTimeout)

    timeoutId = setInterval(() => {
      if (document.visibilityState === 'visible' && document.hasFocus()) {
        updatePresence('online')
      }
    }, 30 * 1000) // 30 seconds

    return () => {
      clearTimeout(timeoutId)
      clearTimeout(awayTimeoutId)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleWindowFocus)
      window.removeEventListener('blur', handleWindowBlur)
      window.removeEventListener('beforeunload', handleBeforeUnload)
      document.removeEventListener('mousemove', resetAwayTimeout)
      document.removeEventListener('keydown', resetAwayTimeout)
      updatePresence('offline')
    }
  }, [supabase])

  return status
}