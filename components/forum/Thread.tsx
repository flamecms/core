import { FC } from "react"
import Icon from "@mui/material/Icon"
import ReactMarkdown from "react-markdown"
import Link from "next/link"
import Grid from "@mui/material/Unstable_Grid2"

interface Props {
    body: string,
    updated_at: Date,
    author: {
        full_name: string,
        avatar_url: string,
        created_at: Date,
        id: string
    }
}

const Thread: React.FC<Props> = (props: Props) => {
    return (
        <>
        <div className="bg-primary rounded-lg p-2 flex flex-row gap-2" style={{boxShadow: "0 0 0 1px rgb(255 255 255 / 10%)"}}>
            <div className="p-3 flex flex-row w-full">
                <img referrerPolicy="no-referrer" className="rounded-xl w-12 h-12" alt="Avatar name" src={props.author.avatar_url} />
                <div className="w-full">
                    <div className="flex flex-row text-gray-800 dark:text-gray-200 ml-2 w-full">
                        <div className="text-xl font-bold">
                            <Link href={`/user/${props.author.id}`}>{props.author.full_name}</Link>
                        </div>
                        <div className="flex-row-reverse ml-auto font-medium text-md">
                            Replied at {new Date(props.updated_at || "1 January 1970").toLocaleDateString("en-GB", { year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                    </div>

                    <div className="mx-1 px-1 rounded-lg">
                        <ReactMarkdown className="forum-markdown-styling max-w-[819px]">
                            {props.body.replace(/@(\S+)/gi,'[@$1](/user/$1)')}
                        </ReactMarkdown>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default Thread