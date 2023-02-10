import { useEffect, useRef } from "react"
import { useRouter } from 'next/router'
import { supabase } from "../../../lib/supabase"
import useUser from "../../../hooks/useUser"
import { TextField, Button } from "@mui/material"
import Link from "next/link"
import { Send } from '@mui/icons-material'

type Profile = {
    id: any,
    username: string,
    full_name: string,
    avatar_url: string,
    created_at: Date,
    granted_authorities: GrantedAuthority[]
}

type GrantedAuthority = {
    id: any,
    created_at: Date,
    authorities: Authority,
    created_by: any,
    created_reason: string,
    removed_reason: string,
    removed_at: Date
}

type Authority = {
    id: any,
    name: string,
    display_name: string,
    color: string,
    rights: string[],
    weight: number,
    hidden: boolean
}

const ForumThread = (data) => {
    const { user } = useUser()

    return (
            <>
                <div className="flex flex-col items-center mt-8">
                    <div className="lg:min-w-[1100px] flex flex-col gap-y-2">
                        <div className="flex flex-row items-center gap-x-4">
                            <img referrerPolicy="no-referrer" className="rounded-xl w-16" alt="Avatar name" src={data?.profile?.avatar_url} />
                            <div className="flex flex-col gap-x-2">
                                <h1 className="items-center text-3xl font-bold">{data?.profile?.full_name}</h1>
                                <div className="p-1 flex flex-row gap-x-2">
                                    {
                                        data?.profile?.granted_authorities.filter((grant) => grant.removed_at == null).map((grant) => (
                                            <h3 style={{backgroundColor: grant.authorities.color}} key={grant.id} className="rounded-lg w-auto px-1 text-lg font-medium text-gray-800 dark:text-gray-300 hover:text-gray-600 hover:dark:text-gray-200" >
                                                {grant.authorities.display_name.toUpperCase()}
                                            </h3>
                                        ))
                                    }
                                </div>
                            </div>
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
    const { data: p, error: profileError } = await supabase
            .from("profiles")
            .select(`
                id,
                username,
                full_name,
                avatar_url,
                created_at
            `).eq("username", context.query.query.toLowerCase()).single()

    let profile = p as Profile

    const { data: grants, error: grantError } = await supabase
            .from("granted_authorities")
            .select(`
                id,
                created_at,
                created_by,
                created_reason,
                removed_reason,
                removed_by,
                removed_at,
                authorities (
                    id,
                    name,
                    display_name,
                    color,
                    rights,
                    weight,
                    hidden
                )
            `).eq(`target`, profile.id)

    profile.granted_authorities = (grants as unknown) as GrantedAuthority[]

    return {
        props: {
            profile
        }
    }
}

export default ForumThread