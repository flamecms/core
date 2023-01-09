import { useEffect, useRef } from "react"
import { useRouter } from 'next/router'
import { supabase } from "../../../../lib/supabase"
import useUser from "../../../../hooks/useUser"
import { TextField, Button } from "@mui/material"
import Link from "next/link"
import { Send } from '@mui/icons-material'
import Thread from "../../../../components/forum/Thread"

const ForumThread = (data) => {
    const { user } = useUser()

    const reply_content = useRef('')

    return (
            <>
                <div className="flex flex-col items-center">
                    <div className="lg:min-w-[1100px]">
                        <h1 className="text-3xl font-medium">{data.thread.title}</h1>
                        <h3 className="text-2xl font-medium">Started by {data.thread.profiles.full_name}</h3>
                        <div className="flex flex-col pt-4 gap-2">
                            {
                                <Thread
                                    body={data.thread.body}
                                    updated_at={data.thread.updated_at}
                                    author={{
                                    full_name: data.thread.profiles.full_name,
                                        created_at: data.thread.profiles.created_at,
                                        avatar_url: data.thread.profiles.avatar_url,
                                    }
                                    }/>
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

                                                        console.log(reply_content.current.value)
                                                        window.location = window.location
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
                </div>
            </>
        )
}


export async function getServerSideProps(context) {
    const user = await supabase.auth.user()

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
                    avatar_url
                )
            `).eq("id", context.query.thread_id).single()

    const { data: replies, error: replyError } = await supabase
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
                    avatar_url
                )
            `).eq("thread_id", context.query.thread_id)

    return {
        props: {
            thread,
            replies
        }
    }
}

export default ForumThread