/**
 * pythink2 강의안 — 테마 선택기
 * pythink2 앱의 멀티테마 시스템에서 영감을 받아 제작
 * 6개 테마: Notion, Aurora, Ghibli, Pastel, Retro, Ocean
 */

(function () {
  const THEMES = [
    { id: 'notion',  name: 'Notion',  color: '#37352f', desc: '깔끔한 기본 테마' },
    { id: 'aurora',  name: 'Aurora',  color: '#6366f1', desc: '다크 + 보라 그라데이션' },
    { id: 'ghibli',  name: 'Ghibli',  color: '#4d7c6c', desc: '따뜻한 세리프 느낌' },
    { id: 'pastel',  name: 'Pastel',  color: '#a855f7', desc: '부드러운 퍼플 톤' },
    { id: 'retro',   name: 'Retro',   color: '#00ff88', desc: '터미널 + 네온' },
    { id: 'ocean',   name: 'Ocean',   color: '#14b8a6', desc: '깊은 바다 그라데이션' },
  ];

  const STORAGE_KEY = 'pythink2-slides-theme';

  function createSwitcher() {
    const container = document.createElement('div');
    container.id = 'theme-switcher';

    THEMES.forEach(theme => {
      const dot = document.createElement('div');
      dot.className = 'theme-dot';
      dot.title = theme.name;
      dot.style.background = theme.color;
      dot.dataset.themeId = theme.id;

      // Dark themes need light border on dot
      if (['aurora', 'retro', 'ocean'].includes(theme.id)) {
        dot.style.border = '2px solid rgba(255,255,255,0.3)';
      }

      dot.addEventListener('click', () => applyTheme(theme.id));
      container.appendChild(dot);
    });

    document.body.appendChild(container);
  }

  function applyTheme(themeId) {
    const reveal = document.querySelector('.reveal');
    if (!reveal) return;

    reveal.setAttribute('data-theme', themeId);

    // Update active dot
    document.querySelectorAll('#theme-switcher .theme-dot').forEach(dot => {
      dot.classList.toggle('active', dot.dataset.themeId === themeId);
    });

    // Update reveal.js theme dynamically
    const isDark = ['aurora', 'retro', 'ocean'].includes(themeId);

    // Change base theme stylesheet
    const themeLink = document.querySelector('link[href*="theme/"]');
    if (themeLink) {
      const baseUrl = 'https://cdn.jsdelivr.net/npm/reveal.js@5.1.0/dist/theme/';
      themeLink.href = isDark ? baseUrl + 'black.css' : baseUrl + 'white.css';
    }

    // Update highlight theme
    const hlLink = document.querySelector('link[href*="highlight/"]');
    if (hlLink) {
      const hlBase = 'https://cdn.jsdelivr.net/npm/reveal.js@5.1.0/plugin/highlight/';
      hlLink.href = isDark ? hlBase + 'monokai.css' : hlBase + 'zenburn.css';
    }

    // Save preference
    localStorage.setItem(STORAGE_KEY, themeId);
  }

  function init() {
    createSwitcher();

    // Restore saved theme or default to 'notion'
    const saved = localStorage.getItem(STORAGE_KEY) || 'notion';
    applyTheme(saved);

    // Auto-hide switcher after 3 seconds in presentation
    let hideTimeout;
    const switcher = document.getElementById('theme-switcher');

    function resetHide() {
      switcher.style.opacity = '1';
      clearTimeout(hideTimeout);
      hideTimeout = setTimeout(() => {
        if (!switcher.matches(':hover')) {
          switcher.style.opacity = '0.3';
        }
      }, 3000);
    }

    switcher.addEventListener('mouseenter', () => {
      switcher.style.opacity = '1';
      clearTimeout(hideTimeout);
    });

    switcher.addEventListener('mouseleave', resetHide);
    resetHide();
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
