# CLAUDE.md

## Project Overview

Quarto-based website for "高専3年 情報処理" (3rd-year KOSEN Information Processing). Written in Japanese.

## Tech Stack

- **Quarto** website project with `clean-revealjs` slide format
- **MathJax** for math rendering
- Extensions: `lightbox`

## Structure

- `_quarto.yml` — site config and navigation
- `*.qmd` — lecture content files
- `imgs/` — image assets
- `_extensions/` — Quarto extensions

## Conventions

- Content is written in **Japanese**
- `##` がスライドの区切り（`---` は使わない）
- `_metadata.yaml` が全 `.qmd` に `clean-revealjs` を適用するため、スライドではないページ（`index.qmd` など）には `format: html` を個別に指定する
- `_quarto.yml` の `render: ["*.qmd"]` で `.md` ファイル（CLAUDE.md等）がレンダリングされないようにしている
- Use Quarto callouts for key concepts

## Build

```bash
quarto preview   # local dev server
quarto render    # build to _site/
```

- `_metadata.yaml` を変更した場合は `rm -rf _site` してから `quarto preview` を再起動する（古いキャッシュで壊れることがある）
