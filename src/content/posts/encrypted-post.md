---
title: Encrypted Post
published: 2024-01-15
description: This is an article for testing the page encryption feature
encrypted: true
pinned: true
password: "123456"
passwordHint: "123456"
hideHomeContent: true
alias: "encrypted-example"
tags: ["Test", "Encryption"]
category: "Technology"
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
| `description` | A short description of the post. Displayed on index page.                                                                                                                                                   |
| `image`       | The cover image path of the post.<br/>1. Start with `http://` or `https://`: Use web image<br/>2. Start with `/`: For image in `public` dir<br/>3. With none of the prefixes: Relative to the markdown file |
| `tags`        | The tags of the post.                                                                                                                                                                                       |
| `category`    | The category of the post.                                                                                                                                                                                   |
| `alias`   | alias for the post. The post will be accessible at `/posts/{alias}/`. Example: `my-special-article` (will be available at `/posts/my-special-article/`)                                   |
| `licenseName` | The license name for the post content.                                                                                                                                                                      |
| `author`      | The author of the post.                                                                                                                                                                                     |
| `sourceLink`  | The source link or reference for the post content.                                                                                                                                                          |
| `draft`       | If this post is still a draft, which won't be displayed.                                                                                                                                                    |
| `encrypted`   | Whether this post is password protected.                                                                                                                                                                    |
| `password`    | The password to unlock the encrypted post.                                                                                                                                                                  |
| `passwordHint`| A hint to help users remember the password. Displayed below the password input.                                                                                                                             |
| `hideHomeContent` | Whether to hide public post summaries, including the home page, meta tags, feed/API summaries, and share previews. Defaults to `true` when `password` is set.                                      |

## Where to Place the Post Files



Your post files should be placed in `src/content/posts/` directory. You can also create sub-directories to better organize your posts and assets.

```
src/content/posts/
├── post-1.md
└── post-2/
    ├── cover.png
    └── index.md
```

## Posts alias

You can set a alias for any post by adding the `alias` field to the front-matter:

```yaml
---
title: My Special Article
published: 2024-01-15
alias: "my-special-article"
tags: ["Example"]
category: "Technology"
---
```

When a alias is set:
- The post will be accessible at the custom URL (e.g., `/posts/my-special-article/`)
- The default `/posts/{slug}/` URL will still work
- RSS/Atom feeds will use the custom alias
- All internal links will automatically use the custom alias

**Important Notes:**
- Alias should NOT include `/posts/` prefix (it will be added automatically)
- Avoid special characters and spaces in alias
- Use lowercase letters and hyphens for best SEO practices
- Make sure alias are unique across all posts
- Don't include leading or trailing slashes


## How It Works

```mermaid
graph LR
    A[User Password] --> B[Direct AES Decryption]
    B --> C{Check Prefix?}
    C -- "MIZUKI-VERIFY:" found --> D[Success: Render Content]
    C -- Random/Garbage --> E[Fail: Wrong Password]
```

## Page Encryption

You can password protect any post by setting `encrypted: true` and providing a `password` in the front-matter:

```yaml
---
title: My Private Post
published: 2024-01-15
encrypted: true
password: "my-secret-password"
passwordHint: "Hint: The password is my dog's name"
hideHomeContent: true
---
```

### Fields

| Field          | Required | Description                                              |
|----------------|----------|----------------------------------------------------------|
| `encrypted`    | Yes      | Set to `true` to enable password protection              |
| `password`     | Yes      | The password to unlock the post                          |
| `passwordHint` | No       | A hint displayed below the password input to help users |
| `hideHomeContent` | No   | Hide public summaries as `该文章已加密`. Defaults to `true` when `password` is set. Set to `false` to show the normal summary. |

### How the Unlock Box Looks

The unlock box displays:
- A lock icon in the theme's primary color
- The post title "Password Protected"
- A description asking for the password
- A hint (if `passwordHint` is provided)
- A password input field and unlock button

After entering the correct password, the content is decrypted and displayed. The password is stored in session storage so users don't need to re-enter it on subsequent page loads within the same session.
