import { FC, useState, useRef, useEffect } from "react";
import { Tooltip, IconButton, TextField, InputAdornment, Button, Badge, Snackbar, Alert } from "@mui/material";
import { Close, Logout, Menu, Notifications, Settings, Search } from "@mui/icons-material";
import { VscFlame } from "react-icons/vsc";
import MailIcon from '@mui/icons-material/Mail';
import useUser from "../hooks/useUser";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/router";
import Image from "next/image";
import pages from "../lib/pages";
import Link from "next/link";

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

        async function handleNotifications(router) {
            setLoading(true)
            if (localStorage.getItem("sb:state") == "SIGNED_IN") {
                const { data: { user: localUser } } = await supabase.auth?.getUser()
                console.log("Loading notifications for " + localUser?.user_metadata?.full_name)
                const { data: retrieved, error } = await supabase
                    .from("notifications")
                    .select("*")
                    .eq("acknowledged", false)
                    .eq("target", localUser.id)

                retrieved.forEach(async (notification) => {
                    if (window.location.href == notification.source) {
                        notification.acknowledged = true
                        await supabase.from("notifications").update({acknowledged: true}).eq('id', notification.id)
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
            <div style={
                {
                    backgroundImage: `url("/bbg.jpg")`,
                    backgroundRepeat: 'no-repeat'
                }
            } className="md:bg-cover bg-center">
                <nav className="px-8 bg-gradient-to-t from-transparent to-primary bg-opacity-25 pt-6 py-4 w-full drop-shadow-xl flex justify-between items-center z-[50] bg">
                    <div className="flex flex-row items-center text-left gap-x-4">
                        <Button className="sm:hidden" onClick={() => toggleNavbar()}>
                            <Menu className="text-gray-800 dark:text-gray-300" />
                        </Button>
                        <span className="hidden md:block text-5xl font-bold text-amber-300 hover:text-amber-400"><VscFlame /></span>
                        <div className="hidden sm:flex flex-col sm:flex-row items-center gap-y-2 sm:gap-x-6">
                            {
                                Object.keys(pages).map((page, index) => (
                                    <Link href={page} key={index} className="text-lg font-medium text-gray-800 dark:text-gray-300 hover:text-gray-600 hover:dark:text-gray-200">
                                        <Tooltip title={<span className="font-Quicksand">{pages[page].description || pages[page].displayName}</span>} placement="bottom">
                                            <span className={(router.pathname.startsWith(page) && page != "/" || page == "/" && router.pathname == "/" ? "light text-purple-800 hover:text-purple-900 dark:text-gray-300 hover:dark:text-gray-300 hover:dark:border-b-2 hover:dark:border-purple-200 hover:dark:-my-2" : "text-gray-800 hover:text-gray-700 dark:text-gray-400 hover:dark:text-gray-300") + " flex flex-col-reverse items-center"}>{pages[page].displayName} {pages[page].icon}</span>
                                        </Tooltip>
                                    </Link>
                                ))
                            }
                        </div>
                    </div>

                    <div className="hidden md:flex flex-row item-center text-center bg-black bg-opacity-20 px-4 py-2 rounded-full" style={{
                        backdropFilter: "blur(2px)"
                    }}>
                        <form noValidate autoComplete="off" className="rounded-full">
                            <TextField
                                id="reply-box"
                                sx={{ input: { color: "", }}}
                                variant="standard"
                                className="px-4"
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
                                                <IconButton edge="end" className="text-gray-200" onClick={() => window.location = `/user/${searchBox.current.value}`}>
                                                    <Search />
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    disableUnderline: true,
                                    placeholder: "Search Flame"
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
                                        <img referrerPolicy="no-referrer" className={(userInfoOpened ? "rounded-lg" : "rounded-full") + " hover:rounded-lg w-12"} alt="Avatar name" src={user?.user_metadata?.avatar_url} />
                                        
                                    </Badge>
                                </button>
                            </span>
                        )}
                    </div>
                </nav>
                <div id="user_info" className={`${userInfoOpened ? "flex opacity-100" : "hidden md:flex opacity-0 pointer-"} transition-opacity w-full sm:w-auto drop-shadow-xl flex-col gap-y-4 sm:absolute right-0 bg-gray-300 dark:bg-primary ease-in-out rounded-bl-xl rounded-tl-xl z-[40]`}>
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
                            <Link href="/manage/notifications">
                                Notifications
                            </Link>
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
                            setLoading(false)
                            setUserInfoOpened(false) // we need this to make it so if they logout it closes the user info page <3
                            router.push("/")
                        } finally {
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

            <div className={`w-full p-10 ${router.pathname == "/" ? "md:p-24" : "md:p-6 md:pb-8"}`}>
                <div className="rounded lg:mx-40 xl:mx-80 p-2 flex flex-col items-center gap-y-2">
                    <h2 className="text-8xl text-center text-amber-300 hover:text-amber-400 font-bold"><VscFlame /></h2>
                    {
                        router.pathname == "/" && (
                            <p className="text-2xl text-gray-200 font-medium text-center">The number one solution for all your CMS needs.</p>
                        )
                    }
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
            </div>
        </>
    )
}

export default Nav