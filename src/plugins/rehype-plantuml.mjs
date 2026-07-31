import { h } from "hastscript";
import { visit } from "unist-util-visit";

let diagramSequence = 0;

function hasClass(node, className) {
	const value = node.properties?.className;
	return Array.isArray(value)
		? value.includes(className)
		: String(value ?? "")
				.split(/\s+/)
				.includes(className);
}

export function rehypePlantuml() {
	return (tree) => {
		visit(tree, "element", (node) => {
			if (node.tagName !== "div" || !hasClass(node, "plantuml-source")) return;
			const light =
				node.properties.dataPlantumlLight ||
				node.properties["data-plantuml-light"];
			const dark =
				node.properties.dataPlantumlDark ||
				node.properties["data-plantuml-dark"] ||
				light;
			const alt =
				node.properties.dataPlantumlAlt ||
				node.properties["data-plantuml-alt"] ||
				"PlantUML diagram";
			if (!light) return;
			node.properties = {
				className: ["diagram-container", "plantuml-diagram-container"],
				dataDiagramId: `plantuml-${diagramSequence++}`,
			};
			node.children = [
				h("div", { class: "diagram-wrapper plantuml-wrapper" }, [
					h("img", {
						class: "plantuml-image",
						src: light,
						alt,
						dataLightSrc: light,
						dataDarkSrc: dark,
						loading: "lazy",
						decoding: "async",
					}),
				]),
			];
		});
	};
}
