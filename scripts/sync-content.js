import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { loadEnv } from "./load-env.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

loadEnv();
console.log("Loaded .env configuration file\n");

// 从环境变量读取配置
const ENABLE_CONTENT_SYNC = process.env.ENABLE_CONTENT_SYNC !== "false"; // 默认启用
const CONTENT_REPO_URL = process.env.CONTENT_REPO_URL || "";
const CONTENT_DIR = process.env.CONTENT_DIR || path.join(rootDir, "content");

console.log("Starting content synchronization...\n");

// 检查是否启用内容分离
if (!ENABLE_CONTENT_SYNC) {
	console.log("Content separation is disabled (ENABLE_CONTENT_SYNC=false)");
	console.log(
		"Tip: Local content will be used, will not sync from remote repository",
	);
	console.log("     To enable content separation feature, set in .env:");
	console.log("     ENABLE_CONTENT_SYNC=true");
	console.log("     CONTENT_REPO_URL=<your-repo-url>\n");
	process.exit(0);
}

// 检查内容目录是否存在
if (!fs.existsSync(CONTENT_DIR)) {
	console.log(`Content directory does not exist: ${CONTENT_DIR}`);
	console.log("Using independent repository mode");

	if (!CONTENT_REPO_URL) {
		console.warn("Warning: CONTENT_REPO_URL not set, will use local content");
		console.log(
			"Tip: Please set CONTENT_REPO_URL environment variable or manually create content directory",
		);
		process.exit(0);
	}

	try {
		console.log(`Cloning content repository: ${CONTENT_REPO_URL}`);
		execSync(`git clone --depth 1 ${CONTENT_REPO_URL} ${CONTENT_DIR}`, {
			stdio: "inherit",
			cwd: rootDir,
		});
		console.log("Content repository cloned successfully");
	} catch (error) {
		console.error("Clone failed:", error.message);
		process.exit(1);
	}
} else {
	console.log(`Content directory already exists: ${CONTENT_DIR}`);

	if (fs.existsSync(path.join(CONTENT_DIR, ".git"))) {
		try {
			console.log("Pulling latest content...");
			execSync("git pull --allow-unrelated-histories", {
				stdio: "inherit",
				cwd: CONTENT_DIR,
			});
			console.log("Content updated successfully");
		} catch (error) {
			console.warn("Content update failed:", error.message);
		}
	}
}

// 创建符号链接或复制内容
console.log("\nSetting up content links...");

const contentMappings = [
	{ src: "posts", dest: "src/content/posts" },
	{ src: "spec", dest: "src/content/spec" },
	{ src: "data", dest: "src/data" },
	{ src: "images", dest: "public/images" },
];

for (const mapping of contentMappings) {
	const srcPath = path.join(CONTENT_DIR, mapping.src);
	const destPath = path.join(rootDir, mapping.dest);

	if (!fs.existsSync(srcPath)) {
		console.log(`Skipping non-existent source: ${mapping.src}`);
		continue;
	}

	// 如果目标已存在且不是符号链接,备份它
	if (fs.existsSync(destPath) && !fs.lstatSync(destPath).isSymbolicLink()) {
		const backupPath = `${destPath}.backup`;
		console.log(
			`Backing up existing content: ${mapping.dest} -> ${mapping.dest}.backup`,
		);
		if (fs.existsSync(backupPath)) {
			fs.rmSync(backupPath, { recursive: true, force: true });
		}
		fs.renameSync(destPath, backupPath);
	}

	// 删除现有的符号链接
	if (fs.existsSync(destPath)) {
		fs.unlinkSync(destPath);
	}

	// 创建符号链接 (Windows 需要管理员权限,否则复制文件)
	try {
		const relPath = path.relative(path.dirname(destPath), srcPath);
		fs.symlinkSync(relPath, destPath, "junction");
		console.log(`Created symbolic link: ${mapping.dest} -> ${mapping.src}`);
	} catch (error) {
		console.log(`Copying content: ${mapping.src} -> ${mapping.dest}`);
		copyRecursive(srcPath, destPath);
	}
}

console.log("\nContent synchronization completed\n");

// 递归复制函数
function copyRecursive(src, dest) {
	if (fs.statSync(src).isDirectory()) {
		if (!fs.existsSync(dest)) {
			fs.mkdirSync(dest, { recursive: true });
		}
		const files = fs.readdirSync(src);
		for (const file of files) {
			copyRecursive(path.join(src, file), path.join(dest, file));
		}
	} else {
		fs.copyFileSync(src, dest);
	}
}
