// HTMLの要素を取得しておく
const imageSelector = document.getElementById('image-selector');
const imagePreview = document.getElementById('image-preview');
const resultText = document.getElementById('result');
const detectionList = document.getElementById('detection-list');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d'); // Canvasに描画するためのコンテキスト
const clearButton = document.getElementById('clear-button');
const loadingDiv = document.getElementById('loading');

// カラーパレット（検出した物体ごとに異なる色を使用）
const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57',
    '#FF9FF3', '#54A0FF', '#48DBFB', '#1ABC9C', '#F39C12'
];

// 日本語翻訳辞書
const translations = {
    'person': '人',
    'bicycle': '自転車',
    'car': '車',
    'motorcycle': 'バイク',
    'airplane': '飛行機',
    'bus': 'バス',
    'train': '電車',
    'truck': 'トラック',
    'boat': 'ボート',
    'traffic light': '信号機',
    'fire hydrant': '消火栓',
    'stop sign': '一時停止標識',
    'parking meter': '駐車メーター',
    'bench': 'ベンチ',
    'bird': '鳥',
    'cat': '猫',
    'dog': '犬',
    'horse': '馬',
    'sheep': '羊',
    'cow': '牛',
    'elephant': '象',
    'bear': '熊',
    'zebra': 'シマウマ',
    'giraffe': 'キリン',
    'backpack': 'バックパック',
    'umbrella': '傘',
    'handbag': 'ハンドバッグ',
    'tie': 'ネクタイ',
    'suitcase': 'スーツケース',
    'frisbee': 'フリスビー',
    'skis': 'スキー',
    'snowboard': 'スノーボード',
    'sports ball': 'スポーツボール',
    'kite': '凧',
    'baseball bat': '野球バット',
    'baseball glove': '野球グローブ',
    'skateboard': 'スケートボード',
    'surfboard': 'サーフボード',
    'tennis racket': 'テニスラケット',
    'bottle': 'ボトル',
    'wine glass': 'ワイングラス',
    'cup': 'カップ',
    'fork': 'フォーク',
    'knife': 'ナイフ',
    'spoon': 'スプーン',
    'bowl': 'ボウル',
    'banana': 'バナナ',
    'apple': 'りんご',
    'sandwich': 'サンドイッチ',
    'orange': 'オレンジ',
    'broccoli': 'ブロッコリー',
    'carrot': 'にんじん',
    'hot dog': 'ホットドッグ',
    'pizza': 'ピザ',
    'donut': 'ドーナツ',
    'cake': 'ケーキ',
    'chair': '椅子',
    'couch': 'ソファ',
    'potted plant': '鉢植え',
    'bed': 'ベッド',
    'dining table': 'ダイニングテーブル',
    'toilet': 'トイレ',
    'tv': 'テレビ',
    'laptop': 'ノートパソコン',
    'mouse': 'マウス',
    'remote': 'リモコン',
    'keyboard': 'キーボード',
    'cell phone': '携帯電話',
    'microwave': '電子レンジ',
    'oven': 'オーブン',
    'toaster': 'トースター',
    'sink': 'シンク',
    'refrigerator': '冷蔵庫',
    'book': '本',
    'clock': '時計',
    'vase': '花瓶',
    'scissors': 'はさみ',
    'teddy bear': 'テディベア',
    'hair drier': 'ヘアドライヤー',
    'toothbrush': '歯ブラシ'
};

// モデルを一度だけ読み込むための変数
let model = null;

// ページ読み込み時にモデルを事前ロード
window.addEventListener('DOMContentLoaded', async () => {
    console.log('COCO-SSDモデルの事前ロードを開始します...');
    try {
        loadingDiv.style.display = 'block';
        loadingDiv.querySelector('p').textContent = 'AIモデルを準備中...';
        model = await cocoSsd.load();
        console.log('モデルの読み込みが完了しました！');
        loadingDiv.style.display = 'none';
    } catch (error) {
        console.error('モデルの読み込みに失敗しました:', error);
        loadingDiv.style.display = 'none';
    }
});

