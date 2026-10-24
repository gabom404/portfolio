/**
 * drive.js — "Hot lap": drive car 404 around Circuito 404 (arcade physics).
 * The 2.5D chase view lives in scene.js; without WebGL the game falls back to a
 * top-down view drawn here. Both files load on demand the first time the game opens.
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
  var STORAGE_REACTION = 'c404-best-reaction';   // shared with the start lights on the home page
  var START_DELAY = 600, START_STEP = 700;       // ms before the first light, and between lights
  var JUMP_PENALTY = 1000;                       // ms added to the lap after a jump start

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

  /** Start procedure: five lights come on one by one, then go out after a random hold (ms). */
  function createStart(t0, hold) { return { t0: t0, outAt: t0 + START_DELAY + 5 * START_STEP + hold, out: false, jump: false, reaction: null }; }
  /** Number of lit lights (0–5) at time `now`; 0 again once the lights are out. */
  function lampsAt(start, now) {
    if (now >= start.outAt) return 0;
    var e = now - start.t0 - START_DELAY;
    return e < 0 ? 0 : Math.min(5, Math.floor(e / START_STEP) + 1);
  }

  /** Lap timing with ordered checkpoints. */
  function createLap(count) { return { count: count, next: 0, startedAt: null, best: null, last: null, penalty: 0 }; }
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
    var time = Math.round(t - lap.startedAt + (lap.penalty || 0));
    lap.penalty = 0;
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
  var running = false, raf = 0, lastT = 0, cardTimer = 0, dpr = 1, start = null, shownLamps = -1;
  var scene = null, groundCanvas = null, stage = null, lastDt = 0;
  var entry = null, entryForm = null, entryName = null, entryError = null, lapsDone = 0;
  var reduceMotion = root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function t(k, v) { return root.C404.i18n.t(k, v); }
  function css(name) { return getComputedStyle(document.documentElement).getPropertyValue(name).trim(); }

  function reset() {
    var p = track.pointAt(0.985);
    var q = track.pointAt(0);
    startAngle = Math.atan2(q.y - p.y, q.x - p.x);
    startPoint = { x: q.x * SCALE, y: q.y * SCALE, angle: startAngle };
    // pole position: the first grid box, on the left, with the nose on its line
    var g = track.pointAt(0.988), g2 = track.pointAt(0.991);
    var ga = Math.atan2(g2.y - g.y, g2.x - g.x), fx = Math.cos(ga), fy = Math.sin(ga);
    car = { x: g.x * SCALE - fy * -22 - fx * 34, y: g.y * SCALE + fx * -22 - fy * 34, vx: 0, vy: 0, heading: ga, speed: 0 };
    var best = lap ? lap.best : null;
    try { best = best || Number(localStorage.getItem(STORAGE_BEST)) || null; } catch (e) { /* ignore */ }
    lap = createLap(cps.length);
    lap.best = best;
    start = null;
    lapsDone = 0;
    shownLamps = -1;
    hud.lap.textContent = formatLap(0);
    hud.last.textContent = '—';
    hud.best.textContent = formatLap(lap.best);
    hud.cp.textContent = '0/' + cps.length;
    var visitors = root.C404.visitors;
    if (visitors && visitors.enabled()) askName(visitors);      // the entry form first, then the start lights
    else beginStart();
  }

  function beginStart() {
    start = createStart(performance.now(), root.C404.lights ? root.C404.lights.randomHold() : 200 + Math.random() * 2800);
    shownLamps = -1;
    showLights(0);
  }

  /* ---------- entry form: who is driving ---------- */
  function askName(visitors) {
    showCard('', '', 0);
    var prev = visitors.player || visitors.remembered();
    entryName.value = prev ? prev.name : '';
    entryError.textContent = '';
    entryName.removeAttribute('aria-invalid');
    entry.hidden = false;
    (prev ? entryForm.querySelector('button[type="submit"]') : entryName).focus({ preventScroll: true });
  }

  function submitEntry(e) {
    e.preventDefault();
    var visitors = root.C404.visitors;
    var problem = visitors.checkName(entryName.value);
    if (problem) {
      entryError.textContent = t(problem);
      entryName.setAttribute('aria-invalid', 'true');
      entryName.focus();
      return;
    }
    visitors.register(entryName.value, root.C404.i18n.lang);
    entry.hidden = true;
    closeBtn.focus({ preventScroll: true });
    lastT = performance.now();
    beginStart();
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    var r = canvas.getBoundingClientRect();
    var w = Math.max(1, Math.round(r.width * dpr)), h = Math.max(1, Math.round(r.height * dpr));
    if (scene) scene.resize(w, h, dpr);
    else { canvas.width = w; canvas.height = h; }
  }

  /** Falls back to the top-down view (no WebGL, or the GPU context was lost). */
  function useFlatView() {
    scene = null;
    if (groundCanvas && groundCanvas.parentNode) groundCanvas.parentNode.removeChild(groundCanvas);
    if (stage) stage.classList.remove('is-3d');
    resize();
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

  /** The start card: a small gantry with the lit lights. */
  function showLights(n) {
    if (n === shownLamps) return;
    if (shownLamps < 0 || card.hidden || !card.querySelector('.gantry')) {
      showCard(t('drive.ready'), t('drive.wait'), 0);
      var gantry = document.createElement('div');
      gantry.className = 'gantry';
      gantry.setAttribute('aria-hidden', 'true');
      for (var i = 0; i < 5; i++) gantry.appendChild(document.createElement('span')).className = 'gantry__lamp';
      card.insertBefore(gantry, card.children[1]);
    }
    shownLamps = n;
    Array.prototype.forEach.call(card.querySelectorAll('.gantry__lamp'), function (l, i) { l.classList.toggle('is-on', i < n); });
  }

  function startProcedure(now) {
    if (!start) return false;                           // still filling in the entry form
    if (start.out) {
      if (start.reaction == null && !start.jump && keys.up) {
        start.reaction = Math.round(now - start.outAt);
        var best = null;
        try { best = Number(localStorage.getItem(STORAGE_REACTION)) || null; } catch (e) { /* ignore */ }
        var lights = root.C404.lights;
        var record = lights ? lights.bestOf(best, start.reaction) : Math.min(best || Infinity, start.reaction);
        try { localStorage.setItem(STORAGE_REACTION, String(record)); } catch (e) { /* ignore */ }
        showCard(t('drive.go'), t('drive.reaction', { ms: start.reaction }), 2200);
      }
      return true;
    }
    if (keys.up && !start.jump) {                       // throttle before the lights go out
      start.jump = true;
      lap.penalty = JUMP_PENALTY;
    }
    if (now >= start.outAt) {
      start.out = true;
      startLap(lap, start.outAt);
      shownLamps = -1;
      if (start.jump) showCard(t('drive.jump'), t('drive.jumpText'), 2600);
      else showCard(t('drive.go'), t('drive.goText'), 0);
      return true;
    }
    showLights(lampsAt(start, now));
    return false;
  }

  function factFor(i) {
    var list = root.PROJECTS || [];
    var p = list[i % Math.max(1, list.length)];
    if (!p) return '';
    var pick = root.C404.i18n.pick;
    return pick(p.name) + ' · ' + pick(p.highlights[0]);
  }

  function update(dt, now) {
    var go = startProcedure(now);                      // the car waits on the grid until lights out
    var near = track.nearest(car.x / SCALE, car.y / SCALE);
    var onTrack = near.dist * SCALE <= HALF_WIDTH;
    car = stepCar(car, go ? keys : {}, dt, onTrack);
    car.offTrack = !onTrack;

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
          if (root.C404.visitors) root.C404.visitors.lap(time, lapsDone === 0 ? start.reaction : null, lapsDone === 0 && start.jump);
          lapsDone += 1;
          showCard(t('drive.lapDone'), formatLap(time), 2600);
        }
      }
      hud.lap.textContent = formatLap(now - lap.startedAt + (lap.penalty || 0));
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
    if (scene) {
      var ok = scene.render({ car: car, lap: lap, cps: cps, keys: keys, dt: lastDt, now: performance.now(), reduceMotion: reduceMotion, lamps: start ? lampsAt(start, performance.now()) : 0 });
      if (ok) return;
      useFlatView();
    }
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
      ctx.fillStyle = passed ? css('--livery-ui') || '#D40000' : '#111214';
      ctx.fillRect(x - 30, y - 92, 60, 36);
      ctx.fillStyle = '#F5F3EE';
      ctx.fillText(c.id, x, y - 74);
    });

    drawCar(css('--livery-1') || '#D40000', css('--livery-2') || '#16171B', css('--livery-accent') || '#F7F4EE');
  }

  function loop(now) {
    if (!running) return;
    var dt = Math.min(0.033, (now - lastT) / 1000 || 0);
    lastT = now;
    lastDt = dt;
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
    if (entry && !entry.hidden) {                       // typing a name: keep focus inside the dialog, no driving keys
      if (e.key === 'Tab') {
        var f = [closeBtn].concat(Array.prototype.slice.call(entryForm.querySelectorAll('input, button')));
        var i = f.indexOf(document.activeElement);
        e.preventDefault();
        f[(i + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
      }
      return;
    }
    if (e.key === 'Tab') { e.preventDefault(); closeBtn.focus(); return; }
    setKey(e, true);
  }
  function onKeyUp(e) { if (!dlg.hidden && (!entry || entry.hidden)) setKey(e, false); }

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
    if (scene) {
      var st = getComputedStyle(dlg);
      scene.setColors({ body: css('--livery-1'), body2: css('--livery-2'), accent: css('--livery-accent'), ui: st.getPropertyValue('--livery-ui').trim() });
      scene.reset();
    }
    if (!entry || entry.hidden) closeBtn.focus({ preventScroll: true });
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
    stage = canvas.parentNode;
    entry = document.getElementById('drive-entry');
    entryForm = document.getElementById('drive-entry-form');
    entryName = document.getElementById('entry-name');
    entryError = document.getElementById('entry-error');
    entryForm.addEventListener('submit', submitEntry);
    entryName.addEventListener('input', function () { entryError.textContent = ''; entryName.removeAttribute('aria-invalid'); });
    if (root.C404.scene) {
      groundCanvas = document.createElement('canvas');
      groundCanvas.className = 'drive__ground';
      groundCanvas.setAttribute('aria-hidden', 'true');
      stage.insertBefore(groundCanvas, canvas);
      try {
        scene = root.C404.scene.create({ ground: groundCanvas, overlay: canvas, track: root.C404.track, scale: SCALE, halfWidth: HALF_WIDTH });
      } catch (e) { scene = null; }
      if (scene) stage.classList.add('is-3d'); else useFlatView();
    }
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
    state: function () { return car && lap ? { x: car.x, y: car.y, heading: car.heading, speed: car.speed, offTrack: !!car.offTrack, next: lap.next, best: lap.best, last: lap.last, out: !!(start && start.out), jump: !!(start && start.jump), reaction: start ? start.reaction : null } : null; },
    createStart: createStart, lampsAt: lampsAt, JUMP_PENALTY: JUMP_PENALTY,
    stepCar: stepCar, createLap: createLap, startLap: startLap, hitCheckpoint: hitCheckpoint, crossLine: crossLine, formatLap: formatLap,
    constants: { MAX_SPEED: MAX_SPEED, MAX_SPEED_OFF: MAX_SPEED_OFF, HALF_WIDTH: HALF_WIDTH, SCALE: SCALE }
  };
})(typeof window !== 'undefined' ? window : globalThis);
