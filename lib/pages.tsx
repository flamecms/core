type Pages = {
    displayName: string;
    icon: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
    external: boolean;
    description?: string;
};

import { Home, Storefront, Forum } from "@mui/icons-material";
import { OverridableComponent, } from "@mui/material/OverridableComponent";
import { SvgIconTypeMap } from "@mui/material";

const pages = {
    "/": {
        displayName: "Home",
        icon: <Home />,
        external: false,
        description: "Landing"
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