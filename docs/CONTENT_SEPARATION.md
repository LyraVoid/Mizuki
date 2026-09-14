# Mizuki 内容分离完整指南

本指南详细说明如何在 Mizuki 中使用内容分离功能,包括基础配置、私有仓库、CI/CD 部署等所有场景。

## 📖 目录

- [快速开始](#-快速开始)
- [ENABLE_CONTENT_SYNC 控制开关](#-enable_content_sync-控制开关)
- [配置方式](#-配置方式)
- [配置覆盖 (overrides)](#-配置覆盖-overrides)
- [私有仓库](#-私有仓库配置)
- [CI/CD 部署](#-cicd-部署)
- [常用命令](#-常用命令)
- [故障排查](#-故障排查)

---

## 🚀 快速开始

### 新手推荐: 本地模式 (最简单)

**不需要任何配置**,直接开始使用:

```bash
# 克隆项目
git clone https://github.com/LyraVoid/Mizuki.git
cd Mizuki

# 安装依赖
pnpm install

# 直接开发
pnpm dev
```

内容存放在 `src/content/` 和 `public/images/` 目录,与代码一起管理。

### 进阶: 启用内容分离

如果需要将内容独立管理(多人协作、私有内容、独立版本控制),按以下步骤配置:

```bash
# 1. 创建 .env 文件
cp .env.example .env

# 2. 编辑 .env,启用内容分离
ENABLE_CONTENT_SYNC=true
CONTENT_REPO_URL=https://github.com/your-username/Mizuki-Content.git

# 3. 同步内容
pnpm run sync-content

# 4. 启动开发
pnpm dev
```

---

## 🎛️ ENABLE_CONTENT_SYNC 控制开关

### 功能说明

`ENABLE_CONTENT_SYNC` 是一个一键开关,控制是否启用内容分离功能。

| 值 | 说明 | 适用场景 |
|---|---|---|
| `false` | **禁用内容分离** | 本地内容、个人博客、内容较少 |
| 未设置或其他值 | 启用同步逻辑 | 建议显式设置为 `false` 或 `true`，避免误解 |
| `true` | **启用内容分离** | 团队协作、私有内容、大量文章 |

### 配置位置

在项目根目录的 `.env` 文件中:

```bash
# 禁用内容分离 (使用本地内容)
ENABLE_CONTENT_SYNC=false

# 或启用内容分离 (从远程仓库同步)
ENABLE_CONTENT_SYNC=true
```

### 使用场景对比

#### 场景 1: 本地模式 (推荐新手)

**特点**:
- ✅ 无需额外配置
- ✅ 内容和代码一起管理
- ✅ 适合个人博客、小型项目

**配置**:
```bash
# .env (或不创建 .env 文件)
ENABLE_CONTENT_SYNC=false
```

**工作流程**:
```bash
# 直接编辑 src/content/ 下的文章
pnpm dev

# 提交时一起提交代码和内容
git add .
git commit -m "Update content"
git push
```

> **注意**：本地开发时建议显式设置 `ENABLE_CONTENT_SYNC=false`。如果不设置，当前同步脚本会进入同步逻辑；没有内容仓库地址时通常会继续使用本地内容，但会输出提示。

#### 场景 2: 独立仓库（分离）模式

**特点**:
- ✅ 内容独立仓库管理
- ✅ 支持私有内容仓库
- ✅ 多人协作方便
- ✅ 独立的内容版本控制

**配置**:
```bash
# .env
ENABLE_CONTENT_SYNC=true
CONTENT_REPO_URL=https://github.com/your-username/Mizuki-Content.git
```

**工作流程**:
```bash
# 自动同步内容后启动
pnpm dev

# 内容在独立仓库编辑
cd /path/to/Mizuki-Content
# 编辑文章
git add .
git commit -m "Update article"
git push
```

> **同步副作用**：当 `CONTENT_DIR` 已经是 Git 仓库时，同步脚本会 fetch 并将其重置到远程 `main` 或 `master` 分支。建立运行时映射时，它还可能将已有目录备份为 `.backup`、创建 junction 或复制文件，并在代码仓库中提交同步结果。运行前请提交或备份本地修改，不要直接编辑同步目标。

### 模式切换

#### 从本地切换到独立仓库

1. 创建内容仓库 (参考 [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md))
2. 编辑 `.env`:
   ```bash
   ENABLE_CONTENT_SYNC=true
   CONTENT_REPO_URL=https://github.com/your-username/Mizuki-Content.git
   ```
3. 同步内容: `pnpm run sync-content`

#### 从独立仓库切换回本地

1. 编辑 `.env`:
   ```bash
   ENABLE_CONTENT_SYNC=false
   ```
2. 直接开发: `pnpm dev`

---

## ⚙️ 配置方式

### 环境变量说明

在 `.env` 文件中配置:

```bash
# ============================================
# 功能开关
# ============================================

# 是否启用内容分离功能
# false = 使用本地内容 (推荐新手)
# true = 从远程仓库同步内容
ENABLE_CONTENT_SYNC=false

# ============================================
# 内容仓库配置 (仅当 ENABLE_CONTENT_SYNC=true 时需要)
# ============================================

# 内容仓库地址
# 支持 HTTPS 和 SSH 方式
# 公开仓库: https://github.com/username/repo.git
# 私有仓库 (SSH): git@github.com:username/repo.git
# 私有仓库 (Token): https://TOKEN@github.com/username/repo.git
CONTENT_REPO_URL=https://github.com/your-username/Mizuki-Content.git

# 内容目录路径 (默认 ./content 一般无需改动)
CONTENT_DIR=./content
```

### 配置示例

#### 示例 1: 完全本地 (最简单)

```bash
# .env
ENABLE_CONTENT_SYNC=false
```

或者**不创建 `.env` 文件**,直接使用本地内容。

#### 示例 2: 公开仓库 (HTTPS)

```bash
# .env
ENABLE_CONTENT_SYNC=true
CONTENT_REPO_URL=https://github.com/your-username/Mizuki-Content.git
```

#### 示例 3: 私有仓库 (SSH)

```bash
# .env
ENABLE_CONTENT_SYNC=true
CONTENT_REPO_URL=git@github.com:your-username/Mizuki-Content-Private.git
```

---

## 🧩 配置覆盖 (overrides)

### 解决什么问题

文章和数据可以放进内容仓库，但 `src/config/` 下的配置项默认必须直接改代码仓库的源文件。对于 fork 上游、定期合并上游更新的用户，配置文件是冲突重灾区：上游每次调整配置结构，都会和本地的个人值冲突。

配置覆盖把个人配置值也搬进内容仓库：`src/config/*.ts` 保持上游原版，个人值写在内容仓库的 `overrides/` 里，构建时深合并。跟进上游更新时，配置文件不再产生冲突；上游**新增**配置项自动生效，只有上游**修改结构**时才会暴露问题，且表现为编译期类型错误。

**这是可选功能，也是实验性功能。** 不创建 `overrides/` 目录时，所有配置等同于上游默认值，行为与现状完全一致；但启用前请阅读[迁移步骤](#迁移步骤把已有配置搬进内容仓库)中的注意事项。

### 工作方式

```
内容仓库 overrides/  ──sync-content──>  代码仓库 src/config/overrides/
                                                    │
                     src/config/index.ts 在导出前深合并 ↓

              最终配置 = deepMerge(上游默认配置, 同名覆盖文件的 default 导出)
```

`src/config/overrides/` 已加入 `.gitignore`，不会进入代码仓库的提交历史。

### 目录与命名

**覆盖文件名 = 被覆盖的导出常量名**（注意有几个和上游文件名不同）：

```
内容仓库
└── overrides/
    ├── siteConfig.ts        →  siteConfig            (上游 siteConfig.ts)
    ├── profileConfig.ts     →  profileConfig         (上游 profileConfig.ts)
    ├── navBarConfig.ts      →  navBarConfig          (上游 navBarConfig.ts)
    ├── musicPlayerConfig.ts →  musicPlayerConfig     (上游 musicConfig.ts)
    ├── sakuraConfig.ts      →  sakuraConfig          (上游 effectsConfig.ts)
    └── ...
```

可覆盖的 19 个配置：`announcementConfig`、`commentConfig`、`expressiveCodeConfig`、`footerConfig`、`fullscreenWallpaperConfig`、`licenseConfig`、`markdownConfig`、`musicPlayerConfig`、`navBarConfig`、`permalinkConfig`、`pioConfig`、`profileConfig`、`rainyDayConfig`、`randomPostsConfig`、`relatedPostsConfig`、`sakuraConfig`、`shareConfig`、`sidebarLayoutConfig`、`siteConfig`。

文件名不在名单内会在构建期报错并列出合法名单，不会静默失效。

### 迁移步骤：把已有配置搬进内容仓库

> ⚠️ **实验性功能，慎用**：配置分离（overrides）目前仍处于早期阶段，测试覆盖的场景有限，边界情况未必都验证到。迁移前请先提交或备份当前配置，迁移后务必完整校验一遍；重要站点建议先观察一段时间再决定是否长期使用。

如果你已经改过 `src/config/` 里的配置，可以用 `pnpm export-config` 自动抽出「与上游不同的字段」生成覆盖文件，不需要手抄。

**前置条件**：代码仓库里有一个「配置还是上游原版」的 git remote 可作基准。fork 用户通常已经有了：

```bash
git remote -v          # 确认有 upstream（或 origin）指向上游仓库
git fetch upstream     # 更新基准
```

**迁移流程**：

```bash
# 1. 导出个人配置：与上游基准逐字段比对，结果写入 overrides-export/
pnpm export-config

# 2. 把覆盖文件放进内容仓库
cp overrides-export/*.ts <内容仓库>/overrides/

# 3. 还原代码仓库的配置为上游原版
#    还原后 src/config/ 不再有个人改动，之后合并上游不会在配置上冲突
git checkout upstream/master -- src/config/

# 4. 同步并校验
pnpm sync-content && pnpm type-check && pnpm build
```

**要点**：

- 导出基准自动挑选（依次尝试 `upstream/master`、`upstream/main`、`origin/master`、`origin/main`），不对时用 `--ref=<git-ref>` 指定；`--out=<目录>` 可以直接写进内容仓库。
- 导出前脚本会自检「覆盖合并回去是否等于你当前的配置」，无法还原时会报出具体原因，不会生成不一致的覆盖文件。
- 校验标准：`type-check` 通过，且构建出的站点与迁移前渲染一致。
- 内容仓库如果配置了部署触发工作流，记得把 `overrides/**` 加进 `paths`，见下面的[触发部署](#触发部署)。

**回滚**：删掉内容仓库 `overrides/` 里的文件、重新 `pnpm sync-content`，配置即回到上游默认值；想完全退回直接修改 `src/config/*.ts` 的旧方式也可以，代码不需要任何改动。

### 写法

只写你想改的字段，其余自动取上游默认值：

```ts
// overrides/siteConfig.ts
import type { DeepPartial, SiteConfig } from "../../types/config";

export default {
	title: "我的站点",
	siteURL: "https://example.com/",
	lang: "zh_CN",
	banner: {
		src: {
			desktop: ["/images/banner/desktop.webp"],
			mobile: ["/images/banner/mobile.webp"],
		},
		carousel: { interval: 8 },
	},
} satisfies DeepPartial<SiteConfig>;
```

要点：

- 必须是 `export default`，命名导出不会被识别（构建期报错）；
- 用 `DeepPartial<XxxConfig>` 而不是 `Partial<XxxConfig>`：`Partial` 只让顶层键可选，写 `carousel: { interval: 8 }` 会因为缺少 `enable`、`switchable` 而报错；
- `navBarConfig.links` 里的预设项是枚举，要写 `LinkPreset.Home` 并 `import { LinkPreset } from "../../types/config"`，不能写裸数字；
- 相对路径 `../../types/config` 是同步到 `src/config/overrides/` 之后的位置。内容仓库本身没有 TypeScript 环境，类型检查在代码仓库执行 `pnpm type-check` 时进行。

### 合并语义

| 情况 | 行为 |
| --- | --- |
| 双方都是普通对象 | 深合并，覆盖值只影响写到的字段 |
| 数组 | 整体替换，不拼接 |
| 标量、`null` | 整体替换 |
| 覆盖值里显式写 `undefined` 的键 | 跳过，保留默认值 |
| 没有对应覆盖文件 | 原样使用上游默认值 |

举例：默认 `banner.carousel` 是 `{ enable: true, interval: 3, switchable: true }`，覆盖里只写 `{ interval: 8 }`，结果是 `{ enable: true, interval: 8, switchable: true }`；数组则是整体替换，比如覆盖 `banner.src.desktop` 只写 1 张图，结果就是这 1 张，不会与默认列表拼接。

### 触发部署

内容仓库的 `trigger-build.yml` 需要把 `overrides/**` 加进 `paths`，否则只改配置不会触发站点重新构建：

```yaml
on:
  push:
    branches: [main]
    paths:
      - "posts/**"
      - "spec/**"
      - "data/**"
      - "images/**"
      - "overrides/**"
```

### 已知限制

- **深合并表达不了「删除」。** 覆盖只能改值或加字段，没法把上游默认里的某个键去掉。`pnpm export-config` 遇到这种情况会明确报出来，需要手工处理。
- **评论语言不会自动跟随 `siteConfig.lang`。** `src/config/commentConfig.ts` 在模块顶层引用 `siteConfig.ts` 里的语言常量填充 Twikoo / Giscus 的 `lang`，覆盖 `siteConfig.lang` 时需要同时提供 `overrides/commentConfig.ts` 覆盖对应字段。
- **读取配置请统一走 `@/config` 入口。** 直接 `import { siteConfig } from "@/config/siteConfig"` 会绕过合并，拿到未覆盖的默认值。
- **开发服务器不监听内容仓库。** `src/config/overrides/` 在每次 dev/build 前由 sync-content 从内容仓库复制而来；dev 运行中修改覆盖文件需要重启 `pnpm dev` 才会重新同步。
- **`scripts/compress-fonts/` 暂不读取覆盖值**，该目录是独立的手动工具，不在 `pnpm build` 流程内。番剧数据脚本（`update-anime` / `update-bangumi` / `update-bilibili`）已经会优先读覆盖值。

---

## 🔄 自动构建触发 (内容更新时)

### 问题

启用内容分离后，默认只有代码仓库更新会触发部署，内容仓库更新**不会**自动触发。

### 解决方案

**推荐使用 Repository Dispatch**，5 步快速配置，适用所有部署平台。

详细步骤请查看:
- **[自动构建触发快速参考](./AUTO_BUILD_TRIGGER.md)** - 最简洁的配置指南 ⭐
- **[部署文档 - 完整说明](./DEPLOYMENT.md#内容仓库更新触发构建)** - 包含多种方案
- **[内容仓库配置指南](../Mizuki-Content/.github/workflows/README.md)** - 工作流详细说明

---

## 🔐 私有仓库配置

完全支持私有内容仓库! 推荐使用 SSH 方式,安全且方便。

### 方案 A: SSH 密钥 (推荐)

#### 1. 生成 SSH 密钥

```bash
# 推荐使用 Ed25519
ssh-keygen -t ed25519 -C "your_email@example.com"

# 或使用 RSA
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

按提示操作,默认保存到 `~/.ssh/id_ed25519`。

#### 2. 添加公钥到 Git 平台

```bash
# 查看公钥
cat ~/.ssh/id_ed25519.pub

# Windows PowerShell
Get-Content ~/.ssh/id_ed25519.pub
```

**GitHub**: 
- Settings → SSH and GPG keys → New SSH key
- 粘贴公钥内容

**GitLab**: 
- Preferences → SSH Keys → Add new key

**Gitee**: 
- 设置 → SSH 公钥 → 添加公钥

#### 3. 配置 Mizuki

在 `.env` 文件中使用 SSH URL:

```bash
ENABLE_CONTENT_SYNC=true
CONTENT_REPO_URL=git@github.com:your-username/Mizuki-Content-Private.git
```

#### 4. 测试连接

```bash
# 测试 GitHub 连接
ssh -T git@github.com

# 测试 GitLab 连接
ssh -T git@gitlab.com

# 同步内容
pnpm run sync-content
```

### 方案 B: HTTPS + Personal Access Token

#### 1. 生成 Token

**GitHub**:
- Settings → Developer settings → Personal access tokens → Generate new token
- 权限: 勾选 `repo` (完整访问)

**GitLab**:
- Preferences → Access Tokens
- Scopes: `read_repository`

**Gitee**:
- 设置 → 私人令牌 → 生成新令牌
- 权限: `projects` (读取)

#### 2. 配置 .env

```bash
ENABLE_CONTENT_SYNC=true
CONTENT_REPO_URL=https://YOUR_TOKEN@github.com/your-username/Mizuki-Content-Private.git
```

⚠️ **安全提示**:
- **不要将 `.env` 提交到 Git!** (已在 `.gitignore` 中)
- Token 具有完整权限,请妥善保管

---

## 🌐 CI/CD 部署

### 快速配置

所有部署平台都使用相同的自动同步机制:
- ✅ `pnpm build` 执行前自动运行 `prebuild` 钩子
- ✅ 根据 `ENABLE_CONTENT_SYNC` 决定是否同步内容
- ✅ 同步失败不会中断构建,回退到本地内容

**只需配置环境变量,无需修改构建命令!**

### 环境变量配置

在部署平台添加以下环境变量:

| 变量名 | 值 | 说明 |
|-------|---|------|
| `ENABLE_CONTENT_SYNC` | `true` | 启用内容分离 |
| `CONTENT_REPO_URL` | 仓库地址 | 内容仓库的 URL |

### 支持的平台

- ✅ **GitHub Pages** - 使用 GitHub Actions
- ✅ **Vercel** - 环境变量配置
- ✅ **Netlify** - 环境变量配置
- ✅ **Cloudflare Pages** - 环境变量配置

### 详细配置指南

不同平台的具体配置步骤、私有仓库认证、故障排查等详细信息，请查看：

📖 **[部署指南](./DEPLOYMENT.md)** - 完整的部署文档，包含：
- GitHub Pages 自动部署配置
- Vercel 部署详细步骤
- Netlify 部署配置
- Cloudflare Pages 部署
- 私有仓库认证配置
- 常见问题故障排查

---

## 📋 常用命令

| 命令 | 说明 |
|------|------|
| `pnpm run init-content` | 运行交互式初始化向导 |
| `pnpm run sync-content` | 手动同步内容仓库 |
| `pnpm run export-config` | 导出个人配置为 `overrides/` 覆盖文件 |
| `pnpm run check` | 运行 Astro 诊断 |
| `pnpm run type-check` | 运行 TypeScript 类型检查 |
| `pnpm dev` | 启动开发服务器 (自动同步) |
| `pnpm build` | 构建项目 (自动同步) |

### 自动同步时机

当 `ENABLE_CONTENT_SYNC=true` 时,以下命令会自动同步内容:

- `pnpm dev` - 开发前自动同步
- `pnpm build` - 构建前自动同步

同步失败不会中断开发,会显示警告并继续。

---

## 🔍 故障排查

### 问题 1: 提示 "未启用内容分离功能"

**原因**: `ENABLE_CONTENT_SYNC` 未设置或设置为 `false`。

**解决**:
```bash
# 检查 .env 文件
cat .env

# 确认有以下配置
ENABLE_CONTENT_SYNC=true
```

### 问题 2: 提示 "未设置 CONTENT_REPO_URL"

**原因**: 启用了内容分离但未配置仓库地址。

**解决**:
```bash
# 在 .env 中添加
CONTENT_REPO_URL=https://github.com/your-username/Mizuki-Content.git
```

### 问题 3: 私有仓库认证失败

**SSH 方式**:
```bash
# 测试 SSH 连接
ssh -T git@github.com

# 应该看到: Hi username! You've successfully authenticated...
```

如果失败,检查:
- SSH 密钥是否生成: `ls ~/.ssh/`
- 公钥是否添加到 GitHub
- SSH agent 是否运行: `ssh-add -l`

**HTTPS + Token 方式**:
- 检查 Token 是否有效
- 检查 Token 权限是否正确 (`repo` 权限)
- 确认 URL 格式: `https://TOKEN@github.com/user/repo.git`

### 问题 4: .env 文件不生效

**检查清单**:

1. 文件位置正确 (项目根目录)
   ```bash
   ls -la .env  # Linux/Mac
   dir .env     # Windows
   ```

2. 文件格式正确
   ```bash
   # ✅ 正确
   ENABLE_CONTENT_SYNC=true
   
   # ❌ 错误 (多余空格)
   ENABLE_CONTENT_SYNC = true
   
   # ❌ 错误 (不需要引号,除非值中有空格)
   ENABLE_CONTENT_SYNC="true"
   ```

3. 文件权限可读
   ```bash
   chmod 644 .env  # Linux/Mac
   ```

4. 运行检查命令
   ```bash
   pnpm run check
   pnpm run type-check
   ```

### 问题 5: 内容同步失败

```bash
# 手动同步内容
pnpm run sync-content

# 检查内容目录
ls -la content/

# 手动克隆内容仓库
git clone https://github.com/your-username/Mizuki-Content.git content
```

### 问题 6: 部署时内容未同步

**Vercel/Netlify**:
- 确认环境变量已添加
- 检查构建日志,查看同步步骤是否执行
- 确认 Token 在部署环境有效

**GitHub Actions**:
- 检查工作流配置
- 查看 Actions 运行日志
- 确认 Secrets 已正确添加

---

## 💡 最佳实践

### 新手建议

1. **从本地模式开始** - 不需要额外配置,立即可用
2. **内容稳定后再分离** - 等内容积累到一定程度
3. **使用 SSH 方式** - 比 Token 更安全方便

### 进阶用户

1. **使用独立仓库模式** - 清晰的版本控制
2. **内容仓库添加 CI** - 自动检查文章格式、图片优化等
3. **分支管理** - main 分支用于生产,develop 用于预览

### 团队协作

1. **统一环境变量** - 团队成员使用相同的配置
2. **权限控制** - 内容仓库设置为私有,精细控制访问权限
3. **Git Hooks** - 提交前检查文章格式、图片大小等

---

## 📚 相关文档

- [内容迁移指南](./MIGRATION_GUIDE.md) - 如何从单仓库迁移到分离模式
- [内容仓库结构](./CONTENT_REPOSITORY.md) - 内容仓库的推荐结构
- [主 README](../README.md) - 项目总体说明

---

## 🤝 需要帮助?

- 查看 [GitHub Issues](https://github.com/LyraVoid/Mizuki/issues)
- 阅读 [完整文档](../README.md)
- 运行 `pnpm run check` 和 `pnpm run type-check` 检查项目

祝你使用愉快! 🎉
