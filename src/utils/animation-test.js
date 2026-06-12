// 动画测试工具 - 验证yukina风格的侧滑效果

export function testSlideAnimation() {
	console.log("Testing slide animation effects...");

	// 测试主要动画元素
	const mainElements = document.querySelectorAll(".transition-main");
	const animationElements = document.querySelectorAll(".onload-animation");

	console.log(`Found ${mainElements.length} main transition elements`);
	console.log(`Found ${animationElements.length} onload animation elements`);

	// 检查CSS动画属性
	mainElements.forEach((el, index) => {
		const styles = window.getComputedStyle(el);
		console.log(`Element ${index}:`, {
			transition: styles.transition,
			transform: styles.transform,
			opacity: styles.opacity,
		});
	});

	return {
		mainElements: mainElements.length,
		animationElements: animationElements.length,
		status: "Animation test completed",
	};
}

// 模拟页面切换动画
export function simulatePageTransition() {
	const _body = document.body;
	const html = document.documentElement;

	// 添加离开状态
	html.classList.add("is-animating", "is-leaving");

	setTimeout(() => {
		// 移除离开状态，添加进入状态
		html.classList.remove("is-leaving");

		setTimeout(() => {
			// 完成动画
			html.classList.remove("is-animating");
			console.log("Page transition simulation completed");
		}, 300);
	}, 300);
}

// 在控制台中可用的测试函数
if (typeof window !== "undefined") {
	window.testSlideAnimation = testSlideAnimation;
	window.simulatePageTransition = simulatePageTransition;
}
