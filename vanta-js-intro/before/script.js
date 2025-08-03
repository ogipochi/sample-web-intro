// ページが読み込まれたときの処理
document.addEventListener('DOMContentLoaded', function() {
  console.log('ページが読み込まれました');
  
  // CTAボタンのクリックイベント
  const ctaButton = document.querySelector('.cta-button');
  ctaButton.addEventListener('click', function() {
    // 作品セクションへスクロール（実際にはセクションがないため、アラートを表示）
    alert('作品セクションは準備中です！');
  });
  
  // スクロールアニメーション
  window.addEventListener('scroll', function() {
    const aboutSection = document.querySelector('.about');
    const sectionTop = aboutSection.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;
    
    if (sectionTop < windowHeight * 0.8) {
      aboutSection.style.opacity = '1';
      aboutSection.style.transform = 'translateY(0)';
    }
  });
  
  // aboutセクションの初期スタイル
  const aboutSection = document.querySelector('.about');
  aboutSection.style.opacity = '0';
  aboutSection.style.transform = 'translateY(50px)';
  aboutSection.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
});