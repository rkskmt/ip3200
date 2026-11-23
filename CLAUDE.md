# CLAUDE.md

This repository is public. Keep this file and `doc/` to rules and their technical reasons; leave out dates, history, who decided, and anything specific to one author's machine or tools.

## Project Overview

Quarto-based website for an information processing course. Written in Japanese.

## Tech Stack

- **Quarto** website project; slides use the vendored **cleanslidekit-revealjs** extension (theme.scss + custom.css + UI JS + Lua filters, in `_extensions/rkskmt/cleanslidekit/`)
- **MathJax** for math rendering
- **D2** (quarto-d2) for diagrams
- Extensions: `cleanslidekit`, `d2`, `qmd-web` (all vendored; `qmd-web` lets the qmd web editor follow and live-update the published decks). Click-to-zoom images use Quarto's built-in lightbox (`lightbox: auto`; built in since Quarto 1.4, so the old `quarto-ext/lightbox` extension is not needed)

## Structure

- `_quarto.yml` — site config and resources
- `_metadata.yaml` — shared slide format settings (`cleanslidekit-revealjs` format + `d2` filter + `lightbox: auto`)
- `*.qmd` — lecture content files
- `imgs/` — image assets
- `_extensions/` — Quarto extensions
- `doc/` — authoring guides and reference docs

## Language

- Content is written in **Japanese**
- Code comments and commit messages are in **English**
- **English/Japanese mix in slides — intentional, not a defect:**
  - Explanatory prose, annotations, and callouts: **Japanese**. Japanese data/column names stay Japanese where natural.
  - **Key technical terms get English alongside Japanese at first appearance** (e.g. 内積（inner product）, 正規化（normalization）). This is a feature — students must learn the English. When auditing, **add the English where a term first appears without it** (this is worth a dedicated inspection pass).
  - **Standard English in matplotlib figures is fine — leave it.** Axis/label/title text that is itself a term a student should know (e.g. `Iteration Trajectory`) is good exposure; do not Japanize it just for uniformity. Use Japanese in figures only when the text is *explanation* aimed at understanding, not a term.

## Teaching Philosophy

Use Python as the vehicle, but frame concepts as broadly as possible. Where a concept is universal (e.g., iteration, container, method), note that it exists across languages. Prefer language-agnostic expressions alongside Python-specific ones.

## Matplotlib

- **Whenever using matplotlib, `import japanize_matplotlib`** — even if the current plot has no Japanese text, for consistency.
- **Do not use `rcParams['font.family']`** for Japanese — it never works reliably. `japanize_matplotlib` is the only reliable approach.

## Conventions

