import type { NextPage } from "next"
import { useEffect } from "react"
import useUser from "../../hooks/useUser"
import Link from "next/link"
import Icon from "@mui/material/Icon"
import { supabase } from "../../lib/supabase"
import Breadcrumbs from "../../components/Breadcrumbs"

const Notifications: NextPage = (data: any) => {
    const { user, loading, setLoading } = useUser()

    return (
        <div className="flex flex-col items-center">
            <div className="lg:min-w-[1100px]">
                <Breadcrumbs pages={["Notifications"]}/>

                <h1 className="text-3xl font-medium">Notifications</h1>
                <div className="flex flex-col pt-4">
                    {
                        data.notifications.map((notification) => {
                            switch (notification.type) {
                                case "thread_mention":
                                    return (
                                        <div href={notification.source} className="flex flex-col dark:bg-primary px-6 py-6 rounded-xl" key={notification.id}>
                                            You were mentioned by {notification.metadata.mentioner} in the thread {notification.thread}.
                                        </div>
                                    )
                                default:
                                    return (
                                        <div href={notification.source} className="flex flex-col dark:bg-primary px-6 py-6 rounded-xl" key={notification.id}>

                                        </div>
                                    )
                            }
                        }
                    )}
                </div>
            </div>
        </div>
    )
}


export async function getServerSideProps(context) {
    const user = await supabase.auth.user()

    let { data: notifications, error: forumError } = await supabase
        .from("notifications")
        .select(`*`)
        .eq("target", user.id)

    return {
        props: {
            notifications
        }
    }
}

export default Notifications