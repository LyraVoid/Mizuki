---
title: Mizuki 简易指南
published: 2024-04-01
description: "如何使用此博客模板。"
image: "./cover.png"
tags: ["Mizuki", "博客", "自定义"]
category: 指南
draft: false
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
| `priority` | 置顶文章的优先级。数值越小优先级越高 (0, 1, 2...)。 |
| `description` | 文章简短描述。显示在首页。 |
| `image` | 文章封面图路径。<br/>1. 以 `http://` 或 `https://` 开头：使用网络图片<br/>2. 以 `/` 开头：使用 `public` 目录下的图片<br/>3. 无前缀：相对于 markdown 文件 |
| `tags` | 文章标签。 |
| `category` | 文章分类。 |
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
