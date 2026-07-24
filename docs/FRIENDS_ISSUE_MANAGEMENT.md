# 友链 Issue 管理

通过 GitHub Issue 管理友情链接，由 GitHub Actions 自动生成 `src/data/friends.ts`。

## 工作流程

```
申请者提交 Issue（按模板填写）
    │  自动打上「待审核」标签
    ▼
博主审阅
    ├─ 通过 → 可选：评论 /tags: 标签名 → 将标签改为「friends:approved」→ 自动构建
    └─ 拒绝 → 关闭 Issue / 打拒绝标签 → 不构建
```

关闭已通过的 Issue → 下次触发时自动从数据文件中移除该友链。

## 标签说明

| 标签 | 说明 |
|------|------|
| `待审核` | 提交后的初始状态 |
| `friends:approved` | 触发自动构建并收录 |

## 指定分类（tags）

在 Issue 评论区留如下格式的评论，**只有仓库 Owner 的评论会被识别**：

```
/tags: 朋友们
```

多个分类用逗号分隔：

```
/tags: 朋友们, 技术
```

不留评论则使用默认值 `["朋友们"]`，以最新一条为准。

## 文件说明

```
.github/
├── ISSUE_TEMPLATE/
│   └── 04-friend-request.yml   # 友链申请表单
├── scripts/
│   └── build-friends.js        # 生成 friends.ts 的构建脚本
└── workflows/
    └── build-friends.yml       # Actions workflow
```

## 注意事项

- 只有**仓库 Owner** 操作 Issue 才会触发构建，申请者的操作不会触发
- 只扫描 `state=open` 且带 `friends:approved` 标签的 Issue
- `id` 字段使用 Issue Number，天然唯一
