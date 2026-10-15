/**
 * app.js
 * Interactive controller for Gabriel Martínez's Minimalist Portfolio
 * Features:
 * - Dynamic project rendering & STAR modal expansion
 * - Instant category filtering with counters
 * - Dark/Light mode toggle with localStorage persistence
 * - Keyboard navigation & accessibility (ESC close, ARIA)
 * - Dynamic skills & experience rendering
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  renderProfileStats();
  renderFilterTabs();
  renderProjects('all');
  renderSkillsMatrix();
  renderExperience();
  setupModalHandlers();
  setupSmoothScroll();
});

/* ==========================================================================
   Theme Management (Dark / Light)
   ========================================================================== */

function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const storedTheme = localStorage.getItem('portfolio-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  // Default is dark unless light is explicitly set
  if (storedTheme === 'light' || (!storedTheme && !prefersDark && false)) {
    document.documentElement.classList.add('light-theme');
    updateThemeToggleIcon(true);
  } else {
    document.documentElement.classList.remove('light-theme');
    updateThemeToggleIcon(false);
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const isLight = document.documentElement.classList.toggle('light-theme');
      localStorage.setItem('portfolio-theme', isLight ? 'light' : 'dark');
      updateThemeToggleIcon(isLight);
    });
  }
}

function updateThemeToggleIcon(isLight) {
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  if (!themeToggleBtn) return;

  if (isLight) {
    // Show moon icon to switch back to dark
    themeToggleBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
      <span class="sr-only">Cambiar a Modo Oscuro</span>
    `;
    themeToggleBtn.setAttribute('title', 'Cambiar a modo oscuro');
  } else {
    // Show sun icon to switch to light
    themeToggleBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>
      <span class="sr-only">Cambiar a Modo Claro</span>
    `;
    themeToggleBtn.setAttribute('title', 'Cambiar a modo claro');
  }
}

/* ==========================================================================
   Candidate Profile Stats
   ========================================================================== */

function renderProfileStats() {
  if (typeof CANDIDATE_PROFILE === 'undefined') return;

  const countContrib = document.getElementById('stat-contrib');
  const countRepos = document.getElementById('stat-repos');
  const countProjects = document.getElementById('stat-projects');

  if (countContrib) countContrib.textContent = CANDIDATE_PROFILE.stats.contributions;
  if (countRepos) countRepos.textContent = CANDIDATE_PROFILE.stats.repositories;
  if (countProjects) countProjects.textContent = CANDIDATE_PROFILE.stats.projectsCurated;
}

/* ==========================================================================
   Category Filter Tabs
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

  // Calculate counts per category
  const counts = { all: PROJECTS.length };
  CATEGORIES.forEach(cat => {
    if (cat.key !== 'all') {
      counts[cat.key] = PROJECTS.filter(p => p.category === cat.key).length;
    }
  });

  container.innerHTML = CATEGORIES.map((cat, idx) => `
    <button class="filter-btn ${idx === 0 ? 'active' : ''}" data-category="${cat.key}" type="button">
      <span>${cat.label}</span>
      <span class="filter-count">${counts[cat.key] || 0}</span>
    </button>
  `).join('');

  container.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const targetBtn = e.currentTarget;
      container.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      targetBtn.classList.add('active');

      const selectedCategory = targetBtn.getAttribute('data-category');
      renderProjects(selectedCategory);
    });
  });
}

/* ==========================================================================
   Render Project Cards
   ========================================================================== */