- `##` delimits slides (do not use `---`)
- `_metadata.yaml` applies the `cleanslidekit-revealjs` format (+ `d2` filter and `lightbox: auto`) to all `.qmd` files; theme, CSS, and UI JS ship from `_extensions/rkskmt/cleanslidekit/`
- **Theme classes and their attributes are catalogued in `_extensions/rkskmt/cleanslidekit/_schema.yml`** (`.table-style`, `.table-compact`, `.fig`, `.peek`, badges, …, each with its attributes); the kit's snippets sit beside it in `_snippets.json`. Read the schema before proposing or writing layout markup instead of guessing class names. It ships inside the vendored theme, so it is current on every clone.
- **To show a slide inside a slide, use `.mini-slide`** (a sample of the slides students hand in, a before/after of a slide design, a page of a report). Do not build one from a deck-local `<style>` or paste a screenshot of slide software: the mini slide is ordinary markdown, its text scales with the frame, and it prints in the handout as on screen. Sizes inside are in points of the page drawn (a page is 540pt high), so a rule such as "18pt minimum" can be shown true to scale. Content that does not fit is clipped without a warning, so check every page in the render. Parts and attributes: `_schema.yml`; usage: [doc/slide-notation.md](doc/slide-notation.md) §9; worked example: `presentation.qmd`.
- **Do not add frontmatter to `index.qmd`.**  Quarto **merges** (not overwrites) `format` from `_metadata.yaml` and the file, so adding `format: html` causes it to render in both formats and trigger a `rename` error. Raw HTML (e.g. `<details>/<summary>`) is fine — it needs no frontmatter.
- **Do not use `listing:` in `index.qmd` either.** Same reason — it requires `format: html`, which conflicts.
- `render: ["*.qmd"]` in `_quarto.yml` prevents `.md` files (e.g. CLAUDE.md) from being rendered
- **When adding a new `.qmd`, add it to `index.qmd`.** It is the site's only navigation: every page renders as revealjs slides, so the Quarto website navbar is never displayed — do not maintain a `navbar` in `_quarto.yml`.
- **`search-ui.js` provides site-wide full-text search**: a 検索 button + modal on every deck (shipped by the cleanslidekit extension) and the inline box on `index.qmd` (`#search-input`/`#search-results`). It reads Quarto's generated `search.json` and deep-links to slides via `#/slide-id` — no per-lecture maintenance.
- **Never add numbers to slide section headers or `index.qmd` link text.** Numbered slides (e.g. `## １. ...`) and numbered links (e.g. `第N回`) break on reorder — every insert or swap requires renaming every entry after it. Use plain titles only (e.g. `## \`in\` 演算子で存在確認`, `[dict改めて](dict.qmd)`).
- Use Quarto callouts for key concepts. **Give a callout its title with the `title="…"` attribute** (`::: {.callout-tip title="…"}`), never with a `##` heading inside it: `##` is the slide delimiter, and only a callout reads it as a title; the same line in a `.takeaway` or any other div starts a new slide.
- **Use bullet points only for parallel items, where listing them makes the slide easier to read.** They are not the default format for slide text. **Exercise/task statements:** a 演習 uses the exam-problem register — directive and concise beats polite filler, as long as it doesn't turn harsh:
   - **Problem statement**: one prose sentence in **命令形** (`…を自分のコードで確かめよ`, `…を実装せよ`), wrapped in `::: {.prompt}` (the plain problem-statement frame). Name the concrete action (`CSVで読み込み`), not vague framing (`〜を使って`).
   - **Steps**: a numbered list in **体言止め** — drop trailing する/出す (`columns で列名を確認`, `平均を比較`). Setup (data download) is **step 0** so the whole list aligns.
   - **Required outputs are explicit**: state them in parentheses (`（差分値も表示）`) instead of leaving what to print implicit.
   - Do NOT cram instructions into bullets or arrow chains (`まず予想 → 何度ちがう？ → 自分で書く`), and don't spoon-feed what students can discover with a taught tool (make checking `columns` a step instead of printing the column names in the text).
- **Decide each slide from its purpose; never apply a pattern uniformly.** Every convention in this file exists for a purpose, and so does every form that works on one slide. Before writing a slide, name what its reader cannot yet read or do and what the slide must add; each title, code line, comment and note is there for that. When a form fits one slide, do not copy it to the others: ask, slide by slide, whether the same reason holds there.
   - A supplement (an equivalent written with syntax the student already knows, a preview of the intermediate value, an extra variant) goes only on the slides where the main code cannot be read without it, and it follows the main code, because the main code is what the slide teaches.
   - Setup lines exist only when the slide uses them. Do not define data in a roundabout form because another slide needed that form.
   - A title says what the student wants to do. It does not restate the syntax.
   - Symptoms of the failure: the same supplement on every slide; a line that exists only to force a pattern; a title that reads like a code comment.
- **Every sentence on a slide must be written for the student — author-side circumstances are never slide content.** Litmus test: *does the student gain anything from reading this line?* Banned categories:
   - **Authoring/build decisions**: 「（この節だけでも実行できるよう、読み込みから用意）」「本スライドは `"directory"` を使っている — 教室のWi-Fiが切れても動くように」
   - **Curriculum decisions** — especially naming untaught material only to exclude it: 「`.plot.bar()` は今回は使わない」「だから3Dはこの回で扱った」
   - **Lecture-structure narration / pedagogical-effect claims**: 「今回は「◯◯」の回」「〜が体感できる」 "this builds intuition for △△"
   - Meta-information may stay only if reframed as a fact useful to the student: 「ここまで触ってきた動くグラフも、こうして保存したHTMLの埋め込み」 is fine; 「実は本スライドは以下のように埋め込んでいる」 is not.
   Teaching intent belongs in conversation, design notes, or `doc/` — never in the deck.
