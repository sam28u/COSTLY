import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export default async function OnboardingPage() {
  const session = await auth();
  
  // If they somehow got here without being logged in, send them away
  if (!session?.user?.id) redirect("/login");

  async function updateWage(formData: FormData) {
    "use server";
    const wage = parseFloat(formData.get("wage") as string);
    const session = await auth();

    if (session?.user?.id && wage > 0) {
      await db.update(users)
        .set({ hourlyWage: wage })
        .where(eq(users.id, session.user.id));
      
      revalidatePath("/"); // Clear the middleware cache
      redirect("/dashboard");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <div className="max-w-md w-full space-y-8 p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl">
        <h1 className="text-3xl font-bold text-center">Calibrate Your Time</h1>
        <p className="text-zinc-400 text-center">To calculate your Life-Tax, we need to know your hourly worth.</p>
        
        <form action={updateWage} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Hourly Wage ($)</label>
            <input 
              name="wage" 
              type="number" 
              step="0.01"
              required 
              placeholder="e.g. 50.00"
              className="w-full p-4 bg-black border border-white/20 rounded-xl focus:ring-2 focus:ring-white outline-none"
            />
          </div>
          <button className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition">
            Access Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}