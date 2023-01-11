import { deleteCookie } from 'cookies-next';
export default async function handler(req, res) {
    deleteCookie("sb:token", { req, res })
    deleteCookie("sb-access-token", { req, res })
    deleteCookie("sb-refresh-token", { req, res })
    res.send({})
}