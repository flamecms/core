import { useState, useEffect } from "react"
import { supabase } from "../lib/supabase"
import { User } from "@supabase/gotrue-js"

const useUser = () => {
    const [user, setUser] = useState<User | undefined>(undefined)
    const [loading, setLoading] = useState(true)
    const [token, setToken] = useState<any>(undefined)

    useEffect(() => {
        const currentSesssion = supabase.auth.session()

        if (currentSesssion?.user?.id) {
            setUser(currentSesssion.user)
            setToken(currentSesssion.access_token)
        }

        setLoading(false)

        supabase.auth.onAuthStateChange(async (event, session) => {
            let newUser = supabase.auth.user()
            if (newUser) {
                await fetch("/api/auth/set", {
                    "method": "POST",
                    "headers": new Headers({ "Content-Type": "application/json"}),
                    "credentials": "same-origin",
                    "body": JSON.stringify({ event, session })
                })
            }
            setUser(supabase.auth.user() || undefined)
            setToken(session?.access_token)

            let { data: profile, error, status } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", newUser.id)
                .single()

            if (error && status != 406) throw error
            if (!profile.full_name) {
                await supabase.from("profiles").upsert({
                    id: newUser.id,
                    username: newUser.user_metadata.username,
                    full_name: newUser.user_metadata.full_name,
                    email: newUser.email,
                    avatar_url: newUser.user_metadata.avatar_url,
                    updated_at: new Date()
                })

                console.log("Created Flame profile for " + profile.id)
            }
        })
    }, [supabase])


    return {
        user,
        loading,
        setLoading,
        token
    }
}

export default useUser