// ファイルが選択されたら処理を開始
imageSelector.addEventListener('change', async (event) => {
    // Canvasをクリア
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    resultText.innerHTML = '<p class="placeholder">検出中...</p>';
    detectionList.innerHTML = '';

    const file = event.target.files[0];
    if (!file) return;

    // 画像を画面に表示
    const reader = new FileReader();
    reader.onload = e => {
        imagePreview.src = e.target.result;
        imagePreview.style.display = 'block';
    };
    reader.readAsDataURL(file);

    // 画像の読み込み完了後にAI処理を実行
    imagePreview.onload = async () => {
        try {
            loadingDiv.style.display = 'block';
            loadingDiv.querySelector('p').textContent = '物体を検出中...';

            // 1. AIモデルを読み込む (まだ読み込まれていない場合)
            if (!model) {
                model = await cocoSsd.load();
            }

            // 2. 物体検出を実行
            const predictions = await model.detect(imagePreview);

            // Canvasのサイズを画像に合わせる
            canvas.width = imagePreview.width;
            canvas.height = imagePreview.height;

            // 3. 検出結果を処理
            const validPredictions = predictions.filter(p => p.score > 0.5);
            
            if (validPredictions.length === 0) {
                resultText.innerHTML = '<p>物体を検出できませんでした。</p>';
            } else {
                resultText.innerHTML = `<p><strong>${validPredictions.length}個</strong>の物体を検出しました。</p>`;
                drawDetections(validPredictions);
                displayDetectionList(validPredictions);
            }

            clearButton.style.display = 'inline-block';

        } catch (error) {
            console.error('エラーが発生しました:', error);
            resultText.innerHTML = '<p class="error-message">エラーが発生しました。もう一度お試しください。</p>';
        } finally {
            loadingDiv.style.display = 'none';
        }
    };
});

// 検出結果を描画する関数
function drawDetections(predictions) {
    predictions.forEach((prediction, index) => {
        const color = colors[index % colors.length];
        
        // 確率が50%以上のものだけ描画
        if (prediction.score > 0.5) {
            const [x, y, width, height] = prediction.bbox;
            
            // 四角を描く
            ctx.beginPath();
            ctx.rect(x, y, width, height);
            ctx.lineWidth = 3;
            ctx.strokeStyle = color;
            ctx.stroke();
            
            // ラベルの背景を描く
            const label = `${translateClass(prediction.class)} ${Math.round(prediction.score * 100)}%`;
            ctx.font = 'bold 16px sans-serif';
            const textWidth = ctx.measureText(label).width;
            const textHeight = 20;
            
            // ラベルの位置を調整（画面外に出ないように）
            const labelY = y > textHeight ? y - 5 : y + textHeight;
            
            ctx.fillStyle = color;
            ctx.fillRect(x, labelY - textHeight, textWidth + 10, textHeight + 5);
            
            // ラベルのテキストを描く
            ctx.fillStyle = 'white';
            ctx.fillText(label, x + 5, labelY);
        }
    });
}

// 検出リストを表示する関数
function displayDetectionList(predictions) {
    detectionList.innerHTML = '';
    
    predictions.forEach((prediction, index) => {
        const color = colors[index % colors.length];
        const [x, y, width, height] = prediction.bbox;
        
        const item = document.createElement('div');
        item.className = 'detection-item';
        item.style.borderLeft = `4px solid ${color}`;
        
        item.innerHTML = `
            <div class="detection-label">${translateClass(prediction.class)}</div>
            <div class="detection-confidence">確信度: ${Math.round(prediction.score * 100)}%</div>
            <div class="detection-position">位置: (${Math.round(x)}, ${Math.round(y)})</div>
            <div class="detection-position">サイズ: ${Math.round(width)} × ${Math.round(height)}</div>
        `;
        
        detectionList.appendChild(item);
    });
}

// クラス名を日本語に翻訳する関数
function translateClass(className) {
    return translations[className] || className;
}

// クリアボタンの処理
clearButton.addEventListener('click', () => {
    // 画像と結果をクリア
    imageSelector.value = '';
    imagePreview.src = '';
    imagePreview.style.display = 'none';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    resultText.innerHTML = '<p class="placeholder">画像をアップロードすると、ここに結果が表示されます</p>';
    detectionList.innerHTML = '';
    clearButton.style.display = 'none';
});

// ドラッグ&ドロップのサポート
const uploadArea = document.querySelector('.upload-area');

uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.backgroundColor = '#e8f5e9';
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.style.backgroundColor = 'transparent';
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.backgroundColor = 'transparent';
    
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith('image/')) {
        imageSelector.files = files;
        const event = new Event('change', { bubbles: true });
        imageSelector.dispatchEvent(event);
    }
});