"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function signup(email: string, password: string) {
    if (!email || !password) {
        return { 
            success: false,
            error: "Please fill in all fields!"
        }
    }
    if (password.length < 6) {
        return {
            success: false,
            error: "Password must be at least 6 characters"
        };
    }
    try {
        const supabase = await createClient();
        const { data, error } = await supabase.auth.signUp({
            email,
            password
        });
        if (error) {
            console.error("Signup error:", error);
            return {
                success: false,
                error: error.message
            }
        }
        if (!data.user) {
            return { 
                success: false,
                error: "Failed to create user"
            }
        }
        if (data.user && !data.session) {
            return {
                success: true,
                message: "Check email for verification link",
                requiresConfirmation: true
            }
            
        }
        revalidatePath("/", "layout");
        return {
            success: true,
            message: "Signup successful"
        }
    } catch (error) {
        console.error("Signup error:", error);
        return {
            success: false,
            error: "An unexpected error occurred, please try again."
        }
    }
};