// 设备页面处理脚本
// 此脚本作为全局脚本加载，不受 Swup 页面切换影响

(() => {
	if (typeof window.devicesPageState === "undefined") {
		window.devicesPageState = {
			eventListeners: [],
			mutationObserver: null,
		};
	}

	function escapeHtml(value) {
		return String(value ?? "")
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/\"/g, "&quot;")
			.replace(/'/g, "&#39;");
	}

	function cleanupListeners() {
		const state = window.devicesPageState;
		for (let i = 0; i < state.eventListeners.length; i++) {
			const [element, type, handler] = state.eventListeners[i];
			if (element && element.removeEventListener) {
				element.removeEventListener(type, handler);
			}
		}
		state.eventListeners = [];
	}

	function createDeviceCardHTML(device, index, viewDetailsText) {
		const imgSection =
			'<div class="relative p-6 pb-0"><div class="flex justify-center items-center h-48 bg-gradient-to-br from-[var(--card-bg)] to-[var(--btn-regular-bg)] rounded-lg overflow-hidden relative"><div class="absolute inset-0 bg-[var(--primary)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div><img src="' +
			escapeHtml(device.image) +
			'" alt="' +
			escapeHtml(device.name) +
			'" class="w-auto h-full max-h-full object-contain group-hover:scale-110 transition-all duration-500 drop-shadow-md relative z-10" loading="lazy"></div></div>';

		const infoSection =
			'<div class="p-6 pt-4 relative z-10"><div class="flex items-start justify-between mb-3"><h3 class="text-lg font-bold text-black/90 dark:text-white/90 group-hover:text-[var(--primary)] transition-colors duration-300">' +
			escapeHtml(device.name) +
			'</h3><div class="p-1.5 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"><svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg></div></div><div class="mb-4"><div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--btn-regular-bg)] text-black/70 dark:text-white/70 text-sm mb-3"><svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg><span class="font-medium">' +
			escapeHtml(device.specs) +
			'</span></div><p class="text-sm text-black/60 dark:text-white/60 leading-relaxed line-clamp-2">' +
			escapeHtml(device.description) +
			'</p></div><div class="flex items-center justify-between pt-3 border-t border-[var(--line-divider)] border-dashed opacity-0 group-hover:opacity-100 transition-all duration-300"><span class="text-sm font-medium text-[var(--primary)]">' +
			escapeHtml(viewDetailsText) +
			'</span><svg class="w-5 h-5 text-[var(--primary)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg></div></div>';

		return (
			'<a href="' +
			escapeHtml(device.link) +
			'" target="_blank" rel="noopener noreferrer" class="device-card group relative overflow-hidden rounded-xl border border-[var(--line-divider)] bg-[var(--card-bg)] transition-all duration-300 hover:border-[var(--primary)]/50 hover:shadow-md hover:shadow-black/5 dark:hover:shadow-white/5 hover:scale-[1.02] hover:-translate-y-0.5 block cursor-pointer" style="animation-delay:' +
			index * 100 +
			'ms; animation: fadeInUp 0.6s cubic-bezier(0.25, 0.1, 0.25, 1) forwards; opacity: 0;">' +
			imgSection +
			infoSection +
			"</a>"
		);
	}

	function initDevicesPage() {
		const brandTabs = document.querySelectorAll(".filter-tag[data-brand]");
		const devicesContainer = document.getElementById("devices-container");
		const devicesDataElement = document.getElementById("devices-data");
		const i18nDataElement = document.getElementById("i18n-data");

		if (
			!brandTabs.length ||
			!devicesContainer ||
			!devicesDataElement ||
			!i18nDataElement
		) {
			return false;
		}

		const devicesData = JSON.parse(devicesDataElement.textContent || "{}");
		const i18nData = JSON.parse(i18nDataElement.textContent || "{}");

		cleanupListeners();

		brandTabs.forEach((tab) => {
			const clickHandler = () => {
				const brand = tab.dataset.brand;
				if (!brand) {
					return;
				}

				brandTabs.forEach((item) => item.classList.remove("active"));
				tab.classList.add("active");

				const brandDevices = devicesData[brand] || [];
				devicesContainer.innerHTML = brandDevices
					.map((device, index) =>
						createDeviceCardHTML(
							device,
							index,
							i18nData.viewDetails || "",
						),
					)
					.join("");
			};

			tab.addEventListener("click", clickHandler);
			window.devicesPageState.eventListeners.push([
				tab,
				"click",
				clickHandler,
			]);
		});

		return true;
	}

	function tryInit(retries) {
		retries = retries || 0;
		if (initDevicesPage()) {
			return;
		}
		if (retries < 5) {
			setTimeout(() => {
				tryInit(retries + 1);
			}, 100);
		}
	}

	function setupMutationObserver() {
		if (window.devicesPageState.mutationObserver) {
			window.devicesPageState.mutationObserver.disconnect();
		}

		window.devicesPageState.mutationObserver = new MutationObserver(
			(mutations) => {
				let shouldInit = false;

				for (let i = 0; i < mutations.length; i++) {
					const mutation = mutations[i];
					if (
						!mutation.addedNodes ||
						mutation.addedNodes.length === 0
					) {
						continue;
					}

					for (let j = 0; j < mutation.addedNodes.length; j++) {
						const node = mutation.addedNodes[j];
						if (node.nodeType !== 1) {
							continue;
						}

						if (
							node.id === "devices-container" ||
							node.id === "devices-data" ||
							(node.querySelector &&
								(node.querySelector("#devices-container") ||
									node.querySelector("#devices-data")))
						) {
							shouldInit = true;
							break;
						}
					}

					if (shouldInit) {
						break;
					}
				}

				if (shouldInit) {
					setTimeout(() => {
						tryInit();
					}, 50);
				}
			},
		);

		window.devicesPageState.mutationObserver.observe(document.body, {
			childList: true,
			subtree: true,
		});
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", () => {
			tryInit();
		});
	} else {
		tryInit();
	}

	setupMutationObserver();

	const events = [
		"swup:contentReplaced",
		"swup:pageView",
		"astro:page-load",
		"astro:after-swap",
		"mizuki:page:loaded",
	];

	for (let i = 0; i < events.length; i++) {
		const eventName = events[i];
		document.addEventListener(eventName, () => {
			setTimeout(() => {
				tryInit();
			}, 100);
		});
	}
})();
