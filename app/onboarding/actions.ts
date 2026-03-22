'use server'

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export async function completeOnboarding(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const hourlyWage = parseFloat(formData.get("hourlyWage") as string);

  // Update the user record we created during the Google handshake
  await db.update(users)
    .set({ hourlyWage })
    .where(eq(users.id, session.user.id));

  redirect("/dashboard");
}