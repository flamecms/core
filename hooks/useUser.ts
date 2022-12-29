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