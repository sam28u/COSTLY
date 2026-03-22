'use client' // This is required to use useState and useRouter

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Target, Wallet, Clock, ArrowLeft, ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";

export default function NewGoalPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const data = {
      name: formData.get("name"),
      targetMoney: parseFloat(formData.get("targetMoney") as string) || 0,
      targetTimeMinutes: parseInt(formData.get("targetTime") as string) || 0,
    };

    try {
      const response = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create goal. Check your backend.");
      }
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-12">
      <div className="max-w-2xl mx-auto">
        <Link 
          href="/dashboard" 
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Base
        </Link>

        <header className="mb-12">
          <div className="inline-flex p-3 rounded-2xl bg-indigo-600 text-white mb-4 shadow-lg shadow-indigo-200">
            <Target className="w-6 h-6" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">
            Define <span className="text-indigo-600 not-italic">Objective</span>
          </h1>
        </header>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-xs font-bold uppercase">
            Error: {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
            
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                Objective Name
              </label>
              <input
                name="name"
                type="text"
                placeholder="e.g., Japan Trip"
                required
                className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none transition-all text-lg font-bold text-slate-900"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                  <Wallet className="w-3 h-3 text-emerald-500" /> Capital Target ($)
                </label>
                <input
                  name="targetMoney"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-emerald-50 outline-none transition-all font-bold text-slate-900"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                  <Clock className="w-3 h-3 text-amber-500" /> Time Target (Min)
                </label>
                <input
                  name="targetTime"
                  type="number"
                  placeholder="0"
                  className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-amber-50 outline-none transition-all font-bold text-slate-900"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-slate-900 hover:bg-indigo-600 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs transition-all shadow-xl flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                Deploy Objective
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}