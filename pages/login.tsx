import { useState, useEffect } from "react"
import type { NextPage } from "next"
import providers from "../lib/providers"
import { Tooltip, Button, Badge } from "@mui/material"
import { Logout, Menu, Notifications, Settings } from "@mui/icons-material"
import { supabase } from "../lib/supabase"
import useUser from "../hooks/useUser"
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
        <div className="flex flex-col justify-center gap-y-2 px-96">
                <h2 className="dark:text-gray-300 text-gray-800 text-center">Login to Flame</h2>

                {
                    Object.keys(providers).map((provider, index) => (
                        <Button key={provider} onClick={
                            async (e) => {
                                handleLogin(provider)
                            }
                        }

                            variant="outlined" startIcon={providers[provider].icon || <></>} className="mx-12 dark:text-gray-300 text-gray-800 border-gray-800 hover:border-gray-700 dark:border-gray-300 hover:dark:border-gray-200 font-sans font-bold normal-case">
                            Continue With {providers[provider].displayName}
                        </Button>
                    ))
                }
            </div>
        </>
    )
}

export default Login