import { visit } from "unist-util-visit";

const GITHUB_ALERT_DECLARATION_REGEX =
	/^\s*\[!(?<type>[\w-]+)\](?:[ \t]+(?<title>[^\n]+))?\s*$/;

const TYPE_ALIASES = {
	NOTE: "note",
	ABSTRACT: "note",
	SUMMARY: "note",
	TLDR: "note",
	INFO: "note",
	TODO: "note",
	TIP: "tip",
	HINT: "tip",
	IMPORTANT: "important",
	SUCCESS: "tip",
	CHECK: "tip",
	DONE: "tip",
	QUESTION: "important",
	HELP: "important",
	FAQ: "important",
	WARNING: "warning",
	CAUTION: "caution",
	ATTENTION: "warning",
	FAILURE: "caution",
	FAIL: "caution",
	MISSING: "caution",
	DANGER: "caution",
	ERROR: "caution",
	BUG: "caution",
	EXAMPLE: "note",
	QUOTE: "note",
	CITE: "note",
};

function parseGithubAlertDeclaration(text) {
	const match = text.match(GITHUB_ALERT_DECLARATION_REGEX);
	const type = match?.groups?.type?.toUpperCase();
	return type && TYPE_ALIASES[type]
		? { type: TYPE_ALIASES[type], title: match?.groups?.title?.trim() || type }
		: null;
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

			const possibleTypeDeclaration = firstParagraphChild.value.split("\n")[0];
			if (!possibleTypeDeclaration) {
				return;
			}

			const alert = parseGithubAlertDeclaration(possibleTypeDeclaration);
			if (!alert) {
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
				name: alert.type,
				attributes: { title: alert.title },
				children: [...alertParagraphChildren, ...node.children.slice(1)],
			};

			parent.children[index] = directive;
		});
	};
}
