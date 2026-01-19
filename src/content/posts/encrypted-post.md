---
title: 加密文章
published: 2024-01-15
description: 这是一篇用于测试页面加密功能的文章
encrypted: true
pinned: true
password: "123456"
alias: "encrypted-example"
tags: ["测试", "加密"]
category: "技术"
---

此博客模板基于 [Astro](https://astro.build/) 构建。如果本指南中未提及某些内容，您可以在 [Astro 文档](https://docs.astro.build/)中找到答案。

## 文章的 Front-matter

```yaml
---
title: My First Blog Post
published: 2023-09-09
description: This is the first post of my new Astro blog.
image: ./cover.jpg
tags: [Foo, Bar]
category: Front-end
draft: false
---
```




| 属性 | 描述 |
|---|---|
| `title` | 文章标题。 |
| `published` | 文章发布日期。 |
| `pinned` | 是否将此文章置顶。 |
| `description` | 文章简短描述。显示在首页。 |
| `image` | 文章封面图路径。<br/>1. 以 `http://` 或 `https://` 开头：使用网络图片<br/>2. 以 `/` 开头：使用 `public` 目录下的图片<br/>3. 无前缀：相对于 markdown 文件 |
| `tags` | 文章标签。 |
| `category` | 文章分类。 |
| `alias` | 文章别名。文章将可以通过 `/posts/{alias}/` 访问。例如：`my-special-article`（将可以通过 `/posts/my-special-article/` 访问） |
| `licenseName` | 文章内容的许可证名称。 |
| `author` | 文章作者。 |
| `sourceLink` | 文章内容的来源链接或引用。 |
| `draft` | 如果此文章仍为草稿，则不会显示。 |

## 文章文件放置位置



您的文章文件应放置在 `src/content/posts/` 目录下。您也可以创建子目录来更好地组织文章和资源。

```
src/content/posts/
├── post-1.md
└── post-2/
    ├── cover.png
    └── index.md
```

## 文章别名 (Alias)

您可以通过在 front-matter 中添加 `alias` 字段来为任何文章设置别名：

```yaml
---
title: My Special Article
published: 2024-01-15
alias: "my-special-article"
tags: ["Example"]
category: "Technology"
---
```

设置别名后：
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


## 工作原理

```mermaid
graph LR
    A[User Password] --> B[Direct AES Decryption]
    B --> C{Check Prefix?}
    C -- "MIZUKI-VERIFY:" found --> D[Success: Render Content]
    C -- Random/Garbage --> E[Fail: Wrong Password]
```
