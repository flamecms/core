import { FC } from "react"
import Icon from "@mui/material/Icon"
import ReactMarkdown from "react-markdown"
import Grid from "@mui/material/Unstable_Grid2"

interface Props {
    body: string,
    updated_at: Date,
    author: {
        full_name: string,
        avatar_url: string,
        created_at: Date
    }
}

const Thread: React.FC<Props> = (props: Props) => {
    return (
        <>
            <div className="flex flex-col dark:bg-primary rounded-xl">
                <Grid className="px-4 py-4" container spacing={1}>
                    <Grid xs={12} lg={3}>
                        <div className="flex items-center flex-col gap-y-4 px-4 pt-8 pb-2">
                            <img referrerPolicy="no-referrer" className="rounded-xl w-24" alt="Avatar name" src={props.author.avatar_url} />
                            <div>
                                <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200 text-center">
                                    {props.author.full_name}
                                </h1>
                                <h2 className="text-md font-medium text-gray-800 dark:text-gray-200 text-center">Joined {new Date(props.author.created_at || "1 January 1970").toLocaleDateString("en-GB", { year: 'numeric', month: 'long', day: 'numeric' })}</h2>
                            </div>
                        </div>
                    </Grid>
                    <Grid xs={12} lg={9}>
                        <ReactMarkdown className="forum-markdown-styling">
                            {props.body.replace(/@(\S+)/gi,'[@$1](/user/$1)')}
                        </ReactMarkdown>
                    </Grid>
                </Grid>

                <div className="border-gray-800 dark:border-gray-700 border-[1px] mt-1 mb-1 w-full" />
                <div class="flex flex-row gap-2 p-2">
                    <h2 className="text-md font-medium text-gray-800 dark:text-gray-200">{props.author.full_name}</h2>
                    <span> · </span>
                    <h2 className="text-md font-medium text-gray-800 dark:text-gray-200"> {new Date(props.updated_at || "1 January 1970").toLocaleDateString("en-GB", { year: 'numeric', month: 'long', day: 'numeric' })}</h2>
                </div>
            </div>
        </>
    )
}

export default Thread