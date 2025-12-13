"use client";

imoprt { createClient } from "@/lib/supabase/server";
import { useState } from "react";
import Link from "next/link";

export default function Login() {
    async function handleSubmit(e){
        const [email, setEmail] = useState("");
        const [password, setPassword] = useState("")
    
        const supabase =  createClient();
        
    }
  return (
    <div>
        <form onSubmit={handleSubmit}>
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <button type="submit">Login</button>
        </form>
        <button>
            <Link href="/signup">Dont have an account?</Link>
        </button>
    </div>
  )
}