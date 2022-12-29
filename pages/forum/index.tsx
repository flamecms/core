import type { NextPage } from "next"
import { useEffect } from "react"
import useUser from "../../hooks/useUser";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

const ForumHome: NextPage = (data: any) => {
    const { user, loading, setLoading } = useUser()

    return (
            <>
            {
                data.posts.map((post) => (
                    <div key={post.id}>
                        <h1>{post.title}</h1>
                        <p>{post.body}</p>
                    </div>
                    )
            )}
            </>
            )
}


export async function getServerSideProps(context) {
    const user = await supabase.auth.user()
    const { data: posts, error } = await supabase
        .from("posts")
        .select(`id, title, body, users ( author_uid )`)

    console.log(posts)
    if (error) console.log(error.message)

    return {
        props: {
            posts: (posts || [])
        }
    }
}

export default ForumHome