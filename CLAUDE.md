# CLAUDE.md

## Project Overview

Quarto-based website for an information processing course. Written in Japanese.

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

## Matplotlib

- **Whenever using matplotlib, `import japanize_matplotlib`** — even if the current plot has no Japanese text, for consistency.
- **Do not use `rcParams['font.family']`** for Japanese — it never works reliably. `japanize_matplotlib` is the only reliable approach.

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
- **Assume students run Python in VSCode as normal `.py` scripts, not notebooks.** Code examples must be copy-pasteable into a Python file and still show the intended output.
- **Do not use notebook-only display style** such as a bare `df`, `df.head()`, `df.shape`, `series`, or expression as the final line when the goal is to show output. Use `print(...)` for textual/tabular output (e.g. `print(df.head())`, `print(df.shape)`). Use plotting calls like `plt.show()` when the goal is a figure.
- For large tables or arrays, show only a small, intentional preview such as `print(df.head())`; do not dump all rows unless the full output is pedagogically necessary.
- **Highlight marker (`==text==`):** `hl.lua` filter turns `==text==` into a highlighted span (white text + cyan outline). For text with spaces use `[a b]{.hl}`.
- **MathJax `\vec{}` height fix:** `\vec{a}` and `\vec{b}` render at different heights because `b` has an ascender. Use `\vec{\vphantom{b}a}` to match the arrow height of shorter letters to `b`.

## Error Handling

- **No `getattr`** — use direct attribute access (`obj.attr`).
- **Never swallow failures.** Wrong type, missing value, missing package, or unexpected state must raise an error, not be hidden by `try/except`, `continue`, `pass`, a silent fallback/default, or `.get()` when the key must exist.
- Prefer an immediate crash with a stack trace. It points directly at the source of the problem; a swallowed failure lets corrupted state propagate and usually surfaces later as a harder-to-debug bug.
- If a lecture needs a dependency, add it to `environment.yml`. Do not add fallback code for a missing dependency.

## Build

```bash
quarto preview --port 4321   # local dev server (fixed port)
quarto render                # build to _site/
```

**Do not run `quarto preview` or `quarto render` yourself.** The user handles previewing and building.

## Style or functionality changes

Most tasks are content editing — the conventions above are all you need.

When changing CSS, theme, or `_metadata.yaml`: read **[doc/troubleshooting.md](doc/troubleshooting.md)** first. It covers the Pandoc vs revealjs CSS distinction (critical — easy to confuse), the no-`.reveal`-prefix rule, and cache-clearing steps.

**JavaScript robustness:** Inline JS in `_metadata.yaml` must be defensive. On slow networks, DOM elements or `Reveal` may not be ready when scripts run. Wrap operations in `try/catch` and check for existence (`if (!window.Reveal) return;`). Uncaught errors can break other scripts (e.g., MathJax) loaded on the same page.

**Event listener priority:** Inline JS in `.qmd` files loses to Quarto/revealjs event handlers by default. To intercept keyboard events before revealjs, use capture phase and stop propagation:
```javascript
document.addEventListener('keydown', function(e) {
  e.preventDefault();
  e.stopImmediatePropagation();
  // ...
}, true);  // capture phase
```

## Reference Docs

- **[doc/slide-notation.md](doc/slide-notation.md)** — image/citation overlay notation (`.fig-cite`, `.content-box`, etc.)
- **[doc/deploy.md](doc/deploy.md)** — GitHub Pages deploy instructions
- **[doc/troubleshooting.md](doc/troubleshooting.md)** — CSS/style changes: Pandoc vs revealjs, selector rules, cache issues
- **[footer-nav.md](footer-nav.md)** — footer navigation script notes
