'use client'

import { useState, use, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft, Calendar as CalendarIcon, Zap, Clock,
  CheckCircle2, Loader2, Trash2, AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import { format } from 'date-fns'

export default function HabitDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()

  // 1. Properly define all state hooks
  const [habit, setHabit] = useState<any>(null)
  const [goals, setGoals] = useState<any[]>([])
  const [selectedGoalId, setSelectedGoalId] = useState<string>("")
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(new Date())

  const [fetching, setFetching] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("") // Fixed the "Function not implemented" error

  useEffect(() => {
    async function fetchData() {
      try {
        setFetching(true)
        const [habitRes, goalsRes] = await Promise.all([
          fetch(`/api/habits/${id}`),
          fetch(`/api/goals`)
        ])

        if (!habitRes.ok) {
          const text = await habitRes.text()
          throw new Error(`Status ${habitRes.status}: ${text}`)
        }

        const habitData = await habitRes.json()
        const goalsData = await goalsRes.json()

        setHabit(habitData)
        setGoals(Array.isArray(goalsData) ? goalsData.filter((g: any) => g.status === 'active') : [])
      } catch (err: any) {
        console.error("Fetch Error:", err)
        setError(err.message || "Failed to retrieve data")
      } finally {
        setFetching(false)
      }
    }
    fetchData()
  }, [id])

  const handleLogEntry = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/habits/log", {
        method: "POST",
        body: JSON.stringify({
          habitId: parseInt(id),
          goalId: selectedGoalId ? parseInt(selectedGoalId) : null,
          timestamp: selectedDay?.toISOString()
        }),
      })
      if (res.ok) router.refresh()
    } finally {
      setLoading(false)
    }
  }

  // 2. GUARD CLAUSE: Prevents "can't access property name, habit is null"
  if (fetching) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fafc]">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-4" />
        <p className="text-xs font-black uppercase tracking-widest text-slate-400">Synchronizing Data...</p>
      </div>
    )
  }

  if (error || !habit) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fafc] p-6 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-black text-slate-900 uppercase italic">Analysis Failed</h2>
        <p className="text-slate-500 mt-2 max-w-xs">{error || "Habit record not found in database."}</p>
        <Link href="/dashboard" className="mt-8 px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold text-xs uppercase tracking-widest">
          Return to Dashboard
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 md:p-12 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Base
          </Link>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic">
                {habit.name} <span className="text-indigo-600 not-italic">Analysis</span>
              </h1>
            </div>

            <button onClick={handleLogEntry} disabled={loading} className="px-8 py-4 bg-slate-900 hover:bg-emerald-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs transition-all shadow-xl flex items-center gap-3 disabled:opacity-50">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              Log Daily Win
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <HabitStat label="Cost / Unit" val={`$${habit.costPerUnit}`} icon={<Zap className="w-4 h-4" />} />
              <HabitStat label="Time / Unit" val={`${habit.timePerUnit}m`} icon={<Clock className="w-4 h-4" />} />
            </div>
            {/* Add your charts here later */}
            <div className="bg-white p-12 rounded-[2.5rem] border border-slate-200 border-dashed text-center">
              <p className="text-xs font-black text-slate-300 uppercase tracking-widest">Visualization coming soon</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" /> Observation Date
              </h3>
              <div className="flex justify-center scale-90 md:scale-100">
                <DayPicker mode="single" selected={selectedDay} onSelect={setSelectedDay} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function HabitStat({ label, val, icon }: { label: string, val: string, icon: React.ReactNode }) {
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
      <div className="p-2 bg-slate-50 text-indigo-600 w-fit rounded-xl mb-4">{icon}</div>
      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">{label}</p>
      <h4 className="text-xl font-black text-slate-900 tracking-tighter">{val}</h4>
    </div>
  )
}