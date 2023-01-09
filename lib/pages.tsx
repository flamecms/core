import { Home, Storefront, Forum } from "@mui/icons-material";
const pages = {
    "/": {
        displayName: "Home",
        icon: <Home />,
        external: false
    },
    "/forum": {
        displayName: "Forum",
        icon: <Forum />,
        external: false
    },
    "/shop": {
        displayName: "Shop",
        icon: <Storefront />,
        external: false
    }
}

export default pages