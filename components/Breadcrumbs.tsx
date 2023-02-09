import { FC } from "react";
import { Breadcrumbs as Crumb, Link } from '@mui/material';
import { NavigateNext, Home } from "@mui/icons-material";
import { useRouter } from "next/router";

interface Props {
    pages: [string]
}

const Breadcrumbs: React.FC<Props> = (props: Props) => {
    const router = useRouter();
    return (
        <>
            <Crumb className="rounded my-4 text-gray-300" separator={<NavigateNext fontSize="small" />} aria-label="breadcrumb">
                <button className="text-gray-300 hover:text-gray-200" onClick={(() => router.push("/") )}><Home /></button>

                {props.pages.map((page) => (
                    <Link key={page} underline={"none"} className={((props.pages.indexOf(page) + 1 >= props.pages.length) ? "text-breadcrumb" : "text-gray-300 hover:text-gray-200") + " font-Quicksand"}>{page}</Link>
                ))}
            </Crumb>
        </>
    )
}

export default Breadcrumbs