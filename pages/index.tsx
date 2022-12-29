import type { NextPage } from "next"
import { useEffect } from "react"
import useUser from "../hooks/useUser"
import Link from "next/link"
import { supabase } from "../lib/supabase"

const Home: NextPage = (data) => {
    const { user, loading, setLoading } = useUser()

    if (loading) {
        return <div>Loading</div>
    } else {
        return (
            <>
            BOOM BOOM WELCOME!!!! <h1>{JSON.stringify(user, null, 2) || "not logged in"}</h1>

                {!user && (
                    <Link href="/login">Login</Link>
                )}
                {user && (
                    <button
                        onClick={async () => {
                        setLoading(true)
                            try {
                            await supabase.auth.signOut()
                                await fetch("/api/auth/remove", {
                                    method: "GET",
                                    credentials: "same-origin"
                                })
                        } finally {
                            setLoading(false)
                        }
                    }}
                        >
                        Logout
                    </button>
                )}
            </>
        )
    }
}

export default Home