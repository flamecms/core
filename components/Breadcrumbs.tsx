import { FC } from "react"
import { Breadcrumbs as Crumb, Link } from '@mui/material'
import { NavigateNext, Home } from "@mui/icons-material"

interface Props {
    pages: [string]
}

const Breadcrumbs: React.FC<Props> = (props: Props) => {
    return (
        <>
            <Crumb className="dark:bg-primary p-2 rounded m-2 text-gray-300" separator={<NavigateNext fontSize="small" />} aria-label="breadcrumb">
                <Link underline={"none"} className="text-gray-300 hover:text-gray-200" href="/"><Home/></Link>

                {props.pages.map((page) => (
                    <Link underline={"none"} className={(props.pages.indexOf(page) + 1 >= props.pages.length) ? "text-purple-400 hover:text-purple-300" : "text-gray-300 hover:text-gray-200"}>{page}</Link>
                ))}
            </Crumb>
        </>
    )
}

export default Breadcrumbs