- **Do not introduce an established term with 「〜を X と呼ぶ」.** It reads as if the author were naming the thing on the spot. Put the term first and write what it is as a definition (`X：定義`).
   - Write out what 「この」「これ」 points to: 「ボタン操作に応じて呼ばれる関数を**コールバック関数**と呼ぶ」→「**コールバック関数**（[callback function]{.en}）：ボタン操作に応じて呼ばれる関数」. Swapping only the verb and keeping the pronoun (「これが X」) is not a fix.
   - The title of a slide that defines a term is the term itself (`## LUT（[**Look-Up Table**]{.en}）`).
   - 「と呼ぶ」 stays when the question "who calls it that?" has an answer: the subject is written (「scikit-learn は SSE を `inertia_` と呼ぶ」), the sentence states common usage (「と呼ばれる」「と呼ぶことが多い」), the deck picks one of several existing names, or the author declares a way of seeing something (「この距離を、その点の**誤差**と呼ぼう」).
   - Finding candidates by search is fine; decide whether and how to rewrite each sentence from its context. No bulk replacement.
- **Numbers are mostly unnecessary.** Do not use a count for emphasis (「1つの」「3本だけで」「たった2つ」). Write a number only when the number itself is the content (「引数は2個」「152件すべてを使う」).
- **Do not write 「○○を××で△△させる」 or 「○○を、××で△△する」.** What the sentence wants to say is usually △△ or ××: bring that to the front and write it short. Once it is in front, the comma after 「○○を」 is not needed either. Examples: 「勾配降下法という1つの探し方で、回帰も分類も NN も学習させる」→「回帰と分類と NN を勾配降下法で学習可能」; 「データに合う直線を、勾配降下法で求める」→「勾配降下法でデータに合う直線を求める」.
- **Do not copy the output into the prose, and never state running times.** The printed output and the figure already show the numbers; prose that repeats them only creates text to re-check whenever the output changes. Write only what the output cannot say: the property it shows, or a prediction made before running. Running times (「約20分」「このPCで」「数秒」) depend on the machine: never write them. (Times for classroom activities, such as 「30秒で説明」, are instructions and are fine.)
- **Never require untaught syntax.** Exercises (演習/Tweak) must be solvable with only what earlier slides have introduced — a one-line preview in a callout is fine, quizzing on it is not. Related consistency checks: introduce a feature on its **first** use (not silently one slide early), and back-references must be literally true (「前ページのコード」 only if it *is* the previous page; otherwise 「さっきのコード」).
- **Assume students run Python in VSCode as normal `.py` scripts, not notebooks.** Code examples must be copy-pasteable into a Python file and still show the intended output.
- **Echoed executed cells (`echo: true`) must be self-contained** — include their own `import` and `read_csv`. Quarto runs all cells in one kernel, so a cell missing an import renders fine but breaks for the student who copies just that cell. Hidden authoring cells (`echo: false`) may share kernel state freely.
- **`eval: false` cells (解答例) are never executed at render — run them manually before shipping** (including live-API solutions). Every 演習 slide carries a `code-fold` 解答例; keep this invariant when adding exercises.
- **Any data file a code cell reads must have a download link in the slide body.** Students run the copied code on their own machine, so a bare `pd.read_csv("data/foo.csv")` / `np.loadtxt("data/foo.csv")` fails unless they can obtain `foo.csv`. Put `[foo.csv](data/foo.csv)` in the slide text and tell them to place it in their `data/` folder (see the tokyo_temp / datasaurus / students slides). Never show runnable student code that reads a data file without a download link for that file. (Exception: hidden `echo: false` figure cells may read committed CSVs without a link — students use the live-API code shown in the `code-fold` block instead.)
- **Never fabricate figure data.** A chart presented as the result of an API or dataset must be computed from that real data — no `np.linspace` + noise stand-ins. For network sources, fetch once, commit the CSV under `data/` (e.g. `tanabata_pageviews_2025.csv`, `tokyo_population.csv`), load it in a hidden cell, and show the live-API code in a `code-fold`. Interpretation bullets must describe features actually present in the data — verify every number/claim against the file before writing it.
- **Do not use notebook-only display style** such as a bare `df`, `df.head()`, `df.shape`, `series`, or expression as the final line when the goal is to show output. Use `print(...)` for textual/tabular output (e.g. `print(df.head())`, `print(df.shape)`). Use plotting calls like `plt.show()` when the goal is a figure.
- For large tables or arrays, show only a small, intentional preview such as `print(df.head())`; do not dump all rows unless the full output is pedagogically necessary (a 20-row dump pushes captions/callouts below the fold).
- **One slide = one idea.** If bullets + code + output + note don't fit the 720px slide, split the slide at the conceptual seam (e.g. 条件抽出 became "mask を作る" and "行を残す") rather than shrinking the content. Some scroll on code+figure slides is idiomatic in this course; a caption or callout stranded far below the fold is not.
- **Figure/image sizing: `#| out-width` and pixel `width` attributes do NOT work.** The theme's `.reveal img { width: auto; height: auto }` (custom.css) overrides HTML width/height attributes, so Quarto's `out-width` silently renders at natural size. Shrink figures with `#| classes: fig-small` (max-height 300px) / `fig-medium` (400px) on the cell, or wrap in `::: {.fig width="60%"}` — figscale.lua moves a *percentage* width onto the img as an inline style, which does win over the theme CSS. After resizing, check the rendered slide: a callout pushed below the fold by an oversized figure is the usual symptom.
- **String literals in student-visible code use double quotes** (`"数学I"`, `{"User-Agent": "..."}`). Inside f-string braces keep single quotes for Python <3.12 compatibility (`f"{d['title']}"`); genuine Python repr output shows singles — leave real output as-is.
- **Highlight marker (`==text==`):** `hl.lua` filter turns `==text==` into a highlighted span (white text + cyan outline). Since cleanslidekit v1.4.0 phrases with spaces work too (`==a b==`); a literal `a == b` or an unclosed `==` stays untouched. `[a b]{.hl}` also still works.
- **`**bold**` in a slide title (`##`) becomes a solid label chip** (white on the title's near-black, rounded — a content color like blue would compete with code/links in the body), not bold (the title is already bold, so plain bold is invisible). `## **Tweak** 線の見た目` renders `Tweak` as a blue chip. Write the chip directly followed by the title with **no colon after it** — the chip's own margin separates it (`## **Tweak** …`, `## **重要** …`, `## **例** …`). This is generic and universal — any `**word**` directly in a title becomes a chip showing that word, so it is not Tweak-specific. In *body* text `**bold**` is still ordinary bold. Exception: `**…**` inside `{.en}` (abbreviation spell-out, e.g. `## LUT（[**Look-Up Table**]{.en}）`) is nested, not a direct child, so it stays plain bold. Styled via `.reveal h2 > strong` in `custom.css`.
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

**Recommend a full render before the next deploy when one is due.** The deploy publishes `_site/` as is (`--no-render`), and rendering single decks never removes files from `_site/`, so decks or images that were deleted or renamed stay on the public site under their old URLs (details in [doc/deploy.md](doc/deploy.md)). When a task deletes or renames a `.qmd`, an image or another resource, or a render was interrupted, close your report by recommending `quarto render && quarto publish gh-pages --id gh-pages --no-render --no-prompt`; a bare `quarto render` empties `_site/` before rendering every deck. After ordinary edits, do not recommend it.

## Self-contained, reproducible builds

Each repo must build from a **fresh clone** on any machine with nothing more than `conda env create -f environment.yml` + `quarto render` (on Windows, `python setup.py` in place of `conda env create`: conda cannot extract the conda-forge `d2` package there without symlink privilege, so `setup.py` installs `d2` from its release). Do **not** rely on globally-installed tools or on running `quarto add` after cloning.

- **Commit `_extensions/`** — Quarto extensions are vendored, not regenerated. Never gitignore `_extensions/`, or a fresh clone fails to build.
- **Declare every build-time tool in `environment.yml`** — e.g. the `d2` CLI (used by the quarto-d2 diagram filter) is a `conda-forge` dependency, not a global install.

## Style or functionality changes

Most tasks are content editing — the conventions above are all you need.

When changing CSS, theme, or `_metadata.yaml`: read **[doc/troubleshooting.md](doc/troubleshooting.md)** first. It covers which `custom.css` copy to edit (the extension one — the root copy is overwritten on render), the Pandoc vs reveal CSS layers, and cache-clearing steps.

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

- **[doc/slide-notation.md](doc/slide-notation.md)** — image/citation overlay notation (`.fig-cite`, `.content-box`, etc.) and the mini slide (`.mini-slide`)
- **[doc/deploy.md](doc/deploy.md)** — GitHub Pages deploy instructions
- **[doc/troubleshooting.md](doc/troubleshooting.md)** — CSS/style changes: which custom.css to edit, Pandoc vs reveal layers, cache issues
- **[doc/engaging-lecture-design.md](doc/engaging-lecture-design.md)** — lecture design playbook (cold open, quiz-then-reveal, one-dataset-per-section)
