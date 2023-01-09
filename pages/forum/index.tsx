import type { NextPage } from "next"
import { useEffect } from "react"
import useUser from "../../hooks/useUser"
import useProfile from "../../hooks/useProfile"
import Link from "next/link"
import Icon from "@mui/material/Icon"
import { supabase } from "../../lib/supabase"

const ForumHome: NextPage = (data: any) => {
    const { user, loading, setLoading } = useUser()

    return (
        <div className="flex flex-col items-center">
            <div className="lg:min-w-[1100px]">
                <h1 className="text-3xl font-medium">Forum Categories</h1>
                <div className="flex flex-col pt-4">
                    {
                        data.forums.map((forum) => (
                                <div className="flex flex-col dark:bg-primary px-6 py-6 rounded-xl" key={forum.id}>
                                    <h1 className="text-2xl font-bold">{forum.title}</h1>
                                    <p className="text-base">{forum.description}</p>
                                    <hr className="my-4" />
                                    <div id="categories" className="flex flex-col gap-y-4">
                                        {
                                            forum.categories.map((category) => (
                                                <div className="" key={category.id}>
                                                    <div className="flex flex-row gap-x-2 text-lg items-center">
                                                        <Icon className="text-gray-800 dark:text-gray-300">{category.icon || "info"}</Icon>
                                                        <Link href={"/forum/category/" + category.slug} className="font-bold"><h1>{category.title}</h1></Link>
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


export async function getServerSideProps(context) {
    const user = await supabase.auth.user()
    let { data: forums, error: forumError } = await supabase
        .from("forums")
        .select(`id, title, description`)

    const { data: categories, error: categoryError } = await supabase
            .from("forum_categories")
            .select(`id, title, description, slug, icon, forum_id`)

    forums?.forEach(forum => {
        forum.categories = categories?.filter(t => t.forum_id == forum.id) // Was t.id before; fixed it!
    })

    console.log(forums)

    return {
        props: {
            forums
        }
    }
}

export default ForumHome