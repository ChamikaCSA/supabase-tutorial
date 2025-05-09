'use client'

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Loader2 } from "lucide-react"

interface NavigationButtonProps {
  href: string
  variant?: "default" | "secondary" | "outline" | "ghost" | "link" | "destructive"
  children: React.ReactNode
}

export function NavigationButton({ href, variant = "secondary", children }: NavigationButtonProps) {
  const [isNavigating, setIsNavigating] = useState(false)
  const pathname = usePathname()

  const handleClick = () => {
    if (pathname !== href) {
      setIsNavigating(true)
    }
  }

  return (
    <Button
      asChild
      variant={variant}
      onClick={handleClick}
      disabled={isNavigating}
    >
      <Link href={href}>
        {isNavigating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading...
          </>
        ) : (
          children
        )}
      </Link>
    </Button>
  )
}