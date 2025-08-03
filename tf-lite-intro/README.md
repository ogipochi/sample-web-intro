## はじめに 🚀

TensorFlow Liteは、AIモデルをスマートフォンやWebブラウザなどのデバイス上で軽く、速く動かすための技術です。これをWebサイトに導入すると、例えば以下のようなAI機能を追加できます。

  * **画像認識**: 写真に写っているものが何かを当てる（犬、猫、車など）。
  * **物体検出**: 写真の中から特定のモノ（人、顔など）を見つけて四角で囲む。
  * **ポーズ推定**: 人の骨格を認識して、どんなポーズをしているか推定する。

今回は、最も基本的な**画像認識**を例にして、手順を解説します。

-----

## 導入の3ステップ

導入は、大きく分けて以下の3つのステップで完了します。

1.  **ライブラリとAIモデルの準備**
2.  **画面（HTML）の作成**
3.  **処理（JavaScript）の記述**

### ステップ1: ライブラリとAIモデルの準備 📚

まず、TensorFlow LiteをWebサイトで動かすための「おまじない」となるライブラリと、頭脳となる「AIモデル」を準備します。

#### ライブラリの読み込み

TensorFlow LiteをWebブラウザで動かすには、**TensorFlow.js**というライブラリが必要です。これは、以下の`<script>`タグをHTMLファイルに記述するだけで利用できます。今はまだ記述せず、「こういうものを使うんだな」と覚えておいてください。

```html
<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest/dist/tf.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@tensorflow-models/mobilenet@2.1.1/dist/mobilenet.min.js"></script>
```

#### AIモデルの準備

今回は、Googleが提供している学習済みの画像分類AIモデル「**MobileNet**」を使います。このモデルは、様々な物体を認識できるように訓練されています。上記のライブラリを読み込むだけで、このモデルも使えるようになります。

-----

## ステップ2: 画面（HTML）の作成 🖼️

次に、ユーザーが画像をアップロードしたり、結果を見たりするための画面をHTMLで作成します。

まず、`index.html`というファイルを作成し、以下のコードをコピー＆ペーストしてください。

```html
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TensorFlow Lite サンプル</title>
    <style>
        body { font-family: sans-serif; text-align: center; margin-top: 50px; }
        img { max-width: 300px; height: auto; margin-top: 20px; }
        #result { font-size: 1.2em; font-weight: bold; color: #007BFF; }
    </style>
</head>
<body>

    <h1>画像認識AI</h1>
    <p>認識したい画像をアップロードしてください。</p>

    <input type="file" id="image-selector" accept="image/*">

    <br>

    <img id="image-preview" src="" alt="アップロードされた画像">

    <p id="result">ここに結果が表示されます</p>


    <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest/dist/tf.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@tensorflow-models/mobilenet@2.1.1/dist/mobilenet.min.js"></script>
    <script src="script.js"></script>

</body>
</html>
```

このHTMLファイルには、以下の要素が含まれています。

  * 画像をアップロードするための`<input type="file">`
  * アップロードした画像を表示するための`<img>`
  * AIの予測結果を表示するための`<p>`
  * 一番下に、先ほど説明したJavaScriptライブラリと、これから作成する`script.js`を読み込むための`<script>`タグ

-----

## ステップ3: 処理（JavaScript）の記述 ✍️

最後に、AIの動作をJavaScriptで記述します。`index.html`と同じ場所に`script.js`という新しいファイルを作成し、以下のコードをコピー＆ペーストしてください。

