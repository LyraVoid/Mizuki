import { visit } from "unist-util-visit";

export function rehypeVideoWidth() {
	const regex = / w-([0-9]+)%/;

	return (tree) => {
		visit(tree, "element", (node, index, parent) => {
			if (node.tagName === "video" && node.properties) {
				const props = node.properties;

				let width = props.width;
				let height = props.height;

				// 支援 alt 裡的 w-xx% 語法
				if (props.alt) {
					const match = props.alt.match(regex);
					if (match) {
						width = `${match[1]}%`;
						props.alt = props.alt.replace(regex, "").trim();
					}
				}

				// 移除原本的 width/height 屬性，避免干擾
				delete props.width;
				delete props.height;

				// ✅ 永遠固定 16:9
				props.style =
					"width:100%; height:100%; object-fit:cover; aspect-ratio:16/9;object-fit: contain;display:block;";

				// 外層容器控制寬高
				const wrapper = {
					type: "element",
					tagName: "figure",
					properties: {
						style: `width:${width || "100%"}; height:${height || "150px"}; margin:1em auto; position:relative; overflow:hidden;`,
					},
					children: [node],
				};

				// 如果有 title → 加 figcaption
				if (props.title) {
					const figcaption = {
						type: "element",
						tagName: "figcaption",
						properties: {
							style: "text-align:center; margin-top:0.5em; font-size:0.9em; color:#666;",
						},
						children: [{ type: "text", value: props.title }],
					};
					wrapper.children.push(figcaption);
				}

				if (parent && index !== undefined) {
					parent.children[index] = wrapper;
				}
			}
		});
	};
}
