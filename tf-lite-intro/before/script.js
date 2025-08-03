// HTML要素の取得
const imageSelector = document.getElementById('image-selector');
const imagePreview = document.getElementById('image-preview');
const fileInfo = document.getElementById('file-info');
const clearButton = document.getElementById('clear-button');

// ファイルが選択されたときの処理
imageSelector.addEventListener('change', (event) => {
    const file = event.target.files[0];
    
    if (!file) {
        return;
    }
    
    // ファイル情報の表示
    const fileSize = (file.size / 1024).toFixed(2); // KB単位
    fileInfo.textContent = `ファイル名: ${file.name} (${fileSize} KB)`;
    
    // 画像のプレビュー表示
    const reader = new FileReader();
    reader.onload = (e) => {
        imagePreview.src = e.target.result;
        imagePreview.style.display = 'block';
        clearButton.style.display = 'inline-block';
    };
    reader.readAsDataURL(file);
});

// クリアボタンの処理
clearButton.addEventListener('click', () => {
    // 画像とファイル情報をクリア
    imageSelector.value = '';
    imagePreview.src = '';
    imagePreview.style.display = 'none';
    fileInfo.textContent = '';
    clearButton.style.display = 'none';
});

// ドラッグ&ドロップのサポート（オプション）
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