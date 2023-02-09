import type { NextPage } from "next"
import { useEffect, useState } from "react"
import type { PostgrestResponse } from "@supabase/supabase-js"
import useUser from "../../hooks/useUser"
import Link from "next/link"
import Icon from "@mui/material/Icon"
import { supabase } from "../../lib/supabase"
import Breadcrumbs from "../../components/Breadcrumbs"
import { LinearProgress } from "@mui/material"
const ForumHome: NextPage = (data: any) => {
    const { user, loading, setLoading } = useUser()
    const [ forumsLoaded, setForumsLoaded ] = useState<boolean>(false)
    const [ forums, setForums ] = useState<any>([])

    type Forum_old = { id: any } & { title: any } & { description: any } & { categories: any[] }

    type Thread = {
        id: any,
        category_id: any
    }

    type Category = {
        id: any,
        title: any,
        description: any,
        slug: any,
        icon: any,
        forum: any,
        forum_id: any,
        threads: number
    }

    type Forum = {
        id: any,
        title: any,
        description: any,
        categories: Category[]
    }

    useEffect(() => {
        async function getForums() {
            // This is a janky fix. We can clean this up later but I just wanna get rid of the errors for now lol
            let { data: f, error: forumError } = await supabase
            .from("forums")
            .select(`id, title, description`)

            const forums = f as Forum[]
    
            const { data: c, error: categoryError } = await supabase
                    .from("forum_categories")
                    .select(`id, title, description, slug, icon, forum_id`)
            const categories = c as Category[]
        
            const { data: t, error: theadError } = await supabase
                    .from("forum_threads")
                    .select(`id, category_id`)
            const threads = t as Thread[]
        
            categories?.forEach(category => {
                category.threads = threads.filter(t => t.category_id == category.id).length
            })
        
            forums?.forEach(forum => {
                forum.categories = categories?.filter(c => c.forum_id == forum.id) // Was t.id before; fixed it!
            })

            setForums(forums)
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
                        <h1 className="text-2xl font-bold dark:text-gray-300">Fetching forum categories</h1>
                        <LinearProgress color="primary" />
                    </div>
                    {
                        forumsLoaded && forums.map((forum) => (
                                <div className="flex flex-col px-6 py-6 rounded-xl" key={forum.id}>
                                    <h1 className="text-xl font-bold text-[#7F7B96]">{forum.title}</h1>
                                    <div id="categories" className="flex flex-col gap-y-4">
                                        {
                                            forum.categories.map((category) => (
                                                    <div className="dark:bg-primary gap-1 flex align-items-center" style={{ boxShadow: "0 0 0 1px rgb(255 255 255 / 10%)", borderRadius: "0.5rem", marginTop: "0.25rem", padding: "1rem 1.25rem"  }} key={category.id + category.title}>
                                                        <div className="text-center opacity-70 text-[#C8C7D8]" style={{ width: "1.1em", marginLeft: "-0.25rem", fontSize: "1.5rem" }}>
                                                            <Icon>{category.icon || "info"}</Icon>
                                                        </div>

                                                        <div style={{ flexGrow: 1, lineHeight: 1.25, overflow: "hidden" }}>
                                                            <Link href={"/forum/category/" + category.slug}><h1 className="text-link" style={{fontSize: "1.05rem", fontWeight: 800, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}>{category.title}</h1></Link>
                                                            <h3 className="text-[#C8C7D8]" style={{fontSize: ".875rem", fontWeight: 400}}>{category.description}</h3>
                                                        </div>

                                                        <div className="text-[#C8C7D8] text-center" style={{ flexShrink: 0, width: "150px", fontSize: "0.85rem", fontWeight: 400 }}>
                                                            <span><strong>{category.threads}</strong> Threads</span>
                                                        </div>
                                                    </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            )
                    )}
                </div>
            </div>
        </div>
    )
}

export default ForumHome