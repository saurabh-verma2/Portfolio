function scrollToSection(id) {
  const el = document.getElementById(id);

  if (el) {
    el.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }
}

function toggleMenu() {
  const menu = document.getElementById('mobile-menu');
  const hamburger = document.getElementById('hamburger');
  const isOpen = menu.classList.toggle('open');

  hamburger.classList.toggle('is-open', isOpen);

  if (isOpen) {
    const btns = menu.querySelectorAll('.mobile-nav-btn');
    btns.forEach(btn => {
      btn.style.transitionDelay = '0ms';
      btn.classList.remove('item-visible');
    });
    setTimeout(() => {
      btns.forEach((btn, i) => {
        btn.style.transitionDelay = `${i * 70}ms`;
        btn.classList.add('item-visible');
      });
    }, 80);
  } else {
    menu.querySelectorAll('.mobile-nav-btn').forEach(btn => {
      btn.style.transitionDelay = '0ms';
      btn.classList.remove('item-visible');
    });
  }
}

const NAV_SECTIONS = ['about', 'skills', 'projects', 'experience', 'contact'];

function updateActiveNav() {
  let current = 'about';
  NAV_SECTIONS.forEach(id => {
    const el = document.getElementById(id);
    if (el && window.scrollY >= el.offsetTop - 120) current = id;
  });
  document.querySelectorAll('[data-section]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.section === current);
  });
}

function initScrollTop() {
  const btn = document.getElementById('scroll-top');
  if (!btn) return;

  const syncVisibility = () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  };

  window.addEventListener('scroll', syncVisibility, { passive: true });
  syncVisibility();
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

function initFadeIn() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.12 });

  const observe = () =>
    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

  observe();
  setTimeout(observe, 120);
}

// Toast notification
function showToast(msg, type = '') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast show ' + type;
  setTimeout(() => { t.className = 'toast'; }, 3500);
}

//  TYPEWRITER
function initTypewriter() {
  let tIdx = 0, cIdx = 0, deleting = false;
  const el = document.getElementById('typewriter');
  if (!el) return;

  function tick() {
    const word = TAGLINES[tIdx];
    if (!deleting) {
      el.textContent = word.slice(0, ++cIdx);
      if (cIdx === word.length) { deleting = true; setTimeout(tick, 1200); return; }
    } else {
      el.textContent = word.slice(0, --cIdx);
      if (cIdx === 0) { deleting = false; tIdx = (tIdx + 1) % TAGLINES.length; }
    }
    setTimeout(tick, deleting ? 50 : 100);
  }
  tick();
}

//  ABOUT — info cards
function renderInfoCards() {
  const grid = document.getElementById('info-grid');
  if (!grid) return;
  grid.innerHTML = INFO_CARDS.map(card => `
    <div class="info-card fade-in">
      <div class="info-card-header">
        <i class="fa ${card.icon}"></i>
        <h3>${card.title}</h3>
      </div>
      <ul>${card.points.map(p => `<li>${p}</li>`).join('')}</ul>
    </div>
  `).join('');
}

//  ABOUT — tag chips (dynamic)
function renderAboutTags() {
  const row = document.getElementById('about-tags');
  if (!row) return;
  row.innerHTML = ABOUT_TAGS.map(t => `<span class="tag-chip">${t}</span>`).join('');
}

//  SKILLS
let _activeSkillCat = 0;

function renderSkillTabs() {
  const vEl = document.getElementById('skill-tabs-v');
  const hEl = document.getElementById('skill-tabs-h');
  if (!vEl || !hEl) return;
  vEl.innerHTML = '';
  hEl.innerHTML = '';

  SKILL_CATEGORIES.forEach((cat, i) => {
    const makeBtn = () => {
      const btn = document.createElement('button');
      btn.className = 'skill-tab' + (i === _activeSkillCat ? ' active' : '');
      btn.innerHTML = `<i class="fa ${cat.icon}" style="color:${cat.color}"></i> ${cat.name}`;
      btn.addEventListener('click', () => {
        _activeSkillCat = i;
        renderSkillTabs();
        renderSkillGrid();
      });
      return btn;
    };
    vEl.appendChild(makeBtn());
    hEl.appendChild(makeBtn());
  });
}

