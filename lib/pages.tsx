type Pages = {
    displayName: string;
    icon: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
    external: boolean;
    description?: string;
};

import { Home, Storefront, Forum } from "@mui/icons-material";
import BarChartIcon from '@mui/icons-material/BarChart';
import DiamondIcon from '@mui/icons-material/Diamond';
import HiveIcon from '@mui/icons-material/Hive';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { OverridableComponent, } from "@mui/material/OverridableComponent";
import { SvgIconTypeMap } from "@mui/material";

const pages = {
    "/": {
        displayName: "Home",
        icon: <Home />,
        external: false,
        description: "The home of Flame!"
    },
    "/forum": {
        displayName: "Forum",
        icon: <Forum />,
        external: false,
        description: "View the public chat boards!"
    },
    "/leaderboards": {
        displayName: "Leaderboards",
        icon: <BarChartIcon />,
        external: false,
        description: "View the top leaderboards!"
    },
    "/staff": {
        displayName: "Staff",
        icon: <PersonOutlineIcon />,
        external: false,
        description: "The team running the show!"
    },
    "/shop": {
        displayName: "Shop",
        icon: <Storefront />,
        external: false,
        description: "View the shop front!"
    }
}

export default pages