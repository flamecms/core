import { FC, useState, useRef, useEffect } from "react"
import { Tooltip, IconButton, TextField, InputAdornment, Button, Badge, Snackbar, Alert } from "@mui/material"
import { Close, Logout, Menu, Notifications, Settings, Search } from "@mui/icons-material"
import MailIcon from '@mui/icons-material/Mail';
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
    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const [navbarOpened, setNavbarOpened] = useState(false)
    const router = useRouter()

    const [notifications, setNotifications] = useState([])

    useEffect(() => {
        const localUser = supabase.auth.user()

        async function handleNotifications(router) {
            setLoading(true)
            console.log("Loading notifications for " + localUser.user_metadata.full_name)
            if (localUser) {
                const { data: retrieved, error } = await supabase
                    .from("notifications")
                    .select("*")
                    .eq("acknowledged", false)
                    .eq("target", localUser.id)

                console.log(retrieved)

                retrieved.forEach(async (notification) => {
                    if (router.pathname == notification.source) {
                        notification.acknowledged = true
                        retrieved.remove(notification)
                        await supabase.from("notifications").upsert(notification)
                    }
                })

                return retrieved == undefined ? [] : retrieved
            } else return []
        }
        handleNotifications(router).then(value => {
            setNotifications(value)
            setLoading(false)
            if (value.length > 0) setSnackbarOpen(true)
        })
    }, [supabase])

    console.log(notifications)
    console.log(user)

    const searchBox = useRef('')

    const handleSnackbarClose = () => {
        setSnackbarOpen(false)
    }

    const toggleUserInfo = () => {
        setUserInfoOpened(!userInfoOpened)
    }

    const toggleNavbar = () => {
        setNavbarOpened(!navbarOpened)
    }

    return (
        <>
            <nav className="px-4 dark:bg-primary bg-gray-300 py-4 w-full drop-shadow-xl flex justify-between items-center z-[50]">
                <div className="flex flex-row items-center text-left gap-x-4">
                    <Button className="sm:hidden" onClick={() => toggleNavbar()}>
                        <Menu className="text-gray-800 dark:text-gray-300" />
                    </Button>
                    <Link href="/" className="text-xl font-bold text-gray-800 dark:text-gray-200">Flame</Link>
                    <div className="hidden sm:flex flex-col sm:flex-row items-center gap-y-2 sm:gap-x-4">
                        {
                            Object.keys(pages).map((page, index) => (
                                <Link href={page} key={index} className="text-lg font-medium text-gray-800 dark:text-gray-300 hover:text-gray-600 hover:dark:text-gray-200">
                                    <Tooltip title={<span className="font-Quicksand">{pages[page].displayName}</span>} placement="bottom">
                                        <span className={router.pathname.startsWith(page) && page != "/" || page == "/" && router.pathname == "/" ? "text-purple-800 hover:text-purple-900 dark:text-purple-500 hover:dark:text-purple-600" : "text-gray-800 hover:text-gray-700 dark:text-gray-300 hover:dark:text-gray-400"}>{pages[page].icon}</span>
                                    </Tooltip>
                                </Link>
                            ))
                        }
                    </div>
                </div>

                <div className="hidden md:flex flex-row item-center text-center">
                    <form noValidate autoComplete="off">
                        <TextField
                            id="reply-box"
                            sx={{ input: { color: '#f7f7f7' } }}
                            variant="outlined"
                            className="w-full dark:bg-primary rounded"
                            inputRef={searchBox}
                            onKeyPress={(ev) => {
                                if (ev.key === 'Enter') {
                                    ev.preventDefault()
                                    window.location = `/user/${searchBox.current.value}`
                                }
                            }}
                            InputProps={{
                            endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton edge="end" className="text-purple-600" onClick={() => window.location = `/user/${searchBox.current.value}`}>
                                            <Search />
                                        </IconButton>
                                    </InputAdornment>
                                    ),
                            }}
                        />
                    </form>
                </div>

                <div className="flex flex-row items-center text-right">
                    {!user && (
                        <Link className="text-lg font-medium text-gray-800 dark:text-gray-300 hover:text-gray-600 hover:dark:text-gray-200" href="/auth/login">Sign in</Link>
                    )}
                    {user && (
                        <span className="flex flex-row items-center gap-x-4 text-lg font-medium text-gray-800 dark:text-gray-300 hover:text-gray-600 hover:dark:text-gray-200">
                            <span className="hidden lg:flex">Hello, {user?.user_metadata?.full_name}</span>
                            <button onClick={toggleUserInfo}>
                                <Badge anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }} badgeContent={notifications.length} overlap="circular" color="error">
                                    <img referrerPolicy="no-referrer" className="rounded-full hover:rounded-lg w-12" alt="Avatar name" src={user?.user_metadata?.avatar_url} />
                                </Badge>
                            </button>
                        </span>
                    )}
                </div>
            </nav>
            <div id="user_info" className={`${userInfoOpened ? "flex" : "hidden"} w-full sm:w-auto drop-shadow-xl flex-col gap-y-4 sm:absolute right-0 bg-gray-300 dark:bg-primary transition ease-in-out rounded-bl-xl z-[40]`}>
                <div className="flex items-center flex-col gap-y-4 px-16 pt-8 pb-2">
                    <img referrerPolicy="no-referrer" className="rounded-xl w-24" alt="Avatar name" src={user?.user_metadata?.avatar_url} />
                    <div>
                        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200 text-center">
                            {user?.user_metadata?.full_name}
                        </h1>
                        <h2 className="text-md font-medium text-gray-800 dark:text-gray-200 text-center">{user?.email}</h2>
                        <h2 className="text-md font-medium text-gray-800 dark:text-gray-200 text-center">Joined {new Date(user?.created_at || "1 January 1970").toLocaleDateString("en-GB", { year: 'numeric', month: 'long', day: 'numeric' })}</h2>
                    </div>
                </div>
                <div className="border-gray-800 dark:border-gray-700 border-[1px] mt-1 mb-1 w-full" />
                <div className="flex flex-col gap-y-4 px-4">
                    <div onClick={() => setSnackbarOpen(true)} className="flex flex-row justify-center md:justify-start gap-x-4">
                        <Badge badgeContent={notifications.length} color="error">
                            <Notifications />
                        </Badge>
                        Notifications
                    </div>
                    <div className="flex flex-row justify-center md:justify-start gap-x-4">
                        <MailIcon />
                        Messages
                    </div>
                    <div className="flex flex-row justify-center md:justify-start gap-x-4">
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
                        router.push("/")
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
            <div className={`${!userInfoOpened && "hidden"} md:absolute bg-opacity-50 w-full h-full top-0 left-0`} onClick={toggleUserInfo} />

        <div className={`${navbarOpened ? "flex" : "hidden"} w-full sm:w-auto drop-shadow-xl flex-col gap-y-4 sm:absolute right-0 bg-gray-300 dark:bg-primary transition ease-in-out rounded-bl-xl z-[40]`}>
            <div className="flex items-center flex-col gap-y-4 px-16 pt-8 pb-2">
                {
                    Object.keys(pages).map((page, index) => (
                        <Link href={page} key={index} className="text-lg font-medium text-gray-800 dark:text-gray-300 hover:text-gray-600 hover:dark:text-gray-200">
                            <span className={router.pathname.startsWith(page) && page != "/" || page == "/" && router.pathname == "/" ? "text-purple-800 hover:text-purple-900 dark:text-purple-500 hover:dark:text-purple-600" : "text-gray-800 hover:text-gray-700 dark:text-gray-300 hover:dark:text-gray-400"}>{pages[page].icon} {pages[page].displayName}</span>
                        </Link>
                    ))
                }
            </div>
            <div className="border-gray-800 dark:border-gray-700 border-[1px] mt-1 w-full" />

            <IconButton onClick={async () => {
                setNavbarOpened(false)
            }} variant="outlined" className="mx-12 pb-4 dark:text-gray-300 text-gray-800 border-gray-800 hover:border-gray-700 dark:border-gray-300 hover:dark:border-gray-200 font-sans font-bold normal-case">
                <Close />
            </IconButton>
        </div>

        <div className="w-full p-10 md:p-24" style={
            {
                backgroundImage: `url("https://static.vecteezy.com/system/resources/previews/006/852/804/original/abstract-blue-background-simple-design-for-your-website-free-vector.jpg")`,
                backgroundSize: "cover",
                backgroundRepeat: 'no-repeat'
            }
        }>
            <div className="bg-white rounded lg:mx-40 xl:mx-80 p-2">
                <h2 className="text-xl text-center text-gray-900 font-bold">Flame</h2>
                <p className="text-gray-800 font-medium text-center">The number one solution for all your CMS needs.</p>
            </div>
        </div>

        {!loading && notifications.length > 0 &&
            <Snackbar open={snackbarOpen} autoHideDuration={10000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
                {
                    <Alert href="/notifications" onClose={handleSnackbarClose} severity="error">
                        <span>You have {notifications.length} unread notifications!</span><br></br>
                        <span><Link href="/manage/notifications">Click here</Link> to read them.</span>
                    </Alert>
                }
            </Snackbar>
        }
        </>
    )
}

export default Nav