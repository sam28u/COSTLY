// components/auth/sign-in.tsx
import { handleGoogleSignIn } from "@/lib/actions/auth"

export default function SignIn() {
  return (
    <form className="flex flex-col items-center" action={handleGoogleSignIn}>
      <button 
        type="submit"
        className="px-8 py-4 bg-white text-black font-bold rounded-2xl hover:bg-zinc-200 transition"
      >
        Sign in with Google
      </button>
    </form>
  )
}