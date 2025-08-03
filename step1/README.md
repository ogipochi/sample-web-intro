Typed.jsを導入する手順を、初心者の方にも分かりやすく説明します。

## Typed.jsとは
文字が自動的にタイピングされているようなアニメーション効果を簡単に実装できるJavaScriptライブラリです。

## 導入手順

### ステップ1: Typed.jsを読み込む

最も簡単な方法は、CDN（コンテンツ配信ネットワーク）から直接読み込む方法です。

HTMLファイルの`</body>`タグの直前に、以下のコードを追加してください：

```html
<!-- Typed.jsの読み込み -->
<script src="https://unpkg.com/typed.js@2.1.0/dist/typed.umd.js"></script>
```

### ステップ2: タイピングアニメーションを表示する場所を作る

HTMLファイルの表示したい場所に、以下のようなコードを追加します：

```html
<div class="typing-area">
  <span id="typed-text"></span>
  <span class="typed-cursor">|</span>
</div>
```

### ステップ3: Typed.jsを初期化する

先ほど追加したTyped.jsの読み込みコードの下に、以下のJavaScriptコードを追加します：

```html
<script>
  // ページが読み込まれてから実行
  document.addEventListener('DOMContentLoaded', function() {
    // Typed.jsの設定
    var typed = new Typed('#typed-text', {
      strings: [
        'こんにちは！',
        'ようこそ私のサイトへ',
        'Typed.jsを使っています'
      ],
      typeSpeed: 50,        // タイピング速度（ミリ秒）
      backSpeed: 30,        // 削除速度（ミリ秒）
      backDelay: 1000,      // 削除開始までの待機時間
      loop: true,           // ループする
      showCursor: false     // カーソルは自前で表示
    });
  });
</script>
```

### ステップ4: カーソルのスタイルを追加（オプション）

CSSファイルまたは`<style>`タグ内に以下を追加して、カーソルを点滅させます：

```css
.typed-cursor {
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}
```

## 完全なサンプルコード

このディレクトリには、実際に動作するサンプルコードが用意されています：

- **beforeディレクトリ**: Typed.js導入前の基本的なHTML/CSS/JavaScriptファイル
- **afterディレクトリ**: Typed.jsを実装した完成版のファイル

各ディレクトリの`index.html`をブラウザで開いて、導入前後の違いを確認できます。

## よく使う設定オプション

Typed.jsには様々な設定オプションがあります：

- **strings**: 表示するテキストの配列
- **typeSpeed**: タイピング速度（数値が小さいほど速い）
- **backSpeed**: 削除速度
- **backDelay**: テキスト表示後、削除開始までの待機時間
- **startDelay**: アニメーション開始までの待機時間
- **loop**: ループするかどうか（true/false）
- **showCursor**: カーソルを表示するか（true/false）
- **fadeOut**: フェードアウトするか（true/false）
- **shuffle**: テキストをランダムに表示（true/false）

## トラブルシューティング

1. **動作しない場合**
   - ブラウザの開発者ツール（F12キー）でエラーが出ていないか確認
   - IDが正しく指定されているか確認（#typed-textなど）

2. **文字化けする場合**
   - HTMLファイルの文字コードがUTF-8になっているか確認
   - `<meta charset="UTF-8">`が含まれているか確認

3. **カーソルが表示されない場合**
   - CSSが正しく適用されているか確認
   - showCursorをfalseに設定しているか確認

以上の手順で、あなたのWebサイトにTyped.jsを導入できます。まずはサンプルコードをそのまま試してみて、動作を確認してから、お好みに合わせてカスタマイズしてみてください。