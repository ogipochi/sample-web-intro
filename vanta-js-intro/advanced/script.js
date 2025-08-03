// Vantaエフェクト管理クラス
class VantaManager {
  constructor() {
    this.effects = new Map();
  }
  
  create(id, type, options) {
    this.destroy(id);
    this.effects.set(id, VANTA[type](options));
    return this.effects.get(id);
  }
  
  destroy(id) {
    if (this.effects.has(id)) {
      this.effects.get(id).destroy();
      this.effects.delete(id);
    }
  }
  
  update(id, options) {
    if (this.effects.has(id)) {
      this.effects.get(id).setOptions(options);
    }
  }
  
  destroyAll() {
    this.effects.forEach((effect, id) => {
      effect.destroy();
    });
    this.effects.clear();
  }
}

// グローバルマネージャーインスタンス
const vantaManager = new VantaManager();

// 初期化
document.addEventListener('DOMContentLoaded', () => {
  initializeEffects();
  updateScreenInfo();
  updateCurrentTime();
  setInterval(updateCurrentTime, 1000);
});

// 各セクションのエフェクト初期化
function initializeEffects() {
  // 1. エフェクト切り替えデモ
  vantaManager.create('effect-switcher', 'WAVES', {
    el: "#effect-switcher",
    mouseControls: true,
    touchControls: true,
    gyroControls: false,
    minHeight: 200.00,
    minWidth: 200.00,
    scale: 1.00,
    scaleMobile: 1.00,
    color: 0x0099ff,
    shininess: 60.00,
    waveHeight: 20.00,
    waveSpeed: 1.00,
    zoom: 0.65
  });

  // 2. 動的な色変更デモ
  vantaManager.create('color-changer', 'WAVES', {
    el: "#color-changer",
    mouseControls: true,
    touchControls: true,
    color: 0x0099ff,
    shininess: 50.00,
    waveHeight: 15.00
  });

  // 3. マウスインタラクションデモ
  vantaManager.create('mouse-interactive', 'NET', {
    el: "#mouse-interactive",
    mouseControls: true,
    touchControls: true,
    gyroControls: false,
    minHeight: 200.00,
    minWidth: 200.00,
    scale: 1.00,
    scaleMobile: 1.00,
    color: 0xff3f81,
    backgroundColor: 0x23153c,
    points: 10.00,
    maxDistance: 20.00,
    spacing: 20.00
  });

  // 4. 時間帯別エフェクト
  applyTimeBasedEffect();

  // 5. レスポンシブデモ
  createResponsiveEffect();

  // 6. パフォーマンスデモ
  vantaManager.create('performance-demo', 'BIRDS', {
    el: "#performance-demo",
    mouseControls: true,
    touchControls: true,
    gyroControls: false,
    minHeight: 200.00,
    minWidth: 200.00,
    scale: 1.00,
    scaleMobile: 1.00,
    backgroundColor: 0x0c1e3d,
    color1: 0xff0000,
    color2: 0x00ff00,
    birdSize: 1.50,
    quantity: 4
  });
}

// エフェクト切り替え関数
function changeEffect(type) {
  const options = {
    el: "#effect-switcher",
    mouseControls: true,
    touchControls: true,
    gyroControls: false,
    minHeight: 200.00,
    minWidth: 200.00
  };

  switch(type) {
    case 'WAVES':
      vantaManager.create('effect-switcher', 'WAVES', {
        ...options,
        color: 0x0099ff,
        shininess: 60.00,
        waveHeight: 20.00,
        waveSpeed: 1.00
      });
      break;
    case 'BIRDS':
      vantaManager.create('effect-switcher', 'BIRDS', {
        ...options,
        backgroundColor: 0x0c1e3d,
        color1: 0xff0000,
        color2: 0x00ff00,
        birdSize: 1.50,
        quantity: 4
      });
      break;
    case 'FOG':
      vantaManager.create('effect-switcher', 'FOG', {
        ...options,
        highlightColor: 0xe6ff00,
        midtoneColor: 0xff0000,
        lowlightColor: 0x2d00ff,
        baseColor: 0x0
      });
      break;
    case 'NET':
      vantaManager.create('effect-switcher', 'NET', {
        ...options,
        color: 0xff3f81,
        backgroundColor: 0x23153c,
        points: 10.00,
        maxDistance: 20.00
      });
      break;
    case 'DOTS':
      vantaManager.create('effect-switcher', 'DOTS', {
        ...options,
        color: 0xffffff,
        backgroundColor: 0x0a0a0a,
        size: 3.00,
        spacing: 20.00
      });
      break;
  }
}

// 色変更関数
function applyColor() {
  const colorPicker = document.getElementById('color-picker');
  const color = parseInt(colorPicker.value.substring(1), 16);
  
  vantaManager.update('color-changer', {
    color: color
  });
}