```javascript
// HTMLの要素を取得しておく
const imageSelector = document.getElementById('image-selector');
const imagePreview = document.getElementById('image-preview');
const resultText = document.getElementById('result');

// ファイルが選択されたら処理を開始
imageSelector.addEventListener('change', async (event) => {
    // 選択された画像ファイルを取得
    const file = event.target.files[0];
    if (!file) {
        return;
    }

    // 画像を画面に表示
    const reader = new FileReader();
    reader.onload = (e) => {
        imagePreview.src = e.target.result;
    };
    reader.readAsDataURL(file);

    // 準備ができたらAIの処理を実行
    imagePreview.onload = async () => {
        resultText.innerText = "認識中..."; // ユーザーに処理中であることを伝える

        try {
            // 1. AIモデルを読み込む
            const model = await mobilenet.load();

            // 2. 画像をAIが理解できる形式に変換して、推論（予測）を実行
            const predictions = await model.classify(imagePreview);

            // 3. 結果を表示する
            console.log(predictions); // 開発者向けにコンソールに詳細を表示

            if (predictions && predictions.length > 0) {
                // 最も確率の高い予測結果を表示
                const topPrediction = predictions[0];
                const probability = Math.round(topPrediction.probability * 100); // 確率をパーセントに
                resultText.innerText = `これは「${topPrediction.className}」です！ (${probability}% の確率)`;
            } else {
                resultText.innerText = "何も認識できませんでした。";
            }

        } catch (error) {
            console.error(error);
            resultText.innerText = "エラーが発生しました。";
        }
    };
});
```

### JavaScriptコードの解説

1.  **`imageSelector.addEventListener('change', ...)`**:
    ユーザーがファイルを選択したときに、中の処理が実行されます。
2.  **`mobilenet.load()`**:
    `mobilenet`という学習済みAIモデルをインターネットから読み込みます。少し時間がかかる場合があるため、`await`を使って読み込みが終わるまで待ちます。
3.  **`model.classify(imagePreview)`**:
    読み込んだAIモデル(`model`)に、画面に表示されている画像(`imagePreview`)を渡して、「これは何ですか？」と質問します。これが**推論**や**予測**と呼ばれる処理です。
4.  **`resultText.innerText = ...`**:
    AIからの答え(`predictions`)を受け取り、人間が見やすいように整形して、HTMLの`<p id="result">`の部分に表示します。

-----

## 実行してみよう！

これで準備は完了です。しかし、この`index.html`ファイルを直接ダブルクリックして開くと、セキュリティ上の理由（CORSポリシー）でエラーになる可能性があります。

**VS Code（Visual Studio Code）** という無料のエディタを使っている場合は、**Live Server**という拡張機能をインストールして実行するのが最も簡単です。

1.  VS Codeで`index.html`と`script.js`が入っているフォルダを開きます。
2.  VS Codeの拡張機能マーケットプレイスで「Live Server」を検索してインストールします。
3.  `index.html`ファイルを右クリックして、「Open with Live Server」を選択します。

ブラウザが自動で開き、作成したWebページが表示されます。画像をアップロードして、AIが何を認識するか試してみてください！

これで、あなたのWebサイトにTensorFlow Liteを導入できました。ここから、別のAIモデルを使ったり、結果の表示方法を工夫したりして、ぜひオリジナルのAI Webアプリ開発に挑戦してみてください。

## 補足
はい、もちろんです。TensorFlow Lite（WebではTensorFlow.jsというライブラリを使います）を使えば、基本的な画像分類よりもはるかに高度で面白いことができます。

ここでは、特に人気の高い\*\*「物体検出」**と**「姿勢推定」\*\*の2つの応用例について、具体的な手順とコードを交えてご紹介します。

-----

### 応用例1：物体検出 (Object Detection) 📸

これは、画像に写っている**複数のモノが「何か」**、そして\*\*「どこにあるか」\*\*を同時に認識する技術です。例えば、写真から「人と犬」を見つけ出し、それぞれを四角で囲むことができます。

\<br\>

#### 1\. 準備：HTMLの変更

前回の画像分類のHTMLを少し改造します。画像の上に、検出結果の四角形を描画するための\*\*`<canvas>`\*\*要素を追加します。

`index.html`を以下のように変更してください。

