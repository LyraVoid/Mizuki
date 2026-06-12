import { ERROR_DISPLAY_DURATION } from "../constants";

export interface PlayerUIState {
	isExpanded: boolean;
	isHidden: boolean;
	showPlaylist: boolean;
	errorMessage: string;
	showError: boolean;
}

export function createPlayerUIState(): PlayerUIState {
	return {
		isExpanded: false,
		isHidden: false,
		showPlaylist: false,
		// 错误提示相关状态
		errorMessage: "",
		showError: false,
	};
}

/**
 * 切换展开状态：展开时强制显示播放器且关闭播放列表
 */
export function toggleExpandedUI(state: PlayerUIState) {
	state.isExpanded = !state.isExpanded;
	if (state.isExpanded) {
		state.showPlaylist = false;
		state.isHidden = false;
	}
}

/**
 * 切换隐藏状态：隐藏时收起播放器并关闭播放列表
 */
export function toggleHiddenUI(state: PlayerUIState) {
	state.isHidden = !state.isHidden;
	if (state.isHidden) {
		state.isExpanded = false;
		state.showPlaylist = false;
	}
}

/**
 * 切换播放列表面板展示
 */
export function togglePlaylistUI(state: PlayerUIState) {
	state.showPlaylist = !state.showPlaylist;
}

/**
 * 显示错误提示，并在固定时间后自动隐藏
 */
export function showErrorMessageUI(state: PlayerUIState, message: string) {
	state.errorMessage = message;
	state.showError = true;
	setTimeout(() => {
		state.showError = false;
	}, ERROR_DISPLAY_DURATION);
}

export function hideErrorUI(state: PlayerUIState) {
	state.showError = false;
}
