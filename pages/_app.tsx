import "/styles/globals.css"
import { Quicksand, Roboto, Poppins } from '@next/font/google'
import Nav from "../components/Nav"
import { supabase } from "../lib/supabase"
import { useRouter } from 'next/router';
import { useState,useEffect } from 'react'

const quicksand = Quicksand({
    subsets: ['latin'],
    variable: '--font-quicksand',
})

const roboto = Roboto({
    subsets: ['latin'],
    weight: ["400", "500", "700"],
    variable: '--font-roboto',
})

const poppins = Poppins({
    subsets: ['latin'],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    variable: '--font-poppins',
})

const Loading: Function = function () {
    const router = useRouter();

    const [loading, setLoading] = useState(false);

    return loading && (<div className='spinner-wrapper dark:bg-accent'> <div className="spinner"></div></div>)
}

export default function Application({ Component, pageProps }) {
    return <>
        <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />

        <Loading />
        <div className={`dark:bg-accent dark:text-white ${quicksand.variable} ${roboto.variable} ${poppins.variable} font-sans`}>
            <div className="w-full min-w-screen min-h-screen h-full">
                <Nav />
                <div className="w-full h-full px-8 pt-4">
                    <Component {...pageProps} />
                </div>
            </div>
        </div>
    </>
}
