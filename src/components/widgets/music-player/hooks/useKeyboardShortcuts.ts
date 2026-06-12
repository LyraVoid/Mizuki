const INTERACTION_EVENTS = ["click", "keydown", "touchstart"];

const isBrowser = typeof document !== "undefined";

export function registerInteractionHandler(handler: () => void): () => void {
	if (!isBrowser) {
		return () => {};
	}

	INTERACTION_EVENTS.forEach((event) => {
		document.addEventListener(event, handler, { capture: true });
	});

	return () => {
		INTERACTION_EVENTS.forEach((event) => {
			document.removeEventListener(event, handler, { capture: true });
		});
	};
}

export function formatTime(seconds: number): string {
	if (!Number.isFinite(seconds) || seconds < 0) {
		return "0:00";
	}
	const mins = Math.floor(seconds / 60);
	const secs = Math.floor(seconds % 60);
	return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function getAssetPath(path: string): string {
	if (path.startsWith("http://") || path.startsWith("https://")) {
		return path;
	}
	if (path.startsWith("/")) {
		return path;
	}
	return `/${path}`;
}