```html
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>物体検出 サンプル</title>
    <style>
        body { font-family: sans-serif; text-align: center; margin-top: 30px; }
        /* 画像とCanvasを重ねるためのスタイル */
        .container { position: relative; width: fit-content; margin: 20px auto; }
        #image-preview { max-width: 600px; height: auto; }
        #canvas { position: absolute; top: 0; left: 0; }
        #result { font-size: 1.2em; font-weight: bold; }
    </style>
</head>
<body>
    <h1>物体検出AI</h1>
    <p>人やモノが写っている画像をアップロードしてください。</p>
    <input type="file" id="image-selector" accept="image/*">

    <div class="container">
        <img id="image-preview" src="" alt="">
        <canvas id="canvas"></canvas>
    </div>

    <p id="result">ここに結果が表示されます</p>

    <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest/dist/tf.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd@latest/dist/coco-ssd.min.js"></script>

    <script src="script.js"></script>
</body>
</html>
```

**変更点：**

  * `<img>`と`<canvas>`を`<div>`で囲み、CSSで重ねて表示できるようにしました。
  * 読み込むライブラリを、画像分類の`mobilenet`から物体検出用の`coco-ssd`に変更しました。

-----

#### 2\. 実装：JavaScriptの変更

次に、`script.js`を物体検出の処理に書き換えます。検出したモノの位置に四角とラベルを描く処理が加わります。

`script.js`を以下の内容に書き換えてください。

```javascript
// HTMLの要素を取得しておく
const imageSelector = document.getElementById('image-selector');
const imagePreview = document.getElementById('image-preview');
const resultText = document.getElementById('result');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d'); // Canvasに描画するためのコンテキスト

// ファイルが選択されたら処理を開始
imageSelector.addEventListener('change', async (event) => {
    // Canvasをクリア
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    resultText.innerText = "";

    const file = event.target.files[0];
    if (!file) return;

    // 画像を画面に表示
    const reader = new FileReader();
    reader.onload = e => imagePreview.src = e.target.result;
    reader.readAsDataURL(file);

    // 画像の読み込み完了後にAI処理を実行
    imagePreview.onload = async () => {
        resultText.innerText = "検出中...";

        // 1. AIモデルを読み込む (COCO-SSDモデル)
        const model = await cocoSsd.load();

        // 2. 物体検出を実行
        const predictions = await model.detect(imagePreview);

        resultText.innerText = `${predictions.length}個の物体を検出しました。`;

        // Canvasのサイズを画像に合わせる
        canvas.width = imagePreview.width;
        canvas.height = imagePreview.height;

        // 3. 検出したすべての物体に対して四角とラベルを描画
        predictions.forEach(prediction => {
            // 確率が70%以上のものだけ描画
            if (prediction.score > 0.7) {
                // 四角を描く
                ctx.beginPath();
                ctx.rect(...prediction.bbox); // bboxは [x, y, width, height] の配列
                ctx.lineWidth = 2;
                ctx.strokeStyle = '#00FF00'; // 緑色
                ctx.stroke();

                // ラベルを描く
                ctx.fillStyle = '#00FF00';
                ctx.font = '18px sans-serif';
                const label = `${prediction.class} (${Math.round(prediction.score * 100)}%)`;
                ctx.fillText(label, prediction.bbox[0], prediction.bbox[1] > 10 ? prediction.bbox[1] - 5 : 10);
            }
        });
    };
});
```

**処理の流れ：**

1.  **`cocoSsd.load()`**: 物体検出用のAIモデルを読み込みます。
2.  **`model.detect(imagePreview)`**: 画像から物体を検出します。結果は配列で返ってきます。
3.  **`predictions.forEach(...)`**: 検出された各物体について、以下の処理を繰り返します。
      * `prediction.bbox`: モノの場所（左上のx座標, y座標, 幅, 高さ）を取得します。
      * `prediction.class`: モノの名前（'person', 'dog', 'car'など）を取得します。
      * `prediction.score`: 確信度（どれくらいその予測に自信があるか）を取得します。
      * **Canvas API (`ctx`)**: これらの情報を使って、画像の上に`rect`（四角形）と`fillText`（テキスト）を描画します。

**Live Server**で実行し、人や車が写っている画像をアップロードしてみてください。画像の中のモノが緑色の四角で囲まれれば成功です！

-----

### 応用例2：姿勢推定 (Pose Estimation) 🏃‍♀️

