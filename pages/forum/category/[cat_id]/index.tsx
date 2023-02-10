import type { NextPage } from "next"
import { useEffect, useState } from "react"
import type { PostgrestResponse } from "@supabase/supabase-js"
import useUser from "../../../../hooks/useUser"
import Link from "next/link"
import Icon from "@mui/material/Icon"
import { supabase } from "../../../../lib/supabase"
import Breadcrumbs from "../../../../components/Breadcrumbs"
import { LinearProgress } from "@mui/material"
import { useRouter } from "next/router";
import Profile from "../../../../types/Profile"

const ForumCategory: NextPage = (data: any) => {
    const { user, loading, setLoading } = useUser()
    const [ forumsLoaded, setForumsLoaded ] = useState<boolean>(false)
    const [ forums, setForums ] = useState<any>([])

    type Forum_old = { id: any } & { title: any } & { description: any } & { categories: any[] }

    type Thread = {
        id: any,
        title: string,
        body: string,
        category_id: any,
        created_at: Date,
        updated_at: Date,
        profiles: Profile,
        replies: number,
        recentReply: any
    }

    type Category = {
        id: any,
        title: any,
        description: any,
        slug: any,
        icon: any,
        forum: any,
        forum_id: any,
        threads: Thread[]
    }

    const router = useRouter();

    useEffect(() => {
        async function getForums() {
            const { cat_id } = router.query;

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

            let { data: t, error: threadError } = await supabase
            .from("forum_threads")
            .select(`
                id,
                title,
                body,
                category_id,
                created_at,
                updated_at,
                profiles (
                    username,
                    full_name,
                    avatar_url,
                    created_at
                )
            `).eq("category_id", category?.id)

            if (t) {
                const threads: any = t;

                const { data: replies, error: replyError} = await supabase
                .from("forum_replies")
                .select(`id, thread_id, author_uid, profiles (username, full_name, avatar_url, updated_at), created_at`)

                threads?.forEach(thread => {
                    thread.replies = replies?.filter(r => r.thread_id == thread.id).length || 0;
                    if (thread.replies > 0) thread.recentReply = replies?.filter(r => r.thread_id == thread.id).sort(r => -r.created_at)[0]
                })

                if (threads != null) category.threads = threads
            };

            setForums(category)
            setForumsLoaded(true)
        }

        if (!forumsLoaded && router.isReady) {
            getForums()
        }
    }, [forumsLoaded, router.isReady])

    return (
            <div className="flex flex-col items-center">
                <div className="lg:min-w-[1300px]">
                    <Breadcrumbs pages={[
                        {
                            displayName: "Forum",
                            href: "/forum"
                        },
                        {
                            displayName: `Category: ${forums.title}`,
                            href: "/forum/category/" + forums.slug
                        }
                    ]}/>

                    <div className="flex flex-col pt-4">
                        <div className={forumsLoaded === true ? "hidden" : "flex flex-col gap-y-4"}>
                            <h1 className="text-2xl font-bold dark:text-gray-300">Fetching forum threads</h1>
                            <LinearProgress color="primary" />
                        </div>
                        {
                        forumsLoaded && (
                                <div className="flex flex-col px-6 py-6 rounded-xl">
                                    <h1 className="text-xl font-bold text-[#7F7B96]">{forums.title}</h1>
                                    <div id="categories" className="flex flex-col gap-y-4">
                                        {
                                            forums.threads.map((thread) => (
                                                    <div className="dark:bg-primary gap-1 flex align-items-center" style={{ boxShadow: "0 0 0 1px rgb(255 255 255 / 10%)", borderRadius: "0.5rem", marginTop: "0.25rem", padding: "1rem 1.25rem"  }} key={thread.id + thread.title}>
                                                        <div className="text-center opacity-70 text-[#C8C7D8] pr-16" style={{ width: "1.25em", marginLeft: "-0.25rem", fontSize: "1.5rem" }}>
                                                            <Icon style={{fontSize: "2.1rem"}}>comments</Icon>
                                                        </div>

                                                        <div style={{ flexGrow: 1, lineHeight: 1.25, overflow: "hidden" }}>
                                                            <div>
                                                                <Link href={"/forum/thread/" + thread.id}><h1 className="text-link" style={{fontSize: "1.05rem", fontWeight: 800, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}>{thread.title}</h1></Link>
                                                            </div>
                                                            <div className="text-[#C8C7D8] flex gap-1" style={{fontSize: ".875rem", fontWeight: 400 }}>
                                                                <span>
                                                                    started by <Link href={"/user/" + thread.profiles.username} className="font-bold">{thread.profiles.full_name}</Link>,
                                                                </span>
                                                                {new Date(thread.created_at || "1 January 1970").toLocaleTimeString("en-GB", { year: 'numeric', month: 'long', day: 'numeric' })}
                                                            </div>
                                                        </div>

                                                        <div className="text-[#C8C7D8] text-center" style={{ flexShrink: 0, width: "150px", fontSize: "0.85rem", fontWeight: 400 }}>
                                                            <span><strong>{thread.replies}</strong> Replies</span><br></br>
                                                            <span><strong>0</strong> Likes</span>
                                                        </div>

                                                        { thread.recentReply != null && thread.recentReply != undefined ? (
                                                                <div className="flex align-items-center" style={{ flexShrink: 0, width: "300px", lineHeight: 1.25 }}>
                                                                    <div>
                                                                        <Link href={"/user/" + thread.recentReply.profiles.username}>
                                                                            <img referrerPolicy="no-referrer" className="rounded-full hover:rounded-lg" style={{width: "40px", height: "40px", marginRight: "0.5rem"}} alt="Avatar name" src={thread.recentReply.profiles.avatar_url} />
                                                                        </Link>
                                                                    </div>
                                                                    <div style={{overflow: "hidden"}}>
                                                                        <div style={{fontSize: "1rem", fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}>
                                                                            <Link href={"/user/" + thread.recentReply.profiles.username} className="font-bold"><h1>{thread.recentReply.profiles.full_name}</h1></Link>
                                                                        </div>
                                                                        <div className="text-[#C8C7D8]" style={{fontWeight: 600, fontSize: "0.825rem"}}>
                                                                            {new Date(thread.recentReply.created_at || "1 January 1970").toLocaleTimeString("en-GB", { year: 'numeric', month: 'long', day: 'numeric' })}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className="flex align-items-center" style={{ flexShrink: 0, width: "300px", lineHeight: 1.25 }}>
                                                                    <div>
                                                                        <Link href={"/user/" + thread.profiles.username}>
                                                                            <img referrerPolicy="no-referrer" className="rounded-full hover:rounded-lg" style={{width: "40px", height: "40px", marginRight: "0.5rem"}} alt="Avatar name" src={thread.profiles.avatar_url} />
                                                                        </Link>
                                                                    </div>
                                                                    <div style={{overflow: "hidden"}}>
                                                                        <div style={{fontSize: "1rem", fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}>
                                                                            <Link href={"/user/" + thread.profiles.username} className="font-bold"><h1>{thread.profiles.full_name}</h1></Link>
                                                                        </div>
                                                                        <div className="text-[#C8C7D8]" style={{fontWeight: 600, fontSize: "0.825rem"}}>
                                                                            {new Date(thread.created_at || "1 January 1970").toLocaleTimeString("en-GB", { year: 'numeric', month: 'long', day: 'numeric' })}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        }
                                                        { thread.recentReply == null || thread.recentReply == undefined && (
                                                                <div className="flex align-items-center" style={{ flexShrink: 0, width: "300px", lineHeight: 1.25 }}>
                                                                    <span className="text-[#C8C7D8] text-center">There are no replies to this thread yet.</span>
                                                                </div>
                                                                )
                                                        }
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            )}
                    </div>
                </div>
            </div>
            )
}

export default ForumCategory