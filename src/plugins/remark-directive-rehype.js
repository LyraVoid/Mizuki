import { h } from "hastscript";
import { visit } from "unist-util-visit";

export function oldparseDirectiveNode() {
	return (tree, { _data }) => {
		visit(tree, (node) => {
			if (
				node.type === "containerDirective" ||
				node.type === "leafDirective" ||
				node.type === "textDirective"
			) {
				// biome-ignore lint/suspicious/noAssignInExpressions: <check later>
				const data = node.data || (node.data = {});
				node.attributes = node.attributes || {};
				if (
					node.children.length > 0 &&
					node.children[0].data &&
					node.children[0].data.directiveLabel
				) {
					// Add a flag to the node to indicate that it has a directive label
					node.attributes["has-directive-label"] = true;
				}

				const hast = h(node.name, node.attributes);

				data.hName = hast.tagName;
				data.hProperties = hast.properties;
			}
		});
	};
}

export function parseDirectiveNode() {
	return (tree) => {
		visit(tree, (node) => {
			if (
				node.type === "containerDirective" ||
				node.type === "leafDirective" ||
				node.type === "textDirective"
			) {
				const data = node.data || (node.data = {});
				node.attributes = node.attributes || {};

				// 保留原有功能：標記 directive label
				if (
					node.children.length > 0 &&
					node.children[0].data &&
					node.children[0].data.directiveLabel
				) {
					node.attributes["has-directive-label"] = true;
				}

				data.hName = node.name;
				data.hProperties = node.attributes;

				// 新增：把 label 轉成 children
				if (node.label) {
					data.hChildren = [{ type: "text", value: node.label }];
				}

				console.log("DirectiveNode:", node);
			}
		});
	};
}
