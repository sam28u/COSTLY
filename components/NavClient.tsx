'use client'
import { LogOut } from "lucide-react";

export default function NavClient({ session, signOutAction }: { session: any, signOutAction: any }) {
  return (
    <div className="flex items-center gap-4">
      {session?.user && (
        <>
          <img src={session.user.image} className="w-8 h-8 rounded-full" />
          <form action={signOutAction}>
            <button type="submit" className="flex items-center gap-2">
              <LogOut className="w-4 h-4" /> Log Out
            </button>
          </form>
        </>
      )}
    </div>
  );
}