// マウスインタラクション
document.addEventListener('mousemove', (e) => {
  const intensity = (e.clientX / window.innerWidth) * 20;
  vantaManager.update('mouse-interactive', {
    points: Math.max(5, intensity)
  });
});

// 時間帯別エフェクト
function getTimeBasedEffect(hour) {
  if (hour >= 6 && hour < 12) {
    // 朝：明るい雲
    return {
      type: 'CLOUDS',
      options: {
        el: "#time-based",
        mouseControls: true,
        touchControls: true,
        skyColor: 0x68b3ff,
        cloudColor: 0xffffff,
        cloudShadowColor: 0x183550,
        sunColor: 0xff9919,
        sunGlareColor: 0xff6633,
        sunlightColor: 0xff9933
      }
    };
  } else if (hour >= 12 && hour < 18) {
    // 昼：波
    return {
      type: 'WAVES',
      options: {
        el: "#time-based",
        mouseControls: true,
        touchControls: true,
        color: 0x0099ff,
        shininess: 60.00,
        waveHeight: 20.00
      }
    };
  } else {
    // 夜：星空風のドット
    return {
      type: 'DOTS',
      options: {
        el: "#time-based",
        mouseControls: true,
        touchControls: true,
        color: 0xffffff,
        backgroundColor: 0x0a0a0a,
        size: 2.00,
        spacing: 25.00
      }
    };
  }
}

function applyTimeBasedEffect(hour = new Date().getHours()) {
  const effect = getTimeBasedEffect(hour);
  vantaManager.create('time-based', effect.type, effect.options);
}

function simulateTime(hour) {
  applyTimeBasedEffect(hour);
  updateCurrentTime(hour);
}

function updateCurrentTime(simulatedHour = null) {
  const hour = simulatedHour !== null ? simulatedHour : new Date().getHours();
  let timeOfDay;
  
  if (hour >= 6 && hour < 12) {
    timeOfDay = '朝';
  } else if (hour >= 12 && hour < 18) {
    timeOfDay = '昼';
  } else {
    timeOfDay = '夜';
  }
  
  document.getElementById('current-time').textContent = 
    simulatedHour !== null 
      ? `シミュレーション時刻: ${hour}:00 (${timeOfDay})`
      : `現在の時刻: ${new Date().toLocaleTimeString('ja-JP')} (${timeOfDay})`;
}

// レスポンシブ対応
function createResponsiveEffect() {
  const isMobile = window.innerWidth < 768;
  
  vantaManager.create('responsive-demo', 'WAVES', {
    el: "#responsive-demo",
    mouseControls: true,
    touchControls: true,
    gyroControls: false,
    minHeight: 200.00,
    minWidth: 200.00,
    scale: 1.00,
    scaleMobile: 1.00,
    color: 0x005588,
    shininess: isMobile ? 30 : 60,
    waveHeight: isMobile ? 10 : 20,
    waveSpeed: isMobile ? 0.5 : 1.0,
    zoom: isMobile ? 0.8 : 0.65
  });
}

function updateScreenInfo() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const isMobile = width < 768;
  
  document.getElementById('screen-info').textContent = 
    `画面サイズ: ${width} x ${height} (${isMobile ? 'モバイル' : 'デスクトップ'}モード)`;
}

// ウィンドウリサイズ時の処理
window.addEventListener('resize', () => {
  createResponsiveEffect();
  updateScreenInfo();
});

// パフォーマンス設定
function setPerformance(level) {
  let options = {
    el: "#performance-demo",
    mouseControls: true,
    touchControls: true,
    gyroControls: false,
    backgroundColor: 0x0c1e3d
  };
  
  switch(level) {
    case 'low':
      options = {
        ...options,
        quantity: 2,
        birdSize: 1,
        speedLimit: 3,
        separation: 100,
        alignment: 100,
        cohesion: 100
      };
      document.getElementById('performance-info').textContent = '現在: 低負荷モード';
      break;
    case 'normal':
      options = {
        ...options,
        quantity: 4,
        birdSize: 1.5,
        speedLimit: 5,
        separation: 50,
        alignment: 50,
        cohesion: 50
      };
      document.getElementById('performance-info').textContent = '現在: 通常モード';
      break;
    case 'high':
      options = {
        ...options,
        quantity: 8,
        birdSize: 2,
        speedLimit: 7,
        separation: 20,
        alignment: 20,
        cohesion: 20
      };
      document.getElementById('performance-info').textContent = '現在: 高品質モード';
      break;
  }
  
  vantaManager.create('performance-demo', 'BIRDS', options);
}

// タブの可視性変更時の処理
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // タブが非表示になったら全エフェクトを一時停止
    vantaManager.effects.forEach((effect) => {
      if (effect.pause) effect.pause();
    });
  } else {
    // タブが表示されたら全エフェクトを再開
    vantaManager.effects.forEach((effect) => {
      if (effect.resume) effect.resume();
    });
  }
});

// ページ離脱時のクリーンアップ
window.addEventListener('beforeunload', () => {
  vantaManager.destroyAll();
});