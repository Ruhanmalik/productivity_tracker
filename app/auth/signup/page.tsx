"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signup } from "./actions";

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

        if (!email || !password || !confirmPassword) {
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
            const result = await signup(email, password);
            if (!result.success) {
                setError(result.error || "An error occurred")
                setLoading(false);
                return;
            }
            setSuccess(result.message || "Signup successful");
            setLoading(false);

            if (!result.requiresConfirmation) {
                router.push("/")
                router.refresh()
            }
        } catch (error) {
            console.error("Signup error:", error);
            setError("An unexpected error occurred, please try again.")
            setLoading(false);
        }
    }

  return (
    <div className="auth-page">
        <div className="auth-card">
            <div className="auth-wordmark">Schedule.io</div>
            <h1 className="auth-title">Create account</h1>
            <p className="auth-desc">Start tracking your time and events</p>

            <form onSubmit={handleSubmit}>
                {error && <div className="alert-error">{error}</div>}
                {success && <div className="alert-success">{success}</div>}

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
                        autoComplete="email"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Min. 6 characters"
                        disabled={loading}
                        value={password}
                        minLength={6}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="new-password"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="confirm-password">Confirm Password</label>
                    <input
                        type="password"
                        id="confirm-password"
                        placeholder="Repeat password"
                        disabled={loading}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        autoComplete="new-password"
                    />
                </div>

                <div className="form-actions">
                    <button type="submit" disabled={loading} className="btn btn-accent" style={{ width: "100%" }}>
                        {loading ? "Creating account…" : "Create account"}
                    </button>
                </div>
            </form>

            <div className="auth-divider">
                Already have an account?{" "}
                <Link href="/auth/login">Sign in</Link>
            </div>
        </div>
    </div>
  )
}
