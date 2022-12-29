import { createClient } from "@supabase/supabase-js"

export function getSupabase() {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_KEY) {
        console.log(process.env)
        throw new Error('RETARD ADD YOUR FUCKING VARIABLES')
    }
    return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_KEY)
}

export const supabase = getSupabase()