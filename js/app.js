/**
 * app.js
 * Interactive controller for Gabriel Martínez's Portfolio
 * Google Material Design 3 Architecture, Material Symbols & Full Mobile Responsiveness
 */

document.addEventListener('DOMContentLoaded', () => {
  renderFilterTabs();
  renderProjects('all');
  setupModalHandlers();
  setupMobileNav();
  setupSmoothScroll();
});

/* ==========================================================================
   Filter Categories (Material 3 Filter Chips)
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
    <button class="md-filter-chip ${idx === 0 ? 'active' : ''}" data-category="${cat.key}" type="button">
      ${idx === 0 ? '<span class="material-symbols-outlined chip-icon">check</span>' : ''}
      <span class="chip-label">${cat.label} (${counts[cat.key] || 0})</span>
    </button>
  `).join('');

  container.querySelectorAll('.md-filter-chip').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const targetBtn = e.currentTarget;
      container.querySelectorAll('.md-filter-chip').forEach(b => {
        b.classList.remove('active');
        const icon = b.querySelector('.chip-icon');
        if (icon) icon.remove();
      });

      targetBtn.classList.add('active');
      const checkSpan = document.createElement('span');
      checkSpan.className = 'material-symbols-outlined chip-icon';
      checkSpan.textContent = 'check';
      targetBtn.prepend(checkSpan);

      currentCategory = targetBtn.getAttribute('data-category');
      renderProjects(currentCategory);
    });
  });
}

/* ==========================================================================
   Project Icons (Google Material Symbols & Tonal Surface Colors)
   ========================================================================== */

const PROJECT_ICONS = {
  promora: {
    bg: '#FFF7ED',
    color: '#C2410C',
    icon: 'loyalty'
  },
  biblioteca: {
    bg: '#EFF6FF',
    color: '#1D4ED8',
    icon: 'menu_book'
  },
  novapos: {
    bg: '#ECFDF5',
    color: '#047857',
    icon: 'point_of_sale'
  },
  'wallet-id': {
    bg: '#EEF2FF',
    color: '#4338CA',
    icon: 'account_balance_wallet'
  },
  'attendance-track': {
    bg: '#F0FDFA',
    color: '#0F766E',
    icon: 'badge'
  },
  'proyecto-arqui': {
    bg: '#F0F9FF',
    color: '#0369A1',
    icon: 'hub'
  },
  'cupon-x': {
    bg: '#F5F3FF',
    color: '#6D28D9',
    icon: 'bolt'
  },
  'enfoque-app': {
    bg: '#FFF1F2',
    color: '#BE123C',
    icon: 'timer'
  },
  delieat: {
    bg: '#FEFCE8',
    color: '#A16207',
    icon: 'restaurant'
  },
  'data-analytics': {
    bg: '#EEF2FF',
    color: '#3730A3',
    icon: 'analytics'
  },
  turimox: {
    bg: '#F0FDF4',
    color: '#15803D',
    icon: 'travel_explore'
  }
};

function getProjectIcon(id) {
  return PROJECT_ICONS[id] || {
    bg: '#F1F5F9',
    color: '#334155',
    icon: 'terminal'
  };
}

/* ==========================================================================
   Render User-Friendly Material 3 Project Cards
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
    const stackPreviewText = project.stack.slice(0, 4).join(', ');
    const primaryMetric = project.metrics && project.metrics[0] ? project.metrics[0] : '';
    
    const metricPillHtml = primaryMetric ? `
      <div class="card-metric-pill" title="${primaryMetric}">
        <span class="material-symbols-outlined">verified</span>
        <span>${primaryMetric}</span>
      </div>
    ` : '';

    card.innerHTML = `
      <!-- Top Row: Icon squircle + Direct GitHub Action Link -->
      <div class="card-top-row">
        <div class="card-icon-squircle" style="background-color: ${iconMeta.bg}; color: ${iconMeta.color};">
          <span class="material-symbols-outlined">${iconMeta.icon}</span>
        </div>
        <a href="${project.repoUrl}" target="_blank" rel="noopener noreferrer" class="card-action-btn" title="Ver repositorio en GitHub" aria-label="Ver repositorio ${project.title} en GitHub">
          <span class="material-symbols-outlined">arrow_outward</span>
        </a>
      </div>

      <!-- Main Body -->
      <div class="card-main-content">
        <div class="card-meta-row">
          <span class="card-category-label">${project.categoryLabel}</span>
          ${project.isWorkExperience ? `
            <span class="card-badge-exp" title="Proyecto desarrollado en entorno de producción real">
              <span class="material-symbols-outlined">work</span>
              <span>Experiencia Laboral</span>
            </span>
          ` : ''}
        </div>
        <h3 class="card-title">${project.title}</h3>
        <p class="card-tagline">${project.tagline}</p>

        ${metricPillHtml}

        <div class="card-stack-row">
          <span>${stackPreviewText}</span>
        </div>
      </div>

      <!-- Bottom Action Button: Material 3 Tonal Button -->
      <div class="card-bottom-action">
        <button class="btn-card-learn-more" type="button" data-project-id="${project.id}">
          <span>Ver detalles</span>
          <span class="material-symbols-outlined">arrow_forward</span>
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
   Material 3 Project Details Dialog (Reader Experience)
   ========================================================================== */

