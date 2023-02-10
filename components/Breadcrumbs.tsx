import { FC } from "react";
import { Breadcrumbs as Crumb, Link } from '@mui/material';
import { NavigateNext, Home } from "@mui/icons-material";
import { useRouter } from "next/router";

type PageObj = {
    displayName: string,
    href: string
}

interface Props {
    pages: PageObj[] | string[]
}

const Breadcrumbs: React.FC<Props> = (props: Props) => {
    const router = useRouter();
    return (
        <>
            <Crumb className="rounded my-4 text-gray-300" separator={<NavigateNext fontSize="small" />} aria-label="breadcrumb">
                <button className="text-gray-300 hover:text-gray-200" onClick={(() => router.push("/") )}><Home /></button>

                {props.pages.map((page, key) => {
                    let Page = page;
                    
                    return (
                        <div key={key}>
                            {
                                typeof Page === "string" ? (
                                    <Link underline={"none"} className={((props.pages.indexOf(Page) + 1 >= props.pages.length) ? "text-breadcrumb" : "text-gray-300 hover:text-gray-200") + " font-Quicksand"}>{Page}</Link>
                                ) : typeof Page === "object" && (
                                    <Link underline={"none"} className={((props.pages.indexOf(Page) + 1 >= props.pages.length) ? "text-breadcrumb" : "text-gray-300 hover:text-gray-200") + " font-Quicksand"} href={Page?.href}>{Page?.displayName}</Link>
                                )
                            }
                        </div>
                    );
                })}
            </Crumb>
        </>
    )
}

export default Breadcrumbs