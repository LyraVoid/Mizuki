/**
 * 字体压缩入口
 *
 * 模块结构：
 *   utils.js          — 共享工具函数（文件遍历、字符串提取、Markdown 解析）
 *   config-parser.js  — 配置解析（单次读取 siteConfig.ts，缓存后分发）
 *   text-collector.js — 文本采集（8 个来源：本地文件 + 3 个远程 API + 常用字符）
 *   font-compressor.js— 字体压缩（Fontmin 子集化 + ttf→woff2 转换）
 *   css-rewriter.js   — CSS 重写（dist/ 中 ttf 引用替换为 woff2）
 *   index.js          — 入口（串联 compress → rewrite）
 */

import { compressFonts } from "./font-compressor.js";
import { updateCssFontReferences } from "./css-rewriter.js";

compressFonts().then(() => updateCssFontReferences());
