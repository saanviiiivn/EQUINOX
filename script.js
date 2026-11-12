/**
 * EQUINOX – The Cosmic Daily
 * Client-Side Interactive Controller
 */

// ==========================================
// 1. Theme Management (Dark / Light Mode)
// ==========================================
(function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.documentElement.classList.remove('dark');
  } else if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark');
  }
})();

document.addEventListener('DOMContentLoaded', () => {
  const themeBtn = document.getElementById('theme-btn');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const html = document.documentElement;
      if (html.classList.contains('dark')) {
        html.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      } else {
        html.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      }
    });
  }

  // ==========================================
  // 2. Starfield Particles Animation on Hero
  // ==========================================
  const canvas = document.getElementById('starfield');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let stars = [];
    const numStars = 140;

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    }

    function initStars() {
      stars = [];
      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * (canvas.height * 0.7), // Concentrate above planet curve
          radius: Math.random() * 1.5 + 0.3,
          alpha: Math.random() * 0.8 + 0.2,
          speed: Math.random() * 0.02 + 0.005,
          twinkleDelta: (Math.random() - 0.5) * 0.02,
        });
      }
    }

    function renderStars() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let s of stars) {
        s.alpha += s.twinkleDelta;
        if (s.alpha > 0.95 || s.alpha < 0.15) {
          s.twinkleDelta = -s.twinkleDelta;
        }
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(224, 242, 254, ${s.alpha})`;
        ctx.fill();
      }
      requestAnimationFrame(renderStars);
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    renderStars();
  }

  // ==========================================
  // 3. Navigation Drawer Logic
  // ==========================================
  const menuBtn = document.getElementById('menu-btn');
  const drawer = document.getElementById('drawer');
  const drawerBackdrop = document.getElementById('drawer-backdrop');
  const drawerPanel = document.getElementById('drawer-panel');
  const closeDrawerBtn = document.getElementById('close-drawer');

  function openDrawer() {
    if (!drawer || !drawerPanel) return;
    drawer.classList.remove('pointer-events-none', 'opacity-0');
    drawer.classList.add('opacity-100');
    drawerPanel.classList.remove('-translate-x-full');
    drawerPanel.classList.add('translate-x-0');
  }

  function closeDrawer() {
    if (!drawer || !drawerPanel) return;
    drawer.classList.add('opacity-0');
    drawerPanel.classList.remove('translate-x-0');
    drawerPanel.classList.add('-translate-x-full');
    setTimeout(() => {
      drawer.classList.add('pointer-events-none');
    }, 300);
  }

  if (menuBtn) menuBtn.addEventListener('click', openDrawer);
  if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeDrawer);
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);

  // Close drawer when any internal navigation link is tapped
  document.querySelectorAll('#drawer a').forEach((link) => {
    link.addEventListener('click', closeDrawer);
  });

  // ==========================================
  // 4. Global Search Modal Interaction
  // ==========================================
  const searchTrigger = document.getElementById('search-trigger');
  const searchModal = document.getElementById('search-modal');
  const closeSearch = document.getElementById('close-search');
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');

  function openSearch() {
    if (!searchModal) return;
    searchModal.classList.remove('hidden');
    setTimeout(() => {
      if (searchInput) searchInput.focus();
    }, 50);
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

  // Search filter dynamic filtering
  if (searchInput && searchResults) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      const items = searchResults.querySelectorAll('a');
      items.forEach((el) => {
        const text = el.innerText.toLowerCase();
        el.style.display = text.includes(q) ? 'flex' : 'none';
      });
    });
  }

  // ==========================================
  // 5. Audio Synthesizer Ambiance Simulation
  // ==========================================
  const audioBtn = document.getElementById('audio-toggle');
  const audioIcon = document.getElementById('audio-icon');
  let audioCtx = null;
  let isPlaying = false;
  let osc1, osc2, gainNode;

  if (audioBtn) {
    audioBtn.addEventListener('click', () => {
      if (!isPlaying) {
        try {
          audioCtx = new (window.AudioContext || window.webkitAudioContext)();
          osc1 = audioCtx.createOscillator();
          osc2 = audioCtx.createOscillator();
          gainNode = audioCtx.createGain();

          osc1.type = 'sine';
          osc1.frequency.setValueAtTime(55, audioCtx.currentTime); // 55Hz low cosmic drone
          osc2.type = 'triangle';
          osc2.frequency.setValueAtTime(110, audioCtx.currentTime);

          gainNode.gain.setValueAtTime(0.04, audioCtx.currentTime);

          osc1.connect(gainNode);
          osc2.connect(gainNode);
          gainNode.connect(audioCtx.destination);

          osc1.start();
          osc2.start();
          isPlaying = true;
          if (audioIcon) {
            audioIcon.innerText = 'volume_up';
            audioIcon.classList.add('text-primary');
          }
        } catch (e) {
          console.warn('Audio contextual playback prevented', e);
        }
      } else {
        if (gainNode && audioCtx) {
          gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.5);
          setTimeout(() => {
            if (audioCtx && audioCtx.state !== 'closed') {
              audioCtx.close();
            }
            isPlaying = false;
            if (audioIcon) {
              audioIcon.innerText = 'volume_off';
              audioIcon.classList.remove('text-primary');
            }
          }, 500);
        }
      }
    });
  }
});

// ==========================================
// 6. Interactive Space Quiz Handler
// ==========================================
function handleQuizAnswer(button, isCorrect) {
  const feedback = document.getElementById('quiz-feedback');
  if (!feedback) return;

  feedback.classList.remove('hidden');

  // Reset sibling buttons
  const buttons = button.parentElement.querySelectorAll('button');
  buttons.forEach((btn) => {
    btn.classList.remove(
      'bg-emerald-500/30',
      'border-emerald-400',
      'bg-rose-500/30',
      'border-rose-400'
    );
    btn.classList.add('bg-white/5', 'border-white/10');
  });

  if (isCorrect) {
    button.classList.remove('bg-white/5');
    button.classList.add('bg-emerald-500/30', 'border-emerald-400');
    feedback.className = 'text-[11px] font-mono text-emerald-400 pt-1 font-semibold';
    feedback.innerText =
      'Correct! Pauli exclusion principle prevents electron collapse up to Chandrasekhar limit (~1.44 M☉).';
  } else {
    button.classList.remove('bg-white/5');
    button.classList.add('bg-rose-500/30', 'border-rose-400');
    feedback.className = 'text-[11px] font-mono text-rose-400 pt-1';
    feedback.innerText =
      'Incorrect. Quantum electron degeneracy pressure counteracts gravitational collapse.';
  }
}

// Attach to window so inline onclick handlers continue to function
window.handleQuizAnswer = handleQuizAnswer;