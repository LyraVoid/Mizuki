import { visit } from "unist-util-visit";

export function rehypeImageWidth() {
	const regex = / w-([0-9]+)%/;

	return (tree) => {
		visit(tree, "element", (node, index, parent) => {
			if (
				node.tagName === "img" &&
				node.properties &&
				node.properties.alt
			) {
				const alt = node.properties.alt;
				const match = alt.match(regex);

				if (match) {
					const width = match[1];
					node.properties.alt = alt.replace(regex, "").trim();
					node.properties.style = `width: ${width}%; display: block; margin: 0 auto;`;
					// Remove width and height attributes if they were set by Astro optimization
					delete node.properties.width;
					delete node.properties.height;

					const figureChildren = [node];

					if (node.properties.title) {
						const figcaption = {
							type: "element",
							tagName: "figcaption",
							properties: {
								style: "text-align: center; margin-top: 0.5em; font-size: 0.9em; color: #666;",
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
							style: "margin: 1em 0;",
						},
						children: figureChildren,
					};

					if (parent && index !== undefined) {
						parent.children[index] = figure;
					}
				}
			}
		});
	};
}
