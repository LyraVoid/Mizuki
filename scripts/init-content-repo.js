#!/usr/bin/env node

/**
 * Mizuki 内容仓库初始化脚本
 * 帮助用户快速设置代码内容分离
 */

import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import readline from "readline";
import { fileURLToPath } from "url";
import { loadEnv } from "./load-env.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

loadEnv();
console.log("已加载 .env 配置文件\n");

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

function question(query) {
	return new Promise((resolve) => rl.question(query, resolve));
}

function exec(command, options = {}) {
	try {
		return execSync(command, { stdio: "inherit", ...options });
	} catch (error) {
		console.error(`命令执行失败: ${command}`);
		throw error;
	}
}

async function main() {
	console.log("Mizuki 内容仓库初始化\n");

	console.log("将使用独立仓库模式管理内容\n");

	// 询问内容仓库 URL
	const repoUrl = await question("请输入内容仓库 URL: ");

	if (!repoUrl.trim()) {
		console.error("错误：内容仓库 URL 不能为空！");
		rl.close();
		return;
	}

	// 确认信息
	console.log("\n当前配置：");
	console.log("  模式：独立仓库");
	console.log(`  仓库：${repoUrl.trim()}`);

	const confirm = await question("\n确认初始化？(y/n): ");

	if (confirm.toLowerCase() !== "y") {
		console.log("已取消初始化");
		rl.close();
		return;
	}

	console.log("\n开始初始化...\n");

	// 创建 .env 文件
	const envPath = path.join(rootDir, ".env");
	const envContent = `# Mizuki 内容仓库配置
# 由初始化脚本自动生成

CONTENT_REPO_URL=${repoUrl.trim()}
CONTENT_DIR=./content
`;

	fs.writeFileSync(envPath, envContent);
	console.log("已创建 .env 文件");

	// 同步内容
	console.log("正在同步内容仓库...");
	try {
		exec("pnpm run sync-content", {
			cwd: rootDir,
			env: {
				...process.env,
				CONTENT_REPO_URL: repoUrl.trim(),
			},
		});
		console.log("内容同步成功");
	} catch (error) {
		console.error(
			"内容同步失败。请手动执行：pnpm run sync-content",
		);
	}

	// 提示后续步骤
	console.log("\n初始化完成\n");
	console.log("\n相关文档：");
	console.log("- 内容仓库说明：docs/CONTENT_REPOSITORY.md");
	console.log("- 迁移指南：docs/MIGRATION_GUIDE.md");

	rl.close();
}

main().catch((error) => {
	console.error("初始化失败：", error);
	rl.close();
	process.exit(1);
});
