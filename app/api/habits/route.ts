import { db } from "@/db";
import { habits } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq, desc } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

  const userHabits = await db.select().from(habits)
    .where(eq(habits.userId, session.user.id))
    .orderBy(desc(habits.createdAt));

  return NextResponse.json(userHabits);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

  const { name, costPerUnit, timePerUnit } = await req.json();

  const [newHabit] = await db.insert(habits).values({
    userId: session.user.id,
    name,
    costPerUnit: parseFloat(costPerUnit),
    timePerUnit: parseInt(timePerUnit),
  }).returning();

  return NextResponse.json(newHabit);
}