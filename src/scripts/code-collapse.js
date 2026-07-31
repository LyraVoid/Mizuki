const DEFAULT_CONFIG = Object.freeze({
	enabled: true,
	lineThreshold: 20,
	previewLines: 10,
	defaultCollapsed: true,
});

function positiveInteger(value, fallback) {
	const parsed = Number.parseInt(value ?? "", 10);
	return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export function readCodeCollapseConfig(carrier) {
	const dataset = carrier?.dataset ?? {};
	return {
		enabled:
			dataset.codeCollapseEnabled === undefined
				? DEFAULT_CONFIG.enabled
				: dataset.codeCollapseEnabled === "true",
		lineThreshold: positiveInteger(
			dataset.codeCollapseLineThreshold,
			DEFAULT_CONFIG.lineThreshold,
		),
		previewLines: positiveInteger(
			dataset.codeCollapsePreviewLines,
			DEFAULT_CONFIG.previewLines,
		),
		defaultCollapsed:
			dataset.codeCollapseDefaultCollapsed === undefined
				? DEFAULT_CONFIG.defaultCollapsed
				: dataset.codeCollapseDefaultCollapsed === "true",
	};
}

export function shouldAutoCollapse(lineCount, config = DEFAULT_CONFIG) {
	return config.enabled && lineCount >= config.lineThreshold;
}

export class CodeBlockCollapser {
	constructor() {
		this.processedBlocks = new WeakSet();
		this.observer = null;
		this.config = readCodeCollapseConfig(
			document.getElementById("config-carrier"),
		);
		this.setupCodeBlocks();
		this.observePageChanges();
		document.addEventListener("swup:pageView", () => this.setupCodeBlocks());
	}

	setupCodeBlocks(root = document) {
		if (!this.config.enabled) return;

		requestAnimationFrame(() => {
			for (const codeBlock of root.querySelectorAll(".expressive-code")) {
				if (this.processedBlocks.has(codeBlock)) continue;
				this.processedBlocks.add(codeBlock);
				this.enhanceCodeBlock(codeBlock);
			}
		});
	}

	enhanceCodeBlock(codeBlock) {
		const frame = codeBlock.querySelector(":scope > .frame");
		const pre = frame?.querySelector(":scope > pre");
		const lineCount = pre?.querySelectorAll(".ec-line").length ?? 0;

		if (
			!frame ||
			!pre ||
			!shouldAutoCollapse(lineCount, this.config)
		) {
			return;
		}

		const collapsed = this.config.defaultCollapsed;
		codeBlock.classList.add(
			"collapsible",
			"auto-collapsible",
			collapsed ? "collapsed" : "expanded",
		);
		codeBlock.dataset.codeLineCount = String(lineCount);
		codeBlock.style.setProperty(
			"--code-collapse-preview-height",
			this.calculatePreviewHeight(pre),
		);

		const button = this.createToggleButton();
		frame.append(button);
		this.updateButton(button, collapsed);
		button.addEventListener("click", () => this.toggleCollapse(codeBlock, button));
	}

	calculatePreviewHeight(pre) {
		const line = pre.querySelector(".ec-line");
		const lineHeight = Number.parseFloat(
			line ? getComputedStyle(line).lineHeight : "",
		);
		const preStyle = getComputedStyle(pre);
		const verticalPadding =
			Number.parseFloat(preStyle.paddingTop) +
			Number.parseFloat(preStyle.paddingBottom);
		const height =
			(Number.isFinite(lineHeight) ? lineHeight : 24) *
				this.config.previewLines +
			(Number.isFinite(verticalPadding) ? verticalPadding : 0);
		return `${height}px`;
	}

	createToggleButton() {
		const button = document.createElement("button");
		button.className = "collapse-toggle-btn";
		button.type = "button";
		button.innerHTML = `
			<svg viewBox="0 0 24 24" aria-hidden="true">
				<path fill="currentColor" d="m12 16.2-6.4-6.4 1.4-1.4 5 5 5-5 1.4 1.4z"></path>
			</svg>
		`;
		return button;
	}

	updateButton(button, collapsed) {
		button.setAttribute("aria-expanded", String(!collapsed));
		button.setAttribute(
			"aria-label",
			collapsed ? "展开代码块" : "折叠代码块",
		);
		button.title = collapsed ? "展开代码块" : "折叠代码块";
	}

	toggleCollapse(codeBlock, button) {
		const collapsed = !codeBlock.classList.contains("collapsed");
		codeBlock.classList.toggle("collapsed", collapsed);
		codeBlock.classList.toggle("expanded", !collapsed);
		this.updateButton(button, collapsed);
		document.dispatchEvent(
			new CustomEvent("codeBlockToggle", {
				detail: { collapsed, element: codeBlock },
			}),
		);
	}

	observePageChanges() {
		this.observer?.disconnect();
		this.observer = new MutationObserver((mutations) => {
			for (const mutation of mutations) {
				for (const node of mutation.addedNodes) {
					if (!(node instanceof Element)) continue;
					if (
						node.matches(".expressive-code") ||
						node.querySelector(".expressive-code")
					) {
						this.setupCodeBlocks(node.matches(".expressive-code") ? node.parentElement : node);
						return;
					}
				}
			}
		});
		this.observer.observe(document.body, { childList: true, subtree: true });
	}

	collapseAll() {
		for (const block of document.querySelectorAll(
			".expressive-code.auto-collapsible.expanded",
		)) {
			block.querySelector(".collapse-toggle-btn")?.click();
		}
	}

	expandAll() {
		for (const block of document.querySelectorAll(
			".expressive-code.auto-collapsible.collapsed",
		)) {
			block.querySelector(".collapse-toggle-btn")?.click();
		}
	}
}

if (typeof document !== "undefined" && typeof window !== "undefined") {
	const initialize = () => {
		if (window.codeBlockCollapser) return;
		window.codeBlockCollapser = new CodeBlockCollapser();
	};

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", initialize, { once: true });
	} else {
		initialize();
	}
}
