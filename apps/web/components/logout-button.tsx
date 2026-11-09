import { LogOut } from "lucide-react";

import { Button } from "@repo/ui/components/ui/button";

import { logout } from "@/lib/auth-actions";

export function LogoutButton() {
  return (
    <form action={logout}>
      <Button type="submit" variant="ghost" size="sm">
        <LogOut className="size-4" />
        Sign out
      </Button>
    </form>
  );
}
