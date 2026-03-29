"use client";

import { useState, useEffect } from "react";
import { UpdatePassword } from "./actions";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ResetPassword() {
    const [ password, setPassword] = useState("")
    const [ confirmPassword, setConfirmPassword] = useState("")
    const [ loading, setLoading] = useState(false)
    const [ error, setError] = useState<string | null>(null)
    const [ success, setSuccess] = useState<string | null>(null)
    const [ sessionReady, setSessionReady ] = useState(false);
    const [ sessionChecked, setSessionChecked ] = useState(false);
    const router = useRouter();

    useEffect(() => {
        let cancelled = false;
        const supabase = createClient();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (cancelled || !session) return;
            if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
                setSessionReady(true);
                setError(null);
            }
        });

        (async () => {
            const { data: { session }, error } = await supabase.auth.getSession();

            if (cancelled) return;
            setSessionChecked(true);

            if (error) {
                console.error("Session error: ", error);
                setError("An unexpected error occurred, please try again.");
                return;
            }

            if (session) {
                setSessionReady(true);
                return;
            }

            setError(
                "Invalid or expired password reset link. Please request a new reset email."
            );
        })();

        return () => {
            cancelled = true;
            subscription.unsubscribe();
        };
    }, []);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);

        if (!sessionChecked) {
            setError("Still verifying your reset link. Please wait a moment.");
            setLoading(false);
            return;
        }

        if (!sessionReady) {
            setError("Your reset session is missing or expired. Please open the link from your email again or request a new reset.");
            setLoading(false);
            return;
        }

        if (!password || !confirmPassword) {
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
                setError(result.error || "An error occurred")
                setLoading(false);
                return;
            }

            setSuccess(result.message || "Password reset successful");
            setLoading(false);

            setTimeout(() => {
                router.push("/auth/login");
                router.refresh()
            }, 1500)
        } catch (error) {
            console.error("Reset password error:", error);
            setError("An unexpected error occurred, please try again.")
            setLoading(false);
        }
    }

    const formDisabled = loading || !sessionChecked || !sessionReady;

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-wordmark">Schedule.io</div>
                <h1 className="auth-title">Set new password</h1>
                <p className="auth-desc">
                    {!sessionChecked
                        ? "Verifying your reset link…"
                        : sessionReady
                        ? "Choose a new password for your account"
                        : "Reset link invalid or expired"}
                </p>

                <form onSubmit={handleSubmit}>
                    {error && <div className="alert-error">{error}</div>}
                    {success && <div className="alert-success">{success}</div>}

                    <div className="form-group">
                        <label htmlFor="password">New Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            placeholder="Min. 6 characters"
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={formDisabled}
                            required
                            minLength={6}
                            autoComplete="new-password"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            placeholder="Repeat new password"
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            disabled={formDisabled}
                            minLength={6}
                            required
                            autoComplete="new-password"
                        />
                    </div>

                    <div className="form-actions">
                        <button
                            type="submit"
                            disabled={formDisabled}
                            className="btn btn-accent"
                            style={{ width: "100%" }}
                        >
                            {loading ? "Resetting…" : "Reset password"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
