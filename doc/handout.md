# 配布用PDF（ハンドアウト・著者向け）

各回スライドを配布用PDF（ハンドアウト形式 — 1スライド1ページではなく実際の高さで流し込み、コード全行・図も完全表示）にできる。**著者が手作業で作る**もので、学生のビルドには不要（ビルド自体に chromium 依存を持ち込まない）。

## 必要なもの（初回のみ）

- **PDF化ツール `qmd2pdf`**：テーマ repo [`quarto-cleanslidekit-revealjs`](https://github.com/rkskmt/quarto-cleanslidekit-revealjs) の `tools/qmd2pdf`。このrepoの隣に clone しておく（例：`../quarto-cleanslidekit-revealjs`）。
- **Chromium**（HTMLをブラウザ印刷してPDF化するため）：`quarto install chromium`（一度だけ。`~/.local/share/quarto/chromium` に入り、ツールが自動検出する）
- **node**（ツールが使う一時ローカルサーバ用）

## 生成

```bash
quarto render                                   # まず _site/ をビルド
TOOL=../quarto-cleanslidekit-revealjs/tools/qmd2pdf
for f in _site/*.html; do
  name=$(basename "${f%.html}"); [ "$name" = index ] && continue
  "$TOOL" "$f" --no-render -o "pdf/$name.pdf"
done
```

`pdf/*.pdf` が出力される。`index.qmd` は各回に `[PDF](pdf/<name>.pdf)` のリンクを張ってあり、`_quarto.yml` の `resources: pdf/**` で `_site/` にコピーされて配信される。1枚=1ページ版が要るときは `--mode slides`。

## 公開と更新

- `pdf/` は **`.gitignore`**（生成物なので git には入れない）。`quarto publish gh-pages` 時に手元の `pdf/` が `_site/` 経由で公開サイトへ載る。
- スライドを直したら、その回だけ再生成して publish すればよい（毎回全部作る必要はない）。
