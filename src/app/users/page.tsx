import { createClient } from "@/utils/supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserAvatar } from "./user-avatar"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SignOutButton } from "@/components/sign-out-button"

export default async function UsersPage() {
  const supabase = await createClient();

  const { data: users, error } = await supabase.from("profiles").select("*");

  if (error) {
    return (
      <div className="w-full max-w-4xl p-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-destructive">
              Error loading users: {error.message}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl p-8 space-y-12">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/90 to-secondary drop-shadow-sm">
              Users
            </CardTitle>
            <CardDescription className="text-xl text-muted-foreground">
              All registered users in the system
            </CardDescription>
          </div>
          <div className="flex items-center gap-4">
            <Button asChild variant="secondary">
              <Link href="/account">Account Settings</Link>
            </Button>
            <SignOutButton />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users?.map((user) => (
              <div
                key={user.id}
                className="flex items-center space-x-4 p-4 rounded-lg border bg-card"
              >
                <UserAvatar
                  avatarUrl={user.avatar_url}
                  fullName={user.full_name}
                  username={user.username}
                />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user.full_name || "Anonymous"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {user.username || "No username"}
                  </p>
                </div>
                {user.website && (
                  <a
                    href={user.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    Website
                  </a>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
