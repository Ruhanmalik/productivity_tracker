"use client";

import { useState } from "react";
import Link from "next/link";


export default function Signup() {
    async function handleSubmit(e){
        const [email, setEmail] = useState("");
        const [password, setPassword] = useState("")

        
    }
  return (
    <div>
        <form>
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <button type="submit">Signup</button>
        </form>
        <button>
            <Link href="/login">Already have an account?</Link>
        </button>
    </div>
  )
}