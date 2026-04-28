# フッターカスタムナビ仕様

`_metadata.yaml` の `<script>` で実装しているフッターのナビゲーション（◀ N/M ▶）の仕様メモ。

## スクロールビューモードの注意

スマホ縦画面（幅≤435px）では RevealJS が自動的に Scroll View モードに切替わる。
このモードでは `<section>` が `.slides` の直接の子ではなくラッパー div に包まれる構造になる。

## カウンター実装

RevealJS の API は Scroll View モードで正しく動かないことがある。DOM を直接見る。

```javascript
// NG: スクロールビューで 0 件になる
'.reveal .slides > section'    // 直接の子しか取れない
Reveal.getSlidePastCount()     // スクロールビューで値が変わらない

// OK
'.reveal .slides section:not(.stack)'  // 全階層の実スライドを取得
s.classList.contains('present')        // 現在スライドの判定
new MutationObserver(...)              // クラス変化を監視してカウンター更新
```

## ボタンのタッチ対応

`click` のみだとモバイルで反応しない場合がある。`touchstart` + `stopPropagation` を併用。

```javascript
function addNavHandler(el, fn) {
  el.addEventListener('touchstart', function(e) { e.stopPropagation(); fn(); }, { passive: true });
  el.addEventListener('click', fn);
}
```

## デバッグ方針

まず `console.log` でデータを確認する。RevealJS の minified ソースは読みに行かない。
API が怪しければ、API を使わず純粋な DOM 操作で書き直す。
