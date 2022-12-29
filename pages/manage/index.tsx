import { useState, useEffect } from "react"
import type { NextPage } from "next"
import { supabase } from "../../lib/supabase"
import useUser from "../../hooks/useUser"
import { useRouter } from "next/router"

const Manage: NextPage = () => {
    const router = useRouter()
    const { user } = useUser()

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!user) router.push("/login")
    })

    return (
            <>
                this is the admin dashbooard woooo
            </>
            )
}

export default Manage