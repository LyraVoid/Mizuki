function imageCountInParagraph(node) {
	if (node?.type !== "paragraph") return 0;
	let count = 0;
	for (const child of node.children ?? []) {
		if (child.type === "text" && child.value.trim() === "") continue;
		if (child.type === "image") {
			count++;
			continue;
		}
		if (
			child.type === "link" &&
			child.children?.length === 1 &&
			child.children[0].type === "image"
		) {
			count++;
			continue;
		}
		return 0;
	}
	return count;
}

/**
 * 将两个以上连续的纯图片段落转成与 `:::grid` 相同的容器指令。
 * 显式 grid 指令和混有文字的段落不会被改写。
 */
export function remarkAutoImageGrid(options = {}) {
	const minImages = Math.max(2, options.minImages ?? 2);
	const maxColumns = Math.max(1, options.maxColumns ?? 4);

	return (tree) => {
		if (!Array.isArray(tree.children)) return;
		const output = [];
		for (let index = 0; index < tree.children.length; ) {
			const run = [];
			let imageCount = 0;
			let cursor = index;
			while (cursor < tree.children.length) {
				const node = tree.children[cursor];
				const count = imageCountInParagraph(node);
				if (count === 0) break;
				run.push(node);
				imageCount += count;
				cursor++;
			}

			if (imageCount >= minImages) {
				output.push({
					type: "containerDirective",
					name: "grid",
					attributes: {
						columns: String(Math.min(imageCount, maxColumns)),
					},
					children: run,
				});
				index = cursor;
			} else {
				output.push(tree.children[index]);
				index++;
			}
		}
		tree.children = output;
	};
}
