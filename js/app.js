/**
 * app.js — wires the page together: garage, spec sheets, car setup,
 * menu, contact, and the race modules in js/race/.
 */
(function (root) {
  'use strict';

  var C = root.C404;
  var i18n = C.i18n;
  var reduceMotion = root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ======================= Garage ======================= */
  var CATEGORIES = [
    { key: 'all', tyre: 'var(--ink-3)' },
    { key: 'backend', tyre: 'var(--tyre-soft)' },
    { key: 'fullstack', tyre: 'var(--tyre-medium)' },
    { key: 'mobile', tyre: 'var(--tyre-hard)' },
    { key: 'python-ai', tyre: 'var(--tyre-inter)' },
    { key: 'frontend', tyre: 'var(--tyre-wet)' }
  ];
  var currentCategory = 'all';

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  function renderCompounds() {
    var box = document.getElementById('compounds');
    if (!box) return;
    box.innerHTML = '';
    CATEGORIES.forEach(function (c) {
      var count = c.key === 'all' ? root.PROJECTS.length : root.PROJECTS.filter(function (p) { return p.category === c.key; }).length;
      if (!count) return;
      var b = el('button', 'compound');
      b.type = 'button';
      b.style.setProperty('--c', c.tyre);
      b.setAttribute('aria-pressed', String(c.key === currentCategory));
      b.appendChild(el('span', 'compound__tyre'));
      b.appendChild(el('span', null, i18n.t('cat.' + c.key)));
      b.appendChild(el('span', 'compound__count', String(count)));
      b.addEventListener('click', function () { currentCategory = c.key; renderCompounds(); renderGarage(); });
      box.appendChild(b);
    });
  }

  function renderGarage() {
    var grid = document.getElementById('garage-grid');
    if (!grid) return;
    grid.innerHTML = '';
    root.PROJECTS.forEach(function (p, idx) {
      if (currentCategory !== 'all' && p.category !== currentCategory) return;
      var card = el('article', 'car-card');
      card.style.animationDelay = Math.min(idx, 6) * 40 + 'ms';

      var top = el('div', 'car-card__top');
      top.appendChild(el('span', 'car-card__num', String(idx + 1).padStart(2, '0')));
      var tags = el('div', 'car-card__tags');
      tags.appendChild(el('span', 'tag', i18n.t('cat.' + p.category)));
      if (p.isWorkExperience) tags.appendChild(el('span', 'tag tag--work', i18n.t('tag.work')));
      if (p.team) tags.appendChild(el('span', 'tag tag--team', i18n.t('tag.team')));
      if (p.private) tags.appendChild(el('span', 'tag tag--private', i18n.t('tag.private')));
      top.appendChild(tags);
      card.appendChild(top);

      var body = el('div');
      body.appendChild(el('h3', null, i18n.pick(p.name)));
      body.appendChild(el('p', 'car-card__line', i18n.pick(p.tagline)));
      card.appendChild(body);

      var bottom = el('div');
      bottom.appendChild(el('p', 'car-card__stack', p.stack.slice(0, 4).join(' · ')));
      var actions = el('div', 'car-card__actions');
      var btn = el('button', 'btn', i18n.t('card.sheet'));
      btn.type = 'button';
      btn.setAttribute('aria-label', i18n.t('card.sheet') + ' · ' + i18n.pick(p.name));
      btn.addEventListener('click', function () { openSheet(p, btn); });
      actions.appendChild(btn);
      if (p.repoUrl) {
        var a = el('a', 'btn btn--line car-card__repo', i18n.t('card.code'));
        a.href = p.repoUrl; a.target = '_blank'; a.rel = 'noopener noreferrer';
        a.setAttribute('aria-label', i18n.t('card.code') + ' · ' + i18n.pick(p.name));
        actions.appendChild(a);
      }
      bottom.appendChild(actions);
      card.appendChild(bottom);
      grid.appendChild(card);
    });
  }

  /* ======================= Spec sheet dialog ======================= */
  var sheet, sheetContent, sheetClose, sheetReturn = null;

  function openSheet(p, opener) {
    sheetReturn = opener || document.activeElement;
    sheetContent.innerHTML = '';
    var meta = [i18n.t('cat.' + p.category)];
    if (p.isWorkExperience) meta.push(i18n.t('sheet.for', { company: p.workExperienceCompany }));
    if (p.team) meta.push(i18n.t('tag.team'));
    sheetContent.appendChild(el('p', 'kicker', meta.join(' · ')));
    var h = el('h2', null, i18n.pick(p.name)); h.id = 'sheet-title';
    sheetContent.appendChild(h);
    sheetContent.appendChild(el('p', 'sheet__tagline', i18n.pick(p.tagline)));

    var grid = el('div', 'sheet__grid');
    [['sheet.challenge', p.challenge], ['sheet.solution', p.solution]].forEach(function (pair) {
      var b = el('div', 'sheet__block');
      b.appendChild(el('h3', null, i18n.t(pair[0])));
      b.appendChild(el('p', null, i18n.pick(pair[1])));
      grid.appendChild(b);
    });
    sheetContent.appendChild(grid);

    var hl = el('div', 'sheet__block'); hl.style.marginTop = '22px';
    hl.appendChild(el('h3', null, i18n.t('sheet.highlights')));
    var list = el('ol', 'sheet__list');
    p.highlights.forEach(function (x, i) {
      var li = el('li');
      li.appendChild(el('span', 'sec', 'S' + (i + 1)));
      li.appendChild(el('span', null, i18n.pick(x)));
      list.appendChild(li);
    });
    hl.appendChild(list);
    sheetContent.appendChild(hl);

    var stack = el('div', 'sheet__stack');
    p.stack.forEach(function (s) { stack.appendChild(el('span', null, s)); });
    sheetContent.appendChild(stack);

    var foot = el('div', 'sheet__foot');
    if (p.repoUrl) {
      var a = el('a', 'btn btn--livery', i18n.t('sheet.repo'));
      a.href = p.repoUrl; a.target = '_blank'; a.rel = 'noopener noreferrer';
      foot.appendChild(a);
    } else {
      foot.appendChild(el('p', 'sheet__private', i18n.t('sheet.private')));
    }
    sheetContent.appendChild(foot);

    sheet.hidden = false;
    document.body.classList.add('is-locked');
    sheetClose.focus({ preventScroll: true });
  }

  function closeSheet() {
    if (sheet.hidden) return;
    sheet.hidden = true;
    document.body.classList.remove('is-locked');
    if (sheetReturn && sheetReturn.isConnected && sheetReturn.focus) sheetReturn.focus({ preventScroll: true });
  }

  function initSheet() {
    sheet = document.getElementById('sheet');
    sheetContent = document.getElementById('sheet-content');
    sheetClose = document.getElementById('sheet-close');
    sheetClose.addEventListener('click', closeSheet);
    sheet.addEventListener('click', function (e) { if (e.target === sheet) closeSheet(); });
    document.addEventListener('keydown', function (e) {
      if (sheet.hidden) return;
      if (e.key === 'Escape') { closeSheet(); return; }
      if (e.key === 'Tab') {
        var f = sheet.querySelectorAll('a[href], button');
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  /* ======================= Car setup ======================= */
  function initSetup() {
    var parts = document.querySelectorAll('.part');
    var hots = document.querySelectorAll('.hot');
    function show(key) {
      parts.forEach(function (p) { p.setAttribute('aria-pressed', String(p.dataset.part === key)); });
      hots.forEach(function (h) { h.classList.toggle('is-on', h.dataset.part === key); });
    }
    parts.forEach(function (p) {
      ['mouseenter', 'focus', 'click'].forEach(function (ev) { p.addEventListener(ev, function () { show(p.dataset.part); }); });
    });
    show('motor');
  }

  /* ======================= Hero car launch ======================= */
  function launchCar() {
    var stage = document.getElementById('car-stage');
    if (!stage || reduceMotion) return;
    stage.classList.remove('is-returning');
    stage.classList.add('is-launching');
    setTimeout(function () {
      stage.classList.remove('is-launching');
      stage.classList.add('is-returning');
      void stage.offsetWidth;                       // restart from the left edge
      stage.classList.remove('is-returning');
    }, 1150);
  }

  /* ======================= Lap game (loaded on demand) ======================= */
  var driveLoading = null;
  function loadDrive() {
    if (C.drive) return Promise.resolve();
    if (driveLoading) return driveLoading;
    driveLoading = new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = 'js/race/drive.js';
      s.onload = resolve;
      s.onerror = function () { driveLoading = null; reject(new Error('drive.js failed to load')); };
      document.body.appendChild(s);
    });
    return driveLoading;
  }

  /* ======================= Menu, contact ======================= */
  function initMenu() {
    var toggle = document.getElementById('menu-toggle');
    var nav = document.getElementById('main-nav');
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) { nav.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); }
    });
  }

  function initCopy() {
    var btn = document.getElementById('copy-email');
    var text = document.getElementById('email-text');
    var timer = 0;
    btn.addEventListener('click', function () {
      function done(key) {
        btn.textContent = i18n.t(key);
        clearTimeout(timer);
        timer = setTimeout(function () { btn.textContent = i18n.t('radio.copy'); }, 2200);
      }
      function fallback() {
        var r = document.createRange(); r.selectNodeContents(text);
        var s = root.getSelection(); s.removeAllRanges(); s.addRange(r);
        done('copy.fail');
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text.textContent.trim()).then(function () { done('copy.ok'); }, fallback);
      } else fallback();
    });
  }

  /* ======================= Boot ======================= */
  document.addEventListener('DOMContentLoaded', function () {
    i18n.init();
    C.livery.init();
    initSheet();
    renderCompounds();
    renderGarage();
    initSetup();
    initMenu();
    initCopy();
    C.circuitNav.init();
    C.pitstop.init();
    C.lights.init({ onReact: function (r) { if (!r.jump) setTimeout(launchCar, 900); } });

    document.getElementById('replay-lights').addEventListener('click', function () { C.lights.open(); });
    document.getElementById('open-drive').addEventListener('click', function () {
      loadDrive().then(function () { C.drive.open(); });
    });

    i18n.onChange(function () { renderCompounds(); renderGarage(); closeSheet(); });
  });
})(typeof window !== 'undefined' ? window : globalThis);
