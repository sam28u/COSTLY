import { db } from "@/db";
import { goals } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq, desc } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id)
    return new NextResponse("Unauthorized", { status: 401 });
  const userGoals = await db
    .select()
    .from(goals)
    .where(eq(goals.userId, session.user.id))
    .orderBy(desc(goals.createdAt));
  return NextResponse.json(userGoals);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id)
    return new NextResponse("Unauthorized", { status: 401 });
  const { name, targetMoney, targetTimeMinutes } = await req.json();
  const [newGoal] = await db
    .insert(goals)
    .values({
      userId: session.user.id,
      name,
      targetMoney: targetMoney ? parseFloat(targetMoney) : 0,
      targetTimeMinutes: targetTimeMinutes ? parseInt(targetTimeMinutes) : 0,
      isActive: true,
    })
    .returning();
  return NextResponse.json(newGoal);
}
