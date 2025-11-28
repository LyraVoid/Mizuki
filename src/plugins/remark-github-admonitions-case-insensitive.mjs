import { visit } from "unist-util-visit";

/**
 * A remark plugin that normalizes GitHub alert syntax to uppercase.
 * This ensures case-insensitive matching (e.g., [!tip], [!Tip], [!TIP] all work).
 * Must run before remark-github-admonitions-to-directives.
 */
export function remarkGithubAdmonitionsCaseInsensitive() {
	return (tree) => {
		visit(tree, "blockquote", (node) => {
			const firstChild = node.children?.[0];
			if (firstChild?.type !== "paragraph") return;

			const firstParagraphChild = firstChild.children?.[0];
			if (firstParagraphChild?.type !== "text") return;

			// Match GitHub alert syntax: [!TYPE] where TYPE is case-insensitive
			const alertRegex = /^\s*\[\!(\w+)\]\s*$/;
			const lines = firstParagraphChild.value.split("\n");
			const match = lines[0]?.match(alertRegex);

			if (match) {
				// Normalize the alert type to uppercase
				const normalizedType = match[1].toUpperCase();
				lines[0] = lines[0].replace(
					alertRegex,
					(_, type) => `[!${normalizedType}]`,
				);
				firstParagraphChild.value = lines.join("\n");
			}
		});
	};
}
