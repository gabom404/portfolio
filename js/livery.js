/**
 * livery.js — five original colour schemes for car 404.
 * Changes the --livery-* CSS variables used by the page and every SVG drawing.
 */
(function (root) {
  'use strict';

  var LIVERIES = [
    { id: 'naranja', name: { es: 'Naranja 404', en: '404 Orange' }, c1: '#FF5A1F', c2: '#16181D', accent: '#F5F3EE' },
    { id: 'ilopango', name: { es: 'Azul Ilopango', en: 'Ilopango Blue' }, c1: '#1E5BFF', c2: '#0B1B3A', accent: '#E9F6FF' },
    { id: 'volcan', name: { es: 'Verde Volcán', en: 'Volcano Green' }, c1: '#0F9A5B', c2: '#0E1A14', accent: '#F2E94E' },
    { id: 'plata', name: { es: 'Plata Nocturna', en: 'Night Silver' }, c1: '#9AA0AA', c2: '#15161A', accent: '#FF5A1F' },
    { id: 'carbono', name: { es: 'Negro Carbón', en: 'Carbon Black' }, c1: '#1C1D22', c2: '#FF5A1F', accent: '#F5F3EE' }
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
    apply(saved || 'naranja');
    root.C404.i18n.onChange(render);
  }

  root.C404 = root.C404 || {};
  root.C404.livery = { LIVERIES: LIVERIES, init: init, apply: apply, get current() { return current; } };
})(typeof window !== 'undefined' ? window : globalThis);
