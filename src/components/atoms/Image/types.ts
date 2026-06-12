import type { ImageFormat, ResponsiveImageLayout } from "../../../types/config";

export interface ImageProps {
	id?: string;
	src: string;
	class?: string;
	alt?: string;
	position?: string;
	basePath?: string;
	loading?: "eager" | "lazy";
	fetchpriority?: "high" | "low" | "auto";
	// 响应式图像属性
	layout?: ResponsiveImageLayout;
	usePicture?: boolean;
	formats?: ImageFormat[];
	widths?: number[];
	sizes?: string;
	quality?: number;
}
