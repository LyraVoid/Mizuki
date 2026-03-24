import { visit } from "unist-util-visit";

const GITHUB_ALERT_DECLARATION_REGEX = /^\s*\[\!(?<type>\w+)\]\s*$/;
const GITHUB_ALERT_TYPES = ["NOTE", "TIP", "IMPORTANT", "WARNING", "CAUTION"];

function parseGithubAlertDeclaration(text) {
	const match = text.match(GITHUB_ALERT_DECLARATION_REGEX);
	const type = match?.groups?.type?.toUpperCase();
	return GITHUB_ALERT_TYPES.includes(type) ? type : null;
}

export function remarkFixGithubAdmonitions() {
	return (tree) => {
		visit(tree, "blockquote", (node, index, parent) => {
			if (!parent || index === undefined) {
				return;
			}

			const firstChild = node.children[0];
			if (firstChild?.type !== "paragraph") {
				return;
			}

			const firstParagraphChild = firstChild.children[0];
			if (firstParagraphChild?.type !== "text") {
				return;
			}

			const possibleTypeDeclaration =
				firstParagraphChild.value.split("\n")[0];
			if (!possibleTypeDeclaration) {
				return;
			}

			const type = parseGithubAlertDeclaration(possibleTypeDeclaration);
			if (!type) {
				return;
			}

			const typeToDirectiveName = {
				NOTE: "note",
				TIP: "tip",
				IMPORTANT: "important",
				WARNING: "warning",
				CAUTION: "caution",
			};

			const directiveName = typeToDirectiveName[type];
			if (!directiveName) {
				return;
			}

			const textNodeChildren =
				firstParagraphChild.value.split("\n").length > 1
					? [
							{
								type: "text",
								value: firstParagraphChild.value
									.split("\n")
									.slice(1)
									.join("\n"),
							},
						]
					: [];

			const paragraphChildren = [
				...textNodeChildren,
				...firstChild.children.slice(1),
			];

			const alertParagraphChildren =
				paragraphChildren.length > 0
					? [{ type: "paragraph", children: paragraphChildren }]
					: [];

			const directive = {
				type: "containerDirective",
				name: directiveName,
				children: [
					...alertParagraphChildren,
					...node.children.slice(1),
				],
			};

			parent.children[index] = directive;
		});
	};
}
