import type { AlbumGroup, Photo } from "../types/album";

// 使用 import.meta.glob 替代 fs，支持 Cloudflare Workers
const albumModules = import.meta.glob<{ default: Record<string, any> }>(
	"/public/images/albums/*/info.json",
	{ eager: true }
);

// 获取所有相册图片
const imageModules = import.meta.glob<ImageMetadata>(
	"/public/images/albums/**/*.{jpg,jpeg,png,gif,webp}",
	{ eager: true, import: "default" }
);

export async function scanAlbums(): Promise<AlbumGroup[]> {
	const albums: AlbumGroup[] = [];

	// 处理每个相册
	for (const [path, module] of Object.entries(albumModules)) {
		// 从路径中提取相册文件夹名
		const match = path.match(/\/public\/images\/albums\/([^/]+)\/info\.json$/);
		if (!match) continue;

		const folderName = match[1];
		const album = await processAlbumFolder(folderName, module.default);
		if (album) {
			albums.push(album);
		}
	}

	// 按日期排序
	albums.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

	return albums;
}

async function processAlbumFolder(
	folderName: string,
	info: Record<string, any>
): Promise<AlbumGroup | null> {
	// 检查是否为外链模式
	const isExternalMode = info.mode === "external";
	let photos: Photo[] = [];
	let cover: string;

	if (isExternalMode) {
		// 外链模式：从 info.json 中获取封面和照片
		if (!info.cover) {
			console.warn(`相册 ${folderName} 外链模式缺少 cover 字段`);
			return null;
		}

		cover = info.cover;
		photos = processExternalPhotos(info.photos || [], folderName);
	} else {
		// 本地模式：从 import.meta.glob 结果中获取图片
		const albumImages = Object.entries(imageModules).filter(([path]) =>
			path.includes(`/public/images/albums/${folderName}/`)
		);

		// 查找封面
		const coverEntry = albumImages.find(([path]) =>
			path.endsWith("cover.webp") || path.endsWith("cover.jpg")
		);

		if (!coverEntry) {
			console.warn(`相册 ${folderName} 缺少 cover 文件`);
			return null;
		}

		const coverPath = coverEntry[0];
		cover = coverPath.includes("cover.webp")
			? `/images/albums/${folderName}/cover.webp`
			: `/images/albums/${folderName}/cover.jpg`;

		photos = scanPhotos(albumImages, folderName);
	}

	// 检查是否隐藏相册
	if (info.hidden === true) {
		console.log(`相册 ${folderName} 已设置为隐藏，跳过显示`);
		return null;
	}

	// 构建相册对象
	return {
		id: folderName,
		title: info.title || folderName,
		description: info.description || "",
		cover,
		date: info.date || new Date().toISOString().split("T")[0],
		location: info.location || "",
		tags: info.tags || [],
		photos,
	};
}

function scanPhotos(
	albumImages: [string, ImageMetadata][],
	albumId: string
): Photo[] {
	const photos: Photo[] = [];

	// 过滤掉封面文件
	const imageFiles = albumImages.filter(([path]) => {
		const fileName = path.split("/").pop();
		return fileName && fileName !== "cover.webp" && fileName !== "cover.jpg";
	});

	// 创建 WebP 映射
	const fileWebpMap = new Map<string, string>();
	for (const [path, metadata] of imageFiles) {
		const fileName = path.split("/").pop() || "";
		const baseName = fileName.replace(/\.(jpg|jpeg|png|gif|webp)$/i, "");
		const ext = fileName.split(".").pop()?.toLowerCase();

		if (ext === "jpg" || ext === "jpeg" || ext === "png") {
			const webpPath = path.replace(/\.(jpg|jpeg|png)$/i, ".webp");
			if (imageFiles.some(([p]) => p === webpPath)) {
				fileWebpMap.set(fileName, baseName + ".webp");
			}
		}
	}

	imageFiles.forEach(([path, metadata], index) => {
		const fileName = path.split("/").pop() || "";
		const { baseName, tags } = parseFileName(fileName);

		const src = fileWebpMap.has(fileName)
			? `/images/albums/${albumId}/${fileWebpMap.get(fileName)}`
			: `/images/albums/${albumId}/${fileName}`;

		photos.push({
			id: `${albumId}-photo-${index}`,
			src,
			alt: baseName,
			title: baseName,
			tags: tags,
			date: new Date().toISOString().split("T")[0], // 使用当前日期，因为无法获取文件 stats
		});
	});

	return photos;
}

function processExternalPhotos(
	externalPhotos: any[],
	albumId: string
): Photo[] {
	const photos: Photo[] = [];

	externalPhotos.forEach((photo, index) => {
		if (!photo.src) {
			console.warn(
				`相册 ${albumId} 的第 ${index + 1} 张照片缺少 src 字段`
			);
			return;
		}

		photos.push({
			id: photo.id || `${albumId}-external-photo-${index}`,
			src: photo.src,
			thumbnail: photo.thumbnail,
			alt: photo.alt || photo.title || `Photo ${index + 1}`,
			title: photo.title,
			description: photo.description,
			tags: photo.tags || [],
			date: photo.date || new Date().toISOString().split("T")[0],
			location: photo.location,
			width: photo.width,
			height: photo.height,
		});
	});

	return photos;
}

function parseFileName(fileName: string): { baseName: string; tags: string[] } {
	// 移除扩展名
	const nameWithoutExt = fileName.replace(/\.(jpg|jpeg|png|gif|webp)$/i, "");

	// 匹配文件名中的标签，格式为：文件名_标签1_标签2.扩展名
	const parts = nameWithoutExt.split("_");

	if (parts.length > 1) {
		// 第一部分作为基本名称，其余部分作为标签
		const baseName = parts.slice(0, -2).join("_");
		const tags = parts.slice(-2);
		return { baseName, tags };
	}

	// 如果没有标签，返回不带扩展名的文件名
	return { baseName: nameWithoutExt, tags: [] };
}
