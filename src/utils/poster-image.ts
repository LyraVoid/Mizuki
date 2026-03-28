export async function processPosterImage(
	imagePath: string | undefined,
	filePath: string | undefined,
): Promise<string> {
	if (!imagePath) {
		return "";
	}

	const isLocal = !(
		imagePath.startsWith("/") ||
		imagePath.startsWith("http") ||
		imagePath.startsWith("https") ||
		imagePath.startsWith("data:")
	);

	if (isLocal && filePath) {
		const basePath = filePath.replace(/\/[^/]+$/, "").replace(/\\/g, "/");
		const files = import.meta.glob<ImageMetadata>(
			"../../**/*.{jpg,jpeg,png,gif,webp,avif,svg}",
			{
				import: "default",
			},
		);
		// 使用字符串操作替代 path.normalize 和 path.join
		const normalizedPath = normalizePath(`../../${basePath}/${imagePath}`);
		const file = files[`./${normalizedPath}`] || files[normalizedPath];
		if (file) {
			const img = await file();
			return img.src;
		}
	}

	if (imagePath.startsWith("http")) {
		try {
			const response = await fetch(imagePath);
			const arrayBuffer = await response.arrayBuffer();
			const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
			const contentType =
				response.headers.get("content-type") || "image/jpeg";
			return `data:${contentType};base64,${base64}`;
		} catch {
			return imagePath;
		}
	}

	return imagePath;
}

// 简单的路径规范化函数，替代 path.normalize
function normalizePath(path: string): string {
	// 将反斜杠替换为正斜杠
	path = path.replace(/\\/g, "/");

	// 处理 ../ 和 ./
	const parts = path.split("/");
	const result: string[] = [];

	for (const part of parts) {
		if (part === ".." && result.length > 0 && result[result.length - 1] !== "..") {
			result.pop();
		} else if (part !== "." && part !== "") {
			result.push(part);
		}
	}

	// 保留开头的 ../
	const prefixParts: string[] = [];
	for (const part of parts) {
		if (part === "..") {
			prefixParts.push(part);
		} else if (part !== "." && part !== "") {
			break;
		}
	}

	return [...prefixParts, ...result].join("/");
}
