'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Edit3, Trash2, Wallet, Clock } from "lucide-react";
import Link from "next/link";

export default function GoalCard({ goal }: { goal: any }) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  // Define the helper function locally to fix the ReferenceError
  const formatTime = (minutes: number = 0) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
  };

  const handleAchieve = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!confirm("Confirm achievement? Cost will be deducted from your liquid balance.")) return;
    
    setIsProcessing(true);
    try {
      const res = await fetch(`/api/goals/${goal.id}`, { method: "POST" });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Achievement failed");
      
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!confirm("Permanently delete this mission?")) return;
    
    try {
      const res = await fetch(`/api/goals/${goal.id}`, { method: "DELETE" });
      if (res.ok) router.refresh();
    } catch (err) {
      alert("Delete failed");
    }
  };

  const moneySaved = goal.currentMoneySaved ?? 0;
  const moneyTarget = goal.targetMoney ?? 1;
  const moneyProgress = Math.min(Math.round((moneySaved / moneyTarget) * 100), 100);

  const timeSaved = goal.currentTimeSavedMinutes ?? 0;
  const timeTarget = goal.targetTimeMinutes ?? 1;
  const timeProgress = Math.min(Math.round((timeSaved / timeTarget) * 100), 100);

  return (
    <div className={`p-6 rounded-[2rem] bg-slate-50 border border-slate-100 group transition-all hover:bg-white hover:shadow-xl hover:shadow-indigo-50/50 ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="font-black text-slate-900 text-sm uppercase tracking-tight">{goal.name}</h3>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.1em] mt-1">ID: {goal.id}</p>
        </div>

        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
          <button onClick={handleAchieve} className="p-2 hover:bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle className="w-4 h-4" />
          </button>
          <Link href={`/goals/${goal.id}/edit`} className="p-2 hover:bg-blue-50 text-blue-600 rounded-xl">
            <Edit3 className="w-4 h-4" />
          </Link>
          <button onClick={handleDelete} className="p-2 hover:bg-red-50 text-red-600 rounded-xl">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {/* Money Progress */}
        <ProgressBar 
          label="Capital" 
          current={`$${moneySaved.toFixed(0)}`} 
          target={`$${moneyTarget}`} 
          percent={moneyProgress} 
          color="bg-emerald-500" 
          icon={<Wallet className="w-2.5 h-2.5" />} 
        />
        
        {/* Time Progress - formatTime is now defined above! */}
        <ProgressBar 
          label="Temporal" 
          current={formatTime(timeSaved)} 
          target={formatTime(timeTarget)} 
          percent={timeProgress} 
          color="bg-amber-500" 
          icon={<Clock className="w-2.5 h-2.5" />} 
        />
      </div>
    </div>
  );
}

function ProgressBar({ label, current, target, percent, color, icon }: any) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-slate-500">
        <span className="flex items-center gap-1">{icon} {label}</span>
        <span>{current} / {target}</span>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden shadow-inner">
        <div 
          className={`${color} h-full rounded-full transition-all duration-1000 ease-out`} 
          style={{ width: `${percent}%` }} 
        />
      </div>
    </div>
  );
}