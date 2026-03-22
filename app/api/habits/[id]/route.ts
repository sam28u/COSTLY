// app/api/habits/[id]/route.ts
import { db } from "@/db";
import { habits } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } } 
) {
  try {
    const session = await auth();
    if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });

    // Await params if you are using Next.js 15+ standard patterns
    const resolvedParams = await params; 
    const habitId = parseInt(resolvedParams.id);

    if (isNaN(habitId)) {
      console.error("Invalid ID received in API:", resolvedParams.id);
      return new Response(`Invalid ID: ${resolvedParams.id}`, { status: 400 });
    }

    const [habit] = await db
      .select()
      .from(habits)
      .where(and(eq(habits.id, habitId), eq(habits.userId, session.user.id)))
      .limit(1);

    if (!habit) return new Response("Habit not found", { status: 404 });

    return Response.json(habit);
  } catch (error) {
    console.error("API Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  const session = await auth();
  const { name, costPerUnit, timePerUnit } = await req.json();
  const [updated] = await db
    .update(habits)
    .set({
      name,
      costPerUnit: parseFloat(costPerUnit),
      timePerUnit: parseInt(timePerUnit),
    })
    .where(
      and(
        eq(habits.id, parseInt(params.id)),
        eq(habits.userId, session?.user?.id!),
      ),
    )
    .returning();
  return NextResponse.json(updated);
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  const session = await auth();
  await db
    .delete(habits)
    .where(
      and(
        eq(habits.id, parseInt(params.id)),
        eq(habits.userId, session?.user?.id!),
      ),
    );
  return NextResponse.json({ success: true });
}
