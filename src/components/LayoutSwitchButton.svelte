<script lang="ts">
import { onMount } from "svelte";
import { siteConfig, sidebarLayoutConfig } from "../config";

type LayoutMode = "list" | "grid";

export let currentLayout: LayoutMode = "list";

let mounted = false;
let isSmallScreen = false;
let isSwitching = false;
let userPreference: LayoutMode = "list";
let mediaQueryList: MediaQueryList | null = null;

const BREAKPOINT = sidebarLayoutConfig.responsive?.breakpoints?.desktop ?? 1280;

$: currentLayout = isSmallScreen ? "list" : userPreference;

$: if (mounted) {
    dispatchLayoutChange(currentLayout);
}

function dispatchLayoutChange(layout: LayoutMode) {
    if (typeof window !== "undefined") {
        window.dispatchEvent(
            new CustomEvent("layoutChange", {
                detail: { layout },
            })
        );
    }
}

// 辅助函数：同时更新两种存储
// sessionStorage 用于判断当前会话状态（关闭标签页失效）
// localStorage 用于兼容其他组件（如 PostPage.astro）
// TODO: 使用 sessionStorage 存储状态，关闭标签页即销毁。不应把缓存数据存在访客本地电脑上
function updateStorage(layout: LayoutMode) {
    sessionStorage.setItem("postListLayout", layout);
    localStorage.setItem("postListLayout", layout);
}

function getSavedSessionLayout(): LayoutMode | null {
    return sessionStorage.getItem("postListLayout") as LayoutMode;
}

function switchLayout() {
    if (!mounted || isSmallScreen || isSwitching) return;

    isSwitching = true;
    const newLayout = userPreference === "list" ? "grid" : "list";
    userPreference = newLayout;
    
    // 更新存储
    updateStorage(newLayout);
}

function onAnimationEnd() {
    isSwitching = false;
}

function handleMediaQueryChange(e: MediaQueryListEvent | MediaQueryList) {
    isSmallScreen = !e.matches;
}

onMount(() => {
    mounted = true;

    const sessionLayout = getSavedSessionLayout();
    const defaultLayout = siteConfig.postListLayout.defaultMode as LayoutMode;
    
    if (sessionLayout === "list" || sessionLayout === "grid") {
        userPreference = sessionLayout;
        
        if (localStorage.getItem("postListLayout") !== sessionLayout) {
            localStorage.setItem("postListLayout", sessionLayout);
        }
    } else {
        userPreference = defaultLayout;
        updateStorage(defaultLayout);
    }

    mediaQueryList = window.matchMedia(`(min-width: ${BREAKPOINT}px)`);
    handleMediaQueryChange(mediaQueryList);

    if (mediaQueryList.addEventListener) {
        mediaQueryList.addEventListener("change", handleMediaQueryChange);
    } else {
        mediaQueryList.addListener(handleMediaQueryChange);
    }

    const handleCustomEvent = (event: CustomEvent<{ layout: LayoutMode }>) => {
        if (event.detail?.layout) userPreference = event.detail.layout;
    };
    
    const handleSwupEvent = () => {
        setTimeout(() => {
            const saved = getSavedSessionLayout();
            if (saved === "list" || saved === "grid") {
                userPreference = saved;
            } else {
                 userPreference = siteConfig.postListLayout.defaultMode as LayoutMode;
            }
        }, 200);
    };

    window.addEventListener("layoutChange", handleCustomEvent as EventListener);
    
    const setupSwup = () => {
        const swup = (window as any).swup;
        if (swup?.hooks) {
            swup.hooks.on("content:replace", handleSwupEvent);
            swup.hooks.on("page:view", handleSwupEvent);
        } else {
            window.addEventListener("popstate", handleSwupEvent);
        }
    };

    if ((window as any).swup) {
        setupSwup();
    } else {
        setTimeout(setupSwup, 200);
    }

    return () => {
        if (mediaQueryList) {
             if (mediaQueryList.removeEventListener) {
                mediaQueryList.removeEventListener("change", handleMediaQueryChange);
            } else {
                mediaQueryList.removeListener(handleMediaQueryChange);
            }
        }
        window.removeEventListener("layoutChange", handleCustomEvent as EventListener);
        window.removeEventListener("popstate", handleSwupEvent);
        
        const swup = (window as any).swup;
        if (swup?.hooks) {
            swup.hooks.off("content:replace", handleSwupEvent);
            swup.hooks.off("page:view", handleSwupEvent);
        }
    };
});
</script>

{#if mounted && siteConfig.postListLayout.allowSwitch && !isSmallScreen}
  <button 
    type="button"
    aria-label={userPreference === 'list' ? '切换到网格模式' : '切换到列表模式'}
    aria-pressed={userPreference === 'grid'}
    class="btn-plain scale-animation rounded-lg h-11 w-11 active:scale-90 flex items-center justify-center theme-switch-btn {isSwitching ? 'switching' : ''}" 
    on:click={switchLayout}
    disabled={isSwitching}
    title={userPreference === 'list' ? '切换到网格模式' : '切换到列表模式'}
  >
    <div 
        class="icon-container w-5 h-5 flex items-center justify-center relative"
        on:animationend={onAnimationEnd}
    >
        {#if userPreference === 'list'}
            <svg class="w-5 h-5 icon-transition" fill="currentColor" viewBox="0 0 24 24">
            <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/>
            </svg>
        {:else}
            <svg class="w-5 h-5 icon-transition" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 3h7v7H3V3zm0 11h7v7H3v-7zm11-11h7v7h-7V3zm0 11h7v7h-7v-7z"/>
            </svg>
        {/if}
    </div>
  </button>
{/if}

<style>
    .theme-switch-btn::before {
        transition: transform 75ms ease-out, background-color 0ms !important;
    }

    .icon-transition {
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease;
    }
    .switching {
        pointer-events: none;
    }
    .switching .icon-transition {
        animation: iconRotate 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    }
    @keyframes iconRotate {
        0% { transform: rotate(0deg) scale(1); opacity: 1; }
        50% { transform: rotate(180deg) scale(0.8); opacity: 0.5; }
        100% { transform: rotate(360deg) scale(1); opacity: 1; }
    }
    .theme-switch-btn:not(.switching):hover .icon-transition {
        transform: scale(1.1);
    }
    .theme-switch-btn:disabled {
        cursor: not-allowed;
        opacity: 0.7;
    }
</style>
