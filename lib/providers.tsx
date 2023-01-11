import { Google, GitHub, Twitter } from "@mui/icons-material";
import { SiMicrosoft, SiSpotify, SiGitlab } from "react-icons/si";

let standardClasses = "text-xl"

const pages = {
    "google": {
        displayName: "Google",
        icon: <Google className={standardClasses} />
    },
    "azure": {
        displayName: "Microsoft",
        icon: <SiMicrosoft className={standardClasses} />
    },
    "twitter": {
        displayName: "Twitter",
        icon: <Twitter className={standardClasses} />
    },
    "github": {
        displayName: "Github",
        icon: <GitHub className={standardClasses} />
    }
}

export default pages