function renderSkillGrid() {
  const grid = document.getElementById('skills-grid');
  if (!grid) return;

  const cat = SKILL_CATEGORIES[_activeSkillCat];
  grid.innerHTML = '';

  cat.skills.forEach(sk => {
    const card = document.createElement('div');
    card.className = 'skill-card';
    card.dataset.level = sk.level;

    card.innerHTML = `
      <div class="skill-card-inner">
        <div class="skill-icon-wrap">
          <i class="${sk.icon}" style="color:${sk.color}; font-size:1.6rem;"></i>
        </div>
        <div class="skill-info">
          <div class="skill-name-row">
            <span class="skill-name-chip">${sk.name}</span>
            <span class="skill-level-num" style="color:${sk.color}">0%</span>
          </div>
          <div class="skill-bar-track">
            <div class="skill-bar-fill"
                 style="--bar-color:${sk.color}; --bar-target:${sk.level}%"
                 data-target="${sk.level}">
              <div class="skill-bar-shine"></div>
            </div>
          </div>
          <div class="skill-level-label">${getLevelLabel(sk.level)}</div>
        </div>
      </div>
    `;

    card.addEventListener('mouseenter', () => {
      card.style.boxShadow = `var(--shadow-nm), 0 0 20px ${sk.color}44`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.boxShadow = '';
    });

    grid.appendChild(card);
  });

  requestAnimationFrame(() => {
    setTimeout(() => animateSkillBars(), 80);
  });
}

function getLevelLabel(level) {
  if (level >= 90) return '★ Expert';
  if (level >= 75) return '◆ Advanced';
  if (level >= 55) return '● Intermediate';
  return '○ Beginner';
}

function animateSkillBars(root) {
  const container = root || document.getElementById('skills-grid');
  if (!container) return;

  const DURATION = 900;

  container.querySelectorAll('.skill-bar-fill').forEach(bar => {
    const target = parseInt(bar.dataset.target, 10);
    const numEl = bar.closest('.skill-card-inner')
      .querySelector('.skill-level-num');
    const start = performance.now();
    function easeOutExpo(t) {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / DURATION, 1);
      const eased = easeOutExpo(progress);
      const current = Math.round(eased * target);

      bar.style.width = current + '%';
      if (numEl) numEl.textContent = current + '%';

      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  });
}

//  PROJECTS
function renderProjects() {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  PROJECTS.forEach((p, index) => {
    const card = document.createElement('div');
    card.className = 'project-card fade-in';
    card.style.cursor = 'pointer';

    const techHTML = p.techs.map(t =>
      `<div class="tech-chip" data-tip="${t.name}">
         <i class="${t.icon}" style="color:${t.color}"></i>
       </div>`
    ).join('');

    card.innerHTML = `
      <div class="project-img" style="background:${p.gradient}">
        ${p.image
          ? `<img src="${p.image}" alt="${p.title} project preview" loading="lazy" decoding="async">`
          : `<i class="fa ${p.icon} project-img-icon"></i>`}
        <span class="project-img-label">${p.label}</span>
      </div>
      <div class="project-body">
        <div class="project-title-row">
          <div class="project-title">${p.title}</div>
          <a class="project-github" href="${p.github}"
             target="_blank" rel="noopener noreferrer" title="GitHub"
             aria-label="View ${p.title} on GitHub"
             onclick="event.stopPropagation()">
            <i class="fab fa-github" aria-hidden="true"></i>
          </a>
        </div>
        <p class="project-desc">${p.desc}</p>
        <div class="tech-row">
          ${techHTML}
          <button class="view-details-hint" type="button" aria-haspopup="dialog"
            aria-label="View details for ${p.title}">
            <i class="fa fa-expand-alt"></i> View details
          </button>
        </div>
      </div>
    `;

    const detailsButton = card.querySelector('.view-details-hint');
    card.addEventListener('click', () => openProjectModal(index, detailsButton));
    detailsButton.addEventListener('click', event => {
      event.stopPropagation();
      openProjectModal(index, detailsButton);
    });

    grid.appendChild(card);
  });
}

