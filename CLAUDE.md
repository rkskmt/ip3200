# CLAUDE.md

## Project Overview

Quarto-based website for "高専3年 情報処理" (3rd-year KOSEN Information Processing). Written in Japanese.

## Tech Stack

- **Quarto** website project with `clean-revealjs` slide format
- **MathJax** for math rendering
- Extensions: `lightbox`

## Structure

- `_quarto.yml` — site config and navigation
- `_metadata.yaml` — shared slide format settings (revealjs theme, CSS)
- `*.qmd` — lecture content files
- `imgs/` — image assets
- `_extensions/` — Quarto extensions

## Conventions

- Content is written in **Japanese**
- `##` がスライドの区切り（`---` は使わない）
- `_metadata.yaml` が全 `.qmd` に `clean-revealjs` を適用する
- **`index.qmd` には `format: html` を書かない。** Quarto は `_metadata.yaml` の `format` とファイルの `format` を上書きではなく**マージ**するため、両方のフォーマットでレンダーされ `rename` エラーになる。`index.qmd` は `ai` プロジェクトと同様、フロントマターなしのシンプルなリンクリストにする。
- **`index.qmd` に `listing:` も使わない。** 同じ理由で `format: html` が必要になり衝突する。
- `_quarto.yml` の `render: ["*.qmd"]` で `.md` ファイル（CLAUDE.md等）がレンダリングされないようにしている
- Use Quarto callouts for key concepts

## Build

```bash
quarto preview   # local dev server
quarto render    # build to _site/
```

- `_metadata.yaml` を変更した場合は `rm -rf _site` してから `quarto preview` を再起動する（古いキャッシュで壊れることがある）

## GitHub Pages へのデプロイ

```bash
quarto publish gh-pages --no-prompt --id ip3200
```

- 初回セットアップ時に `_publish.yml` が必要（内容は以下）:

```yaml
- source: project
  gh-pages:
    - id: "ip3200"
      branch: gh-pages
```

- SSH 認証が必要（`~/.ssh/id_rsa` が GitHub に登録済みであること）
- `.gitignore` に `_site/` と `.quarto/` を含めること（ビルド成果物はコミットしない）

## よくある失敗

### `quarto render` で rename エラーが出る

```
ERROR: NotFound: No such file or directory (os error 2): rename '.../index.html' -> '.../_site/index.html'
```

**原因**: `index.qmd` に `format: html` や `listing:` を書いていると、`_metadata.yaml` の `clean-revealjs` とマージされ、両フォーマットで同じ `index.html` を出力しようとして衝突する。

**対処**: `index.qmd` のフロントマターを削除し、シンプルなリンクリストにする（`ai` プロジェクトの `index.qmd` を参照）。
