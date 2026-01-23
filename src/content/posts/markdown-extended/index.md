---
title: Markdown 扩展语法
published: 2025-12-06
pinned: false
description: 在XhaniのBlog中阅读更多关于 Markdown扩展语法的信息
tags: [Markdown, XhaniのBlog, Markdown扩展语法]
category: 教程
author: XiaoXhan1234
draft: false
---


## GitHub 仓库卡片
您可以添加链接到GitHub仓库的动态卡片,页面加载时,仓库信息会从GitHub API自动获取. 

::github{repo="xiaoxhan1234/Xhani-Blog"}

使用此段代码创建一个GitHub仓库卡片： `::github{repo="xiaoxhan1234/Xhani-Blog"}`.

```markdown
::github{repo="xiaoxhan1234/Xhani-Blog"}
```

## 告诫

支持以下类型的警告: `note` `tip` `important` `warning` `caution`

:::note[笔记]
突出显示用户即使在浏览时也应考虑的信息.
:::

:::tip[提示]
帮助用户取得更大成功的可选信息.
:::

:::important[重要的]
用户成功所需的关键信息.
:::

:::warning[警告]
由于潜在风险，需要用户立即关注的关键内容.
:::

:::caution[谨慎]
行动的潜在负面后果.
:::



### 基本语法

```markdown
:::note[笔记]
突出显示用户即使在浏览时也应考虑的信息.
:::
```

```markdown
:::tip[提示]
帮助用户取得更大成功的可选信息.
:::
```

```markdown
:::important[重要的]
用户成功所需的关键信息.
:::
```

```markdown
:::warning[警告]
由于潜在风险，需要用户立即关注的关键内容.
:::
```

```markdown
:::caution[谨慎]
行动的潜在负面后果.
:::
```

### 自定义标题

警告的标题可以自定义.

:::note[我的自定义标题]
这是带有自定义标题的注释.
:::

```markdown
:::note[我的自定义标题]
这是带有自定义标题的注释.
:::
```

### GitHub语法

> [!TIP]
> [GitHub语法](https://github.com/orgs/community/discussions/16925) 也支持.


```
> [!NOTE]
> GitHub语法也受支持.

> [!TIP]
> GitHub语法也受支持.
```


:::tip[提示]
**但是没办法更改GitHub的TIP显示了,只能保持原英文了.**
:::


### 剧透

您可以为文本添加剧透效果,该文本也支持 **Markdown** 语法.

内容:spoiler[被隐藏了**哎呀**]!

```markdown
:spoiler[被隐藏了**哎呀**]!
```