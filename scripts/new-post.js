/* This is a script to create a new post markdown file with front-matter */

import fs from "fs";
import path from "path";

function getDate() {
	const today = new Date();
	const year = today.getFullYear();
	const month = String(today.getMonth() + 1).padStart(2, "0");
	const day = String(today.getDate()).padStart(2, "0");

	return `${year}-${month}-${day}`;
}

const args = process.argv.slice(2);

if (args.length === 0) {
	console.error(`Error: No filename argument provided
Usage: npm run new-post -- <filename>`);
	process.exit(1); // Terminate the script and return error code 1
}

const postName = args[0].replace(/\.(md|mdx)$/i, "");
const targetDir = "./src/content/posts/";
const postDir = path.join(targetDir, postName);
const fullPath = path.join(postDir, "index.md");
const legacyPaths = [`${postDir}.md`, `${postDir}.mdx`];

if (fs.existsSync(fullPath) || legacyPaths.some((filePath) => fs.existsSync(filePath))) {
	console.error(`Error: Post ${postName} already exists`);
	process.exit(1);
}

// recursive mode creates multi-level directories
if (!fs.existsSync(postDir)) {
	fs.mkdirSync(postDir, { recursive: true });
}

const content = `---
title: ${path.basename(postName)}
published: ${getDate()}
description: ''
image: ''
tags: []
category: ''
draft: false
lang: ''
---
`;

fs.writeFileSync(fullPath, content);

console.log(`Post ${fullPath} created`);
