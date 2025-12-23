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
                setError(result.error || "An error occured")
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
        <div>
            <h1>Forgot Password</h1>
            <form onSubmit={handleSubmit}>
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
                {error &&
                <p style = {{color : "red"}}>
                    {error}
                </p>
                }
                {success &&
                <p style = {{color : "green"}}>
                    {success}
                </p>
                }
                <button type="submit" disabled={loading}>
                    {loading ? "Sending reset email..." : "Send reset email"}
                </button>
            </form>
            <p>
                Remember your password?{" "}
                <Link href="/auth/login">Back to login</Link>
            </p>
        </div>
    )
}