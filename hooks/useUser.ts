import { useState, useEffect } from "react"
import { supabase } from "../lib/supabase"
import { User } from "@supabase/gotrue-js"
import { useRouter } from "next/router"

const useUser = () => {
    const [user, setUser] = useState<User | undefined>(undefined)
    const [loading, setLoading] = useState(true)
    const [token, setToken] = useState<any>(undefined)
    const [notifications, setNotifications] = useState<any>([])

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
        })
    }, [supabase])


    return {
        user,
        loading,
        setLoading,
        notifications,
        token
    }
}

export const runNotificationCheck = async (user, router) => {
    console.log("running notification check")

    if (user) {
        const { data: notifications, error } = await supabase
            .from("notifications")
            .select("*")
            .eq("acknowledged", false)
            .eq("target", user.id)


        console.log(notifications)

        notifications.forEach(async (notification) => {
            if (router.req.url == notification.source) {
                notification.acknowledged = true
                notifications.remove(notification)
                await supabase.from("notifications").upsert(notification)
            }
        })

        return notifications == undefined ? [] : notifications.replace(undefined, null)
    } else return []
}

export default useUser