import { visit } from "unist-util-visit";

export function rehypeWrapTable() {
	return (tree) => {
		visit(tree, "element", (node, index, parent) => {
			if (node.tagName === "table" && parent) {
				// 创建包装器 div
				const wrapper = {
					type: "element",
					tagName: "div",
					properties: {
						className: ["table-wrapper"],
					},
					children: [node],
				};

				// 替换原始的 table 节点
				parent.children[index] = wrapper;
			}
		});
	};
}
