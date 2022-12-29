import { NextPage } from "next"
import jwt from "jsonwebtoken"

const Test: NextPage<{user: any}> = (props) => {
    return <h1>DONT SAY SHIT ABOUT THIS BEINGH A THING LOL: {props.user}</h1>
}

export async function getServerSideProps(context) {
    let supabaseToken = context.req.cookies["sb:token"]
    if (!supabaseToken) {
        throw new Error("this shouldnt fucking happen middleware exists for a reason.")
    }
    return {
        props: {
            user: jwt.decode(supabaseToken)
        }
    }
}

export default Test