/**
 * EQUINOX – The Cosmic Daily
 * Robust Client Controller & Audio Synthesizer
 */

// ==========================================================================
// 1. Theme Management (Early Execution to avoid layout flash)
// ==========================================================================
(function applyInitialTheme() {
  const saved = localStorage.getItem('equinox_theme');
  if (saved === 'light') {
    document.documentElement.classList.remove('dark');
  } else {
    // Default to dark for cosmic experience
    document.documentElement.classList.add('dark');
  }
})();

// ==========================================================================
// 2. DOM Ready Controller
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  // ------------------------------------------------------------------------
  // A. Theme Switcher Button
  // ------------------------------------------------------------------------
  const themeBtn = document.getElementById('theme-btn');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const isDark = document.documentElement.classList.toggle('dark');
      localStorage.setItem('equinox_theme', isDark ? 'dark' : 'light');
    });
  }

  // ------------------------------------------------------------------------
  // B. Twinkling Starfield Canvas
  // ------------------------------------------------------------------------
  const canvas = document.getElementById('starfield');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let stars = [];
    const numStars = 140;
    let animationFrameId = null;

    function resizeCanvas() {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.scale(dpr, dpr);
      initStars();
    }

    function initStars() {
      stars = [];
      const w = window.innerWidth;
      const h = window.innerHeight;
      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * (h * 0.75),
          radius: Math.random() * 1.4 + 0.4,
          alpha: Math.random() * 0.8 + 0.2,
          twinkleSpeed: (Math.random() - 0.5) * 0.02,
        });
      }
    }

    function render() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      for (let s of stars) {
        s.alpha += s.twinkleSpeed;
        if (s.alpha > 0.95 || s.alpha < 0.15) {
          s.twinkleSpeed = -s.twinkleSpeed;
        }

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(224, 242, 254, ${Math.max(0.1, Math.min(1, s.alpha))})`;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    }

    window.addEventListener('resize', () => {
      cancelAnimationFrame(animationFrameId);
      resizeCanvas();
      render();
    });

    resizeCanvas();
    render();
  }

  // ------------------------------------------------------------------------
  // C. Slide-out Navigation Drawer (Robust Pure-CSS Open/Close)
  // ------------------------------------------------------------------------
  const menuBtn = document.getElementById('menu-btn');
  const drawer = document.getElementById('drawer');
  const drawerBackdrop = document.getElementById('drawer-backdrop');
  const closeDrawerBtn = document.getElementById('close-drawer');

  function openDrawer() {
    if (drawer) {
      drawer.classList.add('open');
    }
  }

  function closeDrawer() {
    if (drawer) {
      drawer.classList.remove('open');
    }
  }

  if (menuBtn) menuBtn.addEventListener('click', openDrawer);
  if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeDrawer);
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);

  document.querySelectorAll('#drawer a').forEach((link) => {
    link.addEventListener('click', closeDrawer);
  });

  // ------------------------------------------------------------------------
  // D. Global Search Modal & Filter
  // ------------------------------------------------------------------------
  const searchTrigger = document.getElementById('search-trigger');
  const searchModal = document.getElementById('search-modal');
  const closeSearch = document.getElementById('close-search');
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');

  function openSearch() {
    if (!searchModal) return;
    searchModal.classList.remove('hidden');
    if (searchInput) {
      setTimeout(() => searchInput.focus(), 80);
    }
  }

  function hideSearch() {
    if (!searchModal) return;
    searchModal.classList.add('hidden');
    if (searchInput) searchInput.value = '';
    if (searchResults) {
      searchResults.querySelectorAll('a').forEach((el) => {
        el.style.display = 'flex';
      });
    }
  }

  if (searchTrigger) searchTrigger.addEventListener('click', openSearch);
  if (closeSearch) closeSearch.addEventListener('click', hideSearch);

  if (searchModal) {
    searchModal.addEventListener('click', (e) => {
      if (e.target === searchModal) hideSearch();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      hideSearch();
      closeDrawer();
    }
  });

  if (searchInput && searchResults) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      const items = searchResults.querySelectorAll('a');
      items.forEach((item) => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(q) ? 'flex' : 'none';
      });
    });
  }

  // ------------------------------------------------------------------------
  // E. News Feed Filter Buttons (ALL FEEDS, JWST, EXOPLANETS, ASTROBIOLOGY)
  // ------------------------------------------------------------------------
  const feedButtons = document.querySelectorAll('.feed-btn');
  const articles = document.querySelectorAll('#cosmic-news article, #cosmic-news [data-category]');

  feedButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      feedButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      articles.forEach((art) => {
        const cat = art.getAttribute('data-category');
        if (filter === 'all' || !cat || cat.includes(filter)) {
          art.style.display = '';
        } else {
          art.style.display = 'none';
        }
      });
    });
  });

  // ------------------------------------------------------------------------
  // F. Planetary Expedition Interactive Selection (Earth, Mars, Jupiter)
  // ------------------------------------------------------------------------
  const planetCards = document.querySelectorAll('.planet-card');
  planetCards.forEach((card) => {
    card.addEventListener('click', () => {
      planetCards.forEach((c) => c.classList.remove('selected'));
      card.classList.add('selected');
    });
  });

  // ------------------------------------------------------------------------
  // G. Cosmic Ambiance Synthesizer (Binaural Drone Generator)
  // ------------------------------------------------------------------------
  const audioBtn = document.getElementById('audio-toggle');
  const audioIcon = document.getElementById('audio-icon');
  let audioCtx = null;
  let isPlaying = false;
  let osc1 = null;
  let osc2 = null;
  let gainNode = null;

  if (audioBtn) {
    audioBtn.addEventListener('click', async () => {
      if (!isPlaying) {
        try {
          const AudioContextClass = window.AudioContext || window.webkitAudioContext;
          if (!AudioContextClass) {
            console.warn('Web Audio API is not supported in this browser.');
            return;
          }

          audioCtx = new AudioContextClass();
          if (audioCtx.state === 'suspended') {
            await audioCtx.resume();
          }

          // Oscillator 1: 55Hz (Sub-bass celestial drone)
          osc1 = audioCtx.createOscillator();
          osc1.type = 'sine';
          osc1.frequency.setValueAtTime(55, audioCtx.currentTime);

          // Oscillator 2: 110Hz (Harmonic overtone)
          osc2 = audioCtx.createOscillator();
          osc2.type = 'triangle';
          osc2.frequency.setValueAtTime(110, audioCtx.currentTime);

          // Master Gain Node with gentle attack ramp
          gainNode = audioCtx.createGain();
          gainNode.gain.setValueAtTime(0.0001, audioCtx.currentTime);
          gainNode.gain.linearRampToValueAtTime(0.045, audioCtx.currentTime + 1.2);

          osc1.connect(gainNode);
          osc2.connect(gainNode);
          gainNode.connect(audioCtx.destination);

          osc1.start();
          osc2.start();
          isPlaying = true;

          if (audioIcon) {
            audioIcon.textContent = 'volume_up';
            audioIcon.classList.add('text-primary');
          }
        } catch (err) {
          console.warn('Cosmic Ambiance playback blocked by browser policy:', err);
        }
      } else {
        // Safe, clean fade-out shutdown
        if (gainNode && audioCtx && audioCtx.state !== 'closed') {
          try {
            gainNode.gain.cancelScheduledValues(audioCtx.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.0001, audioCtx.currentTime + 0.4);

            setTimeout(() => {
              try {
                if (osc1) { osc1.stop(); osc1.disconnect(); }
                if (osc2) { osc2.stop(); osc2.disconnect(); }
                if (gainNode) { gainNode.disconnect(); }
                if (audioCtx && audioCtx.state !== 'closed') {
                  audioCtx.close();
                }
              } catch (_) {}
              isPlaying = false;
              if (audioIcon) {
                audioIcon.textContent = 'volume_off';
                audioIcon.classList.remove('text-primary');
              }
            }, 450);
          } catch (e) {
            isPlaying = false;
            if (audioIcon) {
              audioIcon.textContent = 'volume_off';
              audioIcon.classList.remove('text-primary');
            }
          }
        } else {
          isPlaying = false;
          if (audioIcon) {
            audioIcon.textContent = 'volume_off';
            audioIcon.classList.remove('text-primary');
          }
        }
      }
    });
  }
});

// ==========================================================================
// 3. Interactive Space Quiz Handler (Global Scope for inline onclick)
// ==========================================================================
function handleQuizAnswer(button, isCorrect) {
  const feedback = document.getElementById('quiz-feedback');
  const container = button.closest('.space-y-1\\.5') || button.parentElement;

  if (container) {
    container.querySelectorAll('.quiz-option').forEach((btn) => {
      btn.classList.remove('correct', 'wrong');
    });
  }

  if (isCorrect) {
    button.classList.add('correct');
    if (feedback) {
      feedback.className = 'text-[11px] font-mono text-emerald-400 pt-1 font-semibold';
      feedback.textContent = '✓ Correct! Pauli exclusion principle prevents electron collapse up to the Chandrasekhar limit (~1.44 M☉).';
      feedback.classList.remove('hidden');
    }
  } else {
    button.classList.add('wrong');
    if (feedback) {
      feedback.className = 'text-[11px] font-mono text-rose-400 pt-1';
      feedback.textContent = '✕ Incorrect. Quantum electron degeneracy pressure counteracts gravitational collapse.';
      feedback.classList.remove('hidden');
    }
  }
}

// Ensure global accessibility
window.handleQuizAnswer = handleQuizAnswer;
