import { DEFAULT_SONG } from "../constants";
import type { Song } from "../types";

export interface AudioPlayerState {
	isPlaying: boolean;
	currentTime: number;
	duration: number;
	volume: number;
	isMuted: boolean;
	isLoading: boolean;
	currentSong: Song;
	autoplayFailed: boolean;
	willAutoPlay: boolean;
}

export function createAudioPlayerState(): AudioPlayerState {
	return {
		isPlaying: false,
		currentTime: 0,
		duration: 0,
		volume: 0.7,
		isMuted: false,
		isLoading: false,
		currentSong: DEFAULT_SONG,
		autoplayFailed: false,
		willAutoPlay: false,
	};
}

export function togglePlay(
	state: AudioPlayerState,
	audio: HTMLAudioElement | undefined,
) {
	if (!audio || !state.currentSong.url) {
		return;
	}
	if (state.isPlaying) {
		audio.pause();
	} else {
		audio.play().catch(() => {});
	}
}

export function toggleMute(state: AudioPlayerState) {
	state.isMuted = !state.isMuted;
}

export function handleLoadSuccess(
	state: AudioPlayerState,
	audio: HTMLAudioElement | undefined,
) {
	state.isLoading = false;
	if (audio?.duration && audio.duration > 1) {
		state.duration = Math.floor(audio.duration);
		state.currentSong = { ...state.currentSong, duration: state.duration };
	}

	if (state.willAutoPlay || state.isPlaying) {
		const playPromise = audio?.play();
		if (playPromise !== undefined) {
			playPromise.catch((error) => {
				console.warn("自动播放被拦截，等待用户交互:", error);
				state.autoplayFailed = true;
				state.isPlaying = false;
			});
		}
	}
}

export function handleLoadError(state: AudioPlayerState): {
	shouldContinue: boolean;
} {
	if (!state.currentSong.url) {
		return { shouldContinue: false };
	}
	state.isLoading = false;
	return { shouldContinue: state.isPlaying || state.willAutoPlay };
}

export function loadSong(state: AudioPlayerState, song: Song, autoPlay = true) {
	if (!song) {
		return;
	}
	if (song.url !== state.currentSong.url) {
		state.currentSong = { ...song };
		if (song.url) {
			state.isLoading = true;
		} else {
			state.isLoading = false;
		}
	}
	state.willAutoPlay = autoPlay;
}

export function handleUserInteraction(
	state: AudioPlayerState,
	audio: HTMLAudioElement | undefined,
) {
	if (state.autoplayFailed && audio) {
		const playPromise = audio.play();
		if (playPromise !== undefined) {
			playPromise
				.then(() => {
					state.autoplayFailed = false;
				})
				.catch(() => {});
		}
	}
}
