import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { logout } from "@/lib/auth";
import { GlobalPresence } from "@/components/global-presence";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full">
      <GlobalPresence />
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-end">
          <form action={logout}>
            <Button variant="ghost" size="icon" type="submit">
              <LogOut />
            </Button>
          </form>
        </div>
      </header>
      <div className="pt-16">{children}</div>
    </div>
  );
}