function setupModalHandlers() {
  const modal = document.getElementById('project-modal');
  const closeBtn = document.getElementById('modal-close-btn');

  if (closeBtn) {
    closeBtn.addEventListener('click', closeProjectModal);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeProjectModal();
      }
    });

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
      <span class="material-symbols-outlined">check_circle</span>
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
        <span class="material-symbols-outlined">${iconMeta.icon}</span>
      </div>
      <div>
        <div class="modal-meta-row">
          <span class="modal-category">${project.categoryLabel}</span>
          ${project.isWorkExperience ? `
            <span class="modal-badge-exp">
              <span class="material-symbols-outlined">work</span>
              <span>Experiencia Laboral • ${project.workExperienceCompany}</span>
            </span>
          ` : ''}
        </div>
        <h2 class="modal-title">${project.title}</h2>
        <p class="modal-tagline">${project.tagline}</p>
      </div>
    </div>

    <!-- Highlighted Verified Results -->
    <div class="modal-metrics-card">
      <div class="modal-metrics-title">
        <span class="material-symbols-outlined">trending_up</span>
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
          <span class="material-symbols-outlined">crisis_alert</span>
          <span>El Reto y Contexto</span>
        </div>
        <p class="modal-spec-text"><strong>Contexto:</strong> ${project.star.situation}</p>
        <p class="modal-spec-text"><strong>Desafío:</strong> ${project.star.task}</p>
      </div>

      <!-- 2. Arquitectura y Solución Técnica -->
      <div class="modal-spec-block solution">
        <div class="modal-spec-heading">
          <span class="material-symbols-outlined">architecture</span>
          <span>Arquitectura y Solución Técnica</span>
        </div>
        <p class="modal-spec-text">${project.star.action}</p>
      </div>

      <!-- 3. Impacto y Resultados Clave -->
      <div class="modal-spec-block results">
        <div class="modal-spec-heading">
          <span class="material-symbols-outlined">task_alt</span>
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
        <span class="material-symbols-outlined">arrow_outward</span>
      </a>
    </div>
  `;

  const footerClose = document.getElementById('btn-modal-footer-close');
  if (footerClose) {
    footerClose.addEventListener('click', closeProjectModal);
  }

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
   Material 3 Mobile Navigation Drawer
   ========================================================================== */

function setupMobileNav() {
  const toggleBtn = document.getElementById('md-nav-toggle');
  const drawer = document.getElementById('md-nav-drawer');
  const scrim = document.getElementById('md-drawer-scrim');
  const closeBtn = document.getElementById('md-drawer-close');

  if (!toggleBtn || !drawer || !scrim) return;

  function openDrawer() {
    drawer.classList.add('is-open');
    scrim.classList.add('is-open');
    toggleBtn.setAttribute('aria-expanded', 'true');
    drawer.setAttribute('aria-hidden', 'false');
    scrim.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('is-open');
    scrim.classList.remove('is-open');
    toggleBtn.setAttribute('aria-expanded', 'false');
    drawer.setAttribute('aria-hidden', 'true');
    scrim.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  scrim.addEventListener('click', closeDrawer);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
      closeDrawer();
    }
  });

  drawer.querySelectorAll('.md-drawer-link, .btn-drawer-contact').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

/* ==========================================================================
   Smooth Navigation & Active Link Tracking
   ========================================================================== */

function setupSmoothScroll() {
  const navLinks = document.querySelectorAll('.nav-link, .md-drawer-link');
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
