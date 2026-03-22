"use server";

import { auth } from "@/lib/auth";
import { db } from "@/db";
import { goals } from "@/db/schema";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createGoal(formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const name = formData.get("name") as string;
  const targetMoney = parseFloat(formData.get("targetMoney") as string) || 0;
  const targetTime = parseInt(formData.get("targetTime") as string) || 0;

  await db.insert(goals).values({
    userId: session.user.id,
    name,
    targetMoney,
    targetTimeMinutes: targetTime,
    currentMoneySaved: 0,
    currentTimeSavedMinutes: 0,
    status: "active",
  });

  revalidatePath("/dashboard");
  redirect("/dashboard");
}