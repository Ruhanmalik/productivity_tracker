"use client";

import { useState } from "react";
import Link from "next/link";


export default function Signup() {
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>){
        const [email, setEmail] = useState("");
        const [password, setPassword] = useState("")
        const [error, setError] = useState<string | null>(null)
        const [loading, setLoading] = useState(false)
        const router = useRouter();

        e.preventDefault();



        
    }
  return (
    <div>
        <form>
            <h1>Signup</h1>
            <div>
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    id="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    autoComplete="email"
                />
            </div>

            <div>
                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password"
                    placeholder="Password"
                    disabled={loading}
                    value={password}
                    minLength={6}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                />
            </div>
            {error &&
            <p style = {{color: "red"}}>
                {error}
            </p>
            }
            <button
            type="submit"
            disabled={loading}
            >
                {loading ? "Signing up..." | "Signup"}
            </button>
        </form>
        <p>
            <Link href="/auth/login">Already have an account?</Link>
        </p>
    </div>
  )
}