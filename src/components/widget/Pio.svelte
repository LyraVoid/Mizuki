<script>
import { onDestroy, onMount } from "svelte";
import { pioConfig } from "@/config";

// 将配置转换为 Pio 插件需要的格式
const pioOptions = {
	mode: pioConfig.mode,
	hidden: pioConfig.hiddenOnMobile,
	content: pioConfig.dialog || {},
	model: pioConfig.models || ["/pio/models/pio/model.json"],
};

// 全局Pio实例引用
let pioInstance = null;
let pioInitialized = false;
let pioContainer;
let pioCanvas;

// 样式已通过 Layout.astro 静态引入，无需动态加载

// 等待 DOM 加载完成后再初始化 Pio
function initPio() {
	if (typeof window !== "undefined" && typeof Paul_Pio !== "undefined") {
		try {
			// 确保DOM元素存在
			if (pioContainer && pioCanvas && !pioInitialized) {
				pioInstance = new Paul_Pio(pioOptions);
				pioInitialized = true;
				console.log("Pio initialized successfully (Svelte)");
			} else if (!pioContainer || !pioCanvas) {
				console.warn("Pio DOM elements not found, retrying...");
				setTimeout(initPio, 100);
			}
		} catch (e) {
			console.error("Pio initialization error:", e);
		}
	} else {
		// 如果 Paul_Pio 还未定义，稍后再试
		setTimeout(initPio, 100);
	}
}

// 样式已通过 Layout.astro 静态引入，无需动态加载函数

// 加载必要的脚本
function loadPioAssets() {
	if (typeof window === "undefined") return;

	// 样式已通过 Layout.astro 静态引入

	// 加载JS脚本
	const loadScript = (src, id) => {
		return new Promise((resolve, reject) => {
			if (document.querySelector(`#${id}`)) {
				resolve();
				return;
			}
			const script = document.createElement("script");
			script.id = id;
			script.src = src;
			script.onload = resolve;
			script.onerror = reject;
			document.head.appendChild(script);
		});
	};

	// 按顺序加载脚本
	loadScript("/pio/static/l2d.js", "pio-l2d-script")
		.then(() => loadScript("/pio/static/pio.js", "pio-main-script"))
		.then(() => {
			// 脚本加载完成后初始化
			setTimeout(initPio, 100);
		})
		.catch((error) => {
			console.error("Failed to load Pio scripts:", error);
		});
}

// 样式已通过 Layout.astro 静态引入，无需页面切换监听

onMount(() => {
	if (!pioConfig.enable) return;

	// 如果配置了手机端隐藏，且当前屏幕宽度小于 1280px (平板/手机)，则直接终止，不加载脚本
    if (pioConfig.hiddenOnMobile && window.matchMedia("(max-width: 1280px)").matches) {
        return;
    }

	// 加载资源并初始化
	loadPioAssets();
});

onDestroy(() => {
	// Svelte 组件销毁时不需要清理 Pio 实例
	// 因为我们希望它在页面切换时保持状态
	console.log("Pio Svelte component destroyed (keeping instance alive)");
});
</script>

{#if pioConfig.enable}
  <div class={`pio-container ${pioConfig.position || 'right'}`} bind:this={pioContainer}>
    <div class="pio-action"></div>
    <canvas 
      id="pio" 
      bind:this={pioCanvas}
      width={pioConfig.width || 280} 
      height={pioConfig.height || 250}
    ></canvas>
  </div>
{/if}

<style>
  /* Pio 相关样式将通过外部CSS文件加载 */
</style>