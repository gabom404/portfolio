/**
 * app.js
 * Interactive controller for Gabriel Martínez's Portfolio
 * User-Friendly Card Architecture (inspired by modern SaaS / product cards)
 * with Accessible Detailed Reader Modal.
 */

document.addEventListener('DOMContentLoaded', () => {
  renderFilterTabs();
  renderProjects('all');
  setupModalHandlers();
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
    });
  });
}

/* ==========================================================================
   Project Icons & Friendly Pastel Palettes
   ========================================================================== */

const PROJECT_ICONS = {
  promora: {
    bg: '#FFF7ED',
    color: '#EA580C',
    svg: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="15" x2="15.01" y2="15"></line><line x1="15" y1="9" x2="9" y2="15"></line></svg>`
  },
  biblioteca: {
    bg: '#EFF6FF',
    color: '#2563EB',
    svg: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>`
  },
  novapos: {
    bg: '#ECFDF5',
    color: '#059669',
    svg: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>`
  },
  'wallet-id': {
    bg: '#EEF2FF',
    color: '#4F46E5',
    svg: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>`
  },
  'attendance-track': {
    bg: '#F0FDFA',
    color: '#0D9488',
    svg: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg>`
  },
  'proyecto-arqui': {
    bg: '#F0F9FF',
    color: '#0284C7',
    svg: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>`
  },
  'cupon-x': {
    bg: '#F5F3FF',
    color: '#7C3AED',
    svg: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`
  },
  'enfoque-app': {
    bg: '#FFF1F2',
    color: '#E11D48',
    svg: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`
  },
  delieat: {
    bg: '#FEFCE8',
    color: '#CA8A04',
    svg: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`
  },
  'data-analytics': {
    bg: '#EEF2FF',
    color: '#4338CA',
    svg: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>`
  },
  turimox: {
    bg: '#F0FDF4',
    color: '#16A34A',
    svg: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>`
  }
};

function getProjectIcon(id) {
  return PROJECT_ICONS[id] || {
    bg: '#F1F5F9',
    color: '#475569',
    svg: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>`
  };
}

/* ==========================================================================
   Render User-Friendly Cards (Matching Reference Aesthetic)
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

    const iconMeta = getProjectIcon(project.id);
    const stackPreviewText = project.stack.slice(0, 4).join(' · ');
    const primaryMetric = project.metrics && project.metrics[0] ? project.metrics[0] : '';
    
    const metricPillHtml = primaryMetric ? `
      <div class="card-metric-pill" title="${primaryMetric}">
        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>
        <span>${primaryMetric}</span>
      </div>
    ` : '';

    card.innerHTML = `
      <!-- Top Row: Icon squircle + Top-Right Action -->
      <div class="card-top-row">
        <div class="card-icon-squircle" style="background-color: ${iconMeta.bg}; color: ${iconMeta.color};">
          ${iconMeta.svg}
        </div>
        <a href="${project.repoUrl}" target="_blank" rel="noopener noreferrer" class="card-action-btn" title="Ver repositorio en GitHub" aria-label="Ver repositorio ${project.title} en GitHub">
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <line x1="7" y1="17" x2="17" y2="7"></line>
            <polyline points="7 7 17 7 17 17"></polyline>
          </svg>
        </a>
      </div>

      <!-- Main Body -->
      <div class="card-main-content">
        <span class="card-category-label">${project.categoryLabel}</span>
        <h3 class="card-title">${project.title}</h3>
        <p class="card-tagline">${project.tagline}</p>

        ${metricPillHtml}

        <div class="card-stack-row">
          <span>${stackPreviewText}</span>
        </div>
      </div>

      <!-- Bottom Action Button: Friendly Pill Button ("Ver detalles") matching "Learn more" -->
      <div class="card-bottom-action">
        <button class="btn-card-learn-more" type="button" data-project-id="${project.id}">
          <span>Ver detalles</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>
    `;

    grid.appendChild(card);
  });

  // Attach learn more button listeners
  grid.querySelectorAll('.btn-card-learn-more').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const projId = e.currentTarget.getAttribute('data-project-id');
      openProjectModal(projId);
    });
  });
}

/* ==========================================================================
   Project Details Modal (Reader Experience)
   ========================================================================== */

