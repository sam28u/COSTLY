'use client'

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Target, Wallet, Clock, ArrowLeft, ChevronRight, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function EditGoalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    targetMoney: "",
    targetTimeMinutes: ""
  });

  // 1. Fetch current goal data on load
  useEffect(() => {
    async function fetchGoal() {
      try {
        const res = await fetch(`/api/goals/${id}`);
        if (!res.ok) throw new Error("Could not retrieve mission data");
        const data = await res.json();
        
        setFormData({
          name: data.name,
          targetMoney: data.targetMoney.toString(),
          targetTimeMinutes: data.targetTimeMinutes.toString()
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setFetching(false);
      }
    }
    fetchGoal();
  }, [id]);

  // 2. Handle Form Submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/goals/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          targetMoney: parseFloat(formData.targetMoney),
          targetTimeMinutes: parseInt(formData.targetTimeMinutes),
        }),
      });

      if (!response.ok) throw new Error("Failed to update objective");

      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-12">
      <div className="max-w-2xl mx-auto">
        <Link 
          href="/dashboard" 
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Abort Reconfiguration
        </Link>

        <header className="mb-12">
          <div className="inline-flex p-3 rounded-2xl bg-amber-500 text-white mb-4 shadow-lg shadow-amber-100">
            <Target className="w-6 h-6" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">
            Reconfigure <span className="text-amber-500 not-italic">Objective</span>
          </h1>
          <p className="text-slate-500 font-medium mt-2">Update the parameters for Mission ID: {id}</p>
        </header>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-[10px] font-black uppercase flex items-center gap-2">
            <AlertCircle className="w-4 h-4" /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
            
            {/* Goal Name */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                Objective Name
              </label>
              <input
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                type="text"
                required
                className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none transition-all text-lg font-bold text-slate-900"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Financial Target */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                  <Wallet className="w-3 h-3 text-emerald-500" /> Capital Target ($)
                </label>
                <input
                  value={formData.targetMoney}
                  onChange={(e) => setFormData({...formData, targetMoney: e.target.value})}
                  type="number"
                  step="0.01"
                  className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-emerald-50 outline-none transition-all font-bold text-slate-900"
                />
              </div>

              {/* Time Target */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                  <Clock className="w-3 h-3 text-amber-500" /> Time Target (Min)
                </label>
                <input
                  value={formData.targetTimeMinutes}
                  onChange={(e) => setFormData({...formData, targetTimeMinutes: e.target.value})}
                  type="number"
                  className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-amber-50 outline-none transition-all font-bold text-slate-900"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-slate-900 hover:bg-amber-600 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs transition-all shadow-xl flex items-center justify-center gap-3 group disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                Update Parameters
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}