// lib/actions/auth.ts
"use server"

import { signIn, signOut } from "@/lib/auth"

export async function handleGoogleSignIn() {
  try {
    await signIn("google", { redirectTo: "/dashboard" });
  } catch (error) {
    // Auth.js throws a redirect error which is normal behavior
    throw error;
  }
}

export async function handleSignOut() {
  await signOut({ redirectTo: "/" });
}