import { useEffect, useRef } from "react"
import { useRouter } from 'next/router'
import { supabase } from "../../../lib/supabase"
import useUser from "../../../hooks/useUser"
import { TextField, Button } from "@mui/material"
import Link from "next/link"
import { Send } from '@mui/icons-material'

const ForumThread = (data) => {
    const { user } = useUser()

    return (
            <>
                <div className="flex flex-col items-center mt-8">
                    <div className="lg:min-w-[1100px] flex flex-col gap-y-2">
                        <div className="flex flex-row items-center gap-x-4">
                            <img referrerPolicy="no-referrer" className="rounded-xl w-16 " alt="Avatar name" src={data?.profile?.avatar_url} />
                            <h1 className="text-3xl font-bold">{data?.profile?.full_name}</h1>
                        </div>
                        <h3 className="text-2xl font-medium">something here idk aybe a bio?</h3>
                        <div className="flex flex-col pt-4 gap-2">
                            this is where u put the content
                        </div>
                    </div>
                </div>
            </>
            )
}


export async function getServerSideProps(context) {
    const user = await supabase.auth.user()

    const { data: profile, error: threadError } = await supabase
            .from("profiles")
            .select(`
                id,
                full_name,
                avatar_url
            `).eq("username", context.query.query.toLowerCase()).single()

    return {
        props: {
            profile
        }
    }
}

export default ForumThread