//  EXPERIENCE
function _expCardHTML(e) {
  const badgeClass = e.type === 'work' ? 'badge-work' : 'badge-edu';
  const badgeLabel = e.type === 'work' ? 'Work' : 'Education';
  const scoreHTML = e.score
    ? `<div class="exp-score"><i class="fa fa-star"></i> ${e.score}</div>` : '';
  const ptHTML = e.points.map(p => `<li>${p}</li>`).join('');

  return `
    <div class="exp-badge ${badgeClass}"><i class="fa ${e.icon}"></i> ${badgeLabel}</div>
    <div class="exp-title">${e.title}</div>
    <div class="exp-sub">${e.sub}</div>
    <div class="exp-meta-row">
      <div class="exp-period"><i class="fa fa-calendar"></i> ${e.period}</div>
      ${scoreHTML}
    </div>
    <ul class="exp-points">${ptHTML}</ul>
  `;
}

function renderExperience() {
  const etl = document.getElementById('exp-timeline');
  if (!etl) return;

  EXPERIENCES.forEach((e, i) => {
    const item = document.createElement('div');
    item.className = 'exp-timeline-item fade-in';

    const ptHTML = e.points.map(p => `<li>${p}</li>`).join('');
    const scoreHTML = e.score
      ? `<div class="exp-score"><i class="fa fa-star"></i> ${e.score}</div>` : '';
    const badgeClass = e.type === 'work' ? 'badge-work' : 'badge-edu';
    const dotClass = e.type === 'work' ? 'dot-work' : 'dot-edu';
    const badgeLabel = e.type === 'work' ? 'Work' : 'Education';
    const isLast = i === EXPERIENCES.length - 1;

    item.innerHTML = `
      <div class="exp-line-col">
        <div class="exp-dot ${dotClass}"><i class="fa ${e.icon}"></i></div>
        ${!isLast ? '<div class="exp-connector"></div>' : ''}
      </div>
      <div class="exp-timeline-card" data-type="${e.type}">
        <div class="exp-year-label">${e.period}</div>
        <div class="exp-badge ${badgeClass}"><i class="fa ${e.icon}"></i> ${badgeLabel}</div>
        <div class="exp-title">${e.title}</div>
        <div class="exp-sub">${e.sub}</div>
        <div class="exp-meta-row">${scoreHTML}</div>
        <ul class="exp-points">${ptHTML}</ul>
        <button class="exp-expand-btn" aria-label="Toggle details">
          Details <i class="fa fa-chevron-down"></i>
        </button>
      </div>
    `;

    const btn = item.querySelector('.exp-expand-btn');
    const card = item.querySelector('.exp-timeline-card');

    function toggleCard() {
      card.classList.toggle('expanded');
    }

    card.addEventListener('click', toggleCard);

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleCard();
    });
    
    etl.appendChild(item);
  });
}

//  CONTACT FORM
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  form.dataset.startedAt = String(Date.now());

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const name = document.getElementById('f-name').value.trim();
    const email = document.getElementById('f-email').value.trim();
    const msg = document.getElementById('f-msg').value.trim();

    const showErr = (id, show) =>
      document.getElementById(id).classList.toggle('show', show);

    let ok = true;
    showErr('err-name', !name); if (!name) ok = false;
    showErr('err-email', !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) ok = false;
    showErr('err-msg', !msg); if (!msg) ok = false;
    if (!ok) return;

    const btn = document.getElementById('send-btn');
    btn.classList.add('loading');
    btn.disabled = true;
    const controller = new AbortController();
    const requestTimeout = window.setTimeout(() => controller.abort(), 15_000);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          name,
          email,
          message: msg,
          website: document.getElementById('f-website')?.value || '',
          startedAt: Number(form.dataset.startedAt),
        }),
      });

      if (res.ok) {
        showToast('Message sent successfully! 🎉', 'success');
        form.reset();
        form.dataset.startedAt = String(Date.now());
      } else {
        throw new Error('Server error ' + res.status);
      }
    } catch (err) {
      showToast('Failed to send. Please email me directly.', 'error');
    } finally {
      window.clearTimeout(requestTimeout);
      btn.classList.remove('loading');
      btn.disabled = false;
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const profileImage = document.getElementById('profile-image');
  if (profileImage) profileImage.src = ASSETS.images.profile;

  Theme.init();
  initCursor();
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      const menu = document.getElementById('mobile-menu');
      if (menu.classList.contains('open')) toggleMenu();
    }
  });

  window.addEventListener('scroll', updateActiveNav, { passive: true });

  // Sections
  initScrollProgress();
  initScrollTop();
  initTypewriter();
  renderAboutTags();
  renderInfoCards();
  renderStats();
  renderSkillTabs();
  renderSkillGrid();
  renderProjects();
  renderExperience();
  initContactForm();

  const footerYear = document.getElementById('footer-year');
  if (footerYear) footerYear.textContent = new Date().getFullYear();

  initFadeIn();
});

