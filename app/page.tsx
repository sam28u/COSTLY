'use client'

import { useState, useEffect, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Clock, Wallet, ArrowRight, Zap } from 'lucide-react'
import Link from 'next/link' // Import Link for navigation
import { signIn } from "next-auth/react" // Import the client-side sign-in method

export default function LandingPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] text-slate-900 dark:text-slate-100 transition-colors duration-500 overflow-hidden font-sans">

      {/* Background Decorative Blobs */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 dark:bg-cyan-500/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-[120px]" />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">

        <section className="text-center space-y-8 mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/40 dark:bg-white/5 border border-white/20 dark:border-white/10 backdrop-blur-md shadow-xl"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Quantifying the Invisible Tax</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-6xl md:text-8xl font-black tracking-tighter italic bg-linear-to-b from-slate-900 via-slate-700 to-slate-500 dark:from-white dark:via-slate-300 dark:to-slate-600 bg-clip-text text-transparent uppercase"
          >
            COSTLY.IO
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="max-w-2xl mx-auto text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed"
          >
            Your habits don't just cost money. They cost **Life-Hours** and **Opportunity Wealth**. We expose the true price of your daily choices.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap justify-center gap-4 pt-4"
          >
            {/* LINKED: Initialize Surveillance triggers the Auth flow */}
            <button 
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              className="px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center gap-3 group"
            >
              Initialize Surveillance
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* LINKED: View Sample Data goes to a public dashboard or demo page */}
            <Link 
              href="/dashboard" 
              className="px-8 py-4 bg-white/50 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 rounded-2xl font-black uppercase tracking-widest text-xs transition-all backdrop-blur-md inline-block"
            >
              View Sample Data
            </Link>
          </motion.div>
        </section>

        {/* Feature Bento Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <PromoCard
            icon={<Wallet className="text-cyan-500" />}
            title="Capital Drain"
            desc="Track immediate financial leakage and project it over 1, 5, and 10-year horizons."
          />
          <PromoCard
            icon={<Clock className="text-amber-500" />}
            title="Time Debt"
            desc="Convert every habit into 'Life-Hours' based on your specific net hourly wage."
          />
          <PromoCard
            icon={<Zap className="text-emerald-500" />}
            title="Opp. Cost"
            desc="See what that 'daily latte' would be worth in the S&P 500 by the time you retire."
          />
        </section>

        {/* The "Mirror" Stats Visual */}
        <section className="mt-32 p-1 bg-linear-to-br from-cyan-500/20 via-transparent to-indigo-500/20 rounded-[3rem]">
          <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-3xl border border-white/20 dark:border-white/10 rounded-[2.9rem] p-12 text-center overflow-hidden relative">
            <div className="relative z-10">
              <h2 className="text-4xl font-black tracking-tight mb-4">Seeing is Believing.</h2>
              <p className="text-slate-500 dark:text-slate-400 mb-10 max-w-xl mx-auto">Users report a 40% reduction in impulse spending within the first 7 days of seeing their "Mirror" metrics.</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <Stat label="Avg. Savings" val="$1.2k" />
                <Stat label="Time Recovered" val="28h" />
                <Stat label="Users Active" val="12k+" />
                <Stat label="Habits Broken" val="89%" />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

function PromoCard({ icon, title, desc }: { icon: ReactNode, title: string, desc: string }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="p-8 bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-4xl shadow-2xl hover:bg-white/60 dark:hover:bg-white/10 transition-all group"
    >
      <div className="w-12 h-12 rounded-2xl bg-white/50 dark:bg-white/5 border border-white/20 dark:border-white/10 flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-black tracking-tight mb-3">{title}</h3>
      <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{desc}</p>
    </motion.div>
  )
}

function Stat({ label, val }: { label: string, val: string }) {
  return (
    <div className="space-y-1">
      <div className="text-3xl font-black tracking-tighter text-cyan-500">{val}</div>
      <div className="text-[10px] uppercase font-bold tracking-widest text-slate-400">{label}</div>
    </div>
  )
}