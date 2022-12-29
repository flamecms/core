import { FC, useState } from "react"
import { Tooltip, Button } from "@mui/material"
import { Logout, Menu } from "@mui/icons-material"
import useUser from "../hooks/useUser"
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
            <nav className="px-4 dark:bg-[#1a1a1a] bg-gray-300 py-4 w-full drop-shadow-xl flex justify-between items-center">
                <div className="flex flex-row items-center text-left gap-x-4">
                    <Menu />
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
            <div className={`${userInfoOpened ? "flex" : "hidden"} items-center flex-col gap-y-4 fixed right-0 px-16 py-8 bg-nav-bg transition ease-in-out rounded-bl-xl`}>
                <img className="rounded-xl w-24" alt="Avatar name" src={user?.user_metadata?.avatar_url} />
                <h1 className="text-xl font-bold text-gray-200 text-center">
                    {user?.user_metadata?.full_name}
                </h1>
                <Button variant="outlined" startIcon={<Logout />} color="warning" className="font-sans font-bold">
                    Sign out
                </Button>
            </div>
        </>
    )
}

export default Nav