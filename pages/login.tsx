import { useState, useEffect } from "react"
import type { NextPage } from "next"
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
            <h1>Login To Your Account</h1>

            <button
                onClick={async (e) => {
                    e.preventDefault()
                    handleLogin("google")
                }}
            >
                Login With Google
            </button>
            <button
                onClick={async (e) => {
                e.preventDefault()
                    handleLogin("discord")
            }}
                >
                Login With Discord
            </button>
        </>
    )
}

export default Login