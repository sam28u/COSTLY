// app/api/user/route.ts
import { db } from "@/db";
import { users } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id)
    return new NextResponse("Unauthorized", { status: 401 });
  const { hourlyWage } = await req.json();
  const [updated] = await db
    .update(users)
    .set({ hourlyWage: parseFloat(hourlyWage) })
    .where(eq(users.id, session.user.id))
    .returning();
  return NextResponse.json(updated);
}

// app/api/stats/route.ts
export async function GET() {
  const session = await auth();
  if (!session?.user?.id)
    return new NextResponse("Unauthorized", { status: 401 });
  const [userStats] = await db
    .select({
      totalMoney: users.totalMoneySaved,
      totalTime: users.totalTimeSaved,
    })
    .from(users)
    .where(eq(users.id, session.user.id));
  return NextResponse.json(userStats);
}
