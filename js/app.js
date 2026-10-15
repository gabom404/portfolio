/**
 * app.js
 * Interactive controller for Gabriel Martínez's Minimalist Portfolio
 * Reference Design: Warm, clean, human editorial aesthetic (inspired by reference layout)
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
    const metricHtml = primaryMetric ? `
      <div class="card-metric-badge">
        <span class="metric-icon">⚡</span>
        <span class="metric-text">${primaryMetric}</span>
      </div>
    ` : '';

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
          <h3 class="project-title">${project.title}</h3>
          <a href="${project.repoUrl}" target="_blank" rel="noopener noreferrer" class="project-link-icon" title="Ver repositorio en GitHub">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="7" y1="17" x2="17" y2="7"></line>
              <polyline points="7 7 17 7 17 17"></polyline>
            </svg>
          </a>
        </div>

        <p class="project-description">${project.tagline}</p>

        ${metricHtml}

        <div class="project-tags">
          <span>${stackText}</span>
        </div>

        <div class="card-actions">
          <button class="btn-case-study" type="button" data-star-id="${project.id}">
            <span>Ver Caso de Estudio</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
          <a class="btn-repo-link" href="${project.repoUrl}" target="_blank" rel="noopener noreferrer" title="Ver código en GitHub">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
            </svg>
          </a>
        </div>
      </div>
    `;

    grid.appendChild(card);
  });

  // Attach case study trigger listeners
  grid.querySelectorAll('.btn-case-study').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const projectId = e.currentTarget.getAttribute('data-star-id');
      openStarModal(projectId);
    });
  });
}

/* ==========================================================================
   Engineering Case Study Modal Logic
   ========================================================================== */

function setupModalHandlers() {
  const modalBackdrop = document.getElementById('star-modal');
  const closeBtn = document.getElementById('modal-close-btn');

  if (!modalBackdrop) return;

  if (closeBtn) {
    closeBtn.addEventListener('click', () => closeStarModal());
  }

  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) {
      closeStarModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('active')) {
      closeStarModal();
    }
  });
}

function openStarModal(projectId) {
  if (typeof PROJECTS === 'undefined') return;
  const project = PROJECTS.find(p => p.id === projectId);
  if (!project) return;

  const modalBackdrop = document.getElementById('star-modal');
  const modalBadge = document.getElementById('modal-badge');
  const modalTitle = document.getElementById('modal-title');
  const modalTagline = document.getElementById('modal-tagline');
  const modalSituation = document.getElementById('modal-star-situation');
  const modalAction = document.getElementById('modal-star-action');
  const modalResult = document.getElementById('modal-star-result');
  const modalMetricsList = document.getElementById('modal-metrics-list');
  const modalRepoBtn = document.getElementById('modal-repo-btn');

  if (modalBadge) modalBadge.textContent = project.categoryLabel || 'Caso de Estudio de Ingeniería';
  if (modalTitle) modalTitle.textContent = project.title;
  if (modalTagline) modalTagline.textContent = project.tagline;

  // Fluid, natural storytelling
  if (modalSituation) {
    modalSituation.innerHTML = `<strong>Contexto:</strong> ${project.star.situation}<br><br><strong>El Desafío:</strong> ${project.star.task}`;
  }
  if (modalAction) {
    modalAction.textContent = project.star.action;
  }
  if (modalResult) {
    modalResult.textContent = project.star.result;
  }

  // Populate bullet points for key achievements
  if (modalMetricsList && project.metrics) {
    modalMetricsList.innerHTML = project.metrics.map(m => `
      <li class="metric-item">
        <span class="metric-check">✓</span>
        <span>${m}</span>
      </li>
    `).join('');
  }

  if (modalRepoBtn) {
    modalRepoBtn.setAttribute('href', project.repoUrl);
  }

  modalBackdrop.classList.add('active');
  modalBackdrop.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeStarModal() {
  const modalBackdrop = document.getElementById('star-modal');
  if (!modalBackdrop) return;

  modalBackdrop.classList.remove('active');
  modalBackdrop.setAttribute('aria-hidden', 'true');
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
