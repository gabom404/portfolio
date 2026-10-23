/**
 * drive.js — "Hot lap": drive car 404 around Circuito 404 (top-down, arcade physics).
 * Loaded on demand the first time the visitor opens the game.
 */
(function (root) {
  'use strict';

  var SCALE = 3;                 // world units per track unit
  var HALF_WIDTH = 50;           // half track width in world units
  var MAX_SPEED = 620;           // world units / s on track
  var MAX_SPEED_OFF = 170;
  var ACCEL = 420, BRAKE = 900, REVERSE = 160, DRAG = 0.35, TURN = 2.7;
  var GRIP = 9, GRIP_OFF = 3.2;
  var KMH = 0.55;                // world units/s → km/h shown on the HUD
  var STORAGE_BEST = 'c404-best-lap';

  /* ---------- pure helpers (unit-tested) ---------- */

  /** Advance the car by dt seconds. input: { up, down, left, right }. Returns a new state. */
  function stepCar(s, input, dt, onTrack) {
    var h = s.heading;
    var fx = Math.cos(h), fy = Math.sin(h), rx = -fy, ry = fx;
    var fwd = s.vx * fx + s.vy * fy;
    var lat = s.vx * rx + s.vy * ry;

    if (input.up) fwd += ACCEL * dt;
    if (input.down) fwd -= (fwd > 0 ? BRAKE : REVERSE) * dt;
    fwd -= fwd * (onTrack ? DRAG : DRAG * 6) * dt;
    var cap = onTrack ? MAX_SPEED : MAX_SPEED_OFF;
    if (fwd > cap) fwd = onTrack ? cap : fwd - (fwd - cap) * Math.min(1, 4 * dt);
    if (fwd < -REVERSE * 0.5) fwd = -REVERSE * 0.5;
    if (!input.up && !input.down && Math.abs(fwd) < 4) fwd = 0;

    var steer = (input.right ? 1 : 0) - (input.left ? 1 : 0);
    var steerEffect = Math.min(1, Math.abs(fwd) / 160) * (fwd >= 0 ? 1 : -1);
    h += steer * TURN * dt * steerEffect * (1 - Math.min(0.35, Math.abs(fwd) / MAX_SPEED * 0.35));

    lat *= Math.exp(-(onTrack ? GRIP : GRIP_OFF) * dt);

    fx = Math.cos(h); fy = Math.sin(h); rx = -fy; ry = fx;
    var vx = fx * fwd + rx * lat, vy = fy * fwd + ry * lat;
    return { x: s.x + vx * dt, y: s.y + vy * dt, vx: vx, vy: vy, heading: h, speed: fwd };
  }

  /** Lap timing with ordered checkpoints. */
  function createLap(count) { return { count: count, next: 0, startedAt: null, best: null, last: null }; }
  function startLap(lap, t) { lap.startedAt = t; lap.next = 0; }
  /** Returns true when the checkpoint was the expected one. */
  function hitCheckpoint(lap, i) {
    if (lap.startedAt == null || i !== lap.next) return false;
    lap.next += 1;
    return true;
  }
  /** Crossing the line: returns the lap time (ms) if every checkpoint was passed, else null. */
  function crossLine(lap, t) {
    if (lap.startedAt == null || lap.next < lap.count) return null;
    var time = Math.round(t - lap.startedAt);
    lap.last = time;
    if (lap.best == null || time < lap.best) lap.best = time;
    lap.startedAt = t;
    lap.next = 0;
    return time;
  }
  function formatLap(ms) {
    if (ms == null) return '—';
    var m = Math.floor(ms / 60000), s = Math.floor(ms / 1000) % 60, r = Math.floor(ms % 1000);
    return m + ':' + String(s).padStart(2, '0') + '.' + String(r).padStart(3, '0');
  }

  /* ---------- DOM / game loop ---------- */
  var dlg, canvas, ctx, card, hud = {}, closeBtn, lastFocus = null;
  var keys = { up: false, down: false, left: false, right: false };
  var car, lap, track, trackPath, cps, startPoint, startAngle;
  var running = false, raf = 0, lastT = 0, cardTimer = 0, dpr = 1, moved = false;

  function t(k, v) { return root.C404.i18n.t(k, v); }
  function css(name) { return getComputedStyle(document.documentElement).getPropertyValue(name).trim(); }

  function reset() {
    var p = track.pointAt(0.985);
    var q = track.pointAt(0);
    startAngle = Math.atan2(q.y - p.y, q.x - p.x);
    car = { x: p.x * SCALE, y: p.y * SCALE, vx: 0, vy: 0, heading: startAngle, speed: 0 };
    startPoint = { x: q.x * SCALE, y: q.y * SCALE, angle: startAngle };
    var best = lap ? lap.best : null;
    try { best = best || Number(localStorage.getItem(STORAGE_BEST)) || null; } catch (e) { /* ignore */ }
    lap = createLap(cps.length);
    lap.best = best;
    moved = false;
    hud.lap.textContent = formatLap(0);
    hud.last.textContent = '—';
    hud.best.textContent = formatLap(lap.best);
    hud.cp.textContent = '0/' + cps.length;
    showCard(t('drive.start'), '', 0);
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    var r = canvas.getBoundingClientRect();
    canvas.width = Math.max(1, Math.round(r.width * dpr));
    canvas.height = Math.max(1, Math.round(r.height * dpr));
  }

  function showCard(title, text, ms) {
    clearTimeout(cardTimer);
    if (!title) { card.hidden = true; return; }
    card.innerHTML = '';
    var k = document.createElement('span'); k.className = 'kicker'; k.textContent = 'Circuito 404';
    var b = document.createElement('b'); b.textContent = title;
    card.appendChild(k); card.appendChild(b);
    if (text) { var p = document.createElement('p'); p.textContent = text; card.appendChild(p); }
    card.hidden = false;
    if (ms) cardTimer = setTimeout(function () { card.hidden = true; }, ms);
  }

  function factFor(i) {
    var list = root.PROJECTS || [];
    var p = list[i % Math.max(1, list.length)];
    if (!p) return '';
    var pick = root.C404.i18n.pick;
    return pick(p.name) + ' · ' + pick(p.highlights[0]);
  }

  function update(dt, now) {
    var near = track.nearest(car.x / SCALE, car.y / SCALE);
    var onTrack = near.dist * SCALE <= HALF_WIDTH;
    car = stepCar(car, keys, dt, onTrack);
    car.offTrack = !onTrack;

    if (!moved && Math.abs(car.speed) > 5) { moved = true; startLap(lap, now); showCard('', '', 0); }

    if (lap.startedAt != null) {
      var c = cps[lap.next];
      if (c && Math.hypot(car.x - c.x, car.y - c.y) < HALF_WIDTH * 2.2 && hitCheckpoint(lap, lap.next)) {
        hud.cp.textContent = lap.next + '/' + cps.length;
        showCard(t('drive.cpTitle', { n: c.id }), factFor(lap.next - 1), 2600);
      }
      if (lap.next >= cps.length && Math.hypot(car.x - startPoint.x, car.y - startPoint.y) < HALF_WIDTH * 1.6) {
        var time = crossLine(lap, now);
        if (time != null) {
          hud.last.textContent = formatLap(time);
          hud.best.textContent = formatLap(lap.best);
          hud.cp.textContent = '0/' + cps.length;
          try { localStorage.setItem(STORAGE_BEST, String(lap.best)); } catch (e) { /* ignore */ }
          showCard(t('drive.lapDone'), formatLap(time), 2600);
        }
      }
      hud.lap.textContent = formatLap(now - lap.startedAt);
    }
    hud.speed.textContent = Math.round(Math.max(0, car.speed) * KMH);
  }

  function drawCar(c1, c2, accent) {
    ctx.save();
    ctx.translate(car.x, car.y);
    ctx.rotate(car.heading);
    ctx.fillStyle = 'rgba(0,0,0,.35)';
    ctx.fillRect(-26, -14, 56, 30);
    ctx.fillStyle = '#141518';                       // tyres
    ctx.fillRect(-24, -17, 14, 8); ctx.fillRect(-24, 9, 14, 8);
    ctx.fillRect(12, -15, 11, 7); ctx.fillRect(12, 8, 11, 7);
    ctx.fillStyle = c2; ctx.fillRect(-30, -12, 6, 24); // rear wing
    ctx.fillStyle = c1;                               // body
    ctx.beginPath();
    ctx.moveTo(-24, -8); ctx.lineTo(4, -9); ctx.lineTo(30, -2); ctx.lineTo(30, 2); ctx.lineTo(4, 9); ctx.lineTo(-24, 8); ctx.closePath();
    ctx.fill();
    ctx.fillStyle = c2; ctx.fillRect(28, -14, 5, 28); // front wing
    ctx.fillStyle = accent; ctx.beginPath(); ctx.arc(-2, 0, 4, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  function render() {
    var w = canvas.width, h = canvas.height;
    var zoom = Math.min(w, h) / 760;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = '#2E5B2B';
    ctx.fillRect(0, 0, w, h);
    ctx.setTransform(zoom, 0, 0, zoom, w / 2 - car.x * zoom, h / 2 - car.y * zoom);

    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    ctx.strokeStyle = '#C9C4B6'; ctx.lineWidth = HALF_WIDTH * 2 + 70; ctx.stroke(trackPath);   // run-off
    ctx.strokeStyle = '#F5F3EE'; ctx.lineWidth = HALF_WIDTH * 2 + 14; ctx.stroke(trackPath);   // kerbs
    ctx.setLineDash([24, 24]); ctx.strokeStyle = '#E0212B'; ctx.stroke(trackPath); ctx.setLineDash([]);
    ctx.strokeStyle = '#3A3B40'; ctx.lineWidth = HALF_WIDTH * 2; ctx.stroke(trackPath);        // asphalt
    ctx.setLineDash([30, 40]); ctx.strokeStyle = 'rgba(255,255,255,.18)'; ctx.lineWidth = 3; ctx.stroke(trackPath); ctx.setLineDash([]);

    // start / finish line
    ctx.save();
    ctx.translate(startPoint.x, startPoint.y); ctx.rotate(startPoint.angle);
    for (var i = -5; i < 5; i++) for (var j = 0; j < 2; j++) {
      ctx.fillStyle = (i + j) % 2 ? '#111' : '#fff';
      ctx.fillRect(j * 8 - 8, i * 10, 8, 10);
    }
    ctx.restore();

    // corner boards
    ctx.font = '700 26px JetBrains Mono, monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    track.CORNERS.forEach(function (c) {
      var x = c.point[0] * SCALE, y = c.point[1] * SCALE;
      var passed = cps.indexOf(c) !== -1 && cps.indexOf(c) < lap.next;
      ctx.fillStyle = passed ? css('--livery-1') || '#FF5A1F' : '#111214';
      ctx.fillRect(x - 30, y - 92, 60, 36);
      ctx.fillStyle = '#F5F3EE';
      ctx.fillText(c.id, x, y - 74);
    });

    drawCar(css('--livery-1') || '#FF5A1F', css('--livery-2') || '#16181D', css('--livery-accent') || '#F5F3EE');
  }

  function loop(now) {
    if (!running) return;
    var dt = Math.min(0.033, (now - lastT) / 1000 || 0);
    lastT = now;
    update(dt, now);
    render();
    raf = requestAnimationFrame(loop);
  }

  function setKey(e, down) {
    var map = { ArrowUp: 'up', w: 'up', W: 'up', ArrowDown: 'down', s: 'down', S: 'down', ArrowLeft: 'left', a: 'left', A: 'left', ArrowRight: 'right', d: 'right', D: 'right' };
    var k = map[e.key];
    if (!k) return;
    e.preventDefault();
    keys[k] = down;
  }

  function onKeyDown(e) {
    if (dlg.hidden) return;
    if (e.key === 'Escape') { close(); return; }
    if (e.key === 'Tab') { e.preventDefault(); closeBtn.focus(); return; }
    setKey(e, true);
  }
  function onKeyUp(e) { if (!dlg.hidden) setKey(e, false); }

  function onVisibility() {
    if (dlg.hidden) return;
    if (document.hidden) { running = false; cancelAnimationFrame(raf); }
    else if (!running) { running = true; lastT = performance.now(); raf = requestAnimationFrame(loop); }
  }

  function open() {
    lastFocus = document.activeElement;
    dlg.hidden = false;
    document.body.classList.add('is-locked');
    resize();
    reset();
    closeBtn.focus({ preventScroll: true });
    running = true;
    lastT = performance.now();
    raf = requestAnimationFrame(loop);
  }

  function close() {
    running = false;
    cancelAnimationFrame(raf);
    keys.up = keys.down = keys.left = keys.right = false;
    dlg.hidden = true;
    document.body.classList.remove('is-locked');
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }

  var ready = false;
  function setup() {
    if (ready) return;
    ready = true;
    dlg = document.getElementById('drive');
    canvas = document.getElementById('drive-canvas');
    ctx = canvas.getContext('2d');
    card = document.getElementById('drive-card');
    closeBtn = document.getElementById('drive-close');
    hud = { lap: document.getElementById('hud-lap'), last: document.getElementById('hud-last'), best: document.getElementById('hud-best'), speed: document.getElementById('hud-speed'), cp: document.getElementById('hud-cp') };
    track = root.C404.track;
    trackPath = new Path2D(track.pathD(SCALE));
    cps = track.CORNERS.slice(1).map(function (c) { return Object.assign(c, { x: c.point[0] * SCALE, y: c.point[1] * SCALE }); });

    closeBtn.addEventListener('click', close);
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('resize', function () { if (!dlg.hidden) resize(); });
    dlg.querySelectorAll('.drive__pad button').forEach(function (b) {
      var k = b.getAttribute('data-key');
      function down(e) { e.preventDefault(); keys[k] = true; b.classList.add('is-down'); }
      function up() { keys[k] = false; b.classList.remove('is-down'); }
      b.addEventListener('pointerdown', down);
      b.addEventListener('pointerup', up);
      b.addEventListener('pointercancel', up);
      b.addEventListener('pointerleave', up);
    });
  }

  root.C404 = root.C404 || {};
  root.C404.drive = {
    open: function () { setup(); open(); },
    close: function () { if (ready) close(); },
    /** Read-only snapshot of the car and lap (used by the browser tests). */
    state: function () { return car && lap ? { x: car.x, y: car.y, heading: car.heading, speed: car.speed, offTrack: !!car.offTrack, next: lap.next, best: lap.best, last: lap.last } : null; },
    stepCar: stepCar, createLap: createLap, startLap: startLap, hitCheckpoint: hitCheckpoint, crossLine: crossLine, formatLap: formatLap,
    constants: { MAX_SPEED: MAX_SPEED, MAX_SPEED_OFF: MAX_SPEED_OFF, HALF_WIDTH: HALF_WIDTH, SCALE: SCALE }
  };
})(typeof window !== 'undefined' ? window : globalThis);
