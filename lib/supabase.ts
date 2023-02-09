import { createClient } from "@supabase/supabase-js"

export function getSupabase() {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_KEY) {
        console.log(process.env)
        throw new Error('RETARD ADD YOUR FUCKING VARIABLES')
    }
    const client = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_KEY)

    client.auth.onAuthStateChange(async (event, session) => {
        if (event === "SIGNED_IN" && localStorage.getItem("sb:state") !== "SIGNED_IN") {
            console.log(session?.user?.user_metadata?.avatar_url)
            await fetch("/api/auth/set", {
                "method": "POST",
                "headers": new Headers({ "Content-Type": "application/json"}),
                "credentials": "same-origin",
                "body": JSON.stringify({ event, session })
            }).then(() => localStorage.setItem("sb:state", "SIGNED_IN"))

            await supabase.from("profiles").upsert({
                id: session?.user?.id,
                full_name: session?.user?.user_metadata.full_name,
                avatar_url: session?.user?.user_metadata.avatar_url,
                updated_at: new Date()
            })
        } else if (event === "SIGNED_OUT" && localStorage.getItem("sb:state") !== "SIGNED_OUT") {
            await fetch("/api/auth/remove", {
                method: "GET",
                credentials: "same-origin"
            }).then(() => localStorage.setItem("sb:state", "SIGNED_OUT"))
        }
    })

    return client
}

export async function createSSRClient(accessToken: string | null, refreshToken: string | null) {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_KEY) {
        console.log(process.env)
        throw new Error('RETARD ADD YOUR FUCKING VARIABLES')
    }

    const client = createClient(process?.env?.NEXT_PUBLIC_SUPABASE_URL || "https://localhost:3000", process.env.NEXT_PUBLIC_SUPABASE_KEY || "")
    if (typeof accessToken == "string" && typeof refreshToken == "string") {
        console.log("User authenticated")
        await supabase.auth?.setSession({
            access_token: accessToken || "",
            refresh_token: refreshToken || ""
        })
        
    } else {
        console.log("User unauthenticated")
    }

    return client
}

export const supabase = getSupabase()