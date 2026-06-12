# 性能监控指南

本文档介绍如何在项目中配置和使用性能监控工具。

## 目录

- [概述](#概述)
- [快速开始](#快速开始)
- [Lighthouse CI 配置](#lighthouse-ci-配置)
- [性能基准管理](#性能基准管理)
- [GitHub Actions 集成](#github-actions-集成)
- [常见问题](#常见问题)

---

## 概述

项目集成了以下性能监控工具：

| 工具 | 用途 |
|------|------|
| Lighthouse CI | 自动化性能测试 |
| Web Vitals | 运行时性能监控 |
| Performance Observer | 自定义指标收集 |

### 性能指标目标

| 指标 | 目标值 | 说明 |
|------|--------|------|
| Performance Score | ≥ 0.85 | Lighthouse 性能分数 |
| FCP | ≤ 2000ms | 首次内容绘制 |
| LCP | ≤ 4000ms | 最大内容绘制 |
| TTI | ≤ 5000ms | 可交互时间 |
| CLS | ≤ 0.1 | 累积布局偏移 |

---

## 快速开始

### 1. 运行性能测试

```bash
# 构建项目
pnpm build

# 运行 Lighthouse CI（自动启动 preview server）
pnpm lhci autorun
```

### 2. 查看性能报告

测试结果保存在 `.lighthouseci/` 目录：

```bash
# 查看 JSON 格式的详细报告
cat .lighthouseci/lhr-*.json

# 查看当前性能指标
node scripts/performance-baseline.js
```

### 3. 更新性能基准

首次使用时，需要建立性能基准：

```bash
node scripts/performance-baseline.js --update
```

---

## Lighthouse CI 配置

### 配置文件

主配置文件：`lighthouserc.json`

```json
{
  "ci": {
    "collect": {
      "numberOfRuns": 3,
      "url": [
        "http://localhost:4321/",
        "http://localhost:4321/about/",
        "http://localhost:4321/anime/"
      ]
    },
    "assert": {
      "assertions": {
        "categories:performance": ["warn", { "minScore": 0.85 }],
        "first-contentful-paint": ["warn", { "maxNumericValue": 2000 }]
      }
    }
  }
}
```

### 配置说明

| 选项 | 说明 |
|------|------|
| `numberOfRuns` | 运行次数，结果取平均值 |
| `url` | 要测试的页面 URL |
| `minScore` | 最小分数阈值 |
| `maxNumericValue` | 最大数值阈值（毫秒） |

---

## 性能基准管理

### 基准文件

性能基准保存在 `performance-baseline.json`：

```json
{
  "baseline": {
    "homepage": {
      "url": "http://localhost:4321/",
      "metrics": {
        "performance": 0.85,
        "first-contentful-paint": 1800,
        "largest-contentful-paint": 3500
      }
    }
  },
  "thresholds": {
    "regressionPercent": 10
  }
}
```

### 管理命令

```bash
# 查看当前性能指标（不更新基准）
node scripts/performance-baseline.js

# 更新性能基准
node scripts/performance-baseline.js --update

# 检查性能回归
node scripts/performance-check.js
```

### 回归检测

当性能指标下降超过 10% 时会报警：

```
⚠️  Performance regressions detected!
  ❌ first-contentful-paint
     Current: 2500.00ms
     Baseline: 1800.00ms
     Change: +38.9%
```

---

## GitHub Actions 集成

### 自动运行

推送代码后会自动运行 Lighthouse CI 检查：

```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI
on: [push, pull_request]
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - run: pnpm install
      - run: pnpm build
      - uses: treosh/lighthouse-ci-action@v11
        with:
          configPath: "./lighthouserc.json"
          uploadArtifacts: true
          temporaryPublicStorage: true
```

### 检查结果

CI 检查包括：

- ✅ Astro Check（类型检查）
- ✅ ESLint（代码规范）
- ✅ Build（构建测试）
- ⚠️ Lighthouse（性能测试）

---

## 常见问题

### Q: Lighthouse 测试失败怎么办？

1. 检查网络连接是否正常
2. 确认端口 4321 未被占用
3. 查看详细错误信息：

```bash
npx lhci autorun --verbose
```

### Q: 如何排除某些检查？

编辑 `lighthouserc.json`，将不想检查的指标设为 `"off"`：

```json
"uses-optimized-images": "off",
"uses-webp-images": "off"
```

### Q: 如何添加新的测试页面？

编辑 `lighthouserc.json`，在 `url` 数组中添加：

```json
"url": [
  "http://localhost:4321/",
  "http://localhost:4321/about/",
  "http://localhost:4321/anime/",
  "http://localhost:4321/new-page/"  // 新页面
]
```

### Q: 性能波动大怎么办？

1. 增加运行次数：

```json
"numberOfRuns": 5
```

2. 使用中位数而非平均值
3. 设置更宽松的阈值

### Q: LHCI Server 未配置会怎样？

本地运行时，报告会保存到 `.lighthouseci/` 目录，不会影响测试。但 GitHub Actions 中会报错：

```
Error: Must provide token for LHCI target
```

如需完整功能，请配置 [LHCI Server](https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/server.md)。

---

## 相关资源

- [Lighthouse CI 文档](https://github.com/GoogleChrome/lighthouse-ci)
- [Web Vitals](https://web.dev/vitals/)
- [Lighthouse 性能评分](https://developer.chrome.com/docs/lighthouse/performance/performance-scoring/)
