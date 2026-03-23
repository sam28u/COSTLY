import { db } from "@/db";
import { goals, users } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq, sql, and } from "drizzle-orm";
import { NextResponse } from "next/server";

// 1. ACHIEVE GOAL (POST)
// Deducts from "Current Balance" but keeps "Total Saved" intact
export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
  const session = await auth();
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

  const { id } = await params;
  const goalId = parseInt(id);
  const userId = session.user.id;

  try {
    return await db.transaction(async (tx) => {
      const [goal] = await tx
        .select()
        .from(goals)
        .where(and(eq(goals.id, goalId), eq(goals.userId, userId)))
        .limit(1);

      if (!goal) throw new Error("Goal not found");

      // We subtract from the WALLET (current balance), not the SCOREBOARD (total saved)
      await tx
        .update(users)
        .set({
          currentMoneyBalance: sql`${users.currentMoneyBalance} - ${goal.currentMoneySaved}`,
          currentTimeBalance: sql`${users.currentTimeBalance} - ${goal.currentTimeSavedMinutes}`,
        })
        .where(eq(users.id, userId));

      const [achievedGoal] = await tx
        .update(goals)
        .set({ status: "achieved", isActive: false })
        .where(eq(goals.id, goalId))
        .returning();

      return NextResponse.json({ success: true, achievedGoal });
    });
  } catch (error) {
    return new NextResponse("Failed to process achievement", { status: 500 });
  }
}

// 2. EDIT GOAL (PATCH)
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  const session = await auth();
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

  const { id } = await params;
  const { name, targetMoney, targetTimeMinutes } = await req.json();

  const [updatedGoal] = await db
    .update(goals)
    .set({
      name,
      targetMoney: parseFloat(targetMoney),
      targetTimeMinutes: parseInt(targetTimeMinutes),
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(goals.id, parseInt(id)),
        eq(goals.userId, session.user.id)
      )
    )
    .returning();

  return NextResponse.json(updatedGoal);
}

// 3. DELETE GOAL (DELETE)
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  const session = await auth();
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

  const { id } = await params;

  await db
    .delete(goals)
    .where(
      and(
        eq(goals.id, parseInt(id)),
        eq(goals.userId, session.user.id)
      )
    );

  return NextResponse.json({ success: true, message: "Goal deleted successfully" });
}