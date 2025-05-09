import AccountForm from './account-form'
import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Toaster } from "@/components/ui/sonner"
import { SignOutButton } from "@/components/sign-out-button"
import { NavigationButton } from "@/components/navigation-button"

export default async function Account() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="w-full max-w-4xl p-8 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div>
            <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/90 to-secondary drop-shadow-sm">
              Account Settings
            </CardTitle>
            <CardDescription className="text-base text-muted-foreground">
              Manage your account settings and profile information
            </CardDescription>
          </div>
          <div className="flex items-center gap-4">
            <NavigationButton href="/users">
              Back to Users
            </NavigationButton>
            <SignOutButton />
          </div>
        </CardHeader>
        <CardContent>
          <AccountForm user={user} />
        </CardContent>
      </Card>

      <Toaster />
    </div>
  )
}