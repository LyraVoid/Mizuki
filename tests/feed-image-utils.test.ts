import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { resolvePostContentImageImportPath } from "../src/utils/feed-image-utils.ts";

describe("resolvePostContentImageImportPath", () => {
	it("keeps the parent directory for nested index posts", () => {
		const resolved = resolvePostContentImageImportPath(
			{
				id: "guide",
				filePath: "src/content/posts/guide/index.md",
			},
			"./cover.webp",
		);

		assert.equal(resolved, "/src/content/posts/guide/cover.webp");
	});

	it("resolves bare filenames relative to the post directory", () => {
		const resolved = resolvePostContentImageImportPath(
			{
				id: "guide",
				filePath: "src/content/posts/guide/index.md",
			},
			"cover.webp",
		);

		assert.equal(resolved, "/src/content/posts/guide/cover.webp");
	});

	it("normalizes Windows file separators before resolving", () => {
		const resolved = resolvePostContentImageImportPath(
			{
				id: "nested/guide",
				filePath: "src\\content\\posts\\nested\\guide\\index.md",
			},
			"../shared/cover.webp",
		);

		assert.equal(resolved, "/src/content/posts/nested/shared/cover.webp");
	});

	it("rejects paths that escape the content root", () => {
		const resolved = resolvePostContentImageImportPath(
			{
				id: "guide",
				filePath: "src/content/posts/guide/index.md",
			},
			"../../../outside.webp",
		);

		assert.equal(resolved, null);
	});
});
