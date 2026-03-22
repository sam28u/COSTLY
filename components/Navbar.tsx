import React from 'react'
import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Wallet, Clock, TrendingUp, User as UserIcon, LogOut } from "lucide-react"; // npm i lucide-react
import { handleSignOut } from "@/lib/actions/auth";

const Navbar = async () => {
    const session = await auth();
    return (
        <div>
            <nav className="flex items-center justify-between max-w-7xl mx-auto p-6">
                <Link href="/" className="flex items-center gap-2">
                    <div className="bg-indigo-600 p-2 rounded-lg">
                        <TrendingUp className="text-white w-5 h-5" />
                    </div>
                    <span className="font-bold text-xl tracking-tight text-slate-900">costly.io</span>
                </Link>
                <div className="flex items-center gap-4">
                    <img
                        src={session?.user?.image ?? ""}
                        alt={session?.user?.name ?? "Profile"}
                        className="w-8 h-8 rounded-full border border-slate-200"
                    />
                    <button className="text-slate-500 flex items-center gap-1 hover:text-black transition-colors" onClick={handleSignOut}>
                        <LogOut className="w-5 h-5" /> <span>Log Out</span>
                    </button>
                </div>
            </nav>
        </div>
    )
}

export default Navbar