# Deploy to GitHub Pages

```bash
quarto publish gh-pages --id gh-pages --no-render --no-prompt
```

- 変更したデッキだけを render する。公開のためにサイト全体を render し直さない
- SSH 認証が必要（GitHub に公開鍵を登録）

## 非対話シェルでデッキを render するとき（cron / CI / headless）

`conda activate` が効かない環境では、env の2つを **両方** 明示的に設定する：

```bash
ENV="$(conda info --base)/envs/IP3200"
export QUARTO_PYTHON="$ENV/bin/python"   # 無いと render が plotly 等を見失う
export PATH="$ENV/bin:$PATH"             # 無いと d2 フィルタが d2 バイナリを見失う
quarto render <file>.qmd
```

## サイト全体を render してから publish するとき

`--no-render` の publish は `_site/` の中身をそのまま gh-pages に載せる。デッキ単位の render は `_site/` から古いファイルを消さないので、次のときは先にサイト全体を render する（引数なしの `quarto render` は `_site/` を空にしてから全デッキを render する）：

- デッキや画像を**削除・改名**したとき。消さないと古いファイルが公開サイトに残り、旧 URL で古い版が見え続ける
- render を途中で止めたとき（中断ビルドの stale アーティファクト対策）

```bash
quarto render && quarto publish gh-pages --id gh-pages --no-render --no-prompt
```

公開をやめたい内容は、`_site/` から消しても gh-pages の過去のコミットに残る。完全に消すには履歴の書き換えが必要。
