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
