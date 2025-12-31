class CodeBlockCollapser {
	constructor() {
		this.processedBlocks = new WeakSet();
		this.observer = null;
		this.isThemeChanging = false;
		this.debug = false; // 设置为 true 启用调试日志
		this.init();
	}

	log(...args) {
		if (this.debug) {
			console.log("[CodeBlockCollapser]", ...args);
		}
	}

	init() {
		this.log("Initializing...");
		if (document.readyState === "loading") {
			document.addEventListener("DOMContentLoaded", () => {
				this.log("DOMContentLoaded - setting up code blocks");
				this.setupCodeBlocks();
			});
		} else {
			this.log("Document already loaded - setting up code blocks");
			this.setupCodeBlocks();
		}
		this.observePageChanges();
		this.setupThemeChangeListener();
		this.setupThemeOptimizerSync();
	}

	setupThemeOptimizerSync() {
		// 与主题优化器同步，确保代码块的隐藏/显示行为一致
		this.syncWithThemeOptimizer();

		// 监听主题优化器初始化完成事件
		document.addEventListener("themeOptimizerReady", () => {
			this.log("Theme optimizer ready, syncing code block behavior");
			this.syncWithThemeOptimizer();
		});

		// 监听页面切换事件，确保同步
		document.addEventListener("swup:pageView", () => {
			// 延迟同步，确保主题优化器已经处理完代码块
			setTimeout(() => {
				this.syncWithThemeOptimizer();
			}, 150);
		});
	}

	syncWithThemeOptimizer() {
		// 检查主题优化器是否存在
		if (window.themeOptimizer) {
			// 获取当前主题优化器的设置
			const shouldHideDuringTransition =
				window.themeOptimizer.hideCodeBlocksDuringTransition;

			// 应用相同的设置到代码块
			const codeBlocks = document.querySelectorAll(".expressive-code");
			codeBlocks.forEach((block) => {
				if (shouldHideDuringTransition) {
					block.classList.add("hide-during-transition");
				} else {
					block.classList.remove("hide-during-transition");
				}
			});

			this.log(
				`Synced with theme optimizer: hide code blocks during transition = ${shouldHideDuringTransition}`,
			);
		} else {
			// 如果主题优化器不存在，应用默认行为
			const codeBlocks = document.querySelectorAll(".expressive-code");
			codeBlocks.forEach((block) => {
				block.classList.add("hide-during-transition");
			});

			this.log("Theme optimizer not available, applied default behavior");
		}
	}

	setupThemeChangeListener() {
		// 监听主题切换，在切换期间暂停 observer 和优化性能
		const themeObserver = new MutationObserver((mutations) => {
			for (const mutation of mutations) {
				if (
					mutation.type === "attributes" &&
					(mutation.attributeName === "class" ||
						mutation.attributeName === "data-theme")
				) {
					const isTransitioning =
						document.documentElement.classList.contains(
							"is-theme-transitioning",
						);

					if (isTransitioning && !this.isThemeChanging) {
						this.isThemeChanging = true;

						// 断开 observer 以避免在主题切换时进行不必要的检查
						if (this.observer) {
							this.observer.disconnect();
						}

						// 性能优化：临时禁用代码块的动画和过渡
						document
							.querySelectorAll(".expressive-code")
							.forEach((block) => {
								block.style.transition = "none";
							});
					} else if (!isTransitioning && this.isThemeChanging) {
						this.isThemeChanging = false;

						// 等待主题切换完全结束后再恢复
						requestAnimationFrame(() => {
							// 恢复代码块的过渡效果
							document
								.querySelectorAll(".expressive-code")
								.forEach((block) => {
									block.style.transition = "";
								});

							// 重新连接 observer
							setTimeout(() => {
								this.observePageChanges();
							}, 50);
						});
					}
					break;
				}
			}
		});

		themeObserver.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ["class", "data-theme"],
		});
	}

	setupCodeBlocks() {
		requestAnimationFrame(() => {
			const codeBlocks = document.querySelectorAll(".expressive-code");
			this.log(`Found ${codeBlocks.length} code blocks to process`);

			codeBlocks.forEach((codeBlock, index) => {
				if (!this.processedBlocks.has(codeBlock)) {
					this.log(`Enhancing code block ${index + 1}`);
					this.enhanceCodeBlock(codeBlock);
					this.processedBlocks.add(codeBlock);
				} else {
					this.log(`Code block ${index + 1} already processed`);
				}
			});
		});
	}

	enhanceCodeBlock(codeBlock) {
		const frame = codeBlock.querySelector(".frame");
		if (!frame) {
			this.log("No frame found in code block, skipping");
			return;
		}

		if (frame.classList.contains("has-title")) {
			this.log("Code block has title, skipping collapse feature");
			return;
		}

		this.log("Adding collapse feature to code block");
		codeBlock.classList.add("collapsible", "expanded");

		const toggleBtn = this.createToggleButton();
		frame.appendChild(toggleBtn);

		this.bindToggleEvents(codeBlock, toggleBtn);
	}

	createToggleButton() {
		const button = document.createElement("button");
		button.className = "collapse-toggle-btn";
		button.type = "button";
		button.setAttribute("aria-label", "折叠/展开代码块");

		button.innerHTML = `
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <g fill="none">
          <path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"></path>
          <path fill="currentColor" d="m12 16.172l-4.95-4.95a1 1 0 1 0-1.414 1.414l5.657 5.657a1 1 0 0 0 1.414 0l5.657-5.657a1 1 0 0 0-1.414-1.414z"></path>
        </g>
      </svg>
    `;

		return button;
	}

	bindToggleEvents(codeBlock, button) {
		button.addEventListener("click", (e) => {
			e.preventDefault();
			e.stopPropagation();
			this.toggleCollapse(codeBlock);
		});

		button.addEventListener("keydown", (e) => {
			if (e.key === "Enter" || e.key === " ") {
				e.preventDefault();
				this.toggleCollapse(codeBlock);
			}
		});
	}

	toggleCollapse(codeBlock) {
		const isCollapsed = codeBlock.classList.contains("collapsed");

		requestAnimationFrame(() => {
			if (isCollapsed) {
				codeBlock.classList.remove("collapsed");
				codeBlock.classList.add("expanded");
			} else {
				codeBlock.classList.remove("expanded");
				codeBlock.classList.add("collapsed");
			}
		});

		const event = new CustomEvent("codeBlockToggle", {
			detail: { collapsed: !isCollapsed, element: codeBlock },
		});
		document.dispatchEvent(event);
	}

	observePageChanges() {
		// 如果正在主题切换，不要重新连接
		if (this.isThemeChanging) return;

		// 断开现有的 observer
		if (this.observer) {
			this.observer.disconnect();
		}

		let debounceTimer = null;

		this.observer = new MutationObserver((mutations) => {
			// 如果正在主题切换，忽略所有变化
			if (this.isThemeChanging) return;

			let shouldReinit = false;

			for (const mutation of mutations) {
				if (mutation.type === "childList") {
					for (const node of mutation.addedNodes) {
						if (node.nodeType === Node.ELEMENT_NODE) {
							// 只检查添加的节点本身或其直接子节点
							if (
								node.classList &&
								node.classList.contains("expressive-code")
							) {
								shouldReinit = true;
								break;
							}
							// 避免深度查询，只检查一层
							if (node.children && node.children.length > 0) {
								for (
									let i = 0;
									i < Math.min(node.children.length, 10);
									i++
								) {
									if (
										node.children[i].classList &&
										node.children[i].classList.contains(
											"expressive-code",
										)
									) {
										shouldReinit = true;
										break;
									}
								}
							}
						}
						if (shouldReinit) break;
					}
				}
				if (shouldReinit) break;
			}

			if (shouldReinit) {
				clearTimeout(debounceTimer);
				debounceTimer = setTimeout(() => this.setupCodeBlocks(), 150);
			}
		});

		this.observer.observe(document.body, {
			childList: true,
			subtree: true,
		});
	}

	destroy() {
		if (this.observer) {
			this.observer.disconnect();
			this.observer = null;
		}
		this.processedBlocks = new WeakSet();
	}

	// 公共API方法
	collapseAll() {
		const allBlocks = document.querySelectorAll(
			".expressive-code.expanded",
		);
		allBlocks.forEach((block) => {
			this.toggleCollapse(block);
		});
	}

	expandAll() {
		const allBlocks = document.querySelectorAll(
			".expressive-code.collapsed",
		);
		allBlocks.forEach((block) => {
			this.toggleCollapse(block);
		});
	}
}

