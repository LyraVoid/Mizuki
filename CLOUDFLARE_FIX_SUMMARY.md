# Cloudflare Pages 部署问题总结

## 问题分析

从最新的构建日志发现，Cloudflare Pages 自动应用了 `@astrojs/cloudflare` 适配器，导致：

1. **构建模式冲突**：项目配置为 `output: "static"`，但 Cloudflare 强制使用 Workers 模式
2. **组件导出错误**：Vite 扫描依赖时无法识别 Astro 组件的默认导出
3. **图片路径错误**：`Image.astro` 组件的路径解析出现问题

## 根本原因

Cloudflare Pages 的 Astro 集成自动添加了 `@astrojs/cloudflare` 适配器，这与项目的静态站点配置冲突。

## 解决方案

### 方案 1：使用 Cloudflare Pages 的直接上传功能（推荐）

不通过 Git 集成，而是手动上传构建好的静态文件：

1. 本地构建：`pnpm run build`
2. 在 Cloudflare Pages 控制台选择 **"直接上传"**
3. 上传 `dist` 文件夹

### 方案 2：禁用 Cloudflare 的自动适配器

在 Cloudflare Pages 项目设置中：

1. 进入 **"构建设置"**
2. 将 **"框架预设"** 从 "Astro" 改为 **"None"**（无）
3. 手动设置：
   - 构建命令：`pnpm run build`
   - 构建输出目录：`dist`

### 方案 3：修改代码以支持 Cloudflare Workers

这需要大量修改，包括：
- 修复组件导出方式
- 修复图片路径处理
- 添加 Cloudflare 适配器配置

## 推荐的快速解决方案

**使用 Vercel 或 Netlify 替代**

这些平台对 Astro 静态站点的支持更好，不会出现自动适配器冲突的问题。

### Vercel 部署步骤：

1. 访问 https://vercel.com
2. 导入 GitHub 仓库
3. 框架预设选择 "Astro"
4. 构建命令：`pnpm run build`
5. 输出目录：`dist`
6. 点击部署

### Netlify 部署步骤：

1. 访问 https://netlify.com
2. 从 Git 导入项目
3. 构建命令：`pnpm run build`
4. 发布目录：`dist`
5. 点击部署

## 结论

由于 Cloudflare Pages 的自动适配器行为与项目配置冲突，建议使用 **Vercel** 或 **Netlify** 部署，或者使用 Cloudflare Pages 的 **直接上传** 功能。
