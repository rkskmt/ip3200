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

箇条書きは本文の既定フォーマットではない。複数の並列な情報や、学生が行う手順を
整理する必要があるときに使う。コード・表・図の後ろに説明文を置くためだけに `-` を
付けない。

同じリストに置く項目は、同じ問いに答え、同じ情報の種類でなければならない。用語の
定義・具体例・実行指示・結論を、見た目を揃えるために同じ箇条書きへ混在させない。
役割が変わる箇所は見出し、表、caption、calloutのいずれかで区切る。見出しは次のように
使い分ける。見た目だけで一律に置き換えず、情報の階層で選ぶ。

箇条書きの項目内でも、文の後ろに `—` で補足文を継ぎ足さない
（`〜と表示される — この404が status code`）。前の文への補足・言い換え・帰結は
一段下げた子項目にする。1〜2語の短い言い換えは（　）で畳む。
`用語 — 説明` の対応リスト（`total` — 全件数）はこの形のままでよい。

| 記法 | 役割 | 例 |
|---|---|---|
| `###` | 同じスライド内の同格な大項目、`.panel-tabset` のタブ | マウスの場合 / ショートカットの場合、WPM / KPM、検索系 / ページ情報 |
| `####` | コード・例・参照など、直後の要素につける細い罫線付き見出し | インストール、コード冒頭でimport、ブラウザで開く |

`###` に該当する大項目がないスライドでは、無理に使わない。

悪い例（定義と具体例が同じリストに混在）:

```markdown
- **API** — データ取得などのために公開された仕組み
- **エンドポイント** — APIの中の、具体的な処理を呼ぶ個別のURL
- Wikimediaのランキング用エンドポイントでは、条件をURLに埋め込む
```

よい例（定義は表、具体例は小見出しで分離）:

```markdown
| 用語 | 意味 |
|---|---|
| **API** | データ取得などのために公開された仕組み |
| **エンドポイント** | APIの中の、具体的な処理を呼ぶ個別のURL |

#### Wikimediaのランキング用エンドポイント

条件をURLに埋め込む。
```

別の悪い例（略称、定義、類比、操作が混在）:

```markdown
- **JavaScript Object Notation** の略
- ある文法に従ったテキスト
- CSVも仲間
- `.json()` でPythonの値に変換
```

この場合はJSONの定義を1つの文にまとめ、操作へ移る箇所に `#### Pythonの値に変換`
を置く。

補足だから削除するのではない。学生に必要な情報や、理解を深める面白い事実なら、
本文との役割を区別できるタイトル付きcalloutに置く。削除するのは、学生に伝える内容が
ない編集者目線の説明や、直前のコード・表・図を言い直すだけの文。

コードセルや表の **後ろ** に説明を置くときは、役割で容器を使い分ける
（上端の主たる箇条書きと同じ見た目にしない）:

| 内容 | 容器 |
|---|---|
| 出力そのものの説明（「〜と表示される」「〜の行が残る」「結果は `Series`」） | `::: {.caption-note}` |
| スライドの結論・主張（強調したい一言） | callout（`.callout-tip` / `-important` / `-warning` を意図で選ぶ） |
| その節の前提・主たる論点 | 通常の箇条書き（コードの **前** に置く） |

→ 「コードの後ろに素の `-` 箇条書き」を残さないのが原則。

---

## 9. 演習スライドの書き方（`.prompt` 枠＋設問レジスタ）

演習は**試験問題のレジスタ**で書く。指示的で簡潔なほど良い（嫌なニュアンスに
ならない範囲で）。「〜しましょう」等の丁寧フィラーは使わない。

- **問題文**：命令形の散文1文（「〜を自分のコードで**確かめよ**」「〜を**実装せよ**」）。
  「〜を使って」のような曖昧な枠組みではなく、具体的な動作（「CSVで読み込み」）を書く。
  `::: {.prompt}` の素の角丸枠で囲む（色つきヘッダの callout とは別物 —
  「この段落が問題文」と示すだけのプレーンな枠）。
- **手順**：番号リストで**体言止め**（「`columns` で列名を**確認**」「平均を**比較**」—
  語尾の「する／出す」は省く）。データDLなどの準備は**ステップ0**にして左端を揃える。
- **要求する出力は明示**：「（差分値も表示）」のように括弧で添える。
- 教えた道具で生徒が自分で調べられること（列名など）は、答えを書かずに手順にする。

```markdown
## 演習：◯◯ {.badge-practice}

::: {.prompt}
△△をCSVで読み込み、**□□がどうなるのか**を自分のコードで確かめよ。
:::

0. [foo.csv](data/foo.csv) をダウンロードして `data` フォルダに置く
1. `pd.read_csv()` で読み込み、`columns` で列名を確認
2. 条件抽出で◯◯の行に分ける
3. それぞれの平均を比較（差分値も表示）
```

