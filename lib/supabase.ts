import { createClient } from "@supabase/supabase-js"

export function getSupabase() {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_KEY) {
        console.log(process.env)
        throw new Error('RETARD ADD YOUR FUCKING VARIABLES')
    }
    const client = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_KEY)

    client.auth.onAuthStateChange(async (event, session) => {
        if (event === "SIGNED_IN" && localStorage.getItem("sb:state") !== "SIGNED_IN") {
            await fetch("/api/auth/set", {
                "method": "POST",
                "headers": new Headers({ "Content-Type": "application/json"}),
                "credentials": "same-origin",
                "body": JSON.stringify({ event, session })
            }).then(() => localStorage.setItem("sb:state", "SIGNED_IN"))
        } else if (event === "SIGNED_OUT" && localStorage.getItem("sb:state") !== "SIGNED_OUT") {
            await fetch("/api/auth/remove", {
                method: "GET",
                credentials: "same-origin"
            }).then(() => localStorage.setItem("sb:state", "SIGNED_OUT"))
        }
    })

    return client
}

export const supabase = getSupabase()