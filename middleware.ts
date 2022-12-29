import type { NextFetchEvent, NextRequest } from "next/server"
import { NextResponse } from "next/server"

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
    if (req.nextUrl.pathname.startsWith("/manage")) {
        let authResult = await getUser(req)

        if (authResult.error) {
            console.log("Auth erorr lol monjkewy go to login page", authResult.error)
            return NextResponse.redirect(`/?ret=${encodeURIComponent(req.nextUrl.pathname)}`)
        } else if (!authResult.user) {
            console.log("no user found what the FUCK")
            return NextResponse.redirect(`/?ret=${encodeURIComponent(req.nextUrl.pathname)}`)
        } else {
            console.log("found user OH MY FUCKING GOD IT WORKED!", authResult.user)
            return NextResponse.next()
        }
    }
}

async function getUser(req: NextRequest) : Promise<any> {
    let token = req.cookies["sb-access-token"]
    if (!token) {
        return {
            user: null,
            data: null,
            error: "no supa token in cookies you retard brain dead fucking coder go to hell you fucking faggot kill yourself like actually you fucking low like retard actually faggot spastic."
        }
    }

    let authRequestResult = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/user`, {
        headers: {
            Authorization: `Bearer ${token}`,
            APIKey: process.env.NEXT_PUBLIC_SUPABASE_KEY || ""
        }
    })

    let result = await authRequestResult.json()
    console.log("Auith result: ", result)
    if (authRequestResult.status != 200) {
        return {
            user: null,
            data: null,
            error: `supbase did a monkey type beat: ${authRequestResult.status}`
        }
    } else if (result.aud === "authenticated") {
        return {
            user: result,
            data: result,
            error: null
        }
    }
}