'use client'

import { usePresence } from '@/hooks/use-presence'

export function GlobalPresence() {
  usePresence()
  return null
}