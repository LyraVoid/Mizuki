import * as fs from "node:fs";
import * as path from "node:path";
import type { AlbumGroup, Photo, Video } from "../types/album";

export async function scanAlbums(): Promise<AlbumGroup[]> {
	const albumsDir = path.join(process.cwd(), "public/images/albums");
	const albums: AlbumGroup[] = [];

	// 检查目录是否存在
	if (!fs.existsSync(albumsDir)) {
		console.warn("相册目录不存在:", albumsDir);
		return [];
	}

	// 获取所有子文件夹
	const albumFolders = fs
		.readdirSync(albumsDir, { withFileTypes: true })
		.filter((dirent) => dirent.isDirectory())
		.map((dirent) => dirent.name);

	// 处理每个相册文件夹
	for (const folder of albumFolders) {
		const albumPath = path.join(albumsDir, folder);
		const album = await processAlbumFolder(albumPath, folder);
		if (album) {
			albums.push(album);
		}
	}

	return albums;
}

async function processAlbumFolder(
	folderPath: string,
	folderName: string,
): Promise<AlbumGroup | null> {
	// 检查必要文件
	const infoPath = path.join(folderPath, "info.json");

	if (!fs.existsSync(infoPath)) {
		console.warn(`相册 ${folderName} 缺少 info.json 文件`);
		return null;
	}

	// 读取相册信息
	const infoContent = fs.readFileSync(infoPath, "utf-8");
	let info: Record<string, any>;
	try {
		info = JSON.parse(infoContent);
	} catch (e) {
		console.error(`相册 ${folderName} 的 info.json 格式错误:`, e);
		return null;
	}

	// 检查是否为外链模式
	const isExternalMode = info.mode === "external";
	let photos: Photo[] = [];
	var videos: Video[] = [];
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
		// 本地模式：检查本地文件
		const coverPath = path.join(folderPath, "cover.jpg");
		if (!fs.existsSync(coverPath)) {
			console.warn(`相册 ${folderName} 缺少 cover.jpg 文件`);
			return null;
		}

		cover = `/images/albums/${folderName}/cover.jpg`;

		// ✅ 一次呼叫 scanMedia，解構出 photos 和 videos
		console.log(folderName);
		const media = scanMedia(folderPath, folderName);
		photos = media.photos;

		videos = media.videos;
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
		layout: info.layout || "grid",
		columns: info.columns || 3,
		photos,
		videos,
	};
}

function scanPhotos(folderPath: string, albumId: string): Photo[] {
	const photos: Photo[] = [];
	const files = fs.readdirSync(folderPath);

	// 过滤出图片文件
	const imageFiles = files.filter((file) => {
		const ext = path.extname(file).toLowerCase();
		return (
			[
				".jpg",
				".jpeg",
				".png",
				".gif",
				".webp",
				".svg",
				".avif",
				".bmp",
				".tiff",
				".tif",
			].includes(ext) && file !== "cover.jpg"
		);
	});

	// 处理每张照片
	imageFiles.forEach((file, index) => {
		const filePath = path.join(folderPath, file);
		const stats = fs.statSync(filePath);

		// 解析文件名中的标签
		const { baseName, tags } = parseFileName(file);

		photos.push({
			id: `${albumId}-photo-${index}`,
			src: `/images/albums/${albumId}/${file}`,
			alt: baseName,
			title: baseName,
			tags: tags,
			date: stats.mtime.toISOString().split("T")[0],
		});
	});

	return photos;
}

function scanVideos(folderPath: string, albumId: string): Video[] {
	const videos: Video[] = [];
	const files = fs.readdirSync(folderPath);

	// 過濾出影片檔案
	const videoFiles = files.filter((file) => {
		const ext = path.extname(file).toLowerCase();
		return [
			".mp4",
			".webm",
			".ogg",
			".mov",
			".mkv",
			".avi",
			".flv",
		].includes(ext);
	});

	// 處理每個影片
	videoFiles.forEach((file, index) => {
		const filePath = path.join(folderPath, file);
		const stats = fs.statSync(filePath);

		// 解析檔名中的標籤
		const { baseName, tags } = parseFileName(file);

		videos.push({
			id: `${albumId}-video-${index}`,
			src: `/videos/albums/${albumId}/${file}`, // ✅ 專門給 VideoComponent 用的路徑
			alt: baseName, // 可作為 aria-label 或 figcaption
			title: baseName,
			tags: tags,
			date: stats.mtime.toISOString().split("T")[0],
		});
	});

	return videos;
}

function scanMedia(
	folderPath: string,
	albumId: string,
): { photos: Photo[]; videos: Video[]; cover?: string } {
	const photos: Photo[] = [];
	const videos: Video[] = [];
	let cover: string | undefined;

	const files = fs.readdirSync(folderPath);

	files.forEach((file) => {
		const ext = path.extname(file).toLowerCase();
		const filePath = path.join(folderPath, file);
		const stats = fs.statSync(filePath);

		const { baseName, tags } = parseFileName(file);

		// 封面檔案處理
		if (file === "cover.jpg") {
			cover = `/images/albums/${albumId}/cover.jpg`;
			return;
		}
		if (file === "cover.mp4") {
			cover = `/videos/albums/${albumId}/cover.mp4`;
			return;
		}

		// 圖片
		if (
			[
				".jpg",
				".jpeg",
				".png",
				".gif",
				".webp",
				".svg",
				".avif",
				".bmp",
				".tiff",
				".tif",
			].includes(ext)
		) {
			photos.push({
				id: `${albumId}-photo-${photos.length}`,
				src: `/images/albums/${albumId}/${file}`, // ✅ 已經更正成 public 路徑
				alt: baseName,
				title: baseName,
				tags,
				date: stats.mtime.toISOString().split("T")[0],
			});
		}

		// 影片
		if (
			[".mp4", ".webm", ".ogg", ".mov", ".mkv", ".avi", ".flv"].includes(
				ext,
			)
		) {
			videos.push({
				id: `${albumId}-video-${videos.length}`,
				src: `/videos/albums/${albumId}/${file}`, // ✅ 已經更正成 public 路徑
				alt: baseName,
				title: baseName,
				tags,
				date: stats.mtime.toISOString().split("T")[0],
			});
		}
	});

	return { photos, videos, cover };
}

function processExternalPhotos(
	externalPhotos: any[],
	albumId: string,
): Photo[] {
	const photos: Photo[] = [];

	externalPhotos.forEach((photo, index) => {
		if (!photo.src) {
			console.warn(
				`相册 ${albumId} 的第 ${index + 1} 张照片缺少 src 字段`,
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
			// camera: photo.camera,
			// lens: photo.lens,
			// settings: photo.settings,
		});
	});

	return photos;
}

function parseFileName(fileName: string): { baseName: string; tags: string[] } {
	// 匹配文件名中的标签，格式为：文件名_标签1_标签2.扩展名
	const parts = path.basename(fileName, path.extname(fileName)).split("_");

	if (parts.length > 1) {
		// 第一部分作为基本名称，其余部分作为标签
		const baseName = parts.slice(0, -2).join("_");
		const tags = parts.slice(-2);
		return { baseName, tags };
	}

	// 如果没有标签，返回不带扩展名的文件名
	const baseName = path.basename(fileName, path.extname(fileName));
	return { baseName, tags: [] };
}
