# Static Site Development Environment

このプロジェクトは、静的サイト開発のための環境構築テンプレートです。Gulpを使用して、SCSSのコンパイル、JavaScriptのバンドル、画像の最適化、HTMLの生成などのタスクを自動化します。

## 機能

- SCSSのコンパイルと最適化
- JavaScriptのバンドルと最適化（Webpack + Babel）
- 画像の最適化（imagemin）
- WebP形式への画像変換
- EJSテンプレートエンジンによるHTML生成
- ブラウザの自動リロード（BrowserSync）
- 開発環境と本番環境の分離

## 必要条件

- Node.js (v14以上推奨)
- npm (v6以上推奨)

## インストール

```bash
# 依存関係のインストール
npm install
```

## 使用方法

### 開発サーバーの起動

```bash
# 開発サーバーを起動（ファイルの変更を監視）
npm run dev

# または、ビルドせずに直接開発サーバーを起動
npm run start
```

### ビルド

```bash
# 開発環境用のビルド
npm run build

# 本番環境用のビルド
npm run prod
```

## プロジェクト構造

```
.
├── src/
│   ├── assets/
│   │   ├── scss/      # SCSSファイル
│   │   ├── js/        # JavaScriptファイル
│   │   └── images/    # 画像ファイル
│   ├── ejs/          # EJSテンプレート
│   └── data/         # データファイル
├── dist/             # 開発環境のビルド出力
├── prod/             # 本番環境のビルド出力
├── gulpfile.js       # Gulp設定ファイル
└── package.json      # プロジェクト設定
```

## 主要なタスク

- `npm run dev`: 開発環境用のビルドを実行し、開発サーバーを起動（ファイルの変更を監視）
- `npm run start`: ビルドせずに直接開発サーバーを起動
- `npm run build`: 開発環境用のビルドを実行
- `npm run prod`: 本番環境用のビルドを実行

## 画像最適化

このプロジェクトでは、以下の画像最適化機能を提供しています：

- JPEG/PNG画像の圧縮（imagemin）
- WebP形式への変換（gulp-webp）
  - 品質: 80%
  - 圧縮方法: 6（高圧縮率）

## 技術スタック

- Gulp
- Webpack
- Babel
- Sass
- EJS
- BrowserSync
- imagemin
- gulp-webp

## ライセンス

ISC