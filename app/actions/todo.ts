"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

export async function createTodo(formData: FormData) {

    const supabase =  await createClient()

    const {data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return ( {error: 'User not authenticated' } )
    }

    const title = formData.get("title") as string;

    if (!title || title.trim() === "") {
        return { error: "Title is required" };
    }

    const { data, error } = await supabase
        .from("todos")
        .insert([{
            user_id: user.id,
            title: title.trim(),
            completed: false
        }])
        .select()
        .single()

        if (error) {
            return { error: error.message };
        }
    
        revalidatePath("/");
        return { data };    
}

export async function toggleTodo(id: string) {

    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return ( {error: 'User not authenticated' } )
    }

    const { data: currentTodo, error: fetchError } = await supabase
        .from("todos")
        .select('completed')
        .eq('id', id)
        .single()

    if (fetchError) {
        return { error: fetchError.message }
    }

    const { data, error } = await supabase
        .from("todos")
        .update({ completed: !currentTodo.completed })
        .eq('id', id)
        .select()
        .single()

    if (error) {
        return { error: error.message }
    }

    revalidatePath("/");
    return { data }
}

export async function deleteTodo(id: string) {

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return ( {error: 'User not authenticated' } )
    }

    const { data, error } = await supabase
        .from("todos")
        .delete()
        .eq('id', id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath("/");
    return { success: true }
}