// app/api/goals/[id]/route.ts
import { db } from "@/db";
import { goals, users } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq, and, ne, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  const session = await auth();
  const goalId = parseInt(params.id);
  const userId = session?.user?.id!;

  return await db.transaction(async (tx) => {
    const [goal] = await tx
      .select()
      .from(goals)
      .where(and(eq(goals.id, goalId), eq(goals.userId, userId)));
    if (!goal) return new NextResponse("Not Found", { status: 404 });

    const otherGoals = await tx
      .select()
      .from(goals)
      .where(
        and(
          ne(goals.id, goalId),
          eq(goals.userId, userId),
          eq(goals.isActive, true),
        ),
      );

    if (otherGoals.length > 0) {
      const moneyPart = (goal.currentMoneySaved || 0) / otherGoals.length;
      const timePart = Math.floor(
        (goal.currentTimeSavedMinutes || 0) / otherGoals.length,
      );

      await tx
        .update(goals)
        .set({
          currentMoneySaved: sql`${goals.currentMoneySaved} + ${moneyPart}`,
          currentTimeSavedMinutes: sql`${goals.currentTimeSavedMinutes} + ${timePart}`,
        })
        .where(
          and(
            ne(goals.id, goalId),
            eq(goals.userId, userId),
            eq(goals.isActive, true),
          ),
        );
    }

    await tx.delete(goals).where(eq(goals.id, goalId));
    return NextResponse.json({ success: true });
  });
}
