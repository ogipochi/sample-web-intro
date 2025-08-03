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
  
  // ヘッダーにクリックイベントを追加
  const header = document.querySelector('header h1');
  header.addEventListener('click', function() {
    alert('ヘッダーがクリックされました！');
  });
  
  // 現在の年を自動で更新
  const year = new Date().getFullYear();
  const footer = document.querySelector('footer p');
  footer.textContent = `© ${year} 私のウェブサイト`;
});