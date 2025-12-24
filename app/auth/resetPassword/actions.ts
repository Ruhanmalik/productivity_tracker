"use server";
import { creatClient } from "@/lib/supabase/server";

export async function ResetPassword(newPassword: string){
    // Placeholder for reset password logic
    if (!newPassword) {
        return {
            success: false,
            error: "please provide a new password"
        }
    }

    if (newPassword.length < 6) {
        return {
            success: false,
            error: "Password must be at least 6 characters long"
        }
    }

    try{
        const supabase = await createClient();

        const { data, error } = await supabase.auth.updateUser({
            password: newPassword
        });

        if (error) {
            console.error("Reset password error:", error);
            return {
                success: false,
                error: error.message
            }
        }

        return {
            success: true,
            message: "Password reset successful"
        }
    } catch (error) {
        console.error("Reset password error:", error);
        return {
            success: false,
            error: "An unexpected error occurred, please try again."
        }
    }
}