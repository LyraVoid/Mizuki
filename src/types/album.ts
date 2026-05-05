export interface Photo {
	id?: string;
	src: string;
	alt?: string;
	title?: string;
	thumbnail?: string;
	tags?: string[];
	description?: string;
	date?: string;
	location?: string;
	width?: number;
	height?: number;
}

export interface Video {
	id: string;
	src: string;
	title: string;
	alt: string;
	tags: string[];
	date: string;
}

export interface AlbumGroup {
	id: string;
	title: string;
	description?: string;
	cover: string;
	date: string;
	location?: string;
	tags?: string[];
	layout?: "grid" | "masonry";
	columns?: number;
	photos: Photo[];
	videos: Video[];
}
