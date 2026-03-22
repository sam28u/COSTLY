import Link from "next/link";
import { auth } from "@/lib/auth";
import { TrendingUp, LogOut, LayoutDashboard } from "lucide-react";
import { handleSignOut } from "@/lib/actions/auth";

export default async function Navbar() {
  const session = await auth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3 rounded-2xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-xl">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-indigo-600 p-2 rounded-lg group-hover:scale-110 transition-transform">
            <TrendingUp className="text-white w-5 h-5" />
          </div>
          <span className="font-black text-xl tracking-tighter text-slate-900 dark:text-white">
            costly<span className="text-indigo-500">.io</span>
          </span>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-6">
          {!session ? (
            <Link 
              href="/login" 
              className="text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:text-indigo-500 transition-colors"
            >
              Access Portal
            </Link>
          ) : (
            <div className="flex items-center gap-4">
              <Link 
                href="/dashboard" 
                className="hidden md:flex items-center gap-2 text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 hover:opacity-80"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
              
              <div className="h-4 w-[1px] bg-slate-300 dark:bg-slate-700 hidden md:block" />

              <div className="flex items-center gap-3">
                <img
                  src={session.user?.image ?? ""}
                  alt="Profile"
                  className="w-8 h-8 rounded-full border-2 border-indigo-500/20 shadow-inner"
                />
                <form action={handleSignOut}>
                    <button 
                        type="submit"
                        className="text-slate-500 hover:text-red-500 transition-colors flex items-center gap-1"
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-wider hidden sm:inline">Exit</span>
                    </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}