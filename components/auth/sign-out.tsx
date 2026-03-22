// components/auth/sign-in.tsx
import { handleSignOut } from "@/lib/actions/auth"

export default function SignIn() {
    return (
        <form className="flex flex-col items-center" action={handleSignOut}>
            <button
                type="submit"
                className="px-8 py-4 bg-white text-black font-bold rounded-2xl hover:bg-zinc-200 transition"
            >
                LogOut
            </button>
        </form>
    )
}