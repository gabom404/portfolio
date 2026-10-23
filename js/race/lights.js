/**
 * lights.js — start-light sequence.
 * Five lights come on one by one, stay on for a random 0.2–3 s, then go out.
 * The visitor reacts with any key or a tap; we measure the reaction time.
 */
(function (root) {
  'use strict';

  var STEP_MS = 700;           // time between each light coming on
  var STORAGE_SEEN = 'c404-intro-seen';
  var STORAGE_BEST = 'c404-best-reaction';

  /* ---------- pure helpers (unit-tested) ---------- */
  function randomHold(rand) { return Math.round(200 + (rand == null ? Math.random() : rand) * 2800); }

  function evaluate(lightsOutAt, pressAt) {
    if (lightsOutAt == null || pressAt < lightsOutAt) return { jump: true, ms: null };
    return { jump: false, ms: Math.round(pressAt - lightsOutAt) };
  }

  function bestOf(previous, ms) {
    if (ms == null) return previous == null ? null : previous;
    return previous == null || ms < previous ? ms : previous;
  }

  /* ---------- DOM ---------- */
  var el, lamps, title, hint, bestLine, skipBtn;
  var timers = [], state = 'idle', outAt = null, lastFocus = null, onReact = null;

  function store(key, value) { try { localStorage.setItem(key, String(value)); } catch (e) { /* ignore */ } }
  function read(key) { try { return localStorage.getItem(key); } catch (e) { return null; } }
  function t(k, v) { return root.C404.i18n.t(k, v); }

  function clear() { timers.forEach(clearTimeout); timers = []; }
  function setLamps(n) { lamps.forEach(function (l, i) { l.classList.toggle('is-on', i < n); }); }

  function showBest() {
    var b = Number(read(STORAGE_BEST)) || null;
    bestLine.textContent = b ? t('lights.best', { ms: b }) : '';
  }

  function open() {
    clear();
    lastFocus = document.activeElement;
    el.hidden = false;
    el.classList.remove('is-leaving');
    document.body.classList.add('is-locked');
    title.textContent = t('lights.ready');
    hint.hidden = false;
    showBest();
    setLamps(0);
    outAt = null;
    state = 'arming';
    skipBtn.focus({ preventScroll: true });
    for (var i = 1; i <= 5; i++) {
      (function (n) { timers.push(setTimeout(function () { setLamps(n); }, n * STEP_MS)); })(i);
    }
    timers.push(setTimeout(function () {
      setLamps(0);
      outAt = performance.now();
      state = 'go';
      title.textContent = t('lights.out');
      timers.push(setTimeout(function () { if (state === 'go') close(); }, 2500));
    }, 5 * STEP_MS + randomHold()));
  }

  function close() {
    clear();
    state = 'idle';
    store(STORAGE_SEEN, '1');
    el.classList.add('is-leaving');
    document.body.classList.remove('is-locked');
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setTimeout(function () { el.hidden = true; }, reduce ? 0 : 800);
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }

  function press() {
    if (state !== 'arming' && state !== 'go') return;
    var r = evaluate(outAt, performance.now());
    clear();
    setLamps(0);
    state = 'result';
    hint.hidden = true;
    if (r.jump) {
      title.textContent = t('lights.jump');
    } else {
      title.textContent = t('lights.reaction', { ms: r.ms });
      var b = bestOf(Number(read(STORAGE_BEST)) || null, r.ms);
      store(STORAGE_BEST, b);
      showBest();
    }
    if (onReact) onReact(r);
    timers.push(setTimeout(close, 1500));
  }

  function init(opts) {
    el = document.getElementById('lights-intro');
    if (!el) return;
    onReact = opts && opts.onReact;
    lamps = Array.prototype.slice.call(el.querySelectorAll('.gantry__lamp'));
    title = document.getElementById('lights-title');
    hint = document.getElementById('lights-hint');
    bestLine = document.getElementById('lights-best');
    skipBtn = document.getElementById('lights-skip');

    skipBtn.addEventListener('click', function (e) { e.stopPropagation(); close(); });
    el.addEventListener('pointerdown', function (e) { if (e.target !== skipBtn) press(); });
    document.addEventListener('keydown', function (e) {
      if (el.hidden || state === 'idle' || state === 'result') return;
      if (e.key === 'Escape') { close(); return; }
      if (e.key === 'Tab') { e.preventDefault(); skipBtn.focus(); return; }
      if (document.activeElement === skipBtn && (e.key === 'Enter' || e.key === ' ')) return; // let the button act
      e.preventDefault();
      press();
    });

    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduce && !read(STORAGE_SEEN)) open();
  }

  root.C404 = root.C404 || {};
  root.C404.lights = { init: init, open: open, randomHold: randomHold, evaluate: evaluate, bestOf: bestOf };
})(typeof window !== 'undefined' ? window : globalThis);
