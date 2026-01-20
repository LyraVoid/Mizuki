import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const dirsToRemove = [
	path.join(rootDir, "dist"),
	path.join(rootDir, "node_modules", ".astro"),
	path.join(rootDir, "node_modules", ".vite"),
];

console.log("Cleaning cache and build artifacts...");

dirsToRemove.forEach((dir) => {
	if (fs.existsSync(dir)) {
		try {
			fs.rmSync(dir, { recursive: true, force: true });
			console.log(`Removed: ${dir}`);
		} catch (e) {
			console.error(`Failed to remove ${dir}:`, e.message);
		}
	} else {
		console.log(`Directory not found (skipped): ${dir}`);
	}
});

console.log("Clean complete.");
