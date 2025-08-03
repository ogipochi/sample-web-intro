// DOMの読み込みが完了してから実行
document.addEventListener('DOMContentLoaded', (event) => {
  // Vanta.js BIRDSエフェクトを初期化
  VANTA.BIRDS({
    el: "#vanta-bg",
    mouseControls: true,
    touchControls: true,
    gyroControls: false,
    minHeight: 200.00,
    minWidth: 200.00,
    scale: 1.00,
    scaleMobile: 1.00,
    backgroundColor: 0x181a2a,
    color1: 0xf22e62,
    color2: 0xf5b038,
    birdSize: 1.50,
    separation: 30.00,
    cohesion: 30.00
  });
  
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