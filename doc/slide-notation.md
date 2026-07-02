# Quarto スライド 画像・引用 記法

両プロジェクト（`IP3200/`、`ai/`）共通の記法。

## セットアップ

CSS と Lua フィルター（`cite-image.lua`・`plotly-iframe.lua` 等）は cleanslidekit 拡張（`_extensions/rkskmt/cleanslidekit/`）が同梱。プロジェクト側の追加設定は不要。

---

## 1. 部分画像 + 引用オーバーレイ

```markdown
::: {.fig-cite src="imgs/image.png" height="400px"}

::: {.cite}
出典: <https://example.com>
:::

:::
```

- `src` — 画像パス（`imgs/` 相対）
- `height` — div の高さ（省略時 `60%`）
- 画像は `background-size: contain` で縦横比を保って収まる
- `.cite` が右下にオーバーレイ表示される
- **注意**: `:::` の対応を必ず揃える。最後の `:::` が `.fig-cite` を閉じる

---

## 2. 全画面スライド + 引用オーバーレイ

```markdown
## スライドタイトル {.bg-cover src="imgs/image.png"}

::: {.cite}
出典: <https://example.com>
:::
```

- スライドの `<section>` 要素を背景画像で塗りつぶす（レターボックス外には影響しない）
- `background-size: cover` で全面を埋める
- スライドタイトル（h2）は自動的に非表示になる（`.no-header` が付与される）
- タイトルなしにしたい場合は `## {.bg-cover src="..."}` と空にする

---

## 3. コンテンツボックス（`.content-box`）

背景画像の上にテキストを半透明ボックスで重ねる。`.fig-cite` 内でも `.bg-cover` スライド内でも使える。

### デフォルト（中央）

```markdown
::: {.content-box}
内容
:::
```

### 右下（`.pos-br`）

```markdown
::: {.content-box .pos-br}
内容
:::
```

### 中央・左寄せ（`.pos-cl`）

```markdown
::: {.content-box .pos-cl}
内容
:::
```

### 組み合わせ例（`.fig-cite` + `.content-box` + `.cite`）

```markdown
::: {.fig-cite src="imgs/image.png" height="90%"}

::: {.content-box .pos-br}
- ポイント1
- ポイント2
:::

::: {.cite}
出典: <https://example.com>
:::

:::
```

- コンテンツ幅は最大 `60%` に制限される
- `position: absolute` なので親要素（`.fig-cite` or section）を基準に配置される

---

## 4. `.cite` 単体

`position: absolute` なので、親要素（`position: relative`）の右下に表示される。

- `.fig-cite` の中 → 画像右下
- `.bg-cover` スライド直下 → スライド右下

---

## 5. ブレイクスライド（`.break-slide`）

セクション区切り用の白背景タイトルスライド。

```markdown
## {background-color="white" .center .break-slide}

::: {.break-title}
タイトルテキスト
:::
```

- `h2` の下線が自動的に非表示になる
- `.break-title` で文字の下に細い線が入る
- インラインコード（`` ` `` ）も使用可能

---

## 6. Plotly iframe 埋め込み（`.plotly-iframe`）

revealjs で Plotly の地図などを埋め込むと、スライド遷移時にレイアウトが崩れる問題がある。
これを回避するため、Plotly を別 HTML に書き出して iframe で埋め込む。

### 基本

```markdown
::: {.plotly-iframe src="iframes/cholera_map.html"}
:::
```

### サイズ指定

```markdown
::: {.plotly-iframe src="iframes/map.html" width="800" height="400"}
:::
```

- `width` — iframe の幅（デフォルト: 900）
- `height` — iframe の高さ（デフォルト: 520）
- 自動で中央寄せされる

### Python 側の書き出し

```python
fig.write_html("iframes/map.html", include_plotlyjs="directory")
```

- `iframes/` フォルダに出力
- `include_plotlyjs="directory"` で `plotly.min.js` を同フォルダに書き出す（オフラインでも動く。`"cdn"` は軽いがネット必須）
- `_quarto.yml` の `resources: ["iframes/**"]` で `_site` にコピーされる

---

## 7. その他の CSS クラス

| クラス | 効果 |
|---|---|
| `.fig-small` | 画像の最大高さを 300px に制限 |
| `.fig-medium` | 画像の最大高さを 400px に制限 |
| `.no-header` | スライドの h2 を非表示 |

---

## 8. キャプション `.caption-note`（表・図・コード出力の注記）

表・図・コードセルの出力の **直下に置く注記**。本文の箇条書き（主たる論点）とは
別物の見た目（枠つき・セリフ・小さめ・中央）にして、「すぐ上の要素の説明」だと
一目で分かるようにする。

```markdown
| | 現代文 | 数学I |
|---|---|---|
| 田中 | 80 | 70 |

::: {.caption-note}
上端が **columns**、左端が **index**
:::
```

- CSS は cleanslidekit 拡張の `custom.css`（`.reveal .caption-note`）。フォントは
  **システムのセリフのみ**（Web フォントの DL はしない）。
- テーマ本体には取り込み済み。ai の vendored 拡張は未同期（使うときにテーマから同期する）。

### コードの「後ろの説明」は素の箇条書きにしない

コードセルや表の **後ろ** に説明を置くときは、役割で容器を使い分ける
（上端の主たる箇条書きと同じ見た目にしない）:

| 内容 | 容器 |
|---|---|
| 出力そのものの説明（「〜と表示される」「〜の行が残る」「結果は `Series`」） | `::: {.caption-note}` |
| スライドの結論・主張（強調したい一言） | callout（`.callout-tip` / `-important` / `-warning` を意図で選ぶ） |
| その節の前提・主たる論点 | 通常の箇条書き（コードの **前** に置く） |

→ 「コードの後ろに素の `-` 箇条書き」を残さないのが原則。

---

## 9. コードセルの書き方（自己完結）

学生は各スライドのコードを単体で `.py` にコピペして実行する前提（→ `CLAUDE.md`）。
したがって:

- **各 `{python}` セルは単体で動く**。必要な `import` とデータ用意
  （`pd.read_csv(...)` や toy の `pd.DataFrame(...)`）をそのセルに含め、前スライドの
  変数（`df` など）に依存しない。
- **`print` の細切れ禁止**。1スライド原則1セル。複数の値を見せたいときは1セル内に
  `print()` を並べる（セルを分割しない）。

```python
# 良い例：このセルだけで動く
import pandas as pd

df = pd.read_csv("data/students.csv")

print(df.head())
print(df.shape)
print(df.columns)
```

---

## ファイル構成

```
プロジェクト/
├── _extensions/rkskmt/cleanslidekit/   # テーマ拡張（cite-image.lua / plotly-iframe.lua / CSS を同梱）
├── _metadata.yaml      # cleanslidekit-revealjs 形式 + d2/lightbox フィルタ
├── _quarto.yml         # resources: ["imgs/**", "iframes/**"] で_siteへコピー
├── imgs/               # 画像置き場
└── iframes/            # Plotly 等の埋め込み用 HTML
```

> **注意**: CSS `background-image` に使う画像は `<img>` タグ経由でないと Quarto が自動コピーしない。
> `_quarto.yml` の `resources: ["imgs/**"]` で全画像をコピーするよう設定済み。
