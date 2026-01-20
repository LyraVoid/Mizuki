---
title: Markdown 扩展功能
published: 2026-01-01
updated: 2026-01-01
description: '了解更多关于 Mizuki 中的 Markdown 功能'
image: ''
tags: [演示, 示例, Markdown, mizuki]
category: '示例'
draft: true
---

## GitHub 仓库卡片
您可以添加动态卡片链接到 GitHub 仓库，页面加载时，仓库信息会从 GitHub API 拉取。

::github{repo="matsuzaka-yuki/Mizuki"}

使用代码 `::github{repo="matsuzaka-yuki/Mizuki"}` 创建一个 GitHub 仓库卡片。

```markdown
::github{repo="matsuzaka-yuki/Mizuki"}
```

## 提示框 (Admonitions)

支持以下类型的提示框：`note` `tip` `important` `warning` `caution`

:::note
强调用户应该考虑的信息，即使在略读时也是如此。
:::

:::tip
帮助用户更成功的可选信息。
:::

:::important
用户成功所需的关键信息。
:::

:::warning
由于潜在风险，需要用户立即注意的关键内容。
:::

:::caution
操作的潜在负面后果。
:::

### 基本语法

```markdown
:::note
强调用户应该考虑的信息，即使在略读时也是如此。
:::

:::tip
帮助用户更成功的可选信息。
:::
```

### 自定义标题

提示框的标题可以自定义。

:::note[我的自定义标题]
这是一个带有自定义标题的提示框。
:::

```markdown
:::note[我的自定义标题]
这是一个带有自定义标题的提示框。
:::
```

### GitHub 语法

> [!TIP]
> [GitHub 语法](https://github.com/orgs/community/discussions/16925) 也同样支持。

```
> [!NOTE]
> GitHub 语法也同样支持。

> [!TIP]
> GitHub 语法也同样支持。
```

### 剧透 (Spoiler)

您可以向文本添加剧透效果。文本也支持 **Markdown** 语法。

内容 :spoiler[被隐藏了 **ayyy**]!

```markdown
The content :spoiler[is hidden **ayyy**]!
```
