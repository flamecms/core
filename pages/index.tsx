import type { NextPage } from "next"
import { useEffect } from "react"
import useUser from "../hooks/useUser";
import Icon from "@mui/material/Icon"
import Link from "next/link";
import { supabase } from "../lib/supabase";

const Home: NextPage = (data) => {
    const { user, loading, setLoading } = useUser()


    return (
        <>
        <Icon>github</Icon>
        </>
    )

    /*
    if (loading) {
        return <div>Loading</div>
    } else {
        return (
            <>
                thi

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
    */
}

export default Home