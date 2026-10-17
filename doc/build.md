# ビルド

## 必要なもの

- [Quarto](https://quarto.org/docs/get-started/) (>= 1.8)
- conda (Miniconda / Anaconda)

## ワンコマンドセットアップ

```bash
python setup.py
conda activate IP3200
```

`setup.py` が以下をまとめて行う：

- `environment.yml` に基づく conda 環境 `IP3200` の作成・更新
- `QUARTO_PYTHON` 自動設定の activate フック
- MathJax 2 のダウンロード（`libs/mathjax/`）

Windows でも同じコマンドで動く（`conda` が使えるシェル — Miniforge Prompt、または `conda init powershell` 後の PowerShell — で実行）。Linux との違い：

- `d2` は conda-forge ではなく公式リリースから環境内（`Library\bin`）に入れる。conda-forge のパッケージはライセンスファイルにシンボリックリンクを含み、開発者モードか管理者権限がないと conda が展開に失敗するため
- `QUARTO_PYTHON` は activate フックではなく `conda env config vars` で設定する

MathJax だけ再取得したい場合：

```bash
python setup.py --mathjax-only
```

VSCode でこのフォルダを開けば Python 環境は自動で設定される。ターミナルで直接作業する場合は `conda activate IP3200` を実行すること。

## ローカルプレビュー

```bash
quarto preview --port 4321
```

ブラウザで `http://localhost:4321` が開く。ファイルを保存するとホットリロードされる。

## ビルド

```bash
quarto render   # _site/ に出力
```

デプロイ（GitHub Pages）は [deploy.md](deploy.md) を参照。
