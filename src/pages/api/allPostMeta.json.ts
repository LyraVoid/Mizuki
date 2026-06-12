import { getSortedPosts } from "@/utils/content-utils";
import { getPostPublicDescription } from "@/utils/post-card-content";

export async function GET() {
	const posts = await getSortedPosts();

	const allPostsData = posts
		.map((post) => ({
			id: post.id,
			title: post.data.title,
			description: getPostPublicDescription(post.data),
			published: post.data.published.getTime(),
			category: post.data.category || "",
			password: !!post.data.password,
		}))
		// 按发布日期降序排列
		.sort((a, b) => b.published - a.published);

	return new Response(JSON.stringify(allPostsData), {
		headers: { "Content-Type": "application/json" },
	});
}
