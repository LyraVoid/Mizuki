---
title: Mizuki 入门指南
published: 2026-01-20
pinned: false
description: 对于Mizuki的使用做一些记录，方便自己翻阅

tags: [Markdown]
category: '碎碎念'
draft: false
date: 2026-01-20
image: "https://pic1.acofork.com/ri/h/556.webp"
---

Mizuki官方文档：[Mizuki Next Theme Doc](https://docs.mizuki.mysqil.com/)

# Markdown常用语法

可以参考 Mizuki Next Theme里面写的，很详细：[Markdown基础 - Mizuki Next Theme](https://docs.mizuki.mysqil.com/press/Markdown/Markdown/)

或者使用：[菜鸟教程 - Markdown教程](https://www.runoob.com/markdown/md-tutorial.html)

# Mizuki Markdown扩展语法

## GitHub仓库卡片（GitHub Repository Cards）

支持添加动态 GitHub 仓库卡片，页面加载时会通过 GitHub API 拉取仓库实时信息（如星标数、分支数等）。

### 使用示例

::github{repo="olinll/Mizuki"}

### 语法格式

```markdown
::github{repo="用户名/仓库名"}
```

- `repo` 参数：必填，格式为「GitHub 用户名/仓库名称」（如 `olinll/Mizuki`）

## 提示框（Admonitions）

支持 5 种预设类型的提示框，用于突出显示不同重要程度的信息，适配多种使用场景。

### 支持类型及示例

| 类型         | 语法标识    | 效果示例 |
| ------------ | ----------- | -------- |
| 说明         | `note`      | ::       |
| 技巧         | `tip`       | ::       |
| 重要         | `important` | ::       |
| 警告         | `warning`   | ::       |
| 注意（谨慎） | `caution`   | ::       |

### 基础语法

```markdown
:::类型标识
提示框内容（支持换行）
:::
```

### 自定义标题

可修改提示框默认标题，语法如下：

```markdown
:::note[我的自定义标题]
这是一个带有自定义标题的说明提示框。
:::
```

:::note[我的自定义标题]
这是一个带有自定义标题的说明提示框。
:::

### GitHub 兼容语法

同时支持 GitHub 官方提示框语法（无缝适配 GitHub 文档风格）：

```markdown
> [!NOTE]
> GitHub 语法的说明提示框。
> 支持多行内容。

> [!TIP]
> GitHub 语法的技巧提示框。
```

效果

> [!NOTE]
> GitHub 语法的说明提示框。
> 支持多行内容。

> [!TIP]
> GitHub 语法的技巧提示框。

## 折叠剧透（Spoiler）

支持添加折叠式剧透内容，默认隐藏，hover 或点击时显示，内容支持 Markdown 格式。

### 使用示例

```markdown
这是普通文本，剧透内容：:spoiler[被隐藏的**剧透内容**（支持粗体等 Markdown 语法）]！
```

效果：这是普通文本，剧透内容：:spoiler[被隐藏的**剧透内容**（支持粗体等 Markdown 语法）]！

### 语法格式

```markdown
:spoiler[剧透内容（可包含 Markdown 语法）]
```

 # 文章页元数据

在创建的文章添加frontmatter（前置元数据），这是文章的配置信息，必须包含`title`和`description`字段：

```markdown
---
title: Mizuki 入门指南
published: 2026-01-20
pinned: true
description: 对于Mizuki的使用做一些记录，方便自己翻阅
tags: [Markdown]
category: '碎碎念'

draft: false
date: 2026-01-20
image: "https://xxxx.com/556.webp"
---
```

## Frontmatter字段详解

frontmatter支持的字段包括：

### 必需字段

- `title`：文章标题（必需）
- `description`：文章描述（必需）

### 发布相关

- `published`：文章发布日期，格式为（YYYY-MM-DD）
- `pubDate`：文章发布日期（与published类似）
- `date`：文章创建日期
- `draft`：是否为草稿，true表示草稿，false表示正式发布
- `permalink`: 固定链接

### 内容分类

- `tags`：文章标签数组，用于标记文章主题
- `category`：文章分类，用于组织文章
- `pinned`：是否置顶文章，true表示置顶
- `alias`：设置别名，帖子将通过自定义网址访问

:::caution[设置别名后]

- 文章将可以通过自定义 URL 访问（例如 `/posts/my-special-article/`）
- 默认的 `/posts/{slug}/` URL 仍然有效
- RSS/Atom feed 将使用自定义别名
- 所有内部链接将自动使用自定义别名

**重要提示：**
- 别名不应包含 `/posts/` 前缀（会自动添加）
- 避免在别名中使用特殊字符和空格
- 为了最佳 SEO 实践，请使用小写字母和连字符
- 确保别名在所有文章中是唯一的
- 不要包含开头或结尾的斜杠

:::



### 作者信息

- `author`：文章作者姓名
- `licenseName`：文章许可证名称，如"MIT"、"CC BY 4.0"等
- `sourceLink`：文章源链接，通常指向GitHub仓库或原始来源

:::note[常见的许可证名称]

- "MIT"
- "Apache-2.0"
- "CC BY 4.0"
- "CC BY-SA 4.0"
- "Unlicensed"

:::

### 图片设置

- `image`：文章封面图片

- 在frontmatter下方编写文章内容，可以使用标准的Markdown语法。