function renderProjects(filterCategory = 'all') {
  const grid = document.getElementById('projects-grid');
  if (!grid || typeof PROJECTS === 'undefined') return;

  const filtered = filterCategory === 'all'
    ? PROJECTS
    : PROJECTS.filter(p => p.category === filterCategory);

  grid.innerHTML = '';

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-muted);">
        No se encontraron proyectos en esta categoría.
      </div>
    `;
    return;
  }

  filtered.forEach(project => {
    const card = document.createElement('article');
    card.className = 'project-card fade-in';
    card.setAttribute('data-id', project.id);

    const stackHtml = project.stack.map(tech => `
      <li class="stack-tag">${tech}</li>
    `).join('');

    const metricsHtml = project.metrics.map(metric => `
      <div class="metric-pill">
        <span class="metric-bullet">✓</span>
        <span>${metric}</span>
      </div>
    `).join('');

    card.innerHTML = `
      <div class="project-card-header">
        <div class="card-top-row">
          <span class="project-badge">${project.badge}</span>
          <span class="card-category">${project.categoryLabel}</span>
        </div>
        <h3 class="project-title">${project.title}</h3>
        <p class="project-tagline">${project.tagline}</p>
        
        <div class="metrics-preview">
          ${metricsHtml}
        </div>
      </div>

      <div class="project-card-footer">
        <ul class="stack-list">
          ${stackHtml}
        </ul>

        <div class="card-actions">
          <button class="btn-star" type="button" data-star-id="${project.id}">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            <span>Ver Método STAR</span>
          </button>
          
          <a class="btn-repo" href="${project.repoUrl}" target="_blank" rel="noopener noreferrer" title="Ver código en GitHub">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
            </svg>
          </a>
        </div>
      </div>
    `;

    grid.appendChild(card);
  });

  // Attach event listeners to all newly created STAR buttons
  grid.querySelectorAll('[data-star-id]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const projId = e.currentTarget.getAttribute('data-star-id');
      openStarModal(projId);
    });
  });
}

/* ==========================================================================
   STAR Modal System
   ========================================================================== */

function setupModalHandlers() {
  const modalBackdrop = document.getElementById('star-modal');
  const closeBtn = document.getElementById('modal-close-btn');

  if (!modalBackdrop) return;

  // Close on backdrop click (outside the modal dialog)
  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) {
      closeStarModal();
    }
  });

  // Close on close button click
  if (closeBtn) {
    closeBtn.addEventListener('click', closeStarModal);
  }

  // Close on Escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('open')) {
      closeStarModal();
    }
  });
}

function openStarModal(projectId) {
  const project = PROJECTS.find(p => p.id === projectId);
  if (!project) return;

  const modalBackdrop = document.getElementById('star-modal');
  const modalBadge = document.getElementById('modal-badge');
  const modalTitle = document.getElementById('modal-title');
  const modalTagline = document.getElementById('modal-tagline');
  const modalSituation = document.getElementById('modal-star-situation');
  const modalTask = document.getElementById('modal-star-task');
  const modalAction = document.getElementById('modal-star-action');
  const modalResult = document.getElementById('modal-star-result');
  const modalMetricsList = document.getElementById('modal-metrics-list');
  const modalRepoBtn = document.getElementById('modal-repo-btn');

  if (modalBadge) modalBadge.textContent = `${project.categoryLabel} • ${project.badge}`;
  if (modalTitle) modalTitle.textContent = project.title;
  if (modalTagline) modalTagline.textContent = project.tagline;
  if (modalSituation) modalSituation.textContent = project.star.situation;
  if (modalTask) modalTask.textContent = project.star.task;
  if (modalAction) modalAction.textContent = project.star.action;
  if (modalResult) modalResult.textContent = project.star.result;

  if (modalMetricsList) {
    modalMetricsList.innerHTML = project.metrics.map(m => `
      <li>
        <span style="color: var(--success); font-weight: bold;">✓</span>
        <span>${m}</span>
      </li>
    `).join('');
  }

  if (modalRepoBtn) {
    modalRepoBtn.href = project.repoUrl;
  }

  // Open modal
  modalBackdrop.classList.add('open');
  modalBackdrop.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden'; // Prevent page scroll behind modal
}

function closeStarModal() {
  const modalBackdrop = document.getElementById('star-modal');
  if (!modalBackdrop) return;

  modalBackdrop.classList.remove('open');
  modalBackdrop.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

/* ==========================================================================
   Render Technical Skills Matrix
   ========================================================================== */

function renderSkillsMatrix() {
  const container = document.getElementById('skills-container');
  if (!container || typeof SKILLS_MATRIX === 'undefined') return;

  container.innerHTML = Object.keys(SKILLS_MATRIX).map(key => {
    const cat = SKILLS_MATRIX[key];
    const skillsHtml = cat.skills.map(skill => `
      <li class="skill-item">
        <span class="skill-name">${skill.name}</span>
        <span class="skill-level-badge">${skill.level}</span>
      </li>
    `).join('');

    return `
      <div class="skill-category-card">
        <h3 class="skill-cat-title">
          <span>${cat.title}</span>
        </h3>
        <ul class="skill-items-list">
          ${skillsHtml}
        </ul>
      </div>
    `;
  }).join('');
}

/* ==========================================================================
   Render Experience & Co-Founding
   ========================================================================== */

function renderExperience() {
  const container = document.getElementById('experience-container');
  if (!container || typeof EXPERIENCES === 'undefined') return;

  container.innerHTML = EXPERIENCES.map(exp => `
    <article class="exp-card">
      <div class="exp-header">
        <div>
          <h3 class="exp-role-title">${exp.role}</h3>
          <span class="exp-company">${exp.organization}</span>
        </div>
        <span class="exp-period">${exp.period}</span>
      </div>
      <p class="exp-desc">${exp.description}</p>
      <ul class="exp-achievements">
        ${exp.achievements.map(ach => `<li>${ach}</li>`).join('')}
      </ul>
    </article>
  `).join('');
}

/* ==========================================================================
   Smooth Scroll Navigation
   ========================================================================== */

function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      const targetElem = document.querySelector(targetId);
      if (targetElem) {
        e.preventDefault();
        targetElem.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}
