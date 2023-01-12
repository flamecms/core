import { useState, useEffect, useRef } from "react"
import type { NextPage } from "next"
import providers from "../../lib/providers"
import { Tooltip, Button, Badge, Grid, TextField } from "@mui/material"
import { Logout, Menu, Notifications, Settings } from "@mui/icons-material"
import { supabase } from "../../lib/supabase"
import useUser from "../../hooks/useUser"
import { useRouter } from "next/router"

const Login: NextPage = () => {
    const router = useRouter()
    const { user } = useUser()

    const [loading, setLoading] = useState<boolean>(false)
    const [email, setEmail] = useState<String>("")


    const emailBox = useRef<HTMLInputElement|null>(null)
    const passwordBox = useRef<HTMLInputElement|null>(null)

    let [ emailError, setEmailError ] = useState<boolean>(false)
    let [ passwordError, setPasswordError ] = useState<boolean>(false)

    let [ emailErrorText , setEnailErrrorText ]  = useState<string|boolean|null>("")
    let [ passwordErrorText, setPasswordErrorText ]  = useState<string|boolean|null>("")

    useEffect(() => {
        if (user) router.push("/")
    })

    async function handleLogin(provider) {
        setLoading(true)
        try {
            await supabase.auth.signInWithOAuth(
                {
                    provider,
                },
            )
        } finally {
            setLoading(false)
        }
    }

    async function handleCredLogin(email, password) {
        setLoading(true)
        try {
            setEmailError(false)
            setEnailErrrorText(false)
            setPasswordError(false)
            setPasswordErrorText(false)

            if (emailBox.current?.value?.length == 0) {
                setEmailError(true)
                setEnailErrrorText("You must enter an email address.")
            }


            if (passwordBox.current?.value?.length == 0) {
                setPasswordError(true)
                setPasswordErrorText("You must enter a password.")
                return
            }

            const { error } = await supabase.auth.signInWithPassword(
                {
                    email,
                    password,
                },
            )

            console.log(JSON.stringify(error))

            if (JSON.parse(JSON.stringify(error)).status == 422) {
                setEnailErrrorText(error?.message || "Invalid email or password.")
                setEmailError(true)
            }
            if (JSON.parse(JSON.stringify(error)).status == 400) {
                setPasswordErrorText(error?.message || "Invalid email or password.")
                setPasswordError(true)
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
        <div className="flex flex-col justify-center gap-y-2 items-center">
                <div className="w-lg-[1200px] dark:bg-primary rounded-lg">
                    <Grid container spacing={0}>
                        <Grid className="hidden lg:flex rounded-lg" item lg={6}>
                            <div className="w-full p-32 rounded-lg" style={
                                {
                                    backgroundImage: `url("https://static.vecteezy.com/system/resources/previews/006/852/804/original/abstract-blue-background-simple-design-for-your-website-free-vector.jpg")`,
                                    backgroundSize: "cover",
                                    backgroundRepeat: 'no-repeat'
                                }
                            }/>
                        </Grid>
                        <Grid className="text-center p-5" item lg={6}>
                            <h2 className="text-3xl font-bold dark:text-gray-300 text-gray-800 text-center">Sign in</h2>
                            <h4 className="text-xl dark:text-gray-100 text-gray-600 text-center pb-2">Enter the username and password you used to create an account.</h4>

                            <form className="flex flex-col gap-y-2">
                                <TextField
                                    id="email"
                                    sx={{ input: { color: '#f7f7f7' } }}
                                    variant="outlined"
                                    className="w-full dark:bg-primary bg-white rounded"
                                    inputRef={emailBox}
                                    error={emailError}
                                    type="email"
                                    helperText={emailErrorText}
                                    placeholder="Email"
                                    onKeyPress={(ev) => {
                                    if (ev.key === 'Enter') {
                                        ev.preventDefault()
                                    }
                                }}
                                />
                                <TextField
                                    id="password"
                                    sx={{ input: { color: '#f7f7f7' } }}
                                    variant="outlined"
                                    className="w-full dark:bg-primary bg-white rounded"
                                    inputRef={passwordBox}
                                    error={passwordError}
                                    helperText={passwordErrorText}
                                    placeholder="Password"
                                    type="password"
                                    onKeyPress={(ev) => {
                                    if (ev.key === 'Enter') {
                                        ev.preventDefault()
                                    }
                                }}
                                />
                                <Button
                                    className="w-full bg-mui-primary"
                                    variant="contained"
                                    color="primary"
                                    size="medium"
                                    onClick={ async (e) => {
                                        handleCredLogin(emailBox?.current?.value, passwordBox?.current?.value)
                                    }}>
                                    Log In
                                </Button>

                            </form>

                            <div className="flex flex-col items-center gap-y-2 p-5">
                                {
                                    Object.keys(providers).map((provider, index) => (
                                            <Button key={provider} onClick={
                                                async (e) => {
                                                handleLogin(provider)
                                            }
                                            }
                                                variant="outlined" className="bg-primary dark:bg-white gap-x-2 dark:text-gray-800 text-gray-300 border-gray-800 hover:border-gray-700 dark:border-gray-300 hover:dark:border-gray-200 font-sans font-bold normal-case">
                                                Sign In With {providers[provider].displayName} {providers[provider].icon || <></>}
                                            </Button>
                                            ))
                                }
                            </div>
                        </Grid>
                    </Grid>
                </div>
            </div>
        </>
    )
}

export default Login