// 例1: ターミナル風
var terminalTyped = new Typed('#terminal-typed', {
  strings: [
    'npm install typed.js',
    'git clone https://github.com/user/project.git',
    'cd project && npm start',
    'echo "Hello, World!"'
  ],
  typeSpeed: 40,
  backSpeed: 20,
  loop: true,
  showCursor: false
});

// 例2: チャットボット風
var chatTyped = new Typed('#chat-typed', {
  strings: [
    'こんにちは！何かお手伝いできることはありますか？',
    'お待ちください、確認しています...',
    'はい、すぐにお手伝いします！',
    '他にご質問はありますか？'
  ],
  typeSpeed: 30,
  backSpeed: 20,
  backDelay: 2000,
  loop: true,
  showCursor: false
});

// 例3: ヒーローセクション
var heroTyped = new Typed('#hero-typed', {
  strings: [
    'イノベーションを創造します',
    'デジタルの未来を築きます',
    'あなたのビジネスを成長させます',
    '最高の体験を提供します'
  ],
  typeSpeed: 50,
  backSpeed: 30,
  backDelay: 2000,
  loop: true,
  showCursor: false,
  fadeOut: true,
  fadeOutClass: 'typed-fade-out',
  fadeOutDelay: 500
});

// 例4: フォームプレースホルダー
var searchTyped = new Typed('#search-input', {
  strings: [
    '商品を検索...',
    '例: iPhone 15',
    '例: ノートパソコン',
    '例: ワイヤレスイヤホン'
  ],
  typeSpeed: 50,
  backSpeed: 30,
  attr: 'placeholder',
  loop: true,
  showCursor: false
});

// 例5: 多言語
var multilangTyped = new Typed('#multilang-typed', {
  strings: [
    'Welcome! 🇬🇧',
    'ようこそ！ 🇯🇵',
    'Bienvenue! 🇫🇷',
    '欢迎！ 🇨🇳',
    'Bienvenido! 🇪🇸',
    'Willkommen! 🇩🇪'
  ],
  typeSpeed: 60,
  backSpeed: 40,
  backDelay: 1500,
  loop: true,
  showCursor: false,
  shuffle: true  // ランダムな順序で表示
});

// 例6: コールバック機能
var callbackTyped;

function initCallbackTyped() {
  callbackTyped = new Typed('#callback-typed', {
    strings: ['タイピングアニメーションが完了すると、メッセージが表示されます。'],
    typeSpeed: 40,
    showCursor: false,
    onComplete: function () {
      // タイピング完了時の処理
      document.getElementById('completion-message').style.display = 'block';
    },
    onReset: function () {
      // リセット時の処理
      document.getElementById('completion-message').style.display = 'none';
    }
  });
}

function restartCallback() {
  if (callbackTyped) {
    callbackTyped.destroy();
  }
  document.getElementById('completion-message').style.display = 'none';
  initCallbackTyped();
}

// 初期化
initCallbackTyped();