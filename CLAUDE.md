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
- `##` delimits slides (do not use `---`)
- `_metadata.yaml` applies `clean-revealjs` to all `.qmd` files
- **Do not add `format: html` to `index.qmd`.** Quarto **merges** (not overwrites) `format` from `_metadata.yaml` and the file, causing it to render in both formats and trigger a `rename` error. Keep `index.qmd` as a simple link list with no frontmatter, as in the `ai` project.
- **Do not use `listing:` in `index.qmd` either.** Same reason — it requires `format: html`, which conflicts.
- `render: ["*.qmd"]` in `_quarto.yml` prevents `.md` files (e.g. CLAUDE.md) from being rendered
- **When adding a new `.qmd`, always update both `index.qmd` and `_quarto.yml`.** `index.qmd` is the link list; `_quarto.yml` is the navbar. Missing either one leaves them out of sync.
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

## フッターカスタムナビ

`_metadata.yaml` の `<script>` を変更する場合は **[footer-nav.md](footer-nav.md)** を参照。

---

## よくある失敗

### `quarto render` で rename エラーが出る

```
ERROR: NotFound: No such file or directory (os error 2): rename '.../index.html' -> '.../_site/index.html'
```

**原因**: `index.qmd` に `format: html` や `listing:` を書いていると、`_metadata.yaml` の `clean-revealjs` とマージされ、両フォーマットで同じ `index.html` を出力しようとして衝突する。

**対処**: `index.qmd` のフロントマターを削除し、シンプルなリンクリストにする（`ai` プロジェクトの `index.qmd` を参照）。
