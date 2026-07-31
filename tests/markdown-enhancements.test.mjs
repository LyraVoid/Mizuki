import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { describe, it } from "node:test";

import katex from "katex";
import "katex/dist/contrib/mhchem.mjs";

import {
	encodePlantUML,
	injectPlantUMLTheme,
	plantUMLUrl,
} from "../src/plugins/plantuml-encoder.mjs";
import { remarkAutoImageGrid } from "../src/plugins/remark-auto-image-grid.mjs";
import { remarkFixGithubAdmonitions } from "../src/plugins/remark-fix-github-admonitions.js";
import { remarkPlantuml } from "../src/plugins/remark-plantuml.mjs";
import { remarkWikiLink } from "../src/plugins/remark-wiki-link.mjs";
import {
	readCodeCollapseConfig,
	shouldAutoCollapse,
} from "../src/scripts/code-collapse.js";

describe("KaTeX mhchem integration", () => {
	it("uses one KaTeX version and renders chemical equations", () => {
		const require = createRequire(import.meta.url);
		const rehypeRequire = createRequire(require.resolve("rehype-katex"));
		assert.equal(rehypeRequire.resolve("katex"), require.resolve("katex"));

		const source = `${String.fromCharCode(92)}ce{H2O + CO2 -> H2CO3}`;
		const html = katex.renderToString(source, { throwOnError: true });
		assert.doesNotMatch(html, /#cc0000/);
		assert.match(html, /x-arrow|mathvariant="normal"/);
	});
});

describe("Automatic code block collapse", () => {
	it("reads validated settings and only collapses blocks at the threshold", () => {
		const config = readCodeCollapseConfig({
			dataset: {
				codeCollapseEnabled: "true",
				codeCollapseLineThreshold: "20",
				codeCollapsePreviewLines: "10",
				codeCollapseDefaultCollapsed: "true",
			},
		});
		assert.equal(shouldAutoCollapse(19, config), false);
		assert.equal(shouldAutoCollapse(20, config), true);
		assert.equal(config.previewLines, 10);
		assert.equal(config.defaultCollapsed, true);
	});
});

describe("PlantUML markdown pipeline", () => {
	it("encodes source and injects a theme after @startuml", () => {
		const source = "@startuml\nAlice -> Bob\n@enduml";
		const themed = injectPlantUMLTheme(source, "cyborg");
		assert.match(themed, /^@startuml\n!theme cyborg\n/);
		const encoded = encodePlantUML(themed);
		assert.match(encoded, /^[0-9A-Za-z_-]+$/);
		assert.equal(
			plantUMLUrl("https://plantuml.example/", encoded),
			`https://plantuml.example/svg/${encoded}`,
		);
	});

	it("converts plantuml fences to diagram source nodes", () => {
		const tree = {
			type: "root",
			children: [
				{ type: "code", lang: "plantuml", value: "@startuml\nA -> B\n@enduml" },
			],
		};
		remarkPlantuml({
			server: "https://plantuml.example",
			darkTheme: "cyborg",
		})(tree);
		assert.equal(tree.children[0].type, "plantuml");
		assert.match(
			tree.children[0].data.hProperties.dataPlantumlLight,
			/^https:\/\/plantuml\.example\/svg\//,
		);
	});
});

describe("Markdown AST enhancements", () => {
	it("groups consecutive standalone images", () => {
		const image = (url) => ({
			type: "paragraph",
			children: [{ type: "image", url, alt: "" }],
		});
		const tree = {
			type: "root",
			children: [
				image("/a.png"),
				image("/b.png"),
				{ type: "paragraph", children: [] },
			],
		};
		remarkAutoImageGrid({ minImages: 2, maxColumns: 4 })(tree);
		assert.equal(tree.children[0].type, "containerDirective");
		assert.equal(tree.children[0].name, "grid");
		assert.equal(tree.children[0].attributes.columns, "2");
		assert.equal(tree.children[0].children.length, 2);
	});

	it("groups adjacent image lines parsed into one paragraph", () => {
		const tree = {
			type: "root",
			children: [
				{
					type: "paragraph",
					children: [
						{ type: "image", url: "/a.png", alt: "" },
						{ type: "text", value: "\n" },
						{ type: "image", url: "/b.png", alt: "" },
					],
				},
			],
		};
		remarkAutoImageGrid({ minImages: 2, maxColumns: 4 })(tree);
		assert.equal(tree.children[0].name, "grid");
		assert.equal(tree.children[0].attributes.columns, "2");
	});

	it("supports extended GitHub/Obsidian callout aliases and titles", () => {
		const tree = {
			type: "root",
			children: [
				{
					type: "blockquote",
					children: [
						{
							type: "paragraph",
							children: [
								{ type: "text", value: "[!BUG] Known issue\nDetails" },
							],
						},
					],
				},
			],
		};
		remarkFixGithubAdmonitions()(tree);
		assert.equal(tree.children[0].type, "containerDirective");
		assert.equal(tree.children[0].name, "caution");
		assert.equal(tree.children[0].attributes.title, "Known issue");
	});

	it("turns standalone wiki links into post cards and inline links into links", () => {
		const tree = {
			type: "root",
			children: [
				{
					type: "paragraph",
					children: [{ type: "text", value: "[[markdown-extended]]" }],
				},
				{
					type: "paragraph",
					children: [
						{
							type: "text",
							value: "See [[markdown-extended|extended syntax]].",
						},
					],
				},
			],
		};
		remarkWikiLink()(tree);
		assert.equal(tree.children[0].data.hName, "a");
		assert.match(tree.children[0].data.hProperties.class, /card-wiki-link/);
		assert.equal(tree.children[1].children[1].type, "link");
		assert.equal(
			tree.children[1].children[1].children[0].value,
			"extended syntax",
		);
	});
});
