import { useState, useEffect } from "react"
import type { NextPage } from "next"
import providers from "../../lib/providers"
import { Tooltip, Button, Badge } from "@mui/material"
import { Logout, Menu, Notifications, Settings } from "@mui/icons-material"
import { supabase } from "../../lib/supabase"
import useUser from "../../hooks/useUser"
import { useRouter } from "next/router"

const Login: NextPage = () => {
    const router = useRouter()
    const { user } = useUser()

    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState("")

    useEffect(() => {
        if (user) router.push("/")
    })

    async function handleLogin(provider) {
        setLoading(true)
        try {
            await supabase.auth.signIn({
                provider
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
        <div className="flex flex-col justify-center gap-y-2 items-center">
                <h2 className="text-3xl dark:text-gray-300 text-gray-800 text-center">Sign in to Flame</h2>
                <div className="flex flex-row items-center gap-x-2">
                    {
                        Object.keys(providers).map((provider, index) => (
                            <Button key={provider} onClick={
                                async (e) => {
                                    handleLogin(provider)
                                }
                            }
                            variant="outlined" className="dark:text-gray-300 text-gray-800 border-gray-800 hover:border-gray-700 dark:border-gray-300 hover:dark:border-gray-200 font-sans font-bold normal-case">
                                {providers[provider].icon || <></>}
                            </Button>
                        ))
                    }
                </div>
            </div>
        </>
    )
}

export default Login