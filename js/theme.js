/* ════════════════════════════════
   theme.js — Dark/light + particle burst
════════════════════════════════ */
const Theme = (() => {

  /* ── Particle config ── */
  const LIGHT_PARTICLES = ['☀️', '✨', '⭐', '💛', '🌟', '🔆', '💫', '🌙'];
  const DARK_PARTICLES = ['🌙', '⭐', '✨', '💜', '🌟', '💫', '🔮', '🌌'];

  const PARTICLE_COUNT = 22;
  const SPREAD = 140;   // max px radius
  const DURATION = 900;   // ms flight time
  const COLORS_LIGHT = ['#ffeb3b', '#fff176', '#ffe082', '#ffd54f', '#ff8f00', '#ffffff'];
  const COLORS_DARK = ['#ce93d8', '#b39ddb', '#90caf9', '#80deea', '#ffffff', '#f48fb1'];

  /* ── Burst canvas ── */
  function burstParticles(originEl, goingDark) {
    const rect = originEl.getBoundingClientRect();
    const ox = rect.left + rect.width / 2;
    const oy = rect.top + rect.height / 2;
    const emojis = goingDark ? DARK_PARTICLES : LIGHT_PARTICLES;
    const colors = goingDark ? COLORS_DARK : COLORS_LIGHT;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      spawnParticle(ox, oy, emojis, colors, i);
    }

    /* Extra ring-wave of plain dots */
    for (let i = 0; i < 14; i++) {
      spawnDot(ox, oy, colors, i);
    }
  }

  function spawnParticle(ox, oy, emojis, colors, i) {
    const el = document.createElement('div');
    el.className = 'theme-particle';
    el.textContent = emojis[i % emojis.length];

    const angle = (Math.PI * 2 / PARTICLE_COUNT) * i + (Math.random() - 0.5) * 0.6;
    const dist = 50 + Math.random() * SPREAD;
    const tx = Math.cos(angle) * dist;
    const ty = Math.sin(angle) * dist;
    const rot = (Math.random() - 0.5) * 540;
    const delay = Math.random() * 120;
    const scale = 0.7 + Math.random() * 0.9;
    const dur = DURATION + Math.random() * 300;

    Object.assign(el.style, {
      left: ox + 'px',
      top: oy + 'px',
      fontSize: (14 + Math.random() * 14) + 'px',
      animationDelay: delay + 'ms',
      animationDuration: dur + 'ms',
      '--tx': tx + 'px',
      '--ty': ty + 'px',
      '--rot': rot + 'deg',
      '--scale': scale,
    });

    document.body.appendChild(el);
    el.addEventListener('animationend', () => el.remove());
  }

  function spawnDot(ox, oy, colors, i) {
    const el = document.createElement('div');
    el.className = 'theme-dot';

    const angle = (Math.PI * 2 / 14) * i;
    const dist = 30 + Math.random() * 80;
    const size = 4 + Math.random() * 6;
    const delay = Math.random() * 80;
    const dur = 600 + Math.random() * 300;

    Object.assign(el.style, {
      left: ox + 'px',
      top: oy + 'px',
      width: size + 'px',
      height: size + 'px',
      background: colors[i % colors.length],
      animationDelay: delay + 'ms',
      animationDuration: dur + 'ms',
      '--tx': (Math.cos(angle) * dist) + 'px',
      '--ty': (Math.sin(angle) * dist) + 'px',
    });

    document.body.appendChild(el);
    el.addEventListener('animationend', () => el.remove());
  }

  /* ── Ripple wipe across the whole page ── */
  function rippleWipe(originEl, goingDark) {
    const rect = originEl.getBoundingClientRect();
    const ox = rect.left + rect.width / 2;
    const oy = rect.top + rect.height / 2;

    /* Max radius = distance to farthest corner */
    const maxR = Math.hypot(
      Math.max(ox, window.innerWidth - ox),
      Math.max(oy, window.innerHeight - oy)
    );

    const ripple = document.createElement('div');
    ripple.className = 'theme-ripple';

    Object.assign(ripple.style, {
      left: ox + 'px',
      top: oy + 'px',
      '--r': maxR + 'px',
      background: goingDark ? '#1a1a2e' : '#f0f0f0',
    });

    document.body.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  }

  /* ── Flash ring on the button itself ── */
  function buttonFlash(btn) {
    const ring = document.createElement('div');
    ring.className = 'theme-btn-ring';
    btn.style.position = 'relative';
    btn.appendChild(ring);
    ring.addEventListener('animationend', () => ring.remove());
  }

  /* ── Core toggle ── */
  function toggle(sourceBtn) {
    const root = document.documentElement;
    const btn = sourceBtn || document.getElementById('theme-toggle');
    const isDark = root.getAttribute('data-theme') === 'dark';
    const goingDark = !isDark;

    /* Effects first */
    if (btn) {
      burstParticles(btn, goingDark);
      rippleWipe(btn, goingDark);
      buttonFlash(btn);
    }

    /* Small delay so ripple starts before theme snaps */
    setTimeout(() => {
      root.setAttribute('data-theme', goingDark ? 'dark' : 'light');
      localStorage.setItem('theme', goingDark ? 'dark' : 'light');

      const newClass = goingDark ? 'fa fa-sun' : 'fa fa-moon';
      const newLabel = goingDark ? 'Go Light' : 'Go Dark';
      const iconDesktop = document.getElementById('theme-icon');
      const iconMobile  = document.getElementById('theme-icon-mobile');
      const labelMobile = document.getElementById('theme-label-mobile');
      if (iconDesktop) iconDesktop.className = newClass;
      if (iconMobile)  iconMobile.className  = newClass;
      if (labelMobile) labelMobile.textContent = newLabel;
    }, 80);
  }

  /* ── Init (read saved preference) ── */
  function init() {
    const saved  = localStorage.getItem('theme');
    const system = window.matchMedia('(prefers-color-scheme: dark)').matches
                   ? 'dark' : 'light';
    const theme  = saved || system;

    document.documentElement.setAttribute('data-theme', theme);

    const newClass = theme === 'dark' ? 'fa fa-sun' : 'fa fa-moon';
    const newLabel = theme === 'dark' ? 'Go Light' : 'Go Dark';
    const iconDesktop = document.getElementById('theme-icon');
    const iconMobile  = document.getElementById('theme-icon-mobile');
    const labelMobile = document.getElementById('theme-label-mobile');
    if (iconDesktop) iconDesktop.className = newClass;
    if (iconMobile)  iconMobile.className  = newClass;
    if (labelMobile) labelMobile.textContent = newLabel;
  }

  return { init, toggle };
})();

/* Global so onclick="toggleTheme(this)" in HTML still works */
function toggleTheme(btn) { Theme.toggle(btn); }

