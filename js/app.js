/**
 * app.js
 * Interactive controller for Gabriel Martínez's Minimalist Portfolio
 * Reference Design: Warm, clean, human editorial aesthetic (inspired by reference layout)
 */

document.addEventListener('DOMContentLoaded', () => {
  renderFilterTabs();
  renderProjects('all');
  setupSmoothScroll();
});

/* ==========================================================================
   Filter Categories
   ========================================================================== */

const CATEGORIES = [
  { key: 'all', label: 'Todos' },
  { key: 'backend', label: 'Backend & APIs' },
  { key: 'fullstack', label: 'Fullstack' },
  { key: 'mobile', label: 'Mobile' },
  { key: 'python-ai', label: 'Python & IA' },
  { key: 'frontend', label: 'Frontend' }
];

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

      const selectedCategory = targetBtn.getAttribute('data-category');
      renderProjects(selectedCategory);
    });
  });
}

/* ==========================================================================
   Render Project Cards (Matching Reference Mockups)
   ========================================================================== */

function getDeviceMockupSvg(category, id) {
  if (category === 'mobile') {
    // Phone mockup
    return `
      <svg viewBox="0 0 160 110" fill="none" xmlns="http://www.w3.org/2000/svg" style="max-height: 100px;">
        <rect x="50" y="5" width="60" height="100" rx="10" fill="#ffffff" stroke="#14171F" stroke-width="2"/>
        <line x1="72" y1="12" x2="88" y2="12" stroke="#14171F" stroke-width="2" stroke-linecap="round"/>
        <circle cx="80" cy="55" r="22" stroke="#F95721" stroke-width="3" stroke-dasharray="100 30"/>
        <text x="80" y="59" font-family="Plus Jakarta Sans, sans-serif" font-size="10" font-weight="700" fill="#14171F" text-anchor="middle">25:00</text>
        <rect x="68" y="86" width="24" height="6" rx="3" fill="#14171F"/>
      </svg>
    `;
  }
  
  if (id === 'novapos' || id === 'wallet-id') {
    // Desktop POS / Dashboard monitor
    return `
      <svg viewBox="0 0 200 110" fill="none" xmlns="http://www.w3.org/2000/svg" style="max-height: 100px;">
        <rect x="25" y="6" width="150" height="85" rx="5" fill="#ffffff" stroke="#14171F" stroke-width="2"/>
        <!-- Browser top bar -->
        <circle cx="36" cy="15" r="2.5" fill="#FF5F56"/>
        <circle cx="44" cy="15" r="2.5" fill="#FFBD2E"/>
        <circle cx="52" cy="15" r="2.5" fill="#27C93F"/>
        <line x1="60" y1="15" x2="165" y2="15" stroke="#E5E7EB" stroke-width="2" stroke-linecap="round"/>
        <!-- Chart / Content -->
        <rect x="35" y="26" width="30" height="24" rx="3" fill="#FFF2EB" stroke="#F95721" stroke-width="1.2"/>
        <rect x="72" y="26" width="92" height="6" rx="2" fill="#E5E7EB"/>
        <rect x="72" y="36" width="70" height="6" rx="2" fill="#F3F4F6"/>
        <!-- Graph curve -->
        <path d="M35 76L65 60L95 68L130 48L165 54" stroke="#F95721" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        <!-- Monitor stand -->
        <path d="M92 91H108V100H92V91Z" fill="#14171F"/>
        <line x1="75" y1="100" x2="125" y2="100" stroke="#14171F" stroke-width="2.5" stroke-linecap="round"/>
      </svg>
    `;
  }

  // Default clean browser window
  return `
    <svg viewBox="0 0 200 110" fill="none" xmlns="http://www.w3.org/2000/svg" style="max-height: 100px;">
      <rect x="15" y="8" width="170" height="94" rx="6" fill="#ffffff" stroke="#14171F" stroke-width="2"/>
      <line x1="15" y1="24" x2="185" y2="24" stroke="#14171F" stroke-width="1.5"/>
      <circle cx="26" cy="16" r="2.5" fill="#FF5F56"/>
      <circle cx="34" cy="16" r="2.5" fill="#FFBD2E"/>
      <circle cx="42" cy="16" r="2.5" fill="#27C93F"/>
      <!-- Internal layout wireframe -->
      <rect x="25" y="34" width="40" height="60" rx="3" fill="#F9FAFB" stroke="#E5E7EB"/>
      <rect x="73" y="34" width="102" height="14" rx="3" fill="#FFF2EB" stroke="#F95721" stroke-width="1.2"/>
      <rect x="73" y="55" width="102" height="6" rx="2" fill="#E5E7EB"/>
      <rect x="73" y="67" width="80" height="6" rx="2" fill="#F3F4F6"/>
      <rect x="73" y="79" width="60" height="6" rx="2" fill="#F3F4F6"/>
    </svg>
  `;
}

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
    const metricBadgeHtml = primaryMetric ? `
      <div class="card-metric-badge">
        <span class="metric-icon" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg></span>
        <span class="metric-text">${primaryMetric}</span>
      </div>
    ` : '';

    const metricsListHtml = (project.metrics || []).map(m => `
      <li class="story-metric-item">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>
        <span>${m}</span>
      </li>
    `).join('');

    card.innerHTML = `
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

      <div class="card-content">
        <div class="card-top">
          <div>
            <span class="card-category-tag">${project.categoryLabel}</span>
            <h3 class="project-title">${project.title}</h3>
          </div>
          <a href="${project.repoUrl}" target="_blank" rel="noopener noreferrer" class="project-link-icon" title="Ver repositorio en GitHub">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="7" y1="17" x2="17" y2="7"></line>
              <polyline points="7 7 17 7 17 17"></polyline>
            </svg>
          </a>
        </div>

        <p class="project-description">${project.tagline}</p>

        ${metricBadgeHtml}

        <div class="project-story-blocks">
          <!-- 1. El Reto & Contexto -->
          <div class="story-block challenge">
            <div class="story-header">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
              <span class="story-title">El Reto & Contexto</span>
            </div>
            <p class="story-text"><strong>Contexto:</strong> ${project.star.situation}</p>
            <p class="story-text"><strong>Desafío:</strong> ${project.star.task}</p>
          </div>

          <!-- 2. Arquitectura & Solución -->
          <div class="story-block solution">
            <div class="story-header">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>
              <span class="story-title">Arquitectura & Solución Técnica</span>
            </div>
            <p class="story-text">${project.star.action}</p>
          </div>

          <!-- 3. Impacto & Resultados -->
          <div class="story-block results">
            <div class="story-header">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
              <span class="story-title">Impacto & Resultados Clave</span>
            </div>
            <p class="story-text">${project.star.result}</p>
            <ul class="story-metrics-list">
              ${metricsListHtml}
            </ul>
          </div>
        </div>

        <div class="project-tags">
          <span>${stackText}</span>
        </div>

        <div class="card-footer-action">
          <a class="btn-pill-dark btn-card-repo" href="${project.repoUrl}" target="_blank" rel="noopener noreferrer">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
            </svg>
            <span>Ver Repositorio en GitHub</span>
          </a>
        </div>
      </div>
    `;

    grid.appendChild(card);
  });
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
