import type { NextPage, GetServerSideProps } from "next"
import { useEffect, useState } from "react"
import useUser from "../../hooks/useUser"
import Link from "next/link"
import Icon from "@mui/material/Icon"
import { createSSRClient, supabase } from "../../lib/supabase"
import Breadcrumbs from "../../components/Breadcrumbs"

const renderNotification = (notification) => {
    switch (notification.type) {
        case "thread_mention":
            console.log(notification)
            return (
                <div className="flex flex-col dark:bg-primary px-6 py-6 rounded-xl" key={notification.id}>
                    <p>
                        You were mentioned by {notification.metadata.mentioner} in the thread {" "} 
                        <Link href={notification.source} className="text-purple-300 hover:text-purple-400">
                            {notification.metadata?.thread_title}
                        </Link>.
                    </p>
                    <b>{new Date(notification?.created_at).toLocaleTimeString("en-GB", { year: 'numeric', month: 'long', day: 'numeric' })}</b>
                </div>
                )
        default:
            return (
                <a href={notification.source} className="flex flex-col dark:bg-primary px-6 py-6 rounded-xl" key={notification.id}>
                    {notification}
                </a>
            )
    }
}

const Notifications: NextPage = (data: any) => {
    const [ notificationsLoaded, setNotificationsLoaded ] = useState<boolean>(false)
    const [ notifications, setNotifications ] = useState<any>([])
    useEffect(() => {
        async function getNotifications() {
            let { data, error: forumError } = await supabase
            .from("notifications")
            .select(`*`)

            if (forumError) {
                throw new Error(forumError + " ")
            } else {
                setNotifications(data)
                setNotificationsLoaded(true)
            }
        }

        if (!notificationsLoaded) {
            getNotifications()
        }
    })

    const { user, loading, setLoading } = useUser()

    return (
        <div className="flex flex-col items-center">
            <div className="lg:min-w-[1100px]">
                <Breadcrumbs pages={["Notifications"]}/>

                <h1 className="text-3xl font-medium">Notifications</h1>
                <div className="flex flex-col pt-4">
                    {
                        notifications.map((notification) => (renderNotification(notification)))
                    }
                </div>
            </div>
        </div>
    )
}

export default Notifications