import type { WALLPAPER_MODE } from "@/types/config";

export type { WALLPAPER_MODE };

export interface DisplaySettingsProps {
	class?: string;
}

export interface WallpaperSwitchProps {
	mode?: WALLPAPER_MODE;
}
