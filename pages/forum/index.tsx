import type { NextPage } from "next"
import { useEffect } from "react"
import useUser from "../../hooks/useUser";
import Link from "next/link";
import Icon from "@mui/material/Icon"
import { supabase } from "../../lib/supabase";

const ForumHome: NextPage = (data: any) => {
    const { user, loading, setLoading } = useUser()

    return (
            <>
            {
                data.forums.map((forum) => (
                        <div key={forum.id}>
                            <h1>{forum.title}</h1>
                            <p>{forum.description}</p>

                            <div id="categories">
                                {
                                    forum.categories.map((category) => (
                                        <div key={category.id}>
                                            <Icon>{category.icon}</Icon>

                                            <Link href={"/forum/category/" + category.slug}><h1>{category.title}</h1></Link>
                                            <h3>{category.description}</h3>
                                        </div>
                                    ))
                                }
                            </div>
                    </div>
                    )
            )}
            </>
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

    forums.forEach(forum => {
        forum.categories = categories.filter(t => t.id == forum.id)
    })

    console.log(forums)

    return {
        props: {
            forums
        }
    }
}

export default ForumHome