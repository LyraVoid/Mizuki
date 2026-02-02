# 🌸 Mizuki
<img align='right' src='logo.png' width='200px' alt="Mizuki logo">

[Astro](https://astro.build) で構築された高度な機能と美しいデザインを備えた、モダンで機能が豊富な静的ブログテンプレート。

[![Node.js >= 20](https://img.shields.io/badge/node.js-%3E%3D20-brightgreen)](https://nodejs.org/)
[![pnpm >= 9](https://img.shields.io/badge/pnpm-%3E%3D9-blue)](https://pnpm.io/)
[![Astro](https://img.shields.io/badge/Astro-5.15.3-orange)](https://astro.build/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue)](https://www.typescriptlang.org/)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg?logo=apache)](https://opensource.org/licenses/Apache-2.0)

[**🖥️ ライブデモ**](https://mizuki.mysqil.com/) | [**📝 ドキュメント**](https://docs.mizuki.mysqil.com/)

🌏 **README の言語:**
[**English**](./README.md) / [**中文**](./README.zh.md) / [**日本語**](./README.ja.md) / [**中文繁体**](./README.tw.md) /

包括的なドキュメントですぐに始めましょう。テーマのカスタマイズや機能の設定、本番環境へのデプロイなどブログを完成させるために必要なすべての情報がドキュメントに網羅されています。

[📚 完全なドキュメントを読む](https://docs.mizuki.mysqil.com/) →

![Mizuki Preview](./README.webp)

<table>
  <tr>
    <td><img alt="" src="docs/image/1.webp"></td>
    <td><img alt="" src="docs/image/2.webp"></td>
    <td><img alt="" src="docs/image/3.webp"></td>
  <tr>
  <tr>
    <td><img alt="" src="docs/image/4.webp"></td>
    <td><img alt="" src="docs/image/5.webp"></td>
    <td><img alt="" src="docs/image/6.webp"></td>
  <tr>
</table>

## 🚀 NEW: 自動解像度スケーリング

> **🎯 スマート解像度アルゴリズム** - デバイスの解像度に応じてレイアウトをインテリジェントに適応、あらゆるデバイスでの閲覧体験を提供します。

🌏 **README の言語:**
[**English**](./README.md) /
[**中文**](./README.zh.md) /
[**日本語**](./README.ja.md) /
[**中文繁体**](./README.tw.md) /

### 🔧 コンポーネント構成システムを再構築
- **統合された構成アーキテクチャ:** 全く新しいモジュール型コンポーネント構成システムにより、動的なコンポーネント管理と順序設定に対応
- **構成駆動型のコンポーネントの読み込み:** サイドバーコンポーネントを再構築し、完全に構成ベースのコンポーネントの読み込みメカニズムを実装しています
- **統合コントロールの切り替え:** 音楽プレーヤーとお知らせのコンポーネントを独立した有効化切り替えを削除、sidebarLayoutConfig を通じた統合コントロールを実現しています
- **適応型レスポンシブレイアウト:** コンポーネントはレスポンシブレイアウトに対応しており、デバイスの種類に応じた表示を自動調整します

### 📐 レイアウトシステムを最適化
- **動的なサイドバーの位置調整:** 自動なレイアウト適応による、左右サイドバーの切り替えに対応
- **インテリジェントな記事ディレクトリの位置付け:** サイドバーが右側にある場合に自動で左側に移動で、より良い読書体験を提供します
- **グリッドレイアウトの改善:** CSS グリッドレイアウトを最適化でコンテナ幅の異常問題を解決済み

### 🎛️ 構成ファイル形式の標準化
- **標準化された構成形式:** 統一されたコンポーネント設定ファイル形式仕様を作成
- **型安全性:** 構成の型安全性を確保するための TypeScript 型な定義
- **拡張性:** カスタムコンポーネントタイプと構成オプションに対応

### 🧹 コードの最適化
- **テストファイルのクリーンアップ:** 未使用なテスト構成と依存関係を削除でプロジェクトのサイズを削減
- **コード構造の最適化:** コンポーネントアーキテクチャの改善でコードの保守性を向上
- **パフォーマンスを向上:** コンポーネントの読み込みロジックを最適化し、ページレンダリングパフォーマンスを向上

---

## ✨ 機能

### 🎨 デザインとインターフェース
- [x] [Astro](https://astro.build)と[Tailwind CSS](https://tailwindcss.com)で構築
- [x] [Swup](https://swup.js.org/)を使用したスムーズなアニメーションとページ遷移
- [x] システム設定検出機能付きのライト/ダークテーマ切り替え
- [x] カスタマイズ可能なテーマカラーと動的バナーカルーセル
- [x] カルーセル、透明度、ぼかし効果を備えた全画面背景画像
- [x] すべてのデバイスに対応した完全レスポンシブデザイン
- [x] JetBrains Monoフォントによる美しいタイポグラフィ

### 🔍 コンテンツと検索
- [x] [Pagefind](https://pagefind.app/)ベースの高度な検索機能
- [x] 構文強調表示付きの[拡張Markdown機能](#-markdown拡張機能)
- [x] 自動スクロール機能付きのインタラクティブな目次
- [x] RSSフィード生成
- [x] 読書時間の推定
- [x] 記事のカテゴリ化とタグシステム



### 📱 特別ページ
- [x] **アニメトラッキングページ** - アニメの視聴進捗と評価を追跡
- [x] **友達ページ** - 友達のウェブサイトを美しいカードで紹介
- [x] **日記ページ** - ソーシャルメディアのような生活の瞬間を共有
- [x] **アーカイブページ** - 記事の整理されたタイムラインビュー
- [x] **アバウトページ** - カスタマイズ可能な自己紹介

### 🛠 技術的特徴
- [x] [Expressive Code](https://expressive-code.com/)ベースの**拡張コードブロック**
- [x] KaTeXレンダリングによる**数式サポート**
- [x] PhotoSwipeギャラリー統合による**画像最適化**
- [x] サイトマップとメタタグを含む**SEO最適化**
- [x] 遅延読み込みとキャッシュによる**パフォーマンス最適化**
- [x] Twikoo統合による**コメントシステム**

## 🚀 クイックスタート

### 📦 インストール

1. **リポジトリをクローン：**
   ```bash
   git clone https://github.com/matsuzaka-yuki/mizuki.git
   cd mizuki
   ```

2. **依存関係をインストール：**
   ```bash
   # pnpmがインストールされていない場合はインストール
   npm install -g pnpm
   
   # プロジェクトの依存関係をインストール
   pnpm install
   ```

3. **ブログを設定：**
   - `src/config.ts`を編集してブログ設定をカスタマイズ
   - サイト情報、テーマカラー、バナー画像、ソーシャルリンクを更新
   - 機能ページの機能を設定

4. **開発サーバーを起動：**
   ```bash
   pnpm dev
   ```
   ブログは`http://localhost:4321`で利用可能になります

### 📝 コンテンツ管理

- **新しい投稿を作成：** `pnpm new-post <ファイル名>`
- **投稿を編集：** `src/content/posts/`内のファイルを修正
- **特別ページをカスタマイズ：** `src/content/spec/`内のファイルを編集
- **画像を追加：** 画像を`src/assets/`または`public/`に配置

### 🚀 デプロイ

ブログを任意の静的ホスティングプラットフォームにデプロイ：

- **Vercel：** GitHubリポジトリをVercelに接続
- **Netlify：** GitHubから直接デプロイ
- **GitHub Pages：** 付属のGitHub Actionsワークフローを使用
- **Cloudflare Pages：** リポジトリを接続

デプロイ前に、`astro.config.mjs`の`site` URLを更新してください。

## 📝 投稿フロントマター形式

```yaml
---
title: 私の最初のブログ投稿
published: 2023-09-09
description: これは私の新しいブログの最初の投稿です。
image: ./cover.jpg
tags: [タグ1, タグ2]
category: フロントエンド
draft: false
pinned: false
lang: ja      # 記事の言語がconfig.tsのサイト言語と異なる場合のみ設定
---
```

### フロントマターフィールドの説明

- **title**: 記事のタイトル（必須）
- **published**: 公開日（必須）
- **description**: SEOとプレビュー用の記事の説明
- **image**: カバー画像のパス（記事ファイルからの相対パス）
- **tags**: カテゴリ化のためのタグの配列
- **category**: 記事のカテゴリ
- **draft**: 本番環境で記事を非表示にするには`true`に設定
- **pinned**: 記事を上部に固定するには`true`に設定
- **lang**: 記事の言語（サイトのデフォルト言語と異なる場合のみ設定）

### ピン留め記事機能

`pinned`フィールドを使用すると、重要な記事をブログリストの上部に固定できます。ピン留めされた記事は、公開日に関係なく、常に通常の記事の前に表示されます。

**使用方法：**
```yaml
pinned: true  # この記事を上部に固定
pinned: false # 通常の記事（デフォルト）
```

**ソートルール：**
1. ピン留め記事が最初に表示され、公開日でソート（最新が先）
2. 通常の記事がその後に表示され、公開日でソート（最新が先）

## 🧩 Markdown拡張機能

Mizukiは標準のGitHub Flavored Markdownを超える拡張機能をサポートしています：

### 📝 拡張ライティング
- **コールアウト：** `> [!NOTE]`、`> [!TIP]`、`> [!WARNING]`などを使用して美しい注釈ボックスを作成
- **数式：** `$インライン$`と`$$ブロック$$`構文を使用してLaTeX数式を記述
- **コード強調表示：** 行番号とコピーボタン付きの高度な構文強調表示
- **GitHubカード：** `::github{repo="ユーザー/リポジトリ"}`を使用してリポジトリカードを埋め込み

### 🎨 ビジュアル要素
- **画像ギャラリー：** 画像表示のための自動PhotoSwipe統合
- **折りたたみセクション：** 展開可能なコンテンツブロックを作成
- **カスタムコンポーネント：** 特別なディレクティブでコンテンツを強化

### 📊 コンテンツ整理
- **目次：** 見出しから自動生成され、スムーズスクロールをサポート
- **読書時間：** 自動計算して表示
- **記事メタデータ：** カテゴリとタグを含む豊富なフロントマターサポート

## ⚡ コマンド

すべてのコマンドはプロジェクトルートから実行します：

| コマンド                    | アクション                                |
|:---------------------------|:----------------------------------------|
| `pnpm install`             | 依存関係をインストール                     |
| `pnpm dev`                 | `localhost:4321`でローカル開発サーバーを起動 |
| `pnpm build`               | 本番サイトを`./dist/`にビルド              |
| `pnpm preview`             | デプロイ前にビルドをローカルでプレビュー     |
| `pnpm check`               | Astroエラーチェックを実行                  |
| `pnpm format`              | Prettierでコードをフォーマット                |
| `pnpm lint`                | コードの問題をチェックして修正              |
| `pnpm new-post <ファイル名>` | 新しいブログ投稿を作成                     |
| `pnpm astro ...`           | Astro CLIコマンドを実行                   |

## 🎯 設定ガイド

### 🔧 基本設定

`src/config.ts`を編集してブログをカスタマイズ：

```typescript
export const siteConfig: SiteConfig = {
  title: "あなたのブログ名",
  subtitle: "あなたのブログの説明",
  lang: "ja", // または "zh-CN"、"en" など
  themeColor: {
    hue: 210, // 0-360、テーマの色相
    fixed: false, // テーマカラーピッカーを非表示
  },
  banner: {
    enable: true,
    src: ["assets/banner/1.webp"], // バナー画像
    carousel: {
      enable: true,
      interval: 0.8, // 秒
    },
  },
};
```

### 📱 機能ページの設定

- **アニメページ：** `src/pages/anime.astro`でアニメリストを編集
- **友達ページ：** `src/content/spec/friends.md`で友達データを編集
- **日記ページ：** `src/pages/diary.astro`で瞬間を編集
- **アバウトページ：** `src/content/spec/about.md`でコンテンツを編集

### 📦 コードとコンテンツの分離（オプション）

Mizukiは、コードとコンテンツを2つの独立したリポジトリに分けて管理することをサポートしており、チーム协作や大規模プロジェクトに適しています。

**簡単選択**:

| 使用シナリオ | 設定方法 | 対象者 |
|---------|---------|---------|
| 🆕 **ローカルモード**（デフォルト） | 設定不要、そのまま使用 | 初心者、個人ブログ |
| 🔧 **分離モード** | `ENABLE_CONTENT_SYNC=true`を設定 | チーム协作、プライベートコンテンツ |

**ワンクリック有効化/無効化**:

```bash
# 方法 1: ローカルモード（初心者向け）
# .envファイルを作成せず、そのまま実行
pnpm dev

# 方法 2: コンテンツ分離モード
# 1. 設定ファイルをコピー
cp .env.example .env

# 2. .envを編集してコンテンツ分離を有効化
ENABLE_CONTENT_SYNC=true
CONTENT_REPO_URL=https://github.com/your-username/Mizuki-Content.git

# 3. コンテンツを同期
pnpm run sync-content
```

**機能**:
- ✅ パブリックおよびプライベートリポジトリをサポート 🔐
- ✅ ワンクリックで有効化/無効化、コード修正不要
- ✅ 自動同期、開発前に最新コンテンツを自動プル

📖 **詳細設定**: [コンテンツ分離完全ガイド](docs/CONTENT_SEPARATION.md)
🔄 **移行チュートリアル**: [シングルリポジトリから分離モードへ移行](docs/MIGRATION_GUIDE.md)
📚 **その他のドキュメント**: [ドキュメントインデックス](docs/README.md)

## ✏️ 貢献

貢献は歓迎します！お気軽に問題やプルリクエストを提出してください。

1. リポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを開く

## 📄 ライセンス

このプロジェクトはApacheライセンス2.0の下でライセンスされています - 詳細は[LICENSE](./LICENSE)ファイルをご覧ください。

### 元のプロジェクトライセンス

このプロジェクトは[Fuwari](https://github.com/saicaca/fuwari)に基づいて開発され、元のプロジェクトはMITライセンスを使用しています。MITライセンスの要件に従い、元の著作権表示と許可通知はLICENSE.MITファイルに含まれています。

## 🙏 謝辞

- オリジナルの[Fuwari](https://github.com/saicaca/fuwari)テンプレートをベースにしています
- [Yukina](https://github.com/WhitePaper233/yukina) - 美しくエレガントなブログテンプレートにインスパイアされました
- 一部のデザインは [Firefly](https://github.com/CuteLeaf/Firefly) と [Twilight](https://github.com/spr-aachen/Twilight) テンプレートからインスピレーションを得ています
- [Pio](https://github.com/Dreamer-Paul/Pio)を使用してかわいいLive2D看板娘プラグインを実装
- [Astro](https://astro.build)と[Tailwind CSS](https://tailwindcss.com)で構築
- アイコンは[Iconify](https://iconify.design/)から

### 🌸 特別な感謝

- **[Fuwari](https://github.com/saicaca/fuwari)** by saicaca - このプロジェクトのベースとなるオリジナルテンプレート。このような美しく機能的なテンプレートを作成していただきありがとうございます。
- **[Yukina](https://github.com/WhitePaper233/yukina)** - このプロジェクトの形成に役立ったデザインのインスピレーションと創造性を提供してくれたことに感謝します。Yukinaは優れたデザイン原則とユーザーエクスペリエンスを示す、エレガントなブログテンプレートです。
- **[Firefly](https://github.com/CuteLeaf/Firefly)** - 優れたレイアウトデザインのアイデアを提供していただきありがとうございます。デュアルサイドバーレイアウト、記事の2カラムグリッドレイアウト、およびいくつかのウィジェットのデザインと実装により、Mizukiのインターフェースがより豊かになりました。
- **[Twilight](https://github.com/spr-aachen/Twilight)** - インスピレーションと技術的なサポートを提供していただきありがとうございます。Twilight の動的壁紙モード切り替えシステム、レスポンシブデザイン、およびトランジション効果は、Mizuki のユーザーエクスペリエンスを大幅に向上させました。

## 🍀 コントリビューター

このプロジェクトに貢献してくださったすべてのコントリビューターに感謝します。質問や提案がある場合は、[Issue](https://github.com/matsuzaka-yuki/Mizuki/issues)または[Pull Request](https://github.com/matsuzaka-yuki/Mizuki/pulls)を提出してください。

<a href="https://github.com/matsuzaka-yuki/Mizuki/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=matsuzaka-yuki/Mizuki" />
</a>

## ⭐ Star History

[![Star History Chart](https://api.star-history.com/svg?repos=matsuzaka-yuki/Mizuki&type=Date)](https://star-history.com/#matsuzaka-yuki/Mizuki&Date)
---

⭐ このプロジェクトが役立つと思ったら、スターを付けることを検討してください！
