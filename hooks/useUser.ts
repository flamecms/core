import { useState, useEffect } from "react"
import { supabase } from "../lib/supabase"
import { User } from "@supabase/gotrue-js"
import { useRouter } from "next/router"

const useUser = () => {
    const [user, setUser] = useState<User | undefined>(undefined)
    const [loading, setLoading] = useState(true)
    const [token, setToken] = useState<any>(undefined)

    useEffect(() => { 
        async function sessionUser() {
            const { data: { session: currentSession }, error } = await supabase.auth.getSession()
            if (currentSession?.user?.id) {
                setUser(currentSession?.user)
                setToken(currentSession?.access_token)
            }

            setLoading(false)

            supabase.auth.onAuthStateChange(async (event, session) => {
                const { data: { user: newUser } } = await supabase.auth?.getUser()
                if (newUser) {
                    if (event === "SIGNED_IN" && localStorage.getItem("sb:state") !== "SIGNED_IN") {
                        await fetch("/api/auth/set", {
                            "method": "POST",
                            "headers": new Headers({ "Content-Type": "application/json"}),
                            "credentials": "same-origin",
                            "body": JSON.stringify({ event, session })
                        })
                    };

                    let { data: profile, error, status } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("id", newUser.id)
                    .single()

                    if (error && status != 406) throw error
                    if (!profile.username) {
                        await supabase.from("profiles").upsert({
                            id: newUser.id,
                            username: newUser.user_metadata.full_name.toLowerCase(),
                            full_name: newUser.user_metadata.full_name,
                            email: newUser.email,
                            avatar_url: newUser.user_metadata.avatar_url,
                            updated_at: new Date()
                        })

                        console.log("Created Flame profile for " + profile.id)
                    }
                }
                console.log(newUser)
                setUser(newUser || undefined)
                setToken(session?.access_token)
            })
        }

        sessionUser()
    }, [supabase])


    return {
        user,
        loading,
        setLoading,
        token
    }
}

export default useUser