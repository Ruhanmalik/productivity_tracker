"use client";

import { useState } from "react";
import { UpdatePassword } from "./actions";
import { useRouter } from "next/navigation";


export default function ResetPassword() {
    const [ password, setPassword] = useState("")
    const [ confirmPassword, setConfirmPassword] = useState("")
    const [ loading, setLoading] = useState(false)
    const [ error, setError] = useState<string | null>(null)
    const [ success, setSuccess] = useState<string | null>(null)
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);

        if (!password || ! confirmPassword) {
            setError("Please fill in all fields")
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

        try{
            const result = await UpdatePassword(password);
            if (!result.success) {
                setError(result.error || "An error occured")
                setLoading(false);
                return;
            }
            
            setSuccess(result.message || "Password reset successful");
            setLoading(false);

            router.push("/auth/login");
            router.refresh()
        } catch (error) {
            console.error("Reset password error:", error);
            setError("An unexpected error occurred, please try again.")
            setLoading(false);
        }
    }

    return (
        <div>
            <h1>Reset Passsord</h1>
            <form onSubmit={handleSubmit}>
                <div>
                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    required
                    minLength={6}
                    autoComplete="new-password"
                    >
                </input>
                </div>

                <div>
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        placeholder="Confirm Password"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={loading}
                        minLength={6}
                        required
                        autoComplete="new-password"
                        >
                            
                        </input>
                </div>
                {error &&
                <p style={{ color: "red"}}
                >
                    {error}
                </p>
                }

                {success &&
                <p style={{ color: "green"}}
                >
                    {success}
                </p>
            }

            <button
            type="submit"
            disabled={loading}
            >
                {loading ? "Resetting password..." : "Reset Password"}
            </button>

            </form>
        </div>
    )
}