const codeBlockCollapser = new CodeBlockCollapser();

window.CodeBlockCollapser = CodeBlockCollapser;
window.codeBlockCollapser = codeBlockCollapser;

// 设置 Swup 钩子的函数
function setupSwupHooks() {
	if (window.swup) {
		codeBlockCollapser.log("Setting up Swup hooks");

		// 监听 page:view 事件
		window.swup.hooks.on("page:view", () => {
			codeBlockCollapser.log(
				"Swup page:view event - reinitializing code blocks",
			);
			// 页面切换后重置 processedBlocks，确保新页面的代码块被处理
			codeBlockCollapser.processedBlocks = new WeakSet();
			setTimeout(() => {
				codeBlockCollapser.setupCodeBlocks();
			}, 100);
		});

		// 监听 content:replace 事件（更早触发）
		window.swup.hooks.on("content:replace", () => {
			codeBlockCollapser.log(
				"Swup content:replace event - preparing for reinitialization",
			);
			// 内容替换时也重置，确保不会因为缓存而跳过处理
			codeBlockCollapser.processedBlocks = new WeakSet();
			setTimeout(() => {
				codeBlockCollapser.setupCodeBlocks();
			}, 50);
		});

		return true;
	}
	return false;
}

// 尝试立即设置 Swup 钩子
if (!setupSwupHooks()) {
	// 如果 Swup 尚未初始化，等待它加载
	codeBlockCollapser.log("Swup not ready, waiting for initialization");

	// 监听 swup:enable 事件
	document.addEventListener("swup:enable", () => {
		codeBlockCollapser.log("Swup enabled, setting up hooks");
		setupSwupHooks();
	});

	// 额外的延迟重试机制，确保捕获到 Swup
	const retryInterval = setInterval(() => {
		if (setupSwupHooks()) {
			codeBlockCollapser.log("Swup hooks set up successfully via retry");
			clearInterval(retryInterval);
		}
	}, 100);

	// 最多重试 20 次（2 秒）
	setTimeout(() => {
		clearInterval(retryInterval);
	}, 2000);
}
