import { visit } from "unist-util-visit";

export function rehypeImageWidth() {
	const regexW = / w-([0-9]+)(%|px)?/;
	const regexH = / h-([0-9]+)(%|px)?/;

	return (tree) => {
		visit(tree, "element", (node, index, parent) => {
			if (
				node.tagName === "img" &&
				node.properties &&
				node.properties.alt
			) {
				const alt = node.properties.alt;

				const matchW = alt.match(regexW);
				const matchH = alt.match(regexH);

				let width = "100%";
				let height = "auto";

				if (matchW) {
					width = matchW[2]
						? `${matchW[1]}${matchW[2]}`
						: `${matchW[1]}%`;
				}
				if (matchH) {
					height = matchH[2]
						? `${matchH[1]}${matchH[2]}`
						: `${matchH[1]}%`;
				}

				// 清理 alt 裡的語法
				node.properties.alt = alt
					.replace(regexW, "")
					.replace(regexH, "")
					.trim();

				// 套用寬高
				node.properties.style = `display:block; margin:0 auto; width:${width}; height:${height};object-fit:contain;`;

				const figureChildren = [node];

				if (node.properties.title) {
					const figcaption = {
						type: "element",
						tagName: "figcaption",
						properties: {
							style: "text-align:center; margin-top:0.5em; font-size:0.9em; color:#666;",
						},
						children: [
							{
								type: "text",
								value: node.properties.title,
							},
						],
					};
					figureChildren.push(figcaption);
				}

				const figure = {
					type: "element",
					tagName: "figure",
					properties: {
						style: "margin:1em 0;",
					},
					children: figureChildren,
				};

				if (parent && index !== undefined) {
					parent.children[index] = figure;
				}
			}
		});
	};
}
