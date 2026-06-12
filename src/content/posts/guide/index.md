---
title: Simple Guides for Mizuki
published: 2024-04-01
description: "How to use this blog template."
image: "./cover.webp"
tags: ["Mizuki", "Blogging", "Customization"]
category: Guides
draft: false
---



This blog template is built with [Astro](https://astro.build/). For the things that are not mentioned in this guide, you may find the answers in the [Astro Docs](https://docs.astro.build/).

## Front-matter of Posts

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




| Attribute     | Description                                                                                                                                                                                                 |
|---------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `title`       | The title of the post.                                                                                                                                                                                      |
| `published`   | The date the post was published.                                                                                                                                                                            |
| `pinned`      | Whether this post is pinned to the top of the post list.                                                                                                                                                   |
| `priority`    | The priority of the pinned post. Smaller value means higher priority (0, 1, 2...).                                                                                                                          |
| `description` | A short description of the post. Displayed on index page.                                                                                                                                                   |
| `image`       | The cover image path of the post.<br/>1. Start with `http://` or `https://`: Use web image<br/>2. Start with `/`: For image in `public` dir<br/>3. With none of the prefixes: Relative to the markdown file |
| `tags`        | The tags of the post.                                                                                                                                                                                       |
| `category`    | The category of the post.                                                                                                                                                                                   |
| `licenseName` | The license name for the post content.                                                                                                                                                                      |
| `author`      | The author of the post.                                                                                                                                                                                     |
| `sourceLink`  | The source link or reference for the post content.                                                                                                                                                          |
| `draft`       | If this post is still a draft, which won't be displayed.                                                                                                                                                    |

## Where to Place the Post Files



Your post files should be placed in `src/content/posts/` directory. You can also create sub-directories to better organize your posts and assets.

```
src/content/posts/
├── post-1.md
└── post-2/
    ├── cover.webp
    └── index.md
```