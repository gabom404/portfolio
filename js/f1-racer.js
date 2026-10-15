/**
 * Controlador reactivo del auto de F1 y generador de partículas de humo.
 *
 * Características principales:
 * - Rastreo vertical pasivo mediante requestAnimationFrame a 60 FPS.
 * - Cálculo de progreso de scroll (0% a 100%) entre el inicio y la meta.
 * - Telemetría en tiempo real: sectores dinámicos y velocidad simulada en km/h.
 * - Efecto de derrape (drift-left / drift-right) según dirección y aceleración.
 * - Generador de humo de escape con tasa controlada (60-80ms) y limpieza DOM.
 * - Turbo boost interactivo al hacer clic en el auto para regresar al inicio.
 */

(function () {
  'use strict';

  function initF1Racer() {
    const carWrapper = document.getElementById('f1-car-wrapper');
    const smokeContainer = document.getElementById('f1-smoke-container');
    const trackContainer = document.getElementById('f1-track-container');
    const sectorLabel = document.getElementById('f1-sector-label');
    const speedLabel = document.getElementById('f1-speed-label');

    if (!carWrapper || !smokeContainer) {
      return;
    }

    const contactEl = document.getElementById('contact');
    const expEl = document.getElementById('experience');
    const workEl = document.getElementById('work');
    const skillsEl = document.getElementById('skills');

    const prefersReducedMotion =
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let ticking = false;
    let isScrolling = false;
    let lastScrollY = window.scrollY || window.pageYOffset || 0;
    let lastScrollTime = performance.now();
    let currentSpeed = 0;
    let targetSpeed = 0;
    let lastPuffTime = 0;
    let scrollStopTimer = null;
    let lastDirection = 0;

    let containerHeight = window.innerHeight;
    let carHeight = 112;
    const topPadding = 56;
    const bottomPadding = 56;
    let travelDistance = 0;

    function calculateLayout() {
      containerHeight = trackContainer
        ? trackContainer.clientHeight
        : window.innerHeight;
      carHeight = carWrapper.offsetHeight || 112;
      travelDistance = Math.max(0, containerHeight - carHeight - topPadding - bottomPadding);
    }

    function createSmokePuff(carY, driftDirection) {
      if (prefersReducedMotion || !smokeContainer) return;

      // Mantener el DOM limpio limitando particulas activas
      if (smokeContainer.children.length > 24) {
        smokeContainer.removeChild(smokeContainer.firstChild);
      }

      const puff = document.createElement('div');
      puff.className = 'f1-smoke-puff';

      // Posicion centrada en los escapes traseros
      const randomOffsetX = (Math.random() - 0.5) * 8;
      puff.style.left = `calc(50% + ${randomOffsetX.toFixed(1)}px)`;
      puff.style.top = `${(carY + 14).toFixed(1)}px`;

      const driftX = (Math.random() * 12 - 6) + (driftDirection * 8);
      puff.style.setProperty('--smoke-drift-x', `${driftX.toFixed(1)}px`);

      smokeContainer.appendChild(puff);

      puff.addEventListener('animationend', () => puff.remove(), { once: true });
      setTimeout(() => {
        if (puff.parentNode) {
          puff.remove();
        }
      }, 850);
    }

    function updateSector(progress) {
      if (!sectorLabel) return;

      let sectorText = 'P1 • Inicio';
      const triggerY = window.innerHeight * 0.45;

      if ((contactEl && contactEl.getBoundingClientRect().top <= window.innerHeight * 0.75) || progress >= 0.88) {
        sectorText = 'Meta • Contacto';
      } else if (expEl && expEl.getBoundingClientRect().top <= triggerY) {
        sectorText = 'S3 • Experiencia';
      } else if (workEl && workEl.getBoundingClientRect().top <= triggerY) {
        sectorText = 'S2 • Proyectos';
      } else if (skillsEl && skillsEl.getBoundingClientRect().top <= triggerY) {
        sectorText = 'S1 • Habilidades';
      } else {
        sectorText = 'P1 • Inicio';
      }

      if (sectorLabel.textContent !== sectorText) {
        sectorLabel.textContent = sectorText;
      }
    }

    function setDrift(direction) {
      if (prefersReducedMotion) return;
      if (direction > 0) {
        carWrapper.classList.add('drift-right');
        carWrapper.classList.remove('drift-left');
      } else if (direction < 0) {
        carWrapper.classList.add('drift-left');
        carWrapper.classList.remove('drift-right');
      }
    }

    function resetDrift() {
      carWrapper.classList.remove('drift-left', 'drift-right');
    }

    function renderLoop() {
      const diff = targetSpeed - currentSpeed;
      if (Math.abs(diff) > 0.5) {
        currentSpeed += diff * 0.15;
      } else {
        currentSpeed = targetSpeed;
      }

      if (speedLabel) {
        speedLabel.textContent = `${Math.round(currentSpeed)} km/h`;
      }

      if (currentSpeed > 0.5 || isScrolling) {
        requestAnimationFrame(renderLoop);
      } else {
        currentSpeed = 0;
        if (speedLabel) {
          speedLabel.textContent = '0 km/h';
        }
        ticking = false;
      }
    }

    function startRenderLoop() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(renderLoop);
      }
    }

    function onScroll() {
      const now = performance.now();
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const deltaY = scrollY - lastScrollY;
      const deltaTime = Math.max(1, now - lastScrollTime);

      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = Math.min(Math.max(scrollY / maxScroll, 0), 1);

      const currentCarY = topPadding + (progress * travelDistance);
      updateSector(progress);
      carWrapper.style.top = `${currentCarY.toFixed(1)}px`;

      const velocity = Math.abs(deltaY) / deltaTime;
      targetSpeed = Math.min(340, Math.round(velocity * 130));

      isScrolling = true;
      startRenderLoop();

      if (Math.abs(deltaY) > 2) {
        lastDirection = deltaY > 0 ? 1 : -1;
        setDrift(lastDirection);

        if (now - lastPuffTime >= 70) {
          createSmokePuff(currentCarY, lastDirection);
          lastPuffTime = now;
        }
      }

      if (scrollStopTimer) {
        clearTimeout(scrollStopTimer);
      }
      scrollStopTimer = setTimeout(() => {
        isScrolling = false;
        targetSpeed = 0;
        resetDrift();
      }, 160);

      lastScrollY = scrollY;
      lastScrollTime = now;
    }

    function turboBoost() {
      window.scrollTo({ top: 0, behavior: 'smooth' });

      targetSpeed = 340;
      isScrolling = true;
      startRenderLoop();

      if (!prefersReducedMotion) {
        for (let i = 0; i < 6; i++) {
          setTimeout(() => {
            const currentY = parseFloat(carWrapper.style.top) || topPadding;
            createSmokePuff(currentY, (i % 2 === 0 ? -1 : 1));
          }, i * 45);
        }
      }
    }

    // Configurar interaccion accesible de Turbo Boost
    carWrapper.style.pointerEvents = 'auto';
    carWrapper.style.cursor = 'pointer';
    carWrapper.setAttribute('role', 'button');
    carWrapper.setAttribute('aria-label', 'Volver al inicio con turbo boost');
    carWrapper.setAttribute('tabindex', '0');

    carWrapper.addEventListener('click', turboBoost);
    carWrapper.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        turboBoost();
      }
    });

    calculateLayout();
    onScroll();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener(
      'resize',
      () => {
        calculateLayout();
        onScroll();
      },
      { passive: true }
    );
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initF1Racer);
  } else {
    initF1Racer();
  }

  if (typeof window !== 'undefined') {
    window.initF1Racer = initF1Racer;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initF1Racer };
  }
})();
