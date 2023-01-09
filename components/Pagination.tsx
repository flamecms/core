import { FC } from "react"
import { Breadcrumbs as Crumb, Link } from '@mui/material'
import { NavigateNext, NavigateBefore } from "@mui/icons-material"

interface Props {
    currentPage: int,
    pages: int
}

const Pagination: React.FC<Props> = (props: Props) => {
    const pageArray = []

    for (let i = 1; i <= props.pages; i++) {
        pageArray.push(i)
    }

    return (
        <>

        <Crumb className="dark:bg-primary p-2 rounded m-2 text-gray-300 w-auto" separator={""} aria-label="breadcrumb">
                <Link underline={"none"} href={(props.currentPage <= 1) ? "#" : ("?page=" + (props.currentPage - 1))} className="text-gray-300 hover:text-gray-200"><NavigateBefore></NavigateBefore></Link>

                {pageArray.map(page => (
                    <Link underline={"none"} href={"?page=" + page} className={(page == props.currentPage) ? "text-purple-400 hover:text-purple-300" : "text-gray-300 hover:text-gray-200"}>{page}</Link>
                ))}

                <Link underline={"none"} href={(props.currentPage >= props.pages) ? "#" : ("?page=" + (props.currentPage + 1))} className="text-gray-300 hover:text-gray-200"><NavigateNext></NavigateNext></Link>
        </Crumb>
        </>
    )
}

export default Pagination