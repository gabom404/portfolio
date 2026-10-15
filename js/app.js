/**
 * app.js
 * Interactive controller for Gabriel Martínez's Minimalist Portfolio
 * Modern UX/UI Progressive Disclosure & Monochromatic Editorial Architecture
 */

document.addEventListener('DOMContentLoaded', () => {
  renderFilterTabs();
  renderProjects('all');
  setupGlobalToggle();
  setupSmoothScroll();
});

/* ==========================================================================
   Filter Categories
   ========================================================================== */

const CATEGORIES = [
  { key: 'all', label: 'Todos' },
  { key: 'backend', label: 'Backend y APIs' },
  { key: 'fullstack', label: 'Full Stack' },
  { key: 'mobile', label: 'Desarrollo Móvil' },
  { key: 'python-ai', label: 'Python e IA' },
  { key: 'frontend', label: 'Frontend Web' }
];

let currentCategory = 'all';

function renderFilterTabs() {
  const container = document.getElementById('filter-tabs');
  if (!container || typeof PROJECTS === 'undefined') return;

  const counts = { all: PROJECTS.length };
  CATEGORIES.forEach(cat => {
    if (cat.key !== 'all') {
      counts[cat.key] = PROJECTS.filter(p => p.category === cat.key).length;
    }
  });

  container.innerHTML = CATEGORIES.map((cat, idx) => `
    <button class="filter-pill ${idx === 0 ? 'active' : ''}" data-category="${cat.key}" type="button">
      ${cat.label} (${counts[cat.key] || 0})
    </button>
  `).join('');

  container.querySelectorAll('.filter-pill').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const targetBtn = e.currentTarget;
      container.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
      targetBtn.classList.add('active');

      currentCategory = targetBtn.getAttribute('data-category');
      renderProjects(currentCategory);
      syncGlobalToggleState();
    });
  });
}

/* ==========================================================================
   Device Mockup Vector Illustrations
   ========================================================================== */

function getDeviceMockupSvg(category, id) {
  if (category === 'mobile') {
    // Elegant Mobile device mockup
    return `
      <svg viewBox="0 0 160 110" fill="none" xmlns="http://www.w3.org/2000/svg" class="mockup-svg" aria-hidden="true">
        <rect x="52" y="6" width="56" height="98" rx="9" fill="#ffffff" stroke="#1c1917" stroke-width="2"/>
        <line x1="72" y1="13" x2="88" y2="13" stroke="#1c1917" stroke-width="2" stroke-linecap="round"/>
        <circle cx="80" cy="54" r="20" stroke="#f95721" stroke-width="2.5" stroke-dasharray="90 35"/>
        <text x="80" y="58" font-family="Plus Jakarta Sans, sans-serif" font-size="9" font-weight="700" fill="#1c1917" text-anchor="middle">25:00</text>
        <rect x="68" y="85" width="24" height="5" rx="2.5" fill="#1c1917"/>
      </svg>
    `;
  }

  if (id === 'novapos' || id === 'wallet-id') {
    // POS Terminal / Dashboard monitor
    return `
      <svg viewBox="0 0 200 110" fill="none" xmlns="http://www.w3.org/2000/svg" class="mockup-svg" aria-hidden="true">
        <rect x="25" y="8" width="150" height="82" rx="5" fill="#ffffff" stroke="#1c1917" stroke-width="2"/>
        <circle cx="36" cy="16" r="2.5" fill="#ff5f56"/>
        <circle cx="44" cy="16" r="2.5" fill="#ffbd2e"/>
        <circle cx="52" cy="16" r="2.5" fill="#27c93f"/>
        <line x1="60" y1="16" x2="165" y2="16" stroke="#e5e7eb" stroke-width="1.8" stroke-linecap="round"/>
        <rect x="35" y="27" width="30" height="22" rx="3" fill="#fff2eb" stroke="#f95721" stroke-width="1.2"/>
        <rect x="72" y="27" width="92" height="6" rx="2" fill="#e5e7eb"/>
        <rect x="72" y="37" width="68" height="6" rx="2" fill="#f3f4f6"/>
        <path d="M35 74L65 58L95 66L130 46L165 52" stroke="#f95721" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M92 90H108V99H92V90Z" fill="#1c1917"/>
        <line x1="75" y1="99" x2="125" y2="99" stroke="#1c1917" stroke-width="2.2" stroke-linecap="round"/>
      </svg>
    `;
  }

  // Clean Web Architecture Browser View
  return `
    <svg viewBox="0 0 200 110" fill="none" xmlns="http://www.w3.org/2000/svg" class="mockup-svg" aria-hidden="true">
      <rect x="18" y="9" width="164" height="92" rx="6" fill="#ffffff" stroke="#1c1917" stroke-width="2"/>
      <line x1="18" y1="24" x2="182" y2="24" stroke="#1c1917" stroke-width="1.5"/>
      <circle cx="28" cy="17" r="2.5" fill="#ff5f56"/>
      <circle cx="36" cy="17" r="2.5" fill="#ffbd2e"/>
      <circle cx="44" cy="17" r="2.5" fill="#27c93f"/>
      <line x1="56" y1="17" x2="140" y2="17" stroke="#e5e7eb" stroke-width="1.8" stroke-linecap="round"/>
      <rect x="28" y="33" width="38" height="58" rx="3" fill="#f9fafb" stroke="#e5e7eb"/>
      <rect x="74" y="33" width="98" height="14" rx="3" fill="#fff2eb" stroke="#f95721" stroke-width="1.2"/>
      <rect x="74" y="54" width="98" height="6" rx="2" fill="#e5e7eb"/>
      <rect x="74" y="65" width="76" height="6" rx="2" fill="#f3f4f6"/>
      <rect x="74" y="76" width="58" height="6" rx="2" fill="#f3f4f6"/>
    </svg>
  `;
}

