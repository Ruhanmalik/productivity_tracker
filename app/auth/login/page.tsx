"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { login } from "./actions";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        setError(null);
        setLoading(true);

        if (!email || !password) {
            setError("Please fill in all fields")
            setLoading(false);
            return;
        }

        if (!email.includes("@")) {
            setError("Please enter a valid email address");
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters long");
            setLoading(false);
            return;
        }

        try {
            const result = await login(email, password);
            if (!result.success) {
                setError(result.error || "An error occurred");
                setLoading(false);
                return;
            }
            router.push("/calendar");
            router.refresh();
        } catch (error) {
            console.error("Login error:", error);
            setError("An unexpected error occurred, please try again.")
            setLoading(false);
        }
    }

  return (
    <div className="auth-page">
        <div className="auth-card">
            <div className="auth-wordmark">Schedule.io</div>
            <h1 className="auth-title">Welcome back</h1>
            <p className="auth-desc">Sign in to your account to continue</p>

            <form onSubmit={handleSubmit}>
                {error && <div className="alert-error">{error}</div>}

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
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={loading}
                        autoComplete="current-password"
                        minLength={6}
                    />
                </div>

                <div className="form-actions">
                    <button type="submit" disabled={loading} className="btn btn-accent" style={{ width: "100%" }}>
                        {loading ? "Signing in…" : "Sign in"}
                    </button>
                </div>
            </form>

            <div className="auth-divider">
                <Link href="/auth/forgotPassword">Forgot your password?</Link>
            </div>
            <div className="auth-divider" style={{ borderTop: "none", paddingTop: 10, marginTop: 0 }}>
                No account?{" "}
                <Link href="/auth/signup">Create one</Link>
            </div>
        </div>
    </div>
  )
}
