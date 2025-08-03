// HTMLの要素を取得しておく
const imageSelector = document.getElementById('image-selector');
const imagePreview = document.getElementById('image-preview');
const resultDiv = document.getElementById('result');
const clearButton = document.getElementById('clear-button');
const loadingDiv = document.getElementById('loading');

// モデルを一度だけ読み込むための変数
let model = null;

// ページ読み込み時にモデルを事前ロード（オプション）
window.addEventListener('DOMContentLoaded', async () => {
    console.log('ページが読み込まれました。モデルの事前ロードを開始します...');
    try {
        loadingDiv.style.display = 'block';
        loadingDiv.querySelector('p').textContent = 'AIモデルを準備中...';
        model = await mobilenet.load();
        console.log('モデルの読み込みが完了しました！');
        loadingDiv.style.display = 'none';
    } catch (error) {
        console.error('モデルの読み込みに失敗しました:', error);
        loadingDiv.style.display = 'none';
    }
});

// ファイルが選択されたら処理を開始
imageSelector.addEventListener('change', async (event) => {
    // 選択された画像ファイルを取得
    const file = event.target.files[0];
    if (!file) {
        return;
    }

    // 結果をクリア
    resultDiv.innerHTML = '<p class="placeholder">認識中...</p>';

    // 画像を画面に表示
    const reader = new FileReader();
    reader.onload = (e) => {
        imagePreview.src = e.target.result;
        imagePreview.style.display = 'block';
    };
    reader.readAsDataURL(file);

    // 準備ができたらAIの処理を実行
    imagePreview.onload = async () => {
        try {
            loadingDiv.style.display = 'block';
            loadingDiv.querySelector('p').textContent = '画像を分析中...';

            // 1. AIモデルを読み込む（まだ読み込まれていない場合）
            if (!model) {
                model = await mobilenet.load();
            }

            // 2. 画像をAIが理解できる形式に変換して、推論（予測）を実行
            const predictions = await model.classify(imagePreview);

            // 3. 結果を表示する
            console.log('予測結果:', predictions);
            displayResults(predictions);
            
            clearButton.style.display = 'inline-block';

        } catch (error) {
            console.error('エラーが発生しました:', error);
            resultDiv.innerHTML = '<p class="error-message">エラーが発生しました。もう一度お試しください。</p>';
        } finally {
            loadingDiv.style.display = 'none';
        }
    };
});

// 結果を見やすく表示する関数
function displayResults(predictions) {
    if (!predictions || predictions.length === 0) {
        resultDiv.innerHTML = '<p class="error-message">何も認識できませんでした。</p>';
        return;
    }

    // 結果をHTMLとして構築
    let html = '';
    predictions.forEach((prediction, index) => {
        const probability = Math.round(prediction.probability * 100);
        const isTop = index === 0;
        
        html += `
            <div class="prediction ${isTop ? 'top' : ''}">
                <div class="prediction-label">
                    ${translateClassName(prediction.className)}
                    ${isTop ? ' 🏆' : ''}
                </div>
                <div class="prediction-confidence">
                    <div class="confidence-bar">
                        <div class="confidence-fill" style="width: ${probability}%"></div>
                    </div>
                    <span class="confidence-text">${probability}%</span>
                </div>
            </div>
        `;
    });

    resultDiv.innerHTML = html;

    // アニメーション効果のために少し遅延させる
    setTimeout(() => {
        document.querySelectorAll('.confidence-fill').forEach((bar, index) => {
            const width = predictions[index].probability * 100;
            bar.style.width = width + '%';
        });
    }, 100);
}

// 英語のクラス名を日本語に翻訳する簡単な関数（一部のみ）
function translateClassName(className) {
    const translations = {
        'dog': '犬',
        'cat': '猫',
        'car': '車',
        'person': '人物',
        'bird': '鳥',
        'flower': '花',
        'food': '食べ物',
        'building': '建物',
        'tree': '木',
        'computer': 'コンピューター'
    };

    // 翻訳がある場合は日本語を返す、なければ英語のまま
    for (const [eng, jpn] of Object.entries(translations)) {
        if (className.toLowerCase().includes(eng)) {
            return `${jpn} (${className})`;
        }
    }
    
    return className;
}

// クリアボタンの処理
clearButton.addEventListener('click', () => {
    // 画像と結果をクリア
    imageSelector.value = '';
    imagePreview.src = '';
    imagePreview.style.display = 'none';
    resultDiv.innerHTML = '<p class="placeholder">画像をアップロードすると、ここに結果が表示されます</p>';
    clearButton.style.display = 'none';
});

// ドラッグ&ドロップのサポート
const uploadArea = document.querySelector('.upload-area');

uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.backgroundColor = '#e3f2fd';
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