import { supabase } from "../../../lib/supabase"

export default async function handler(req, res) {
    console.log("a")
    console.log(req.cookies)
    await supabase.auth.api.setAuthCookie(req, res)
}