function setupModalHandlers() {
  const modal = document.getElementById('project-modal');
  const closeBtn = document.getElementById('modal-close-btn');

  if (closeBtn) {
    closeBtn.addEventListener('click', closeProjectModal);
  }

  if (modal) {
    // Click outside to close
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeProjectModal();
      }
    });

    // Escape key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-visible')) {
        closeProjectModal();
      }
    });
  }
}

function openProjectModal(projectId) {
  const modal = document.getElementById('project-modal');
  const content = document.getElementById('modal-content');
  if (!modal || !content || typeof PROJECTS === 'undefined') return;

  const project = PROJECTS.find(p => p.id === projectId);
  if (!project) return;

  const iconMeta = getProjectIcon(project.id);

  const metricsListHtml = (project.metrics || []).map(m => `
    <li class="modal-metric-item">
      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>
      <span>${m}</span>
    </li>
  `).join('');

  const stackPillsHtml = (project.stack || []).map(t => `
    <span class="modal-tech-pill">${t}</span>
  `).join('');

  content.innerHTML = `
    <!-- Header -->
    <div class="modal-header">
      <div class="modal-icon-box" style="background-color: ${iconMeta.bg}; color: ${iconMeta.color};">
        ${iconMeta.svg}
      </div>
      <div>
        <span class="modal-category">${project.categoryLabel}</span>
        <h2 class="modal-title">${project.title}</h2>
        <p class="modal-tagline">${project.tagline}</p>
      </div>
    </div>

    <!-- Highlighted Verified Results -->
    <div class="modal-metrics-card">
      <div class="modal-metrics-title">
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
        <span>Métricas Clave Verificadas</span>
      </div>
      <ul class="modal-metrics-list">
        ${metricsListHtml}
      </ul>
    </div>

    <!-- Structured Engineering Breakdown -->
    <div class="modal-specs-container">
      <!-- 1. El Reto y Contexto -->
      <div class="modal-spec-block challenge">
        <div class="modal-spec-heading">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
          <span>El Reto y Contexto</span>
        </div>
        <p class="modal-spec-text"><strong>Contexto:</strong> ${project.star.situation}</p>
        <p class="modal-spec-text"><strong>Desafío:</strong> ${project.star.task}</p>
      </div>

      <!-- 2. Arquitectura y Solución Técnica -->
      <div class="modal-spec-block solution">
        <div class="modal-spec-heading">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>
          <span>Arquitectura y Solución Técnica</span>
        </div>
        <p class="modal-spec-text">${project.star.action}</p>
      </div>

      <!-- 3. Impacto y Resultados Clave -->
      <div class="modal-spec-block results">
        <div class="modal-spec-heading">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
          <span>Impacto y Resultados Clave</span>
        </div>
        <p class="modal-spec-text">${project.star.result}</p>
      </div>
    </div>

    <!-- Tech Stack Tags -->
    <div class="modal-tech-stack">
      <div class="modal-tech-title">Tecnologías y Herramientas</div>
      <div class="modal-tech-pills">
        ${stackPillsHtml}
      </div>
    </div>

    <!-- Footer Actions -->
    <div class="modal-footer-actions">
      <button class="btn-modal-close" id="btn-modal-footer-close" type="button">Cerrar</button>
      <a class="btn-modal-github" href="${project.repoUrl}" target="_blank" rel="noopener noreferrer">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
        <span>Ver repositorio en GitHub</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
      </a>
    </div>
  `;

  // Attach footer close button listener
  const footerClose = document.getElementById('btn-modal-footer-close');
  if (footerClose) {
    footerClose.addEventListener('click', closeProjectModal);
  }

  // Open modal
  modal.classList.add('is-visible');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
  const modal = document.getElementById('project-modal');
  if (!modal) return;

  modal.classList.remove('is-visible');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
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
