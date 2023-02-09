import type { NextPage } from "next"
import { useRef, useEffect, useState } from "react"
import type { PostgrestResponse } from "@supabase/supabase-js"
import useUser from "../../../../hooks/useUser"
import Link from "next/link"
import Icon from "@mui/material/Icon"
import { supabase } from "../../../../lib/supabase"
import Breadcrumbs from "../../../../components/Breadcrumbs"
import { LinearProgress } from "@mui/material"
import { Send } from '@mui/icons-material'
import { useRouter } from "next/router";
import Profile from "../../../../types/Profile"

import { TextField, Button, Pagination } from "@mui/material"

const ForumCategory: NextPage = (data: any) => {
    const { user, loading, setLoading } = useUser()
    const [ forumsLoaded, setForumsLoaded ] = useState<boolean>(false)
    const [ forums, setForums ] = useState<Category>()

    const title_content = useRef('')
    const body_content = useRef('')

    type Category = {
        id: any,
        title: any,
        description: any,
        slug: any,
        icon: any
    }

    const router = useRouter();
    const { cat_id } = router.query

    console.log(cat_id)

    useEffect(() => {
        async function getForums() {
            const { data: c, error: categoryError } = await supabase
            .from("forum_categories")
            .select(`
                id,
                title,
                description,
                slug,
                icon
            `).eq("slug", cat_id).single()

            const category = c as Category

            console.log(category)

            setForums(category)
            setForumsLoaded(true)
        }

        if (!forumsLoaded) {
            getForums()
        }
    })

    return (
            <div className="flex flex-col items-center">
                <div className="lg:min-w-[1300px]">
                    <Breadcrumbs pages={["Forum"]}/>

                    <div className="flex flex-col pt-4">
                        <div className={forumsLoaded === true ? "hidden" : "flex flex-col gap-y-4"}>
                            <h1 className="text-2xl font-bold dark:text-gray-300">Loading</h1>
                            <LinearProgress color="primary" />
                        </div>
                        {
                        forumsLoaded && (
                                <div className="flex flex-col px-6 py-6 rounded-xl">
                                    <div className="dark:bg-primary gap-1 flex align-items-center" style={{ boxShadow: "0 0 0 1px rgb(255 255 255 / 10%)", borderRadius: "0.5rem", marginTop: "0.25rem", padding: "1rem 1.25rem"  }}>
                                        Creating a new thread for updates

                                        <>
                                        <form noValidate autoComplete='off'>
                                            <div className="p-2 flex flex-col">
                                                <TextField
                                                    id="title-box"
                                                    sx={{ input: { color: '#f7f7f7' } }}
                                                    className="w-full dark:bg-primary"
                                                    inputRef={title_content}>
                                                </TextField>
                                                <TextField
                                                    id="body-box"
                                                    sx={{ input: { color: '#f7f7f7' } }}
                                                    className="w-full dark:bg-primary"
                                                    inputRef={body_content}>
                                                </TextField>
                                                <Button
                                                    variant='contained'
                                                    color='primary'
                                                    size='medium'
                                                    endIcon={<Send/>}
                                                    onClick={async () => {
                                                    await supabase
                                                            .from("forum_threads")
                                                            .upsert({
                                                                title: title_content.current.value,
                                                                body: body_content.current.value,
                                                                category_id: 1,
                                                                author_uid: user.id
                                                            })

                                                        const words = body_content.current.value.split(" ")

                                                        let notified = []

                                                        for (let w in words) {
                                                            let word = words[w]
                                                            if (word.startsWith("@")) {
                                                                word = word.substring(1)

                                                                const { data, error } = await supabase
                                                                    .from("profiles")
                                                                    .select("id, full_name")
                                                                    .eq("username", word.toLowerCase())
                                                                    .single()

                                                                if (!data || notified.includes(data.id)) return

                                                                notified.push(data.id)

                                                                await supabase
                                                                    .from("notifications")
                                                                    .insert({
                                                                        target: data.id,
                                                                        type: "thread_mention",
                                                                        source: window.location.href,
                                                                        metadata: {
                                                                            thread_title: document.getElementById("title-box").text,
                                                                            mentioner: user.user_metadata.full_name
                                                                        }
                                                                    })
                                                            }
                                                        }


                                                        window.location.href = `?page=${data.pages}`
                                                }
                                                }
                                                    >
                                                    Submit Reply
                                                </Button>
                                            </div>
                                        </form>
                                        </>
                                    </div>
                                </div>
                                )}
                    </div>
                </div>
            </div>
            )
}

export default ForumCategory