/* ==========================================================================
   Render Projects with Progressive Disclosure
   ========================================================================== */

function renderProjects(filterCategory = 'all') {
  const grid = document.getElementById('projects-grid');
  if (!grid || typeof PROJECTS === 'undefined') return;

  const filtered = filterCategory === 'all'
    ? PROJECTS
    : PROJECTS.filter(p => p.category === filterCategory);

  grid.innerHTML = '';

  filtered.forEach(project => {
    const card = document.createElement('article');
    card.className = 'project-card';
    card.setAttribute('data-id', project.id);

    const stackText = project.stack.join(' · ');
    const primaryMetric = project.metrics && project.metrics[0] ? project.metrics[0] : '';
    const metricPillHtml = primaryMetric ? `
      <div class="card-metric-pill">
        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
        <span>${primaryMetric}</span>
      </div>
    ` : '';

    const metricsListHtml = (project.metrics || []).map(m => `
      <li class="spec-metric-item">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>
        <span>${m}</span>
      </li>
    `).join('');

    card.innerHTML = `
      <!-- Upper Mockup Area -->
      <div class="card-mockup-frame">
        <div class="mockup-browser-bar">
          <span class="dot dot-red"></span>
          <span class="dot dot-yellow"></span>
          <span class="dot dot-green"></span>
        </div>
        <div class="mockup-preview-svg">
          ${getDeviceMockupSvg(project.category, project.id)}
        </div>
      </div>

      <!-- Lower Content Area (White background) -->
      <div class="card-body">
        <div class="card-header-row">
          <span class="category-pill">${project.categoryLabel}</span>
          <a href="${project.repoUrl}" target="_blank" rel="noopener noreferrer" class="project-ext-link" title="Ver repositorio en GitHub" aria-label="Ver repositorio ${project.title} en GitHub">
            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <line x1="7" y1="17" x2="17" y2="7"></line>
              <polyline points="7 7 17 7 17 17"></polyline>
            </svg>
          </a>
        </div>

        <h3 class="project-title">${project.title}</h3>
        <p class="project-tagline">${project.tagline}</p>

        ${metricPillHtml}

        <div class="project-stack">
          <span>${stackText}</span>
        </div>

        <!-- Progressive Disclosure Action -->
        <button class="btn-toggle-details" type="button" aria-expanded="false" aria-controls="drawer-${project.id}">
          <span class="btn-toggle-text">Ver análisis de ingeniería</span>
          <svg class="chevron-icon" xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>

        <!-- Progressive Disclosure Drawer (CSS Grid) -->
        <div class="card-drawer" id="drawer-${project.id}">
          <div class="card-drawer-inner">
            <div class="spec-breakdown">
              <!-- El Reto y Contexto -->
              <div class="spec-block">
                <div class="spec-heading">
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
                  <span>El Reto y Contexto</span>
                </div>
                <p class="spec-text"><strong>Contexto:</strong> ${project.star.situation}</p>
                <p class="spec-text"><strong>Desafío:</strong> ${project.star.task}</p>
              </div>

              <!-- Arquitectura y Solución Técnica -->
              <div class="spec-block">
                <div class="spec-heading">
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>
                  <span>Arquitectura y Solución Técnica</span>
                </div>
                <p class="spec-text">${project.star.action}</p>
              </div>

              <!-- Impacto y Resultados Clave -->
              <div class="spec-block">
                <div class="spec-heading">
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
                  <span>Impacto y Resultados Clave</span>
                </div>
                <p class="spec-text">${project.star.result}</p>
                <ul class="spec-metrics-list">
                  ${metricsListHtml}
                </ul>
              </div>

              <!-- Action Link -->
              <a class="btn-drawer-github" href="${project.repoUrl}" target="_blank" rel="noopener noreferrer">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
                <span>Ver repositorio completo en GitHub</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    `;

    grid.appendChild(card);
  });

  // Attach individual toggle event handlers
  setupCardToggleListeners(grid);
}

