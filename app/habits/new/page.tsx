'use client' 

import { Wallet, Clock, ArrowLeft, Plus, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewHabitPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name")?.toString() ?? "";
    const costPerUnit = parseFloat(formData.get("costPerUnit")?.toString() ?? "0");
    const timePerUnit = parseInt(formData.get("timePerUnit")?.toString() ?? "0", 10);

    try {
      const response = await fetch("/api/habits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, costPerUnit, timePerUnit }),
      });

      if (!response.ok) {
        throw new Error("Failed to create habit.");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError("Failed to create habit. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-8">
      <div className="max-w-xl mx-auto">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-8 text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <header className="mb-10">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Track a New Habit</h1>
          <p className="text-slate-500 mt-2">Identify a recurring expense or time-sink to start reclaiming your life.</p>
        </header>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm font-bold uppercase tracking-tight">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            {/* Habit Name */}
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Habit Name</label>
              <input
                name="name"
                type="text"
                placeholder="e.g., Daily Latte, Cigarettes, Gaming"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-900 placeholder:text-slate-300"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Cost per Unit */}
              <div>
                <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                  <Wallet className="w-3 h-3 text-emerald-500" /> Cost per Unit ($)
                </label>
                <input
                  name="costPerUnit"
                  type="number"
                  step="0.01"
                  placeholder="5.50"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-900 placeholder:text-slate-300"
                />
              </div>

              {/* Time per Unit */}
              <div>
                <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                  <Clock className="w-3 h-3 text-amber-500" /> Time per Unit (Min)
                </label>
                <input
                  name="timePerUnit"
                  type="number"
                  placeholder="15"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-900 placeholder:text-slate-300"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-lg flex items-center justify-center gap-2 group cursor-pointer disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                Initialize Habit Tracking
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}