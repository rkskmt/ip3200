# Troubleshooting

## CSS in `_metadata.yaml` — Pandoc vs revealjs

CSS in `_metadata.yaml` `include-in-header` overrides two distinct layers. Knowing which layer owns what is critical for writing correct selectors.

### Pandoc-generated CSS (code blocks)

Pandoc generates the HTML structure for code blocks and injects its own `<style>` in the `<head>`. These selectors describe that structure:

| What | Selector |
|---|---|
| Line number counter | `pre.numberSource code > span > a:first-child::before` |
| Span positioning for line numbers | `pre.numberSource code > span` |
| Pre margin/padding for line numbers | `pre.numberSource` |
| Language class on pre | `pre.shell`, `pre.python`, etc. |
| Syntax highlight spans | `code span.kw`, `code span.im`, etc. |

To override Pandoc CSS: use bare selectors + `!important`. Do **not** prefix with `.reveal`.

### revealjs/clean-revealjs theme CSS

The theme owns layout, slide structure, and typography:

| What | Selector |
|---|---|
| Slide headings | `h2`, `h3` |
| Slide body text | `p`, `li` |
| Tables | `table`, `table td` |
| Callout blocks | `.callout-note`, `.callout-tip` |

Same rule: bare selectors + `!important`. Do **not** prefix with `.reveal` in `include-in-header`.

### Rule summary

**Never use `.reveal` as a prefix in `include-in-header` CSS — it silently fails.**

- Wrong: `.reveal table { border-bottom: none }`
- Right: `table { border-bottom: none !important }`
- Wrong: `.reveal pre.shell { padding-left: 1em }`
- Right: `pre.shell { padding-left: 1em !important }`

---

## `quarto render` rename error

```
ERROR: NotFound: No such file or directory (os error 2): rename '.../index.html' -> '.../_site/index.html'
```

**Cause**: Adding `format: html` or `listing:` to `index.qmd` causes Quarto to merge it with `clean-revealjs` from `_metadata.yaml`, producing conflicting outputs for the same `index.html`.

**Fix**: Remove all frontmatter from `index.qmd` and keep it as a plain link list (see the `ai` project's `index.qmd`).

---

## Stale cache after `_metadata.yaml` change

If `_metadata.yaml` is changed, run `rm -rf _site` and restart `quarto preview` with a fixed port to avoid port changes:

```bash
rm -rf _site && quarto preview --port 4321
```