人の体の関節（目、鼻、肩、肘、手首など）の位置を検出する技術です。これを使うと、フィットネスアプリで正しいフォームをチェックしたり、ダンスの動きを分析したりできます。

\<br\>

#### 1\. 準備：ライブラリの変更

HTMLは物体検出のものとほぼ同じで構いません。読み込むJavaScriptライブラリを姿勢推定用の\*\*`posenet`\*\*に変更します。

`index.html`の`<script>`タグの部分を以下のように書き換えます。

```html
<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest/dist/tf.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@tensorflow-models/posenet@latest/dist/posenet.min.js"></script>
```

-----

#### 2\. 実装：JavaScriptの変更

`script.js`を姿勢推定の処理に書き換えます。検出した関節（キーポイント）を点や線で結んで、骨格を描画します。

```javascript
// (HTML要素の取得部分は物体検出と同じなので省略)
// ...

// ファイルが選択されたら処理を開始
imageSelector.addEventListener('change', async (event) => {
    // (Canvasクリアや画像表示の部分も同じなので省略)
    // ...

    imagePreview.onload = async () => {
        resultText.innerText = "姿勢を推定中...";

        // 1. AIモデルを読み込む (PoseNetモデル)
        const model = await posenet.load();

        // 2. 姿勢推定を実行
        const pose = await model.estimateSinglePose(imagePreview, {
            flipHorizontal: false
        });

        resultText.innerText = "姿勢を検出しました。";

        // Canvasのサイズを画像に合わせる
        canvas.width = imagePreview.width;
        canvas.height = imagePreview.height;

        // 3. 検出したキーポイントと骨格を描画
        drawPose(pose);
    };
});

// 姿勢を描画する関数
function drawPose(pose) {
    // キーポイント（関節）を描画
    pose.keypoints.forEach(keypoint => {
        if (keypoint.score > 0.5) {
            ctx.beginPath();
            ctx.arc(keypoint.position.x, keypoint.position.y, 5, 0, 2 * Math.PI);
            ctx.fillStyle = '#FF0000'; // 赤色
            ctx.fill();
        }
    });

    // 骨格（キーポイント間を結ぶ線）を描画
    const adjacentKeyPoints = posenet.getAdjacentKeyPoints(pose.keypoints, 0.5);
    adjacentKeyPoints.forEach((keypoints) => {
        ctx.beginPath();
        ctx.moveTo(keypoints[0].position.x, keypoints[0].position.y);
        ctx.lineTo(keypoints[1].position.x, keypoints[1].position.y);
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#00FFFF'; // 水色
        ctx.stroke();
    });
}
```

**処理の流れ：**

1.  **`posenet.load()`**: 姿勢推定用のAIモデルを読み込みます。
2.  **`model.estimateSinglePose(...)`**: 画像から一人の人物の姿勢を推定します。
3.  **`pose.keypoints`**: 結果として、体の各部位（`keypoints`）の位置とスコアのリストが返ってきます。
4.  **`drawPose(pose)`関数**:
      * キーポイントをループ処理して、`arc`で円（点）を描画します。
      * `posenet.getAdjacentKeyPoints`で、隣り合うキーポイントのペア（例：左肩と左肘）を取得し、`moveTo`と`lineTo`で線を描画します。

人物が写っている画像をアップロードすると、その人の骨格が検出されて線で描画されるはずです。

### さらに広がる可能性

今回紹介した以外にも、TensorFlow.jsを使えば以下のような様々な応用が可能です。

  * **セマンティックセグメンテーション**: 画像のピクセル単位で「これは空」「これは道路」「これは人」と色分けする。
  * **顔検出・顔認識 (Face Landmark Detection)**: 顔のパーツ（目、鼻、口など）を詳細に検出する。
  * **スタイル変換**: 写真を有名画家の画風に変換する。

これらの機能は、それぞれに対応した学習済みモデルを読み込むことで実現できます。ぜひ公式の[TensorFlow.js Models](https://www.tensorflow.org/js/models)のページなどを参考に、色々なAI機能をあなたのWebサイトで試してみてください。