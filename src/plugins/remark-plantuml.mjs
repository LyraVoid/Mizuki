import { visit } from "unist-util-visit";
import {
	encodePlantUML,
	injectPlantUMLTheme,
	plantUMLUrl,
} from "./plantuml-encoder.mjs";

export function remarkPlantuml(options = {}) {
	return (tree) => {
		if (options.enable === false) return;
		visit(tree, "code", (node) => {
			if (
				String(node.lang).toLowerCase() !== "plantuml" ||
				!node.value?.trim()
			) {
				return;
			}
			const lightSource = injectPlantUMLTheme(
				node.value,
				options.lightTheme ?? "",
			);
			const darkSource = injectPlantUMLTheme(
				node.value,
				options.darkTheme ?? "",
			);
			const server = options.server || "https://www.plantuml.com/plantuml";
			const lightUrl = plantUMLUrl(server, encodePlantUML(lightSource));
			const darkUrl =
				lightSource === darkSource
					? lightUrl
					: plantUMLUrl(server, encodePlantUML(darkSource));
			node.type = "plantuml";
			node.data = {
				hName: "div",
				hProperties: {
					className: ["plantuml-source"],
					dataPlantumlLight: lightUrl,
					dataPlantumlDark: darkUrl,
					dataPlantumlAlt: node.value.slice(0, 200),
				},
				hChildren: [{ type: "text", value: node.value }],
			};
			delete node.value;
		});
	};
}
