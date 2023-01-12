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
            <div className="lg:min-w-[1100px]">
                <Breadcrumbs pages={["Forum"]}/>

                <h1 className="text-3xl font-medium">Forum Categories</h1>
                <div className="flex flex-col pt-4">
                    <div className={forumsLoaded === true ? "hidden" : "flex flex-col gap-y-4"}>
                        <h1 className="text-2xl font-bold dark:text-gray-300">Loading...</h1>
                        <LinearProgress color="primary" />
                    </div>
                    {
                        forumsLoaded && forums.map((forum) => (
                                <div className="flex flex-col dark:bg-primary px-6 py-6 rounded-xl" key={forum.id}>
                                    <h1 className="text-2xl font-bold">{forum.title}</h1>
                                    <p className="text-base">{forum.description}</p>
                                    <hr className="my-4" />
                                    <div id="categories" className="flex flex-col gap-y-4">
                                        {
                                            forum.categories.map((category) => (
                                                <div className="" key={category.id + category.title}>
                                                    <div className="flex flex-row gap-x-2 text-lg">
                                                        <div className="flex flex-row gap-x-2 justify-left">
                                                            <Icon className="text-gray-800 dark:text-gray-300">{category.icon || "info"}</Icon>
                                                            <Link href={"/forum/category/" + category.slug} className="font-bold"><h1>{category.title}</h1></Link>
                                                        </div>
                                                        <div className="flex flex-row gap-x-2 ml-auto">
                                                            <span className="text-gray-900 dark:text-gray-200 font-bold">Threads: {category.threads}</span>
                                                        </div>
                                                    </div>
                                                    <h3>{category.description}</h3>
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