"use client";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import Link from "next/link";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")
    
    async function handleSubmit(e: React.FormEvent){
        e.preventDefault();
        const supabase = createClient();
        // Add your login logic here
        
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