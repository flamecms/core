import { useRouter } from 'next/router'
import { supabase } from "../../../../lib/supabase"
import Link from "next/link";

const ForumCategory = (data) => {
    return (
        <div className="text-center">
            <h2>{data.category.title}</h2>
            <p>{data.category.description}</p>
            <br/>

            <div id="threads">
                {
                    data.category.threads.map((thread) => (
                            <div key={thread.id}>
                                <Link href={"/forum/thread/" + thread.id}><h1>{thread.title}</h1></Link>
                                <h3>{thread.body}</h3>

                                <h5>{thread.author.full_name}</h5>
                                <img referrerPolicy="no-referrer" className="rounded-xl w-12" alt="Avatar name" src={thread.author?.user_metadata?.avatar_url} />
                            </div>
                            ))
                }
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

    const { data: threads, error: threadError } = await supabase
            .from("forum_threads")
            .select(`
                id,
                title,
                body,
                category_id,
                created_at,
                updated_at,
                author_uid,
                users (
                    id,
                    full_name,
                    user_metadata(
                        avatar_url
                    )
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