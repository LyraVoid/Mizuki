/**
 * Decryption utilities for password-protected content
 *
 * Note: These functions are designed to run in the browser where CryptoJS
 * is available as a global variable after loading /assets/js/crypto-js.min.js
 */

import type { DecryptResult } from "../types/auth";

declare const CryptoJS: {
	AES: {
		decrypt: (
			encryptedContent: string,
			password: string,
		) => {
			toString: (encoding: typeof CryptoJS.enc.Utf8) => string;
		};
	};
	enc: { Utf8: unknown };
};

const CRYPTOJS_URL = "/assets/js/crypto-js.min.js";
const VERIFICATION_PREFIX = "MIZUKI-VERIFY:";

export async function loadCryptoLibraries(): Promise<void> {
	if (typeof CryptoJS === "undefined") {
		await new Promise<void>((resolve, reject) => {
			const script = document.createElement("script");
			script.src = CRYPTOJS_URL;
			script.onload = () => resolve();
			script.onerror = () => reject(new Error("Failed to load CryptoJS"));
			document.head.appendChild(script);
		});
	}
}

export function verifyCryptoLoaded(): boolean {
	return typeof CryptoJS !== "undefined";
}

export async function decryptContent(
	encryptedContent: string,
	password: string,
): Promise<DecryptResult> {
	if (!verifyCryptoLoaded()) {
		await loadCryptoLibraries();
	}

	if (!password) {
		return { success: false, content: null, error: "passwordRequired" };
	}

	try {
		const decryptedBytes = CryptoJS.AES.decrypt(encryptedContent, password);
		const decryptedString = decryptedBytes.toString(CryptoJS.enc.Utf8);

		if (
			!decryptedString ||
			!decryptedString.startsWith(VERIFICATION_PREFIX)
		) {
			return { success: false, content: null, error: "incorrect" };
		}

		const realContent = decryptedString.replace(VERIFICATION_PREFIX, "");
		return { success: true, content: realContent, error: null };
	} catch (error) {
		console.error("Decryption error:", error);
		return { success: false, content: null, error: "decryptionError" };
	}
}

export async function executeDecryptedScripts(
	contentDiv: HTMLElement,
): Promise<void> {
	const scripts = contentDiv.querySelectorAll("script");
	const scriptPromises = Array.from(scripts).map((script) => {
		return new Promise<void>((resolve) => {
			const newScript = document.createElement("script");
			if (script.type) {
				newScript.type = script.type;
			}
			newScript.textContent = script.textContent;
			newScript.onload = () => resolve();
			newScript.onerror = () => resolve();
			script.parentNode?.replaceChild(newScript, script);
			if (!newScript.src) {
				resolve();
			}
		});
	});
	await Promise.all(scriptPromises);
}

export function showShareComponents(): void {
	const shareComponent = document.getElementById("share-component");
	const licenseComponent = document.getElementById("license-component");
	if (shareComponent) {
		shareComponent.classList.remove("encrypted-hidden");
	}
	if (licenseComponent) {
		licenseComponent.classList.remove("encrypted-hidden");
	}
}

export function savePassword(password: string): void {
	const key = "page-password-" + window.location.pathname;
	sessionStorage.setItem(key, password);
}

export function getSavedPassword(): string | null {
	const key = "page-password-" + window.location.pathname;
	return sessionStorage.getItem(key);
}

export function removeSavedPassword(): void {
	const key = "page-password-" + window.location.pathname;
	sessionStorage.removeItem(key);
}

export function triggerPostDecryptUpdates(): void {
	setTimeout(() => {
		highlightCode();
		regenerateTOC();
		initMobileTOC();
		bindFancybox();
		handleHashNavigation();
		triggerImageLoadEvents();
		triggerMermaidRender();
	}, 50);
}

function highlightCode(): void {
	if (window.hljs) {
		const contentDiv = document.getElementById("decrypted-content");
		if (contentDiv) {
			contentDiv.querySelectorAll("pre code").forEach((block) => {
				window.hljs!.highlightElement(block as HTMLElement);
			});
		}
	}
}

function regenerateTOC(): void {
	const tocElement = document.querySelector("table-of-contents") as
		| (HTMLElement & { init?: () => void; regenerateTOC?: () => void })
		| null;
	if (tocElement) {
		if (typeof tocElement.regenerateTOC === "function") {
			tocElement.regenerateTOC();
		}
		if (typeof tocElement.init === "function") {
			tocElement.init();
		}
	}
}

function initMobileTOC(): void {
	if (typeof window.mobileTOCInit === "function") {
		window.mobileTOCInit();
	}
}

function bindFancybox(): void {
	if (typeof Fancybox !== "undefined" && Fancybox.bind) {
		Fancybox.unbind("[data-fancybox]");
		Fancybox.bind("[data-fancybox]", {});
	}
}

function handleHashNavigation(): void {
	if (window.location.hash) {
		const targetId = window.location.hash.substring(1);
		const targetElement = document.getElementById(targetId);
		if (targetElement) {
			targetElement.scrollIntoView({ behavior: "smooth" });
		}
	}
}

function triggerImageLoadEvents(): void {
	const contentDiv = document.getElementById("decrypted-content");
	if (!contentDiv) {
		return;
	}

	const images = contentDiv.querySelectorAll("img");
	images.forEach((img) => {
		if (!img.complete) {
			img.addEventListener("load", () => {
				window.dispatchEvent(new Event("scroll"));
				window.dispatchEvent(new Event("resize"));
			});
		}
	});

	[0, 100, 300, 500, 1000, 2000].forEach((delay) => {
		setTimeout(() => {
			window.dispatchEvent(new Event("scroll"));
			window.dispatchEvent(new Event("resize"));
		}, delay);
	});
}

async function triggerMermaidRender(): Promise<void> {
	if (typeof window.renderMermaidDiagrams === "function") {
		await new Promise((resolve) => setTimeout(resolve, 100));
		window.renderMermaidDiagrams();
	}
}
