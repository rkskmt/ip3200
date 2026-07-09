# Deploy to GitHub Pages

## 通常（対話シェル）

```bash
conda activate IP3200
rm -rf _site .quarto && quarto publish gh-pages --no-prompt --id ip3200
```

`conda activate` が Python と `d2` バイナリの両方を PATH に通すので、これだけでよい。

## 非対話シェル（cron / CI / headless）

`conda activate` が効かない環境では、env の2つを **両方** 明示的に設定する：

```bash
ENV="$(conda info --base)/envs/IP3200"
export QUARTO_PYTHON="$ENV/bin/python"   # 無いと render が plotly 等を見失う
export PATH="$ENV/bin:$PATH"             # 無いと d2 フィルタが d2 バイナリを見失う
rm -rf _site .quarto && quarto publish gh-pages --no-prompt --id ip3200
```

- `PATH` だけでは不十分：シェルに残った別の `QUARTO_PYTHON` が優先されることがある
- `QUARTO_PYTHON` だけでも不十分：`d2` Lua フィルタは PATH の `d2` を呼ぶ

## メモ

- `_site/` `.quarto/` を消すのは、中断ビルドの stale アーティファクト対策
- `_publish.yml`（初回に生成、`.gitignore`）:

  ```yaml
  - source: project
    gh-pages:
      - id: "ip3200"
        branch: gh-pages
  ```

- SSH 認証が必要（GitHub に公開鍵を登録）
- `_site/` `.quarto/` は `.gitignore`（ビルド生成物はコミットしない）
- 全デッキの一括 render でごくまれに `[Errno 2] No such file or directory: 'X.quarto_ipynb'`（kernel 起動レース）が出る。内容エラーではない（そのデッキ単体は通る）ので publish をやり直せばよい
