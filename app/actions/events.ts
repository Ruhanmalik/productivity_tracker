'use server'

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createEvent(formData: FormData) {
    const supabase = await createClient();

    const {data: { user }} = await supabase.auth.getUser();

    if (!user) {
        return { error: "User not authenticated" }
    }

    //extract from data
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const start_time = formData.get('start_time') as string;
    const end_time = formData.get('end_time') as string;


    //insert data
    const { data, error } = await supabase
    .from('events')
    .insert([{

        user_id: user.id,
        title,
        description,
        start_time,
        end_time
    }])
    .select()
    .single();

    if (error) {
        return {
            error: error.message
        }
    }

    revalidatePath("/calendar");
    return { data };
}

export async function updateEvent(formData: FormData, eventId: string) {
    const supabase = await createClient();


    const { data: {user} } = await supabase.auth.getUser()

    if (!user) {
        return { error: "User not authenticated" }
    }
    

    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const start_time = formData.get('start_time') as string
    const end_time = formData.get('end_time') as string

    const { data, error } = await supabase
    .from('events')
    .update({
        title,
        description,
        start_time,
        end_time
    })
    .eq('id', eventId)
    .select()
    .single();

    if (error) {
        return { error: error.message }
    }

    revalidatePath("/calendar");
    return { data };
}

export async function deleteEvent(id: string){
    const supabase = await createClient();

    const {data : { user }} = await supabase.auth.getUser();

    if (!user) {
        return { error: "User not authenticated" }
    }

    const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', id)

    if (error) {
        return { error: error.message}
    }

    revalidatePath("/calendar");
    return { success: true };
}