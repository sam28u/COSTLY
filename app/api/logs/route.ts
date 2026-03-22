import { db } from "@/db";
import { habitLogs, users, goals, habits } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

  const { habitId, goalId, timestamp } = await req.json();

  try {
    return await db.transaction(async (tx) => {
      // 1. Get the habit details to know how much to save
      const [habit] = await tx.select().from(habits).where(eq(habits.id, habitId)).limit(1);
      if (!habit) throw new Error("Habit not found");

      const savedMoney = habit.costPerUnit;
      const savedTime = habit.timePerUnit;

      // 2. Create the Log with Snapshots
      await tx.insert(habitLogs).values({
        habitId,
        goalId: goalId || null,
        moneySaved: savedMoney,
        timeSaved: savedTime,
        isSkipped: true,
        timestamp: timestamp ? new Date(timestamp) : new Date(),
      });

      // 3. Update User Balances (Total and Current)
      await tx.update(users)
        .set({
          totalMoneySaved: sql`${users.totalMoneySaved} + ${savedMoney}`,
          currentMoneyBalance: sql`${users.currentMoneyBalance} + ${savedMoney}`,
          totalTimeSaved: sql`${users.totalTimeSaved} + ${savedTime}`,
          currentTimeBalance: sql`${users.currentTimeBalance} + ${savedTime}`,
        })
        .where(eq(users.id, session.user.id!));

      // 4. Update Goal if attached
      if (goalId) {
        await tx.update(goals)
          .set({
            currentMoneySaved: sql`${goals.currentMoneySaved} + ${savedMoney}`,
            currentTimeSavedMinutes: sql`${goals.currentTimeSavedMinutes} + ${savedTime}`,
          })
          .where(eq(goals.id, goalId));
      }

      return NextResponse.json({ success: true });
    });
  } catch (error) {
    console.error("Transaction failed:", error);
    return new NextResponse("Failed to log entry", { status: 500 });
  }
}