- `.prompt` の CSS は cleanslidekit 拡張の `custom.css`（`.reveal .prompt`）。
  いまは IP3200 のみ（`.tweak`・タイトルチップと同じく、テーマ本体への同期待ち）。

---

## 10. コードセルの書き方（自己完結）

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
├── _metadata.yaml      # cleanslidekit-revealjs 形式 + d2 フィルタ + 組み込み lightbox
├── _quarto.yml         # resources: ["imgs/**", "iframes/**"] で_siteへコピー
├── imgs/               # 画像置き場
└── iframes/            # Plotly 等の埋め込み用 HTML
```

> **注意**: CSS `background-image` に使う画像は `<img>` タグ経由でないと Quarto が自動コピーしない。
> `_quarto.yml` の `resources: ["imgs/**"]` で全画像をコピーするよう設定済み。

---

## 9. ミニスライド `.mini-slide`（スライドの中に描くスライド）

スライドの見本を、スライドの中に小さなページとして描く。学生が提出するスライドの
見本、スライドデザインの修正前・修正後、レポートの1ページなどに使う。
使用例は `presentation.qmd`（発表のテンプレート）。

```markdown
::::: {.mini-slide width="60%" label="見本"}

::: {.mini-title}
課題
:::

:::: {.mini-row}

::: {.mini-col}
- **ペルソナ**：佐藤 葵（3年生、バスケットボール部）
- **不便なこと**：締め切りの連絡が、科目ごとに別の手段で届く
:::

::: {.mini-fig}
[数学：口頭]{.mini-chip}
[英語：メール]{.mini-chip}
↓
[見落とす]{.mini-chip .warn}
:::

::::

::: {.mini-foot}
担当：青木
:::

:::::
```

- 中身は普通の Markdown（段落・箇条書き・表・画像・コード）
- ページは縦横比を保ち、文字は枠の幅に合わせて拡大・縮小する。ハンドアウト PDF
  でも画面と同じレイアウトで出る
- 文字の大きさは「描いているページ上のポイント」で決まる。ページの高さを 540pt
  （PowerPoint の 16:9 スライドは 960pt × 540pt）として扱うので、既定の本文は
  24pt、いちばん小さい `.mini-foot` が 18pt 相当になる
- **収まらない内容は警告なしに切れる**。レンダリング結果を1ページずつ確認し、
  切れたら `text` を下げるか内容を減らす
- ミニスライドの中にミニスライドは置けない（レンダリングが止まる）

### 枠の属性

| 属性 | 意味 | 既定 |
|---|---|---|
| `width` | 枠の幅（`60%`、`640px`）。指定すると中央に寄る | 親ブロック（カラムなど）の幅いっぱい |
| `ratio` | ページの縦横比 `W:H` | `16:9` |
| `text` | 本文の大きさ（ページ上のポイント）。タイトルなどは連動する | `24` |
| `accent` | タイトルの下線・`.mini-lead`・`.mini-chip .accent` の色 | `#2f6fb7` |
| `label` | 右上の小さなラベル（`見本`、`修正前` など） | なし |

### 中に置く部品

| 部品 | 役割 |
|---|---|
| `.mini-title` | ページのタイトル（アクセント色の下線つき） |
| `.mini-lead` | 色つきの帯に載せた一言（コンセプトなど） |
| `.mini-row` | 横並び。`.mini-col` は幅を等分し、`.mini-fig` は図の幅だけを取る |
| `.mini-fig` | 中央寄せの図。画像か、`[文字]{.mini-chip}` と矢印の文字を1行ずつ積んだ簡単な図 |
| `[文字]{.mini-chip}` | 角丸の小さな箱。`.accent` でアクセント色、`.warn` で赤 |
| `.mini-foot` | ページ右下の1行（担当者名、ページ番号、出典） |
| `.cover`（枠に付ける） | タイトルページ。全体が中央寄せになり、`.mini-title` が大きくなる |

### 画像

画像の大きさは **ページに対する割合** で書く。枠の幅が変わっても同じ比率で出る。

```markdown
![](imgs/presentation/screen_home.png){height="66%"}
```

- `height="66%"` はページの高さの 66%、`width="40%"` はページの幅の 40%
- `px` など割合以外の単位はレンダリングが止まる（枠に追従しないため）
- ミニスライド内の画像はクリックで拡大しない（`.nolightbox` が自動で付く）

### カラムに入れるとき

`width` を付けずにカラムへ入れると、カラムの幅に合う。横に説明を並べる形：

```markdown
::::: {.columns}

:::: {.column width="62%"}
::: {.mini-slide label="見本"}
…
:::
::::

:::: {.column width="38%"}
#### 入れる項目

- …
::::

:::::
```

実装は cleanslidekit 拡張の `mini-slide.lua` と `custom.css`。部品と属性の一覧は
`_extensions/rkskmt/cleanslidekit/_schema.yml` にもある。
