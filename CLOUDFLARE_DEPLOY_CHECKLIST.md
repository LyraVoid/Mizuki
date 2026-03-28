# Cloudflare Pages 部署检查清单

## 部署前检查

### 1. 配置文件检查 ✅
- [x] `astro.config.mjs` - 已移除 `base: "/Mizuki/"`
- [x] `src/config.ts` - 已更新 `siteURL` 为 `https://mizuki.pages.dev/`
- [x] `wrangler.toml` - 已创建 Cloudflare Pages 配置文件
- [x] `.nvmrc` - 已指定 Node.js 版本为 20

### 2. 提交更改到 GitHub
```bash
git add .
git commit -m "配置 Cloudflare Pages 部署"
git push
```

## Cloudflare Pages 控制台设置

### 步骤 1: 创建项目
1. 登录 https://dash.cloudflare.com
2. 点击左侧 **"Pages"**
3. 点击 **"创建项目"**
4. 选择 **"连接到 Git"**

### 步骤 2: 连接 GitHub
1. 选择 **GitHub**
2. 授权 Cloudflare 访问
3. 选择 **Mizuki** 仓库
4. 点击 **"开始设置"**

### 步骤 3: 构建设置（重要！）
在设置页面填写：

| 设置项 | 值 |
|--------|-----|
| **项目名称** | mizuki |
| **生产分支** | main |
| **框架预设** | Astro（如果没有就选 None）|
| **构建命令** | `pnpm install && pnpm run build` |
| **构建输出目录** | `dist` |
| **根目录** | `/` |

### 步骤 4: 环境变量（必须设置）
点击 **"添加变量"**，添加以下变量：

```
NODE_VERSION = 20
```

### 步骤 5: 保存并部署
1. 点击 **"保存并部署"**
2. 等待构建完成（约 3-5 分钟）

## 常见错误及解决方法

### 错误 1: "pnpm: command not found"
**解决方法**: 在构建命令前添加 pnpm 安装
```
npm install -g pnpm && pnpm install && pnpm run build
```

### 错误 2: "Node.js version not supported"
**解决方法**: 确保设置了环境变量
```
NODE_VERSION = 20
```

### 错误 3: "Build failed with exit code 1"
**解决方法**: 
1. 检查构建日志中的具体错误
2. 确保所有依赖都已正确安装
3. 尝试使用以下构建命令：
```
corepack enable && pnpm install && pnpm run build
```

### 错误 4: "Cannot find module"
**解决方法**: 清除缓存并重新构建
1. 在 Cloudflare Pages 控制台点击 **"重试部署"**

## 部署后验证

### 检查清单
- [ ] 网站可以正常访问 `https://mizuki.pages.dev`
- [ ] 首页显示正常
- [ ] 文章列表页正常
- [ ] 文章详情页正常
- [ ] 图片正常加载
- [ ] CSS 样式正常
- [ ] JavaScript 交互正常

### 如果页面 404
1. 检查 `astro.config.mjs` 中的 `base` 是否已注释掉
2. 检查 `siteURL` 是否正确
3. 确保构建输出目录是 `dist`

### 如果资源加载失败
1. 检查浏览器开发者工具 (F12) 的网络请求
2. 确保所有资源路径正确
3. 检查 `_headers` 文件配置

## 替代部署方案

如果通过 Git 集成部署失败，可以尝试：

### 方案 1: 直接上传
1. 本地构建：`pnpm run build`
2. 在 Cloudflare Pages 选择 **"直接上传"**
3. 上传 `dist` 文件夹

### 方案 2: 使用 Wrangler CLI
```bash
# 安装 Wrangler
npm install -g wrangler

# 登录 Cloudflare
wrangler login

# 部署
wrangler pages deploy dist
```

## 需要帮助？

如果仍然无法部署成功，请提供：
1. Cloudflare Pages 构建日志的完整错误信息
2. 截图或复制错误内容
3. 您的 Cloudflare Pages 项目设置截图