/* ==========================================================================
   Progressive Disclosure Drawer Interactivity
   ========================================================================== */

function setupCardToggleListeners(grid) {
  grid.querySelectorAll('.btn-toggle-details').forEach(button => {
    button.addEventListener('click', (e) => {
      const btn = e.currentTarget;
      const card = btn.closest('.project-card');
      const drawer = card.querySelector('.card-drawer');
      const btnText = btn.querySelector('.btn-toggle-text');
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';

      if (isExpanded) {
        drawer.classList.remove('is-open');
        btn.classList.remove('is-active');
        btn.setAttribute('aria-expanded', 'false');
        btnText.textContent = 'Ver análisis de ingeniería';
      } else {
        drawer.classList.add('is-open');
        btn.classList.add('is-active');
        btn.setAttribute('aria-expanded', 'true');
        btnText.textContent = 'Ocultar análisis';
      }

      syncGlobalToggleState();
    });
  });
}

function setupGlobalToggle() {
  const globalBtn = document.getElementById('btn-toggle-all');
  if (!globalBtn) return;

  globalBtn.addEventListener('click', () => {
    const cards = document.querySelectorAll('.project-card');
    const drawers = document.querySelectorAll('.card-drawer');
    const openDrawers = document.querySelectorAll('.card-drawer.is-open');
    const shouldExpandAll = openDrawers.length < cards.length;

    cards.forEach(card => {
      const drawer = card.querySelector('.card-drawer');
      const btn = card.querySelector('.btn-toggle-details');
      const btnText = btn ? btn.querySelector('.btn-toggle-text') : null;

      if (shouldExpandAll) {
        drawer.classList.add('is-open');
        if (btn) {
          btn.classList.add('is-active');
          btn.setAttribute('aria-expanded', 'true');
        }
        if (btnText) btnText.textContent = 'Ocultar análisis';
      } else {
        drawer.classList.remove('is-open');
        if (btn) {
          btn.classList.remove('is-active');
          btn.setAttribute('aria-expanded', 'false');
        }
        if (btnText) btnText.textContent = 'Ver análisis de ingeniería';
      }
    });

    syncGlobalToggleState();
  });
}

function syncGlobalToggleState() {
  const globalBtn = document.getElementById('btn-toggle-all');
  const globalBtnText = document.getElementById('btn-toggle-all-text');
  if (!globalBtn || !globalBtnText) return;

  const cards = document.querySelectorAll('.project-card');
  const openDrawers = document.querySelectorAll('.card-drawer.is-open');

  if (cards.length > 0 && openDrawers.length === cards.length) {
    globalBtn.classList.add('is-expanded');
    globalBtn.setAttribute('aria-expanded', 'true');
    globalBtnText.textContent = 'Contraer análisis';
  } else {
    globalBtn.classList.remove('is-expanded');
    globalBtn.setAttribute('aria-expanded', 'false');
    globalBtnText.textContent = 'Expandir análisis';
  }
}

/* ==========================================================================
   Smooth Navigation & Active Link Tracking
   ========================================================================== */

function setupSmoothScroll() {
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id], footer[id]');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}
