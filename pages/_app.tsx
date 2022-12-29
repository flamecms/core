import "/styles/globals.css"
import { Quicksand, Roboto } from '@next/font/google'
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

export default function Application({ Component, pageProps }) {
  return <>
    <div className={`dark ${quicksand.variable} ${roboto.variable} font-sans`}>
        <div className="dark:bg-[#262626] min-w-screen min-h-screen text-white">
            <Nav />
            <Component {...pageProps} />
        </div>
    </div>
  </>
}
