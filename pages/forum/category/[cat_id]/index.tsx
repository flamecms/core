import { useRouter } from 'next/router'
import { supabase } from "../../../../lib/supabase"
import Link from "next/link"
import Icon from "@mui/material/Icon"

const ForumCategory = (data) => {
    return (
        <div className="flex flex-col items-center">
            <div className="lg:min-w-[1100px]">
                <h1 className="text-3xl font-medium">{data.category.title}</h1>
                <h3 className="text-2xl font-medium">{data.category.description}</h3>
                <div className="flex flex-col pt-4">
                    {
                        <div className="flex flex-col dark:bg-primary px-6 py-6 rounded-xl">
                            <div id="threads" className="flex flex-col gap-y-4">
                                {
                                    data.category.threads.map((thread) => (
                                        <div className="" key={thread.id}>
                                            <div className="flex flex-row gap-x-2 text-lg items-center">
                                                <Icon className="text-gray-800 dark:text-gray-300">chatbubble</Icon>
                                                <Link href={"/forum/thread/" + thread.id} className="font-bold"><h1>{thread.title}</h1></Link>
                                            </div>

                                            <div className="flex flex-row gap-x-2 text-lg items-center">
                                                <h2 className="text-md font-medium text-gray-800 dark:text-gray-200 text-center">{thread.profiles.full_name}</h2>
                                                <span> · </span>
                                                <h2 className="text-md font-medium text-gray-800 dark:text-gray-200 text-center">Last Active {new Date(thread?.updated_at || "1 January 1970").toLocaleDateString("en-GB", { year: 'numeric', month: 'long', day: 'numeric' })}</h2>
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
    const user = await supabase.auth.user()

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
                    avatar_url
                )
            `).eq("category_id", category?.id)

    console.log(`th: ${JSON.stringify(threads)}`)

    category.threads = threads || []

    return {
        props: {
            category
        }
    }
}

export default ForumCategory