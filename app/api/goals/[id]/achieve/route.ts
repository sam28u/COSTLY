import { db } from "@/db";
import { goals, users } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq, sql, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
  const session = await auth();
  if (!session?.user?.id)
    return new NextResponse("Unauthorized", { status: 401 });

  const goalId = parseInt(params.id);
  const userId = session.user.id;

  try {
    return await db.transaction(async (tx) => {
      // 1. Get the current progress of the goal to be "spent"
      const [goal] = await tx
        .select()
        .from(goals)
        .where(and(eq(goals.id, goalId), eq(goals.userId, userId)));

      if (!goal) throw new Error("Goal not found");

      // 2. DEDUCT the goal's progress from the Global Wallet
      // This ensures the dashboard reflects your remaining 'Liquid' wealth
      await tx
        .update(users)
        .set({
          totalMoneySaved: sql`${users.totalMoneySaved} - ${goal.currentMoneySaved}`,
          totalTimeSaved: sql`${users.totalTimeSaved} - ${goal.currentTimeSavedMinutes}`,
        })
        .where(eq(users.id, userId));

      // 3. Deactivate the goal (keeping it for history)
      const [achievedGoal] = await tx
        .update(goals)
        .set({ isActive: false })
        .where(eq(goals.id, goalId))
        .returning();

      return NextResponse.json({
        success: true,
        message:
          "Goal successfully achieved. Wealth deducted from Global Wallet.",
        achievedGoal,
      });
    });
  } catch (error) {
    console.error("Achievement Error:", error);
    return new NextResponse("Failed to process achievement", { status: 500 });
  }
}
