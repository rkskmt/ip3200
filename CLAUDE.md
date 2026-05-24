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
- `doc/` — authoring guides and reference docs

## Language

- Content is written in **Japanese**
- Code comments, commit messages, and Claude's reasoning should be in **English**

## Teaching Philosophy

Use Python as the vehicle, but frame concepts as broadly as possible. Where a concept is universal (e.g., iteration, container, method), note that it exists across languages. Prefer language-agnostic expressions alongside Python-specific ones.

## Matplotlib Japanese Text

- **Do not use `rcParams['font.family']`** for Japanese — it never works reliably.
- Always use `import japanize_matplotlib` instead.

## Conventions

- Content is written in **Japanese**
- `##` delimits slides (do not use `---`)
- `_metadata.yaml` applies `clean-revealjs` to all `.qmd` files
- **Do not add frontmatter to `index.qmd`.**  Quarto **merges** (not overwrites) `format` from `_metadata.yaml` and the file, so adding `format: html` causes it to render in both formats and trigger a `rename` error. Raw HTML (e.g. `<details>/<summary>`) is fine — it needs no frontmatter.
- **Do not use `listing:` in `index.qmd` either.** Same reason — it requires `format: html`, which conflicts.
- `render: ["*.qmd"]` in `_quarto.yml` prevents `.md` files (e.g. CLAUDE.md) from being rendered
- **When adding a new `.qmd`, always update both `index.qmd` and `_quarto.yml`.** `index.qmd` is the link list; `_quarto.yml` is the navbar. Missing either one leaves them out of sync.
- **Never add numbers to slide section headers or `index.qmd` link text.** Numbered slides (e.g. `## １. ...`) and numbered links (e.g. `第N回`) break on reorder — every insert or swap requires renaming every entry after it. Use plain titles only (e.g. `## \`in\` 演算子で存在確認`, `[dict改めて](dict.qmd)`). Same rule applies to `_quarto.yml` navbar `text:` labels.
- Use Quarto callouts for key concepts
- Slide text should use **bullet points**, not prose sentences
- **Highlight marker (`==text==`):** `hl.lua` filter turns `==text==` into a highlighted span (white text + cyan outline). For text with spaces use `[a b]{.hl}`.
- **MathJax `\vec{}` height fix:** `\vec{a}` and `\vec{b}` render at different heights because `b` has an ascender. Use `\vec{\vphantom{b}a}` to match the arrow height of shorter letters to `b`.

## Build

```bash
quarto preview --port 4321   # local dev server (fixed port)
quarto render                # build to _site/
```

## Style or functionality changes

Most tasks are content editing — the conventions above are all you need.

When changing CSS, theme, or `_metadata.yaml`: read **[doc/troubleshooting.md](doc/troubleshooting.md)** first. It covers the Pandoc vs revealjs CSS distinction (critical — easy to confuse), the no-`.reveal`-prefix rule, and cache-clearing steps.

## Reference Docs

- **[doc/slide-notation.md](doc/slide-notation.md)** — image/citation overlay notation (`.fig-cite`, `.content-box`, etc.)
- **[doc/deploy.md](doc/deploy.md)** — GitHub Pages deploy instructions
- **[doc/troubleshooting.md](doc/troubleshooting.md)** — CSS/style changes: Pandoc vs revealjs, selector rules, cache issues
- **[footer-nav.md](footer-nav.md)** — footer navigation script notes
