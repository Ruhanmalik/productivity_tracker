"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Signup() {
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const router = useRouter();

        async function handleSubmit(e: React.FormEvent<HTMLFormElement>){
            e.preventDefault();
            setError(null);
            setLoading(true);

            if (!email || !password || ! confirmPassword) {
                setError("Please fill in all fields")
                setLoading(false);
                return;
            }

            if (!email.includes("@")) {
                setError("Please enter a valid email address")
                setLoading(false);
                return;
            }

            if (password.length < 6) {
                setError("Password must be at least 6 characters long")
                setLoading(false);
                return;
            }

            if (password != confirmPassword) {
                setError("Passwords do not match")
                setLoading(false);
                return;
            }

            try {
                const result = await Signup(email, password);
                if (!result.success) {
                    setError(result.error || "An error occurred")
                    setLoading(false);
                    return;
                }
                setSuccess(result.message || "Signup Successful");
                setLoading(false);
                router.push("/")
                router.refresh()
            } catch (error) {
                console.error("Signup error:", error);
                setError("An unexpected error occurred, please try again.")
                setLoading(false);
            }
    }
  return (
    <div>
        <form onSubmit={handleSubmit}>
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
            <div>
                <label htmlFor="confirm-password">Confirm Password</label>
                <input
                    type="password"
                    id="confirm-password"
                    placeholder="Confirm Password"
                    disabled={loading}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                />
            </div>
            {error &&
            <p style = {{color: "red"}}>
                {error}
            </p>
            }
            {success &&
            <p style = {{color: "green"}}>
                {success}
            </p>
            }
            <button
            type="submit"
            disabled={loading}
            >
                {loading ? "Signing up..." : "Signup"}
            </button>
        </form>
        <p>
            <Link href="/auth/login">Already have an account?</Link>
        </p>
    </div>
  )
}