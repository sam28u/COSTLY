import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { db } from "@/db";
import { users, goals, habits } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import {
  Wallet,
  Clock,
  TrendingUp,
  User as UserIcon,
  Plus,
  History,
  Coins
} from "lucide-react";
import Navbar from "@/components/Navbar";
import GoalCard from "@/components/GoalCard";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // 1. Parallel Data Fetching
  const [userData] = await db
    .select()
    .from(users)
    .where(eq(users.id, session.user.id!))
    .limit(1);

  const activeGoals = await db
    .select()
    .from(goals)
    .where(
      and(
        eq(goals.userId, session.user.id!),
        eq(goals.status, "active")
      )
    );

  const userhabits = await db
    .select()
    .from(habits)
    .where(eq(habits.userId, session.user.id!))
    .orderBy(desc(habits.createdAt));

  // Helper for Server-side display only
  const formatTime = (minutes: number = 0) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <Navbar />

      <main className="max-w-7xl mx-auto p-6 md:p-8">
        {/* Header */}
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">
              Control <span className="text-indigo-600 text-3xl not-italic">Center</span>
            </h1>
            <p className="text-slate-500 font-medium">
              System Operator: <span className="text-slate-900 font-bold">{session.user.name}</span>
            </p>
          </div>
          <Link
            href="/habits/new"
            className="px-6 py-3 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-200 w-fit"
          >
            <Plus className="w-4 h-4" /> New Habit
          </Link>
        </header>

        {/* --- 5-Field Stats Grid --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
          <StatCard
            label="Hourly Wage"
            val={`$${userData?.hourlyWage?.toFixed(2) ?? "0.00"}`}
            sub="Base temporal value"
            color="text-indigo-600"
            icon={<UserIcon className="w-5 h-5" />}
          />
          <StatCard
            label="Current Saved"
            val={`$${userData?.currentMoneyBalance?.toFixed(2) ?? "0.00"}`}
            sub="Liquid capital"
            color="text-emerald-600"
            icon={<Wallet className="w-5 h-5" />}
          />
          <StatCard
            label="Lifetime Saved"
            val={`$${userData?.totalMoneySaved?.toFixed(2) ?? "0.00"}`}
            sub="Total financial impact"
            color="text-slate-400"
            icon={<History className="w-5 h-5" />}
          />
          <StatCard
            label="Time Credits"
            val={formatTime(userData?.currentTimeBalance ?? 0)}
            sub="Available hours"
            color="text-amber-600"
            icon={<Clock className="w-5 h-5" />}
          />
          <StatCard
            label="Total Reclaimed"
            val={formatTime(userData?.totalTimeSaved ?? 0)}
            sub="Lifetime temporal win"
            color="text-slate-400"
            icon={<TrendingUp className="w-5 h-5" />}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Habits Feed */}
          <section className="lg:col-span-7">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm min-h-[500px]">
              <h2 className="font-black text-slate-900 uppercase tracking-widest text-sm mb-8 flex items-center gap-2">
                <History className="w-4 h-4 text-indigo-500" /> Recent Surveillance
              </h2>
              {userhabits.length > 0 ? (
                <div className="space-y-4">
                  {userhabits.map((habit) => (
                    <div
                      key={habit.id}
                      className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-sm transition-all group"
                    >
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900">{habit.name}</span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          Impact: ${habit.costPerUnit} / {habit.timePerUnit}m
                        </span>
                      </div>
                      {/* Using Link for automatic redirect to the habit ID page */}
                      <Link
                        href={`/habits/${habit.id}`}
                        className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all shadow-sm"
                      >
                        Log Entry
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 opacity-30">
                  <Coins className="w-12 h-12 mb-4" />
                  <p className="font-bold uppercase tracking-widest text-xs text-center">
                    No Recent Logs <br />
                    <span className="lowercase font-medium opacity-60 italic">Surveillance inactive</span>
                  </p>
                </div>
              )}
            </div>
          </section>



          {/* Goals Section */}
          <section className="lg:col-span-5">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
              <h2 className="font-black text-slate-900 uppercase tracking-widest text-sm mb-8 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-500" /> Active Missions
              </h2>

              <div className="space-y-4">
                {activeGoals.length === 0 ? (
                  <div className="py-12 text-center border-2 border-dashed border-slate-100 rounded-[2rem]">
                    <p className="text-slate-300 text-[10px] font-black uppercase tracking-widest">No Active Objectives</p>
                  </div>
                ) : (
                  activeGoals.map((goal) => (
                    <GoalCard key={goal.id} goal={goal} />
                  ))
                )}
                <Link
                  href="/goals/new"
                  className="w-full py-5 mt-2 border-2 border-dashed border-slate-200 rounded-[2rem] flex items-center justify-center gap-2 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 transition-all font-black text-xs uppercase tracking-widest"
                >
                  <Plus className="w-4 h-4" /> Initialize Goal
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, val, sub, color, icon }: { label: string, val: string, sub: string, color: string, icon: React.ReactNode }) {
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden group hover:border-indigo-100 transition-all">
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className={`p-2 rounded-xl bg-slate-50 ${color} group-hover:bg-white transition-colors shadow-inner`}>
          {icon}
        </div>
        <span className="text-[8px] font-black uppercase tracking-widest text-slate-300 group-hover:text-indigo-400 transition-colors">{label}</span>
      </div>
      <div className="relative z-10">
        <h3 className={`text-xl font-black tracking-tighter mb-1 ${color}`}>
          {val}
        </h3>
        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tight leading-none">{sub}</p>
      </div>
      <div className="absolute -right-2 -bottom-2 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
        {icon}
      </div>
    </div>
  );
}