//  CUSTOM CURSOR — colored smoke trail
function initCursor() {
  if (window.matchMedia('(hover: none)').matches) return;

  const dot = document.getElementById('cursor-dot');
  if (!dot) return;

  const SMOKE_LIGHT = ['#ff40ef', '#ba68c8', '#64b5f6', '#4dd0e1', '#ffd54f'];
  const SMOKE_DARK = ['#ff0000', '#ce93d8', '#90caf9', '#80deea', '#f48fb1'];

  let lastSpawn = 0;
  const SPAWN_INTERVAL = 16;

  document.addEventListener('mousemove', e => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';

    const now = performance.now();
    if (now - lastSpawn > SPAWN_INTERVAL) {
      lastSpawn = now;
      spawnSmoke(mouseX, mouseY);
      spawnSmoke(mouseX + (Math.random() - 0.5) * 8, mouseY + (Math.random() - 0.5) * 8);
    }
  }, { passive: true });

  function spawnSmoke(x, y) {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const palette = isDark ? SMOKE_DARK : SMOKE_LIGHT;
    const color = palette[Math.floor(Math.random() * palette.length)];

    const puff = document.createElement('div');
    puff.className = 'cursor-smoke';

    const size = 10 + Math.random() * 14;
    const sx = (Math.random() - 0.5) * 40;
    const sy = -20 - Math.random() * 30;
    const rot = (Math.random() - 0.5) * 60;
    const dur = 700 + Math.random() * 500;
    const scale = 1.4 + Math.random() * 1;

    Object.assign(puff.style, {
      left: x + 'px',
      top: y + 'px',
      width: size + 'px',
      height: size + 'px',
      background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
      '--sx': sx + 'px',
      '--sy': sy + 'px',
      '--srot': rot + 'deg',
      '--send-scale': scale,
      '--smoke-dur': dur + 'ms',
    });

    document.body.appendChild(puff);
    puff.addEventListener('animationend', () => puff.remove());
  }

  const hoverTargets = 'a, button, .skill-tab, .project-card, .social-icon-btn, .tech-chip, .orbit-badge';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverTargets)) document.body.classList.add('cursor-hover');
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverTargets)) document.body.classList.remove('cursor-hover');
  });

  document.addEventListener('mousedown', () => {
    dot.style.transform = 'translate(-50%, -50%) scale(0.6)';
  });
  document.addEventListener('mouseup', () => {
    dot.style.transform = 'translate(-50%, -50%) scale(1)';
  });

  document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; });
}

//  PROJECT MODAL
let _projectModalTrigger = null;

function getProjectModalFocusableElements() {
  const modal = document.getElementById('project-modal');
  if (!modal) return [];

  return [...modal.querySelectorAll(
    'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
  )].filter(element => !element.hidden && element.getAttribute('aria-hidden') !== 'true');
}

