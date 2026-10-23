/**
 * circuit-nav.js — the page as a lap of Circuito 404.
 * Each section of the page is a corner (T1…T7). As you scroll, a car moves
 * along the minimap; clicking a corner (or its label) jumps to that section.
 * Replaces the old decorative side track (f1-racer.js).
 */
(function (root) {
  'use strict';

  /* ---------- pure helper (unit-tested) ----------
   * bounds:    [{ top, bottom }] for each section, in page coordinates, in order
   * fractions: lap fraction where each section's corner sits (same order, ascending)
   * y:         the reading line in page coordinates
   * Returns the lap fraction (0–1) and the index of the current section.
   */
  function lapPosition(bounds, fractions, y) {
    if (!bounds.length) return { fraction: 0, index: 0 };
    if (y <= bounds[0].top) return { fraction: fractions[0], index: 0 };
    for (var i = 0; i < bounds.length; i++) {
      var b = bounds[i];
      var nextTop = i + 1 < bounds.length ? bounds[i + 1].top : b.bottom;
      if (y < nextTop || i === bounds.length - 1) {
        var span = Math.max(1, nextTop - b.top);
        var t = Math.min(1, Math.max(0, (y - b.top) / span));
        var from = fractions[i], to = i + 1 < fractions.length ? fractions[i + 1] : 1;
        return { fraction: from + (to - from) * t, index: i };
      }
    }
    return { fraction: 1, index: bounds.length - 1 };
  }

  var NS = 'http://www.w3.org/2000/svg';
  var nav, track, corners, sections, cornerEls = [], linkEls = [], navLinks = [], doneEl, doneLen = 1, car, ticking = false, lastIndex = -1;

  function draw() {
    var d = track.pathD();
    document.getElementById('circuit-runoff').setAttribute('d', d);
    document.getElementById('circuit-track').setAttribute('d', d);
    doneEl = document.getElementById('circuit-done');
    doneEl.setAttribute('d', d);
    doneLen = doneEl.getTotalLength ? doneEl.getTotalLength() : track.length;
    doneEl.style.strokeDasharray = doneLen + ' ' + doneLen;
    doneEl.style.strokeDashoffset = doneLen;

    var g = document.getElementById('circuit-corners');
    var list = document.getElementById('circuit-list');
    corners.forEach(function (c, i) {
      var cg = document.createElementNS(NS, 'g');
      cg.setAttribute('class', 'circuit-nav__corner');
      cg.setAttribute('transform', 'translate(' + c.point[0] + ' ' + c.point[1] + ')');
      var circle = document.createElementNS(NS, 'circle'); circle.setAttribute('r', '30');
      var text = document.createElementNS(NS, 'text'); text.textContent = c.id.slice(1);
      cg.appendChild(circle); cg.appendChild(text);
      cg.addEventListener('click', function () { go(i); });
      g.appendChild(cg);
      cornerEls.push(cg);

      var li = document.createElement('li');
      var a = document.createElement('a');
      a.href = '#' + c.section;
      a.innerHTML = '<b>' + c.id + '</b> <span></span>';
      li.appendChild(a); list.appendChild(li);
      linkEls.push(a);
    });
    labels();
  }

  function labels() {
    linkEls.forEach(function (a, i) { a.querySelector('span').textContent = root.C404.i18n.t(corners[i].key); });
  }

  function go(i) {
    var s = document.getElementById(corners[i].section);
    var reduce = root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (s) s.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  }

  /* keep the current corner visible when the label strip scrolls sideways (phones) */
  function revealLink(a) {
    var list = a.closest('ol');
    if (!list || list.scrollWidth <= list.clientWidth) return;
    var li = a.parentNode;
    var target = (li.offsetLeft - list.offsetLeft) - (list.clientWidth - li.offsetWidth) / 2;
    list.scrollLeft = Math.max(0, target);
  }

  function update() {
    ticking = false;
    nav.classList.toggle('is-parked', window.scrollY < 80);
    var y = window.scrollY + window.innerHeight * 0.35;
    var bounds = sections.map(function (s) {
      var r = s.getBoundingClientRect();
      return { top: r.top + window.scrollY, bottom: r.bottom + window.scrollY };
    });
    // reaching the bottom of the page counts as the finish line
    var atEnd = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
    var pos = atEnd ? { fraction: 1, index: sections.length - 1 } : lapPosition(bounds, corners.map(function (c) { return c.fraction; }), y);

    var p = track.pointAt(pos.fraction >= 1 ? 0.9999 : pos.fraction);
    car.setAttribute('transform', 'translate(' + p.x.toFixed(1) + ' ' + p.y.toFixed(1) + ') rotate(' + (p.angle * 180 / Math.PI).toFixed(1) + ')');
    doneEl.style.strokeDashoffset = (doneLen * (1 - pos.fraction)).toFixed(1);

    if (pos.index !== lastIndex) {
      lastIndex = pos.index;
      cornerEls.forEach(function (c, i) { c.classList.toggle('is-active', i === pos.index); });
      linkEls.forEach(function (a, i) {
        a.classList.toggle('is-active', i === pos.index);
        if (i === pos.index) { a.setAttribute('aria-current', 'true'); revealLink(a); } else a.removeAttribute('aria-current');
      });
      var id = corners[pos.index].section;
      navLinks.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('href') === '#' + id); });
    }
  }

  function schedule() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }

  function init() {
    track = root.C404.track;
    corners = track.CORNERS;
    sections = corners.map(function (c) { return document.getElementById(c.section); }).filter(Boolean);
    car = document.getElementById('circuit-car');
    nav = document.getElementById('circuit-nav');
    navLinks = Array.prototype.slice.call(document.querySelectorAll('.main-nav a'));
    if (!car || !nav || sections.length !== corners.length) return;
    draw();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    root.C404.i18n.onChange(labels);
    update();
  }

  root.C404 = root.C404 || {};
  root.C404.circuitNav = { init: init, lapPosition: lapPosition };
})(typeof window !== 'undefined' ? window : globalThis);
