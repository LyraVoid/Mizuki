import type { NavBarConfig } from "../types/config";
import { LinkPreset } from "../types/config";

export const navBarConfig: NavBarConfig = {
	links: [
		LinkPreset.Home,
		LinkPreset.Archive,
		LinkPreset.Projects,
		LinkPreset.Skills,
		LinkPreset.Timeline,
		{
			name: "Devices",
			url: "/devices/",
			icon: "material-symbols:devices",
		},
		LinkPreset.AITools,
		LinkPreset.About,
	],
};
