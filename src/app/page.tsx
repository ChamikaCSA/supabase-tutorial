import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="w-full max-w-4xl p-8 space-y-12">
      <Card className="text-center space-y-6">
        <CardHeader>
          <CardTitle className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/90 to-secondary drop-shadow-sm">
            Welcome
          </CardTitle>
          <CardDescription className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Sign in to your account or create a new one
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button asChild variant="default" size="lg" className="w-full sm:w-auto">
              <Link href="/login">
                Sign In
              </Link>
            </Button>

            <Button asChild variant="secondary" size="lg" className="w-full sm:w-auto">
              <Link href="/signup">
                Create Account
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}