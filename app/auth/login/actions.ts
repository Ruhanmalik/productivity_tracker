"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function login(email: string, password: string) {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        if (error) {
            console.log("Login error:", error);
            return {
                success: false,
                error: error.message
            }
        };
        if (!data.session) {
            return {
                success: false,
                error: "failed to create session"
            }
        };

        revalidatePath("/", "layout");

        return {
            success: true,
            message: "Login successful"
        };
    } catch (error) {
            console.error("Login error:", error);
            return {
                success: false,
                error: "An unexpected error occurred, please try again."
            }
        }
    
}