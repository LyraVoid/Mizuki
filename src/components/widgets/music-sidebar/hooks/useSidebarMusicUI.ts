export interface SidebarMusicUIState {
	showPlaylist: boolean;
}

export function createSidebarMusicUIState(): SidebarMusicUIState {
	return {
		showPlaylist: false,
	};
}

export function toggleSidebarPlaylist(state: SidebarMusicUIState) {
	state.showPlaylist = !state.showPlaylist;
}
