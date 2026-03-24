import { STORAGE_KEY_VOLUME } from "../constants";
import type { AudioPlayerState } from "./useAudioPlayer";

export interface VolumeDragState {
	isVolumeDragging: boolean;
	isPointerDown: boolean;
	volumeBarRect: DOMRect | null;
	rafId: number | null;
}

export function createVolumeDragState(): VolumeDragState {
	return {
		isVolumeDragging: false,
		isPointerDown: false,
		volumeBarRect: null,
		rafId: null,
	};
}

export function loadVolumeFromStorage(state: AudioPlayerState) {
	try {
		if (typeof localStorage !== "undefined") {
			const savedVolume = localStorage.getItem(STORAGE_KEY_VOLUME);
			if (savedVolume !== null && !isNaN(parseFloat(savedVolume))) {
				state.volume = parseFloat(savedVolume);
			}
		}
	} catch (e) {
		console.warn("Failed to load volume settings from localStorage:", e);
	}
}

export function saveVolumeToStorage(state: AudioPlayerState) {
	try {
		if (typeof localStorage !== "undefined") {
			localStorage.setItem(STORAGE_KEY_VOLUME, state.volume.toString());
		}
	} catch (e) {
		console.warn("Failed to save volume settings to localStorage:", e);
	}
}

function updateVolumeLogic(
	clientX: number,
	dragState: VolumeDragState,
	volumeBar: HTMLElement | null,
	audio: HTMLAudioElement | undefined,
	audioPlayerState: AudioPlayerState,
) {
	if (!audio || !volumeBar) {
		return;
	}

	const rect = dragState.volumeBarRect || volumeBar.getBoundingClientRect();
	const percent = Math.max(
		0,
		Math.min(1, (clientX - rect.left) / rect.width),
	);
	audioPlayerState.volume = percent;
}

export function startVolumeDrag(
	event: PointerEvent,
	dragState: VolumeDragState,
	volumeBar: HTMLElement | null,
	audio: HTMLAudioElement | undefined,
	audioPlayerState: AudioPlayerState,
) {
	if (!volumeBar) {
		return;
	}
	event.preventDefault();

	dragState.isPointerDown = true;
	volumeBar.setPointerCapture(event.pointerId);

	dragState.volumeBarRect = volumeBar.getBoundingClientRect();
	updateVolumeLogic(
		event.clientX,
		dragState,
		volumeBar,
		audio,
		audioPlayerState,
	);
}

export function handleVolumeMove(
	event: PointerEvent,
	dragState: VolumeDragState,
	volumeBar: HTMLElement | null,
	audio: HTMLAudioElement | undefined,
	audioPlayerState: AudioPlayerState,
) {
	if (!dragState.isPointerDown) {
		return;
	}
	event.preventDefault();

	dragState.isVolumeDragging = true;
	if (dragState.rafId) {
		return;
	}

	dragState.rafId = requestAnimationFrame(() => {
		updateVolumeLogic(
			event.clientX,
			dragState,
			volumeBar,
			audio,
			audioPlayerState,
		);
		dragState.rafId = null;
	});
}

export function stopVolumeDrag(
	event: PointerEvent,
	dragState: VolumeDragState,
	volumeBar: HTMLElement | null,
	audioPlayerState: AudioPlayerState,
) {
	if (!dragState.isPointerDown) {
		return;
	}
	dragState.isPointerDown = false;
	dragState.isVolumeDragging = false;
	dragState.volumeBarRect = null;
	if (volumeBar) {
		volumeBar.releasePointerCapture(event.pointerId);
	}

	if (dragState.rafId) {
		cancelAnimationFrame(dragState.rafId);
		dragState.rafId = null;
	}

	saveVolumeToStorage(audioPlayerState);
}

export function handleVolumeKeyDown(
	event: KeyboardEvent,
	onToggleMute: () => void,
) {
	if (event.key === "Enter" || event.key === " ") {
		event.preventDefault();
		if (event.key === "Enter") {
			onToggleMute();
		}
	}
}
