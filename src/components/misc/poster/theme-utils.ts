export async function getThemeColor(): Promise<string> {
	return new Promise((resolve) => {
		const temp = document.createElement("div");
		temp.style.color = "var(--primary)";
		temp.style.display = "none";
		document.body.appendChild(temp);

		requestAnimationFrame(() => {
			const computedColor = getComputedStyle(temp).color;
			document.body.removeChild(temp);
			resolve(computedColor || "#558e88");
		});
	});
}
