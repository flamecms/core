import "/styles/globals.css"
import { Quicksand, Roboto, Poppins } from '@next/font/google'
import Nav from "../components/Nav"

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

export default function Application({ Component, pageProps }) {
  return <>
    <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/icon?family=Material+Icons"
    />
    <div className={`dark:bg-[#262626] dark:text-white ${quicksand.variable} ${roboto.variable} ${poppins.variable} font-sans`}>
        <div className="w-full min-w-screen min-h-screen h-full">
            <Nav />
            <Component {...pageProps} />
        </div>
    </div>
  </>
}
