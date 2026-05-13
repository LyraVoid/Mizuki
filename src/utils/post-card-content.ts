export const ENCRYPTED_POST_HOME_CONTENT = "该文章已加密";

export interface PostHomeContentData {
	description?: string;
	hideHomeContent?: boolean;
	password?: string | null;
}

function hasPassword(password?: string | null): boolean {
	return typeof password === "string" && password.length > 0;
}

export function shouldHidePostHomeContent(
	data: PostHomeContentData,
): boolean {
	return data.hideHomeContent ?? hasPassword(data.password);
}

export function getPostHomeContent(
	data: PostHomeContentData,
	excerpt: string,
): string {
	return getPostPublicDescription(data, excerpt);
}

export function getPostPublicDescription(
	data: PostHomeContentData,
	fallback = "",
): string {
	if (shouldHidePostHomeContent(data)) {
		return ENCRYPTED_POST_HOME_CONTENT;
	}

	return data.description || fallback;
}
