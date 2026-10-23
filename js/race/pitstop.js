/**
 * pitstop.js — change four tyres against the clock.
 * The tyre to change lights up; hit it (click, tap or keys 1–4).
 * A wrong tyre adds a one-second penalty.
 */
(function (root) {
  'use strict';

  var PENALTY_S = 1;
  var STORAGE_BEST = 'c404-best-pitstop';

  /* ---------- pure helpers (unit-tested) ---------- */
  function shuffle(list, rand) {
    var a = list.slice(), r = rand || Math.random;
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)); var tmp = a[i]; a[i] = a[j]; a[j] = tmp; }
    return a;
  }

  function createStop(order, startAt) {
    return { order: order.slice(), next: 0, mistakes: 0, startAt: startAt, done: false, time: null };
  }

  /** Returns { ok, done, time } and updates the stop in place. time is in seconds including penalties. */
  function press(stop, tyre, at) {
    if (stop.done) return { ok: false, done: true, time: stop.time };
    if (tyre !== stop.order[stop.next]) {
      stop.mistakes += 1;
      return { ok: false, done: false, time: null };
    }
    stop.next += 1;
    if (stop.next >= stop.order.length) {
      stop.done = true;
      stop.time = Math.round(((at - stop.startAt) / 1000 + stop.mistakes * PENALTY_S) * 100) / 100;
      return { ok: true, done: true, time: stop.time };
    }
    return { ok: true, done: false, time: null };
  }

  function elapsed(stop, at) { return (at - stop.startAt) / 1000 + stop.mistakes * PENALTY_S; }

  /* ---------- DOM ---------- */
  var tyres, timeEl, bestEl, msgEl, startBtn, stop = null, raf = 0;

  function t(k, v) { return root.C404.i18n.t(k, v); }
  function fmt(s) { return s.toFixed(2) + ' s'; }
  function readBest() { try { return Number(localStorage.getItem(STORAGE_BEST)) || null; } catch (e) { return null; } }
  function writeBest(v) { try { localStorage.setItem(STORAGE_BEST, String(v)); } catch (e) { /* ignore */ } }

  function paint() {
    tyres.forEach(function (g) {
      var id = Number(g.dataset.tyre);
      var doneIdx = stop ? stop.order.slice(0, stop.next).indexOf(id) : -1;
      g.classList.toggle('is-done', doneIdx !== -1);
      g.classList.toggle('is-target', !!stop && !stop.done && stop.order[stop.next] === id);
      g.setAttribute('tabindex', stop && !stop.done ? '0' : '-1');
    });
  }

  function tick() {
    if (!stop || stop.done) return;
    timeEl.textContent = fmt(elapsed(stop, performance.now()));
    raf = requestAnimationFrame(tick);
  }

  function start() {
    cancelAnimationFrame(raf);
    stop = createStop(shuffle([0, 1, 2, 3]), performance.now());
    msgEl.textContent = t('pit.go');
    startBtn.textContent = t('pit.again');
    paint();
    tick();
  }

  function hit(id) {
    if (!stop || stop.done) return;
    var r = press(stop, id, performance.now());
    if (!r.ok) {
      msgEl.textContent = t('pit.wrong');
      var g = tyres[id];
      g.classList.add('is-wrong');
      setTimeout(function () { g.classList.remove('is-wrong'); }, 250);
      return;
    }
    paint();
    if (r.done) {
      cancelAnimationFrame(raf);
      timeEl.textContent = fmt(r.time);
      var best = readBest();
      if (!best || r.time < best) { writeBest(r.time); bestEl.textContent = fmt(r.time); msgEl.textContent = t('pit.record', { t: r.time.toFixed(2) }); }
      else msgEl.textContent = t('pit.done', { t: r.time.toFixed(2) });
      startBtn.focus({ preventScroll: true });
    }
  }

  function init() {
    var box = document.getElementById('pitstop');
    if (!box) return;
    tyres = Array.prototype.slice.call(box.querySelectorAll('.pit-tyre')).sort(function (a, b) { return a.dataset.tyre - b.dataset.tyre; });
    timeEl = document.getElementById('pit-time');
    bestEl = document.getElementById('pit-best');
    msgEl = document.getElementById('pit-msg');
    startBtn = document.getElementById('pit-start');
    var best = readBest();
    if (best) bestEl.textContent = fmt(best);

    startBtn.addEventListener('click', start);
    tyres.forEach(function (g) {
      g.addEventListener('pointerdown', function (e) { e.preventDefault(); hit(Number(g.dataset.tyre)); });
      g.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); hit(Number(g.dataset.tyre)); } });
    });
    document.addEventListener('keydown', function (e) {
      if (!stop || stop.done || e.altKey || e.ctrlKey || e.metaKey) return;
      var n = ['1', '2', '3', '4'].indexOf(e.key);
      if (n !== -1) { e.preventDefault(); hit(n); }
    });
    root.C404.i18n.onChange(function () { startBtn.textContent = t(stop ? 'pit.again' : 'pit.start'); });
  }

  root.C404 = root.C404 || {};
  root.C404.pitstop = { init: init, shuffle: shuffle, createStop: createStop, press: press, PENALTY_S: PENALTY_S };
})(typeof window !== 'undefined' ? window : globalThis);
