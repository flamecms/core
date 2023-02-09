import { useEffect, useRef, useState } from "react"
import { useRouter } from 'next/router'
import { supabase } from "../../../lib/supabase"
import useUser from "../../../hooks/useUser"
import { TextField, Button, Pagination } from "@mui/material"
import Link from "next/link"
import { Send } from '@mui/icons-material'
import Thread from "../../../components/forum/Thread"
import Breadcrumbs from "../../../components/Breadcrumbs"
import OldPagination from "../../../components/Pagination"
import { getPagination, getPages } from "../../../lib/pagination"
import ReactMarkdown from "react-markdown"

const ITEMS_PER_PAGE = 15

const ForumThread = (data) => {
    const { user } = useUser()
    const router = useRouter()
    const [ contentLoaded, setContentLoaded ] = useState<boolean>(false)

    const reply_content = useRef('')

    useEffect(() => {
        supabase
          .channel("public:forum_replies")
          .on('postgres_changes', { event: "INSERT", schema: "public", table: "forum_replies" }, payload => {
              console.log(payload)
              if (payload.new.thread_id == data.thread.id) router.replace(router.asPath)
          })
          .subscribe()  
    })

    return (
            <>
                <div className="flex flex-col items-center">
                    <div className="lg:min-w-[1300px]">
                        <Breadcrumbs pages={["Forum", "Thread", data.thread.title]}/>

                        <div className="bg-primary rounded-lg p-2 flex flex-row gap-2" style={{boxShadow: "0 0 0 1px rgb(255 255 255 / 10%)"}}>
                            <div>
                                <img referrerPolicy="no-referrer" className="rounded-xl w-24" alt="Avatar name" src={data.thread.profiles.avatar_url} />
                            </div>
                            <div className="p-3">
                                <h3 className="text-xl font-bold tracking-widest">{data.thread.profiles.full_name}</h3>
                            </div>

                            <div className="ml-auto">
                                <h2 className="text-md font-medium text-gray-800 dark:text-gray-200 text-right">Joined {new Date(data.thread.profiles.created_at || "1 January 1970").toLocaleDateString("en-GB", { year: 'numeric', month: 'long', day: 'numeric' })}</h2>
                                <h2 className="text-md font-medium text-gray-800 dark:text-gray-200 text-right">Started thread {new Date(data.thread.created_at || "1 January 1970").toLocaleDateString("en-GB", { year: 'numeric', month: 'long', day: 'numeric' })}</h2>
                                <h2 className="text-md font-medium text-gray-800 dark:text-gray-200 text-right"><strong>{data.replyCount}</strong> replies</h2>
                                <h2 className="text-md font-medium text-gray-800 dark:text-gray-200 text-right"><strong>0</strong> likes</h2>
                            </div>
                        </div>

                        <div className="flex flex-col pt-4 gap-2">
                            {data.page == 1 &&
                                <div className="bg-primary rounded-lg p-2 flex flex-col gap-2" style={{boxShadow: "0 0 0 1px rgb(255 255 255 / 10%)"}}>
                                    <div className="p-3">
                                        <h3 className="text-xl font-bold tracking-widest">{data.thread.title}</h3>
                                        <div className="text-sm">
                                            <h3 className="font-medium">by {data.thread.profiles.full_name}</h3>
                                        </div>
                                    </div>

                                    <div className="m-4 p-4 rounded-lg">
                                        <ReactMarkdown className="forum-markdown-styling max-w-[819px]">
                                            {data.thread.body.replace(/@(\S+)/gi,'[@$1](/user/$1)')}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            }

                            {!data.replies || data.replies.length == 0 ?
                                (
                                    <>
                                        <span className="text-red-300 text-center p-4">There are no replies to this thread yet!</span>
                                    </>
                                ) : (data.replies.map(reply => (
                                    <Thread
                                        key={reply.id}
                                        body={reply.body}
                                        updated_at={reply.updated_at}
                                        author={{
                                            full_name: reply.profiles.full_name,
                                            created_at: reply.profiles.created_at,
                                            avatar_url: reply.profiles.avatar_url,
                                        }
                                    }/>
                                )))
                            }

                            {!user ?
                                (
                                    <>
                                        <span className="text-red-300 text-center p-4">You must be logged in to reply to threads!</span>
                                    </>
                                ) : (
                                    <>
                                        <form noValidate autoComplete='off'>
                                            <div className="p-2 flex flex-col">
                                                <TextField
                                                    id="reply-box"
                                                    sx={{ input: { color: '#f7f7f7' } }}
                                                    className="w-full dark:bg-primary"
                                                    inputRef={reply_content}>
                                                </TextField>
                                                <Button
                                                    variant='contained'
                                                    color='primary'
                                                    size='medium'
                                                    endIcon={<Send/>}
                                                    onClick={async () => {
                                                        await supabase
                                                            .from("forum_replies")
                                                            .upsert({
                                                                body: reply_content.current.value,
                                                                author_uid: user.id,
                                                                thread_id: data.thread.id
                                                            })

                                                        const words = reply_content.current.value.split(" ")

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
                                                                            thread_title: document.getElementById("thread_title").innerHTML,
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
                                )
                            }

                        </div>
                    </div>

                    <Pagination color="secondary" className="pt-4 pb-2" count={data.pages} defaultPage={data.page} onChange={(e, page) => router.push(`/forum/thread/${data.thread.id}?page=${page}`)}/>
                </div>
            </>
        )
}


export async function getServerSideProps({query: { page = 1, thread_id }}) {
    const { from, to } = getPagination(page, ITEMS_PER_PAGE)

    const { data: thread, error: threadError } = await supabase
            .from("forum_threads")
            .select(`
                id,
                title,
                body,
                category_id,
                created_at,
                updated_at,
                author_uid,
                profiles (
                    full_name,
                    avatar_url,
                    created_at
                )
            `).eq("id", thread_id).single()

    const { data: replies, error: replyError, count } = await supabase
            .from("forum_replies")
            .select(`
                id,
                body,
                thread_id,
                created_at,
                updated_at,
                author_uid,
                profiles (
                    full_name,
                    avatar_url,
                    created_at
                )
            `, { count: 'exact' })
            .eq("thread_id", thread_id)
            .range(from, to)

    return {
        props: {
            thread,
            replies,
            replyCount: count,
            pages: getPages(count, ITEMS_PER_PAGE),
            page: +page,
        }
    }
}

export default ForumThread