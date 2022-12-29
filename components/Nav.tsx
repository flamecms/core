import { FC, useState } from "react"
import { Tooltip, Button, Badge } from "@mui/material"
import { Logout, Menu, Notifications, Settings } from "@mui/icons-material"
import useUser from "../hooks/useUser"
import { supabase } from "../lib/supabase"
import { useRouter } from "next/router"
import Image from "next/image"
import pages from "../lib/pages"
import Link from "next/link"

interface Props {

}

const Nav: React.FC<Props> = (props) => {
    const { user, loading, setLoading } = useUser()
    const [userInfoOpened, setUserInfoOpened] = useState(false)
    const router = useRouter()

    const toggleUserInfo = () => {
        setUserInfoOpened(!userInfoOpened)
    }

    return (
        <>
            <nav className="px-4 dark:bg-[#1a1a1a] bg-gray-300 py-4 w-full drop-shadow-xl flex justify-between items-center z-[50]">
                <div className="flex flex-row items-center text-left gap-x-4">
                    <Menu className="text-gray-800 dark:text-gray-300" />
                    <Link href="/" className="text-xl font-bold text-gray-800 dark:text-gray-200">Flame</Link>
                    <div className="flex flex-col sm:flex-row items-center gap-y-2 sm:gap-x-4">
                        {
                            Object.keys(pages).map((page, index) => (
                                <Link href={page} key={index} className="text-lg font-medium text-gray-800 dark:text-gray-300 hover:text-gray-600 hover:dark:text-gray-200">
                                    <Tooltip title={<span className="font-Quicksand">{pages[page].displayName}</span>} placement="bottom">
                                        <span className={router.pathname.substring(1) === (page.substring(1)) ? "text-amber-800 hover:text-amber-900 dark:text-amber-500 hover:dark:text-amber-600" : "text-gray-800 hover:text-gray-700 dark:text-gray-300 hover:dark:text-gray-400"}>{pages[page].icon}</span>
                                    </Tooltip>
                                </Link>
                            ))
                        }
                    </div>
                </div>
                <div className="flex flex-row items-center text-right">
                    {!user && (
                        <Link className="text-lg font-medium text-gray-800 dark:text-gray-300 hover:text-gray-600 hover:dark:text-gray-200" href="/login">Login</Link>
                    )}
                    {user && (
                        <span className="flex flex-row items-center gap-x-4 text-lg font-medium text-gray-800 dark:text-gray-300 hover:text-gray-600 hover:dark:text-gray-200">
                            Hello, {user?.user_metadata?.full_name}
                            <button onClick={toggleUserInfo}>
                                <img className="rounded-xl w-12" alt="Avatar name" src={user?.user_metadata?.avatar_url} />
                            </button>
                        </span>
                    )}
                </div>
            </nav>
            <div className={`${userInfoOpened ? "flex" : "hidden"} items- flex-col gap-y-4 absolute right-0 bg-gray-300 dark:bg-nav-bg transition ease-in-out rounded-bl-xl z-[40]`}>
                <div className="flex items-center flex-col gap-y-4 px-16 pt-8 pb-2">
                    <img className="rounded-xl w-24" alt="Avatar name" src={user?.user_metadata?.avatar_url} />
                    <div>
                        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200 text-center">
                            {user?.user_metadata?.full_name}
                        </h1>
                        <h2 className="text-md font-medium text-gray-800 dark:text-gray-200 text-center">{user?.email}</h2>
                        <h2 className="text-md font-medium text-gray-800 dark:text-gray-200 text-center">Joined {new Date(user?.created_at || "1 January 1970").toLocaleDateString("en-GB", { year: 'numeric', month: 'long', day: 'numeric' })}</h2>
                    </div>
                </div>
                <div className="border-gray-800 dark:border-gray-700 border-[1px] mt-1 mb-1 w-full" />
                <div className="flex flex-col justify-start gap-y-4 px-4">
                    <div className="flex flex-row justify-start gap-x-4">
                        <Badge badgeContent={"a"} color="error">
                            <Notifications />
                        </Badge>
                        Notifications
                    </div>
                    <div className="flex flex-row justify-start gap-x-4">
                        <Settings />
                        Account settings
                    </div>
                </div>
                <div className="border-gray-800 dark:border-gray-700 border-[1px] mt-1 mb-1 w-full" />
                <Button onClick={async () => {
                    setLoading(true)
                        try {
                        await supabase.auth.signOut()
                            await fetch("/api/auth/remove", {
                                method: "GET",
                                credentials: "same-origin"
                            })
                    } finally {
                        setLoading(false)
                        setUserInfoOpened(false) // we need this to make it so if they logout it closes the user info page <3
                        router.reload()
                    }
                }} variant="outlined" startIcon={<Logout />} className="mx-12 dark:text-gray-300 text-gray-800 border-gray-800 hover:border-gray-700 dark:border-gray-300 hover:dark:border-gray-200 font-sans font-bold normal-case">
                    Sign out
                </Button>
                <div className="border-gray-800 dark:border-gray-700 border-[1px] mt-1 w-full" />
                <div className="flex flex-row justify-evenly items-center mb-4 text-sm dark:text-gray-300 text-gray-800">
                    <Link href="/terms" className="">Terms of Service</Link>
                    <span className="px-1">•</span>
                    <Link href="/privacy" className="">Privacy Policy</Link>
                </div>
            </div>
            <div className={`${!userInfoOpened && "hidden"} absolute bg-opacity-50 w-full h-full top-0 left-0`} onClick={toggleUserInfo} />
        </>
    )
}

export default Nav