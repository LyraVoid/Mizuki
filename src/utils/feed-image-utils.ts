import path from "node:path";

const CONTENT_ROOT = "/src/content";
const POSTS_ROOT = `${CONTENT_ROOT}/posts`;

export interface FeedPostPathLike {
	id: string;
	filePath?: string;
}

function normalizeFilePath(filePath: string): string {
	const normalized = filePath.replace(/\\/g, "/");
	return normalized.startsWith("/") ? normalized : `/${normalized}`;
}

function getFallbackPostPath(postId: string): string {
	const normalizedId = postId.replace(/\\/g, "/").replace(/^\/+/, "");
	if (/\.(md|mdx|markdown)$/i.test(normalizedId)) {
		return `${POSTS_ROOT}/${normalizedId}`;
	}
	return `${POSTS_ROOT}/${normalizedId}.md`;
}

export function resolvePostContentImageImportPath(
	post: FeedPostPathLike,
	src: string,
): string | null {
	if (!src || src.startsWith("http") || src.startsWith("/")) {
		return null;
	}

	const postPath = post.filePath
		? normalizeFilePath(post.filePath)
		: getFallbackPostPath(post.id);
	const postDir = path.posix.dirname(postPath);
	const resolvedPath = path.posix.normalize(path.posix.join(postDir, src));

	if (!resolvedPath.startsWith(`${CONTENT_ROOT}/`)) {
		return null;
	}

	return resolvedPath;
}
