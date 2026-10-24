/**
 * livery.js — four colour schemes for car 404 (red is the default).
 * Changes the --livery-* CSS variables used by the page and every SVG drawing.
 */
(function (root) {
  'use strict';

  // c1 body · c2 second colour · accent numbers and details
  // ui/on (optional): interface colour on paper and the text on it; uiDark/onDark: the same on dark sections
  var LIVERIES = [
    { id: 'rojo', name: { es: 'Rojo', en: 'Red' }, c1: '#D40000', c2: '#16171B', accent: '#F7F4EE' },
    { id: 'azul-noche', name: { es: 'Azul noche', en: 'Midnight blue' }, c1: '#1A2B5F', c2: '#E1122E', accent: '#FFC906', uiDark: '#FFC906', onDark: '#111214' },
    { id: 'plata', name: { es: 'Plata y turquesa', en: 'Silver and teal' }, c1: '#BFC5CC', c2: '#00A19B', accent: '#111317', ui: '#00857F', on: '#FFFFFF' },
    { id: 'azul-rosa', name: { es: 'Azul y rosa', en: 'Blue and pink' }, c1: '#0B62C4', c2: '#FF6FAE', accent: '#FFFFFF' }
  ];

  var current = LIVERIES[0];

  function find(id) {
    for (var i = 0; i < LIVERIES.length; i++) if (LIVERIES[i].id === id) return LIVERIES[i];
    return LIVERIES[0];
  }

  function apply(id) {
    current = find(id);
    var s = document.documentElement.style;
    s.setProperty('--livery-1', current.c1);
    s.setProperty('--livery-2', current.c2);
    s.setProperty('--livery-accent', current.accent);
    // optional interface overrides; removing them falls back to the tokens in css/tokens.css
    [['--livery-ui', 'ui'], ['--livery-on', 'on'], ['--livery-ui-dark', 'uiDark'], ['--livery-on-dark', 'onDark']].forEach(function (p) {
      if (current[p[1]]) s.setProperty(p[0], current[p[1]]); else s.removeProperty(p[0]);
    });
    try { localStorage.setItem('c404-livery', current.id); } catch (e) { /* storage unavailable */ }
    render();
  }

  function render() {
    var i18n = root.C404.i18n;
    var box = document.getElementById('livery-swatches');
    var label = document.getElementById('livery-label');
    if (label) label.textContent = i18n.t('livery.label', { name: i18n.pick(current.name) });
    if (!box) return;
    if (!box.children.length) {
      LIVERIES.forEach(function (l) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'swatch';
        b.setAttribute('role', 'radio');
        b.dataset.livery = l.id;
        b.innerHTML = '<i style="background:linear-gradient(135deg,' + l.c1 + ' 0 58%,' + l.c2 + ' 58%)"></i>';
        b.addEventListener('click', function () { apply(l.id); });
        b.addEventListener('keydown', function (e) {
          var idx = LIVERIES.indexOf(l), next = null;
          if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = LIVERIES[(idx + 1) % LIVERIES.length];
          if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = LIVERIES[(idx - 1 + LIVERIES.length) % LIVERIES.length];
          if (next) { e.preventDefault(); apply(next.id); box.querySelector('[data-livery="' + next.id + '"]').focus(); }
        });
        box.appendChild(b);
      });
    }
    Array.prototype.forEach.call(box.children, function (b) {
      var on = b.dataset.livery === current.id;
      b.setAttribute('aria-checked', String(on));
      b.tabIndex = on ? 0 : -1;
      var l = find(b.dataset.livery);
      b.setAttribute('aria-label', i18n.pick(l.name));
      b.title = i18n.pick(l.name);
    });
  }

  function init() {
    var saved = null;
    try { saved = localStorage.getItem('c404-livery'); } catch (e) { /* ignore */ }
    apply(saved || 'rojo');
    root.C404.i18n.onChange(render);
  }

  root.C404 = root.C404 || {};
  root.C404.livery = { LIVERIES: LIVERIES, init: init, apply: apply, get current() { return current; } };
})(typeof window !== 'undefined' ? window : globalThis);