function openProjectModal(index, trigger = document.activeElement) {
  const p = PROJECTS[index];
  const overlay = document.getElementById('project-modal-overlay');
  if (!p || !overlay) return;

  _projectModalTrigger = trigger instanceof HTMLElement ? trigger : null;

  const banner = document.getElementById('modal-banner');
  const modalIcon = document.getElementById('modal-icon');

  if (p.image) {
    banner.style.background = `url("${p.image}") center / cover no-repeat`;
    modalIcon.hidden = true;
  } else {
    banner.style.background = p.gradient;
    modalIcon.className = `fa ${p.icon}`;
    modalIcon.hidden = false;
  }

  document.getElementById('modal-label-badge').textContent = p.label;

  document.getElementById('modal-title').textContent = p.title;
  const ghLink = document.getElementById('modal-github');
  ghLink.href = p.github;
  ghLink.setAttribute('aria-label', `View ${p.title} on GitHub`);

  document.getElementById('modal-details').textContent = p.details;

  const featuresList = document.getElementById('modal-features');
  featuresList.innerHTML = p.features
    .map(f => `<li>${f}</li>`)
    .join('');

  const techsWrap = document.getElementById('modal-techs');
  techsWrap.innerHTML = p.techs
    .map(t => `
      <div class="modal-tech-chip">
        <i class="${t.icon}" style="color:${t.color}; font-size:1rem;"></i>
        ${t.name}
      </div>
    `).join('');

  overlay.classList.add('open');
  overlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  document.getElementById('project-modal').scrollTop = 0;
  window.requestAnimationFrame(() => document.getElementById('modal-close')?.focus());
}

function closeProjectModal() {
  const overlay = document.getElementById('project-modal-overlay');
  if (!overlay?.classList.contains('open')) return;

  overlay.classList.remove('open');
  overlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  _projectModalTrigger?.focus();
  _projectModalTrigger = null;
}

document.addEventListener('keydown', e => {
  const overlay = document.getElementById('project-modal-overlay');
  if (!overlay?.classList.contains('open')) return;

  if (e.key === 'Escape') {
    e.preventDefault();
    closeProjectModal();
    return;
  }

  if (e.key !== 'Tab') return;

  const focusable = getProjectModalFocusableElements();
  if (focusable.length === 0) {
    e.preventDefault();
    document.getElementById('project-modal')?.focus();
    return;
  }

  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (e.shiftKey && (document.activeElement === first || !overlay.contains(document.activeElement))) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
});

//  STATS COUNTER
function renderStats() {
  const grid = document.getElementById('stats-grid');
  if (!grid || typeof STATS === 'undefined') return;

  STATS.forEach(s => {
    const card = document.createElement('div');
    card.className = 'stat-card fade-in';
    card.style.setProperty('--stat-color', s.color);

    card.innerHTML = `
      <div class="stat-icon-wrap">
        <i class="fa ${s.icon}" style="color:${s.color}"></i>
      </div>
      <div class="stat-value-row">
        <span class="stat-num" data-target="${s.value}">0</span>
        <span class="stat-suffix">${s.suffix}</span>
      </div>
      <div class="stat-label">${s.label}</div>
    `;

    grid.appendChild(card);
  });

  observeStats();
}

function observeStats() {
  const grid = document.getElementById('stats-grid');
  if (!grid) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      grid.querySelectorAll('.stat-card').forEach((card, i) => {
        const numEl = card.querySelector('.stat-num');
        const target = parseInt(numEl.dataset.target, 10);

        setTimeout(() => {
          countUp(numEl, target, 1400);
          card.classList.add('counted');
        }, i * 100);
      });

      observer.disconnect();
    });
  }, { threshold: 0.25 });

  observer.observe(grid);
}

function countUp(el, target, duration) {
  const start = performance.now();
  const startVal = 0;

  function ease(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  function tick(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const current = Math.round(ease(progress) * (target - startVal) + startVal);

    el.textContent = current.toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      el.textContent = target.toLocaleString();
    }
  }

  requestAnimationFrame(tick);
}
//  SCROLL PROGRESS BAR
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;

  let scrollTimer = null;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight
      - window.innerHeight;
    const pct = docHeight > 0
      ? (scrollTop / docHeight) * 100
      : 0;

    bar.style.width = pct + '%';

    bar.classList.toggle('at-top', scrollTop < 10);

    bar.classList.add('scrolling');
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      bar.classList.remove('scrolling');
    }, 150);

  }, { passive: true });

  bar.classList.add('at-top');
}
