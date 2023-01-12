import { useRouter } from 'next/router'
import { supabase } from "../../../../lib/supabase"
import Link from "next/link"
import Icon from "@mui/material/Icon"
import Breadcrumbs from "../../../../components/Breadcrumbs"

const ForumCategory = (data) => {
    return (
        <div className="flex flex-col items-center">
            <div className="lg:min-w-[1100px]">
                <Breadcrumbs pages={["Forum", "Category", data.category.title]}/>

                <h1 className="text-3xl font-medium">{data.category.title}</h1>
                <h3 className="text-2xl font-medium">{data.category.description}</h3>
                <div className="flex flex-col pt-4">
                    {
                        <div className="flex flex-col dark:bg-primary px-6 py-6 rounded-xl">
                            <div id="threads" className="flex flex-col gap-y-4">
                                {
                                    data.category.threads.map((thread) => (
                                        <div className="flex" key={thread.id}>
                                            <div className="flex flex-col gap-x-2 w-1/2">
                                                <div className="flex flex-row gap-x-2 text-lg items-center">
                                                    <Icon className="text-gray-800 dark:text-gray-300">chatbubble</Icon>
                                                    <Link href={"/forum/thread/" + thread.id} className="font-bold"><h1>{thread.title}</h1></Link>
                                                </div>

                                                <div className="flex flex-row gap-x-2 text-lg items-center">
                                                    <h2 className="text-md font-medium text-gray-800 dark:text-gray-200 text-center">{thread.profiles.full_name}</h2>
                                                    <span> · </span>
                                                    <h2 className="text-md font-medium text-gray-800 dark:text-gray-200 text-center">Started {new Date(thread.created_at || "1 January 1970").toLocaleTimeString("en-GB", { year: 'numeric', month: 'long', day: 'numeric' })}</h2>
                                                </div>
                                            </div>
                                            <div className="flex flex-row gap-x-2 w-1/2 text-right justify-end">
                                                <div className="flex flex-col gap-x-2 text-lg">
                                                    <Link href={"/forum/thread/" + thread.id} className="font-bold"><h1>{thread.recentReply.profiles.full_name}</h1></Link>
                                                    <h2 className="text-md font-medium text-gray-800 dark:text-gray-500">{new Date(thread.recentReply.created_at || "1 January 1970").toLocaleTimeString("en-GB", { year: 'numeric', month: 'long', day: 'numeric' })}</h2>
                                                </div>
                                                <div className="flex flex-col gap-x-2 text-lg">
                                                    <img referrerPolicy="no-referrer" className="rounded-full hover:rounded-lg w-12" alt="Avatar name" src={thread.recentReply.profiles.avatar_url} />
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}


export async function getServerSideProps(context) {
    const { data: category, error: categoryError } = await supabase
            .from("forum_categories")
            .select(`
                id,
                title,
                description,
                slug,
                icon
            `).eq("slug", context.query.cat_id).single()

    console.log(`cat: ${JSON.stringify(category)}`)

    let { data: threads, error: threadError } = await supabase
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
            `).eq("category_id", category?.id)

    const { data: replies, error: replyError} = await supabase
            .from("forum_replies")
            .select(`id, thread_id, author_uid, profiles (full_name, avatar_url, updated_at), created_at`)

    threads?.forEach(thread => {
        thread.replies = replies.filter(r => r.thread_id == thread.id).length
        if (thread.replies > 0) thread.recentReply = replies.filter(r => r.thread_id == thread.id).sort(r => -r.created_at)[0]
    })

    console.log(`th: ${JSON.stringify(threads)}`)

    category.threads = threads || []

    console.log(JSON.stringify(category))

    return {
        props: {
            category
        }
    }
}

export default ForumCategory