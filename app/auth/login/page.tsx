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
            router.push("/")
            router.refresh()
        } catch (error) {
            console.error("Login error:", error);
            setError("An unexpected error occurred, please try again.")
            setLoading(false);
        }
        
        
    }
  return (
    <div>
        <h1>Login</h1>
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

            <div>  
                <label htmlFor="password">Password</label>
                <input 
                type="password"
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                autoComplete="current-password"
                minLength={6}
                />
            </div>
            {error && (
                <p style = {{color: "red"}}>
                    {error}
                </p>
            )}
            <button
            type="submit"
            disabled={loading}
            >
                {loading ? "Logging in..." : "Login"}
            </button>
        </form>
        <p>
            <Link href="/auth/forgotPassword">Reset password</Link>
        </p>
        <p>
            Dont have an account?{" "}
            <Link href="/auth/signup">Sign up</Link>
        </p>
    </div>
  )
}