# 高専3年 情報処理（IP3200）

Quarto で作成した授業スライド。  
公開URL: https://rkskmt.github.io/ip3200/

## セットアップ

### 必要なもの

- [Quarto](https://quarto.org/docs/get-started/) (>= 1.8)
- Python 3.10+
- NumPy, Matplotlib, japanize-matplotlib

### Python パッケージのインストール

```bash
pip install numpy matplotlib japanize-matplotlib
```

### ローカルプレビュー

```bash
quarto preview --port 4321
```

ブラウザで `http://localhost:4321` が開く。ファイルを保存するとホットリロードされる。

### ビルド・デプロイ

```bash
quarto render            # _site/ に出力
quarto publish gh-pages  # GitHub Pages へデプロイ
```

## ファイル構成

```
_quarto.yml       サイト設定・ナビゲーション
_metadata.yaml    スライド共通設定（テーマ・CSS・フィルタ）
index.qmd         トップページ（リンク一覧）
*.qmd             各回のスライド
imgs/             画像ファイル
doc/              執筆ガイド・トラブルシュート
hl.lua            -text- ハイライト用 Lua フィルタ
cite-image.lua    画像引用表示用 Lua フィルタ
_extensions/      Quarto 拡張（clean-revealjs テーマ等）
```

## スライドの書き方

### 基本ルール

- スライド区切りは `##`（`---` は使わない）
- 本文はバレットポイントで書く（地の文は避ける）
- 重要概念は Quarto callout（`.callout-note`, `.callout-tip`, `.callout-warning`）を使う

### 新しいスライドを追加する

1. `xxx.qmd` を作成
2. `index.qmd` にリンクを追加
3. `_quarto.yml` の `navbar` にも追加

3つ揃えないとナビゲーションがずれるので注意。

### インラインコード（バッククォート）

本文中の `` `code` `` は **太字・青（`#005cc5`）・等幅** で表示される。  
コードブロックのシンタックスハイライトと同系色。

```markdown
NumPy では `@` が内積の演算子
```

### ハイライトマーカー（`-text-`）

`hl.lua` フィルタにより、`-text-` と書くと縁取り付きのハイライト表示になる。  
バッククォートのインラインコードとは別のスタイル（白文字＋シアン縁取り）。

```markdown
NumPy では -@- が内積の演算子
```

**制約:**

- 中身に記号（`.` `@` `*` `()` 等）を含む必要がある。英数字のみの単語（`-hello-`）はマッチしない（ハイフン付き単語との誤爆防止）
- スペースを含む場合は `[a @ b]{.hl}` と書く

### Matplotlib で日本語

```python
import japanize_matplotlib  # これだけでOK
```

`rcParams['font.family']` は使わない（動作が不安定）。

### 数式の `\vec{}` の高さ揃え

`\vec{a}` と `\vec{b}` で矢印の高さが揃わない問題の対処：

```latex
\vec{\vphantom{b}a}   ← b と高さが揃う
```

## 参考ドキュメント

- [doc/slide-notation.md](doc/slide-notation.md) — 画像引用・オーバーレイ表記
- [doc/deploy.md](doc/deploy.md) — GitHub Pages デプロイ手順
- [doc/troubleshooting.md](doc/troubleshooting.md) — CSS変更時の注意点（Pandoc vs revealjs の区別等）
