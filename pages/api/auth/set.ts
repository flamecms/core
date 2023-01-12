import { supabase } from "../../../lib/supabase"
import { setCookie } from 'cookies-next';
import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).send({ error: "Method not allowed" })
    if (!req.body?.session?.access_token) return res.status(400).send({ error: "Missing access_token" })
    if (!req.body?.session?.refresh_token) return res.status(400).send({ error: "Missing refresh_token" })
    
    const { data, error } = await supabase.auth?.setSession({
        access_token: req.body?.session?.access_token,
        refresh_token: req?.body?.session?.refresh_token
    })
    console.log("a")

    setCookie("sb-access-token", req.body?.session?.access_token, { req, res })
    setCookie("sb-refresh-token", req.body?.session?.refresh_token, { req, res })

    return res.status(200).send({ response: "OK" })
}