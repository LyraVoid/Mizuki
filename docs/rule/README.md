# Mizuki 开发规范

本目录包含了 Mizuki 项目的开发规范文档，用于指导组件化开发和代码重构。

## 规范列表

### 1. [组件架构设计规范](./01-component-architecture.md)

**说明**：定义 Mizuki 的组件分层架构、命名规范和代码组织方式。

**关键点**：
- 组件分层架构（atoms/molecules/organisms）
- 文件命名和组织规范
- 组件职责分离原则
- 组件复用模式

### 2. [组件拆分指南](./02-component-split-guide.md)

**说明**：如何识别需要拆分的组件，以及拆分的具体方法和最佳实践。

**关键点**：
- 组件拆分的判断标准
- 超大型组件拆分实例
- 拆分步骤和验证方法
- 避免常见拆分错误

### 3. [文件组织架构规范](./03-file-organization-architecture.md)

**说明**：定义项目的文件组织架构，包括目录结构、文件命名和模块化原则。

**关键点**：
- 完整的目录树结构
- 各目录职责说明
- 文件命名规范
- 模块化组织原则
- 文件依赖管理

### 4. [CSS 样式指南](./04-css-style-guide.md)

**说明**：CSS 样式规范，禁止使用 `!important` 级别（Twikoo 除外）。

**关键点**：
- 禁止使用 `!important`（Twikoo 组件除外）
- 使用 CSS 变量和 Tailwind 工具类
- 提高选择器优先级替代 `!important`
- Twikoo 样式文件规范和最佳实践
- 暗色主题样式实现方式

### 5. [原子化组件使用规范](./05-atom-component-usage.md)

**说明**：规定必须优先使用现有原子化组件，以及在缺少合适组件时创建新组件。

**关键点**：
- 优先使用现有 atoms/ 和 misc/ 组件
- 重复 UI 代码超过 2 次应考虑抽取为组件
- 创建新组件的判断标准
- 组件分层架构说明
- 常见使用场景和决策流程

### 6. [侧栏组件开发指南](./06-sidebar-widget-dev.md)

**说明**：规范侧栏组件的接入流程，避免"配置了组件但页面不显示"的遗漏。

**关键点**：
- 侧栏组件接入的 3 个必要步骤
- 在 `WidgetComponentType` 中声明组件类型
- 在 `sidebarLayoutConfig` 中配置布局
- **在所有侧栏渲染器的 componentMap 中注册组件**（最易遗漏）
- 常见问题排查

## 代码审查检查清单

在提交代码前，请确保：

- [ ] 组件遵循分层架构规范（atoms/molecules/organisms）
- [ ] 组件文件名符合命名规范（PascalCase）
- [ ] 组件行数控制在合理范围内（< 500行）
- [ ] 复杂组件已按功能拆分为子组件
- [ ] **优先使用现有原子化组件（atoms/、misc/）**
- [ ] **重复 UI 代码超过 2 次应抽取为新组件**
- [ ] 使用现有通用组件和 Hooks，避免重复代码
- [ ] 组件职责单一明确
- [ ] 样式使用原子组件或统一样式系统
- [ ] 组件使用 TypeScript 定义 Props 接口
- [ ] 代码格式化通过（`pnpm run format`）
- [ ] Lint 检查通过（`pnpm run lint`）
- [ ] 没有使用 `!important`（Twikoo 组件除外）
- [ ] 使用 Tailwind 工具类或 CSS 变量
- [ ] 暗色主题使用 CSS 变量实现
- [ ] **侧栏组件已在所有相关 componentMap 中注册**
- [ ] **侧栏组件的类型已在 `WidgetComponentType` 中声明**
- [ ] **侧栏组件已在 `sidebarLayoutConfig.components` 中配置**

## 参考资源

- [Aruma 组件架构](../../demo/Aruma/docs/rule/05-component-architecture.md)
- [Astro 组件最佳实践](https://docs.astro.build/zh-cn/core-concepts/astro-components/)
- [组件驱动开发](https://componentdriven.org/)

## 相关文档

- [../README.md](../README.md) - 项目主文档
- [../DEPLOYMENT.md](../DEPLOYMENT.md) - 部署指南
- [../CONTENT_SEPARATION.md](../CONTENT_SEPARATION.md) - 内容分离指南

---

**最后更新**: 2026-03-21
**维护者**: Mizuki 开发团队
