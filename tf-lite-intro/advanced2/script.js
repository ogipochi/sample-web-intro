// HTMLの要素を取得しておく
const imageSelector = document.getElementById('image-selector');
const imagePreview = document.getElementById('image-preview');
const resultText = document.getElementById('result');
const keypointsInfo = document.getElementById('keypoints-info');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const clearButton = document.getElementById('clear-button');
const loadingDiv = document.getElementById('loading');

// トグルスイッチ
const showSkeletonToggle = document.getElementById('show-skeleton');
const showKeypointsToggle = document.getElementById('show-keypoints');
const showLabelsToggle = document.getElementById('show-labels');

// キーポイントの日本語名
const keypointNames = {
    'nose': '鼻',
    'leftEye': '左目',
    'rightEye': '右目',
    'leftEar': '左耳',
    'rightEar': '右耳',
    'leftShoulder': '左肩',
    'rightShoulder': '右肩',
    'leftElbow': '左肘',
    'rightElbow': '右肘',
    'leftWrist': '左手首',
    'rightWrist': '右手首',
    'leftHip': '左腰',
    'rightHip': '右腰',
    'leftKnee': '左膝',
    'rightKnee': '右膝',
    'leftAnkle': '左足首',
    'rightAnkle': '右足首'
};

// キーポイントのカラー設定
function getKeypointColor(part) {
    if (['nose', 'leftEye', 'rightEye', 'leftEar', 'rightEar'].includes(part)) {
        return '#FF6B6B'; // 頭部: 赤系
    } else if (['leftShoulder', 'rightShoulder', 'leftElbow', 'rightElbow', 'leftWrist', 'rightWrist'].includes(part)) {
        return '#4ECDC4'; // 上半身: 青緑系
    } else {
        return '#45B7D1'; // 下半身: 青系
    }
}

// モデルを一度だけ読み込むための変数
let model = null;

// ページ読み込み時にモデルを事前ロード
window.addEventListener('DOMContentLoaded', async () => {
    console.log('PoseNetモデルの事前ロードを開始します...');
    try {
        loadingDiv.style.display = 'block';
        loadingDiv.querySelector('p').textContent = 'AIモデルを準備中...';
        model = await posenet.load({
            architecture: 'MobileNetV1',
            outputStride: 16,
            inputResolution: { width: 640, height: 480 },
            multiplier: 0.75
        });
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
    resultText.innerHTML = '<p class="placeholder">姿勢を推定中...</p>';
    keypointsInfo.innerHTML = '';

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
            loadingDiv.querySelector('p').textContent = '姿勢を推定中...';

            // 1. AIモデルを読み込む (まだ読み込まれていない場合)
            if (!model) {
                model = await posenet.load({
                    architecture: 'MobileNetV1',
                    outputStride: 16,
                    inputResolution: { width: 640, height: 480 },
                    multiplier: 0.75
                });
            }

            // 2. 姿勢推定を実行
            const pose = await model.estimateSinglePose(imagePreview, {
                flipHorizontal: false
            });

            // Canvasのサイズを画像に合わせる
            canvas.width = imagePreview.width;
            canvas.height = imagePreview.height;

            // 3. 検出結果を処理
            const validKeypoints = pose.keypoints.filter(kp => kp.score > 0.3);
            
            if (validKeypoints.length === 0) {
                resultText.innerHTML = '<p class="error-message">人物の姿勢を検出できませんでした。</p>';
            } else {
                resultText.innerHTML = '<p class="success-message">姿勢を検出しました！</p>';
                drawPose(pose);
                displayKeypointsInfo(pose.keypoints);
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

// 姿勢を描画する関数
function drawPose(pose) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 骨格（キーポイント間を結ぶ線）を描画
    if (showSkeletonToggle.checked) {
        const adjacentKeyPoints = posenet.getAdjacentKeyPoints(pose.keypoints, 0.3);
        adjacentKeyPoints.forEach((keypoints) => {
            drawSegment(keypoints[0].position, keypoints[1].position);
        });
    }
    
    // キーポイント（関節）を描画
    if (showKeypointsToggle.checked) {
        pose.keypoints.forEach(keypoint => {
            if (keypoint.score > 0.3) {
                const color = getKeypointColor(keypoint.part);
                drawPoint(keypoint.position, color, keypoint.part);
            }
        });
    }
}

// 点を描画する関数
function drawPoint(position, color, label) {
    ctx.beginPath();
    ctx.arc(position.x, position.y, 6, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    
    // 点の周りに白い縁を追加
    ctx.beginPath();
    ctx.arc(position.x, position.y, 6, 0, 2 * Math.PI);
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // ラベルを表示
    if (showLabelsToggle.checked) {
        const jpLabel = keypointNames[label] || label;
        ctx.fillStyle = color;
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        
        // 背景を追加
        const textWidth = ctx.measureText(jpLabel).width;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fillRect(position.x - textWidth/2 - 2, position.y - 20, textWidth + 4, 14);
        
        // テキストを描画
        ctx.fillStyle = color;
        ctx.fillText(jpLabel, position.x, position.y - 10);
    }
}

// 線分を描画する関数
function drawSegment(start, end) {
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#00FFFF';
    ctx.stroke();
}

// キーポイント情報を表示する関数
function displayKeypointsInfo(keypoints) {
    keypointsInfo.innerHTML = '';
    
    keypoints.forEach(keypoint => {
        if (keypoint.score > 0.3) {
            const item = document.createElement('div');
            item.className = 'keypoint-item';
            const color = getKeypointColor(keypoint.part);
            item.style.borderLeft = `3px solid ${color}`;
            
            const jpName = keypointNames[keypoint.part] || keypoint.part;
            const confidence = Math.round(keypoint.score * 100);
            
            item.innerHTML = `
                <div class="keypoint-name">${jpName}</div>
                <div class="keypoint-confidence">信頼度: ${confidence}%</div>
            `;
            
            keypointsInfo.appendChild(item);
        }
    });
}

// トグルスイッチのイベントリスナー
[showSkeletonToggle, showKeypointsToggle, showLabelsToggle].forEach(toggle => {
    toggle.addEventListener('change', () => {
        // 現在の姿勢データがあれば再描画
        if (imagePreview.src && imagePreview.style.display === 'block') {
            // 最後の推定結果を再利用して再描画
            redrawCurrentPose();
        }
    });
});

// 現在の姿勢を再描画する関数
async function redrawCurrentPose() {
    if (!model || !imagePreview.src) return;
    
    try {
        const pose = await model.estimateSinglePose(imagePreview, {
            flipHorizontal: false
        });
        drawPose(pose);
    } catch (error) {
        console.error('再描画エラー:', error);
    }
}

// クリアボタンの処理
clearButton.addEventListener('click', () => {
    // 画像と結果をクリア
    imageSelector.value = '';
    imagePreview.src = '';
    imagePreview.style.display = 'none';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    resultText.innerHTML = '<p class="placeholder">画像をアップロードすると、ここに結果が表示されます</p>';
    keypointsInfo.innerHTML = '';
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