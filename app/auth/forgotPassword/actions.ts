"use server";

import { createClient } from "@/lib/supabase/server";

export async function SendPasswordResetEmail(email: string) {
    if (!email || !email.includes("@")) {
        return {
            success: false,
            error: "Please enter a valid email address"
        }
    }
    try {
        const supabase = await createClient();

        const appUrl = process.env.NEXT_PUBLIC_APP_URL;
        console.log("App URL:", appUrl); // You'll see this in terminal
        
        if (!appUrl) {
            console.error("NEXT_PUBLIC_APP_URL is not set!");
            return {
                success: false,
                error: "Server configuration error. Please contact support."
            }
        }

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/resetPassword`
        })
        if (error) {
            console.error("Password reset email error:", error);
            return {
                success: false,
                error: error.message
            }
        }
        return {
            success: true,
            message: "Check your email for the reset link"
        }
    } catch (error) {
        console.error("Password reset email error:", error);
        return {
            success: false,
            error: "An unexpected error occurred, please try again."
        }
    }
}