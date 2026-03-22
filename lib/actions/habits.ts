"use server";

import { auth } from "@/lib/auth";
import { db } from "@/db";
import { habits } from "@/db/schema";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createHabit(formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const name = formData.get("name") as string;
  const costPerUnit = parseFloat(formData.get("costPerUnit") as string);
  const timePerUnit = parseInt(formData.get("timePerUnit") as string);

  await db.insert(habits).values({
    userId: session.user.id,
    name,
    costPerUnit,
    timePerUnit,
  });

  revalidatePath("/dashboard");
  redirect("/dashboard");
}