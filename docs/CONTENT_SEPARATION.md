# Mizuki 内容分离完整指南

本指南详细说明如何在 Mizuki 中使用内容分离功能,包括基础配置、私有仓库、CI/CD 部署等所有场景。

## 📖 目录

- [快速开始](#-快速开始)
- [ENABLE_CONTENT_SYNC 控制开关](#-enable_content_sync-控制开关)
- [配置方式](#-配置方式)
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
git clone https://github.com/matsuzaka-yuki/Mizuki.git
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
| `false` 或未设置 | **禁用内容分离** (默认) | 新手、个人博客、内容较少 |
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

### 模式切换

#### 从本地切换到独立仓库

1. 创建内容仓库 (参考 [CONTENT_MIGRATION.md](./CONTENT_MIGRATION.md))
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
| `pnpm run check-env` | 检查环境变量配置 |
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
   pnpm run check-env
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

- [内容迁移指南](./CONTENT_MIGRATION.md) - 如何从单仓库迁移到分离模式
- [内容仓库结构](./CONTENT_REPOSITORY.md) - 内容仓库的推荐结构
- [主 README](../README.zh.md) - 项目总体说明

---

## 🤝 需要帮助?

- 查看 [GitHub Issues](https://github.com/matsuzaka-yuki/Mizuki/issues)
- 阅读 [完整文档](../README.zh.md)
- 运行 `pnpm run check-env` 检查配置

祝你使用愉快! 🎉
