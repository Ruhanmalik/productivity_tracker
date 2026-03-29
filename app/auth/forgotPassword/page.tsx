"use client";

import { useState } from "react";
import Link from "next/link";
import { SendPasswordResetEmail } from "./actions";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        setLoading(true)
        setError(null)
        setSuccess(null)

        if (!email || !email.includes("@")) {
            setError("Please enter a valid email address")
            setLoading(false)
            return
        }

        try {
            const result = await SendPasswordResetEmail(email)

            if (!result.success) {
                setError(result.error || "An error occurred")
                setLoading(false)
                return
            }

            setSuccess(result.message || "Check your email for the reset link");
            setEmail("");
            setLoading(false);
        } catch (error) {
            console.error("Forgot password error:", error);
            setError("An unexpected error occurred, please try again.")
            setLoading(false)
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-wordmark">Schedule.io</div>
                <h1 className="auth-title">Reset password</h1>
                <p className="auth-desc">Enter your email and we&apos;ll send you a reset link</p>

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

                    <div className="form-actions">
                        <button type="submit" disabled={loading} className="btn btn-accent" style={{ width: "100%" }}>
                            {loading ? "Sending…" : "Send reset link"}
                        </button>
                    </div>
                </form>

                <div className="auth-divider">
                    Remember your password?{" "}
                    <Link href="/auth/login">Back to sign in</Link>
                </div>
            </div>
        </div>
    )
}
