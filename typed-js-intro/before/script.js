// ページが読み込まれた時に実行
document.addEventListener('DOMContentLoaded', function() {
  console.log('ページが読み込まれました！');
  
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