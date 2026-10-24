/**
 * scene.js — 2.5D view for the "Hot lap" game: a chase camera behind car 404.
 *
 * - The ground (track, run-off, grass) and the sky with volcanoes on the horizon
 *   are drawn by one WebGL fragment shader, "Mode 7" style: every pixel below the
 *   horizon is projected onto the ground plane and looked up in a texture of the circuit.
 * - Trees, grandstands, the start gantry, corner boards and the car itself are drawn
 *   on a 2D canvas on top, sorted from far to near. The car is a small polygon model
 *   painted with the current livery and lit by a fixed sun.
 *
 * Loaded on demand together with drive.js. If WebGL is not available, create()
 * returns null and drive.js keeps its top-down view.
 */
(function (root) {
  'use strict';

  var K = 11;          // world units per metre (car model)
  var NEAR = 6;        // nearest distance drawn, in world units
  var CAM = { height: 30, behind: 84, lag: 5 };

  /* ======================= camera (pure, unit-tested) ======================= */

  /** Projects a world point (x, y on the ground plane, z up) for a camera looking along cam.dir.
   *  Returns screen x, y, the forward distance z and the scale k (pixels per world unit), or null. */
  function project(cam, wx, wy, wz) {
    var dx = wx - cam.x, dy = wy - cam.y;
    var c = Math.cos(cam.dir), s = Math.sin(cam.dir);
    var z = dx * c + dy * s;
    if (z < NEAR) return null;
    var x = dy * c - dx * s;
    var k = cam.f / z;
    return { x: cam.cx + x * k, y: cam.hy + (cam.h - (wz || 0)) * k, z: z, k: k };
  }

  function wrapAngle(a) {
    while (a > Math.PI) a -= Math.PI * 2;
    while (a < -Math.PI) a += Math.PI * 2;
    return a;
  }

  /** Moves the camera behind the car; its heading follows the car's with a little lag. */
  function follow(cam, car, dt, speedRatio) {
    if (cam.dir == null) cam.dir = car.heading;
    cam.dir += wrapAngle(car.heading - cam.dir) * Math.min(1, dt * CAM.lag);
    var back = CAM.behind + 12 * speedRatio;
    cam.x = car.x - Math.cos(cam.dir) * back;
    cam.y = car.y - Math.sin(cam.dir) * back;
    cam.h = CAM.height;
    return cam;
  }

  /* ======================= colours ======================= */
  function parseColor(str, fallback) {
    var s = (str || '').trim();
    var m = /^#([0-9a-f]{6})$/i.exec(s);
    if (m) { var n = parseInt(m[1], 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
    m = /^#([0-9a-f]{3})$/i.exec(s);
    if (m) return [0, 1, 2].map(function (i) { return parseInt(m[1][i] + m[1][i], 16); });
    m = /rgba?\(([^)]+)\)/.exec(s);
    if (m) return m[1].split(',').slice(0, 3).map(function (v) { return Math.round(parseFloat(v)); });
    return fallback;
  }
  function rgb(c, f, add) {
    add = add || 0;
    return 'rgb(' + Math.min(255, Math.round(c[0] * f + add)) + ',' + Math.min(255, Math.round(c[1] * f + add)) + ',' + Math.min(255, Math.round(c[2] * f + add)) + ')';
  }

  /* ======================= car model (metres; x forward, y right, z up) ======================= */
  function sub(a, b) { return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }
  function cross(a, b) { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
  function dot(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
  function norm(a) { var l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; }
  function centroid(pts) {
    var c = [0, 0, 0];
    pts.forEach(function (p) { c[0] += p[0]; c[1] += p[1]; c[2] += p[2]; });
    return [c[0] / pts.length, c[1] / pts.length, c[2] / pts.length];
  }

  function buildCar() {
    var faces = [], lines = [], balls = [];

    function poly(pts, color, ref, opt) {
      opt = opt || {};
      var n = norm(cross(sub(pts[1], pts[0]), sub(pts[2], pts[0])));
      var c = centroid(pts);
      if (dot(n, sub(c, ref)) < 0) { pts = pts.slice().reverse(); n = [-n[0], -n[1], -n[2]]; }
      faces.push({ pts: pts, n: n, c: c, color: color, bias: opt.bias || 0, steer: opt.steer || null, gloss: opt.gloss !== false, emissive: !!opt.emissive });
    }

    function box(x0, x1, y0, y1, z0, z1, color, opt) {
      opt = opt || {};
      var ref = [(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2];
      var col = function (side) { return (opt.faces && opt.faces[side]) || color; };
      var o = { steer: opt.steer, emissive: opt.emissive, gloss: opt.gloss };
      poly([[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], col('top'), ref, o);
      poly([[x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1]], col('front'), ref, o);
      poly([[x0, y0, z0], [x0, y1, z0], [x0, y1, z1], [x0, y0, z1]], col('back'), ref, o);
      poly([[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]], col('left'), ref, o);
      poly([[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]], col('right'), ref, o);
    }
    function boxPair(x0, x1, yIn, yOut, z0, z1, color, opt) {
      box(x0, x1, yIn, yOut, z0, z1, color, opt);
      box(x0, x1, -yOut, -yIn, z0, z1, color, opt);
    }

    // body: lofted sections [x, half width, bottom, top, top-width share]
    var S = [
      [-2.25, 0.12, 0.22, 0.46, 0.8], [-1.85, 0.17, 0.12, 0.56, 0.7], [-1.35, 0.26, 0.08, 0.72, 0.5],
      [-0.85, 0.50, 0.08, 0.84, 0.3], [-0.35, 0.70, 0.08, 0.92, 0.2], [0.15, 0.72, 0.08, 0.82, 0.3],
      [0.45, 0.46, 0.10, 0.72, 0.6], [1.00, 0.36, 0.12, 0.66, 0.7], [1.70, 0.24, 0.14, 0.52, 0.75],
      [2.40, 0.14, 0.14, 0.36, 0.75], [2.95, 0.07, 0.12, 0.22, 0.7]
    ];
    function profile(s) {
      var x = s[0], w = s[1], zb = s[2], zt = s[3], sh = s[4];
      var zm = zb + (zt - zb) * 0.5, zs = zm + (zt - zm) * 0.2;
      return [[x, -w, zb], [x, w, zb], [x, w, zm], [x, w * 0.8, zs], [x, w * sh, zt], [x, -w * sh, zt], [x, -w * 0.8, zs], [x, -w, zm]];
    }
    var edgeColor = [null, 'body2', 'body', 'body', 'body', 'body', 'body', 'body2'];
    for (var i = 0; i < S.length - 1; i++) {
      var A = profile(S[i]), B = profile(S[i + 1]);
      var ref = [(S[i][0] + S[i + 1][0]) / 2, 0, (S[i][2] + S[i][3] + S[i + 1][2] + S[i + 1][3]) / 4];
      for (var j = 1; j < 8; j++) {
        var j2 = (j + 1) % 8;
        poly([A[j], A[j2], B[j2], B[j]], edgeColor[j], ref);
      }
    }
    poly(profile(S[0]), 'carbon', [S[0][0] + 1, 0, 0.34], { gloss: false });
    poly(profile(S[S.length - 1]), 'body2', [S[S.length - 1][0] - 1, 0, 0.17]);

    // floor, diffuser, airbox, cockpit opening, mirrors
    box(-1.2, 1.35, -0.78, 0.78, 0.03, 0.07, 'carbon', { gloss: false });
    box(-2.2, -1.2, -0.55, 0.55, 0.04, 0.2, 'carbon', { gloss: false });
    box(-0.45, -0.1, -0.13, 0.13, 0.84, 1.12, 'body', { faces: { front: 'dark' } });
    box(-0.36, -0.3, -0.03, 0.03, 1.12, 1.17, 'accent');                       // camera pod
    poly([[-0.05, -0.18, 0.87], [-0.05, 0.18, 0.87], [0.75, 0.2, 0.695], [0.75, -0.2, 0.695]], 'dark', [0.35, 0, 0.3], { bias: 0.6, gloss: false });
    boxPair(0.62, 0.74, 0.44, 0.64, 0.72, 0.8, 'body2');

    // wings
    boxPair(-2.62, -2.05, 0.5, 0.54, 0.42, 1.02, 'body2');                       // rear endplates
    box(-2.55, -2.25, -0.5, 0.5, 0.84, 0.9, 'body');                              // rear main plane
    box(-2.62, -2.42, -0.5, 0.5, 0.94, 1.0, 'body2');                             // rear flap
    box(-2.4, -2.25, -0.03, 0.03, 0.42, 0.84, 'carbon', { gloss: false });        // pylon
    box(-2.45, -2.3, -0.42, 0.42, 0.28, 0.33, 'carbon', { gloss: false });        // beam wing
    box(-2.31, -2.25, -0.06, 0.06, 0.33, 0.44, 'light', { emissive: true });      // rain light
    box(2.62, 3.02, -0.95, 0.95, 0.07, 0.11, 'body2');                             // front wing
    box(2.44, 2.68, -0.95, 0.95, 0.11, 0.2, 'body');                               // front flap
    boxPair(2.44, 3.02, 0.92, 0.97, 0.06, 0.3, 'body2');                           // front endplates

    // wheels: cylinders along y
    function wheel(cx, cy, r, hw, steer) {
      var n = 14, inner = [], outer = [], sign = cy > 0 ? 1 : -1;
      var o = { steer: steer ? [cx, cy] : null, gloss: false };
      for (var k = 0; k < n; k++) {
        var a = k / n * Math.PI * 2;
        var x = cx + Math.cos(a) * r, z = r + Math.sin(a) * r;
        inner.push([x, cy - sign * hw, z]); outer.push([x, cy + sign * hw, z]);
      }
      var ref = [cx, cy, r];
      for (k = 0; k < n; k++) poly([inner[k], inner[(k + 1) % n], outer[(k + 1) % n], outer[k]], 'tyre', ref, o);
      poly(outer, 'tyreSide', ref, o);
      poly(inner, 'tyreSide', ref, o);
      var rim = [], ring = [];
      for (k = 0; k < n; k++) {
        var b = k / n * Math.PI * 2;
        rim.push([cx + Math.cos(b) * r * 0.6, cy + sign * (hw + 0.004), r + Math.sin(b) * r * 0.6]);
        ring.push([cx + Math.cos(b) * r * 0.8, cy + sign * (hw + 0.006), r + Math.sin(b) * r * 0.8]);
      }
      poly(rim, 'rim', ref, { steer: o.steer, bias: 0.3, gloss: false });
      ring.push(ring[0]);
      lines.push({ pts: ring, color: 'compound', width: 0.035, steer: o.steer, bias: 0.4, side: sign });
    }
    wheel(-1.65, 0.83, 0.36, 0.2, false); wheel(-1.65, -0.83, 0.36, 0.2, false);
    wheel(1.85, 0.83, 0.34, 0.155, true); wheel(1.85, -0.83, 0.34, 0.155, true);

    // suspension, halo, spine stripe, driver
    [[[-1.5, 0.2, 0.42], [-1.65, 0.64, 0.45]], [[-1.85, 0.18, 0.3], [-1.65, 0.64, 0.28]],
     [[1.55, 0.2, 0.45], [1.85, 0.68, 0.4]], [[2.05, 0.15, 0.3], [1.85, 0.68, 0.3]], [[1.7, 0.2, 0.25], [1.85, 0.68, 0.22]]]
      .forEach(function (l) {
        lines.push({ pts: l, color: 'carbon', width: 0.035 });
        lines.push({ pts: l.map(function (p) { return [p[0], -p[1], p[2]]; }), color: 'carbon', width: 0.035 });
      });
    lines.push({ pts: [[-0.1, -0.3, 0.9], [0.25, -0.3, 1.0], [0.55, -0.12, 1.03], [0.63, 0, 1.01], [0.55, 0.12, 1.03], [0.25, 0.3, 1.0], [-0.1, 0.3, 0.9]], color: 'halo', width: 0.065, bias: 0.8, shine: true });
    lines.push({ pts: [[0.63, 0, 1.01], [0.86, 0, 0.69]], color: 'halo', width: 0.06, bias: 0.8, shine: true });
    lines.push({ pts: [[-2.2, 0, 0.465], [-1.35, 0, 0.73], [-0.47, 0, 0.9]], color: 'accent', width: 0.05, bias: 0.4 });
    lines.push({ pts: [[0.8, 0, 0.67], [1.7, 0, 0.525], [2.4, 0, 0.365]], color: 'accent', width: 0.05, bias: 0.4 });
    balls.push({ c: [0.1, 0, 0.92], r: 0.14 });

    return { faces: faces, lines: lines, balls: balls };
  }

  /* ======================= ground shader ======================= */
  var VERT = 'attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }';
  var FRAG = [
    '#ifdef GL_FRAGMENT_PRECISION_HIGH',
    'precision highp float;',
    '#else',
    'precision mediump float;',
    '#endif',
    'uniform vec2 uRes; uniform vec2 uCam; uniform float uDir; uniform float uH; uniform float uF; uniform float uHorizon;',
    'uniform sampler2D uTex; uniform vec2 uOrigin; uniform vec2 uSize;',
    'const vec3 SKY_TOP = vec3(0.42, 0.66, 0.86);',
    'const vec3 SKY_LOW = vec3(0.86, 0.90, 0.91);',
    'const vec3 HILL = vec3(0.42, 0.52, 0.60);',
    'const vec3 VOLCANO = vec3(0.33, 0.40, 0.47);',
    'float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }',
    'float wrapA(float a){ return mod(a + 3.14159265, 6.2831853) - 3.14159265; }',
    'float cone(float az, float c, float w, float h){ return min(h * 0.9, h * (1.0 - abs(wrapA(az - c)) / w)); }',
    'void main(){',
    '  vec2 px = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y);',
    '  float dx = px.x - uRes.x * 0.5;',
    '  float dy = px.y - uHorizon;',
    '  if (dy < 0.5) {',
    '    float az = uDir + atan(dx / uF);',
    '    float el = -dy / uF;',
    '    vec3 col = mix(SKY_LOW, SKY_TOP, smoothstep(0.0, 0.5, el));',
    '    float ridge = 0.034 + 0.014 * sin(az * 3.0 + 1.3) + 0.008 * sin(az * 7.0 + 0.4) + 0.004 * sin(az * 17.0 + 2.0);',
    '    float v = max(cone(az, -1.9, 0.36, 0.16), cone(az, -1.3, 0.28, 0.11));',
    '    v = max(v, max(cone(az, 1.25, 0.32, 0.13), cone(az, 2.6, 0.3, 0.1)));',
    '    if (el < ridge) col = mix(HILL, SKY_LOW, 0.45);',
    '    if (el < v) col = mix(VOLCANO, SKY_LOW, 0.25 + 0.25 * (el / max(v, 0.001)));',
    '    gl_FragColor = vec4(col, 1.0);',
    '    return;',
    '  }',
    '  float z = uH * uF / dy;',
    '  float x = dx * z / uF;',
    '  vec2 fwd = vec2(cos(uDir), sin(uDir));',
    '  vec2 right = vec2(-fwd.y, fwd.x);',
    '  vec2 w = uCam + fwd * z + right * x;',
    '  vec2 uv = (w - uOrigin) / uSize;',
    '  vec3 col = vec3(0.29, 0.54, 0.23);',
    '  if (uv.x > 0.0 && uv.y > 0.0 && uv.x < 1.0 && uv.y < 1.0) col = texture2D(uTex, uv).rgb;',
    '  float near = 1.0 - smoothstep(350.0, 1300.0, z);',
    '  bool grass = col.g > col.r + 0.06 && col.g > col.b + 0.06;',
    '  if (grass) col *= 1.0 + near * 0.07 * (step(0.5, fract((w.x + w.y * 0.35) / 150.0)) * 2.0 - 1.0);',
    '  col *= 1.0 + near * 0.05 * (hash(floor(w * 0.7)) - 0.5);',
    '  float fog = smoothstep(700.0, 3600.0, z);',
    '  gl_FragColor = vec4(mix(col, SKY_LOW, fog * 0.9), 1.0);',
    '}'
  ].join('\n');

  function compile(gl, type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  }

  /* ======================= offscreen art ======================= */
  function canvas(w, h) { var c = document.createElement('canvas'); c.width = w; c.height = h; return c; }

  function drawGround(track, SCALE, HALF, big) {
    var pts = [];
    for (var i = 0; i <= 200; i++) { var p = track.pointAt(i / 200); pts.push([p.x * SCALE, p.y * SCALE]); }
    var minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    pts.forEach(function (p) { minX = Math.min(minX, p[0]); minY = Math.min(minY, p[1]); maxX = Math.max(maxX, p[0]); maxY = Math.max(maxY, p[1]); });
    var M = 420;
    minX -= M; minY -= M; maxX += M; maxY += M;
    var TW = big ? 4096 : 2048, TH = TW / 2;
    var cv = canvas(TW, TH), g = cv.getContext('2d');
    var sx = TW / (maxX - minX), sy = TH / (maxY - minY);
    var rand = mulberry(404);

    g.fillStyle = '#4A8A3B';
    g.fillRect(0, 0, TW, TH);
    g.setTransform(sx, 0, 0, sy, -minX * sx, -minY * sy);
    for (i = 0; i < 260; i++) {                       // patches of lighter and darker grass
      g.fillStyle = rand() < 0.5 ? 'rgba(30,70,25,.10)' : 'rgba(150,190,90,.08)';
      g.beginPath(); g.arc(minX + rand() * (maxX - minX), minY + rand() * (maxY - minY), 60 + rand() * 220, 0, Math.PI * 2); g.fill();
    }
    var path = new Path2D(track.pathD(SCALE));
    g.lineJoin = 'round'; g.lineCap = 'round';
    g.strokeStyle = '#DCD3BF'; g.lineWidth = HALF * 2 + 84; g.stroke(path);     // run-off
    g.strokeStyle = '#C9BFA8'; g.lineWidth = HALF * 2 + 40; g.stroke(path);
    g.strokeStyle = '#F4F2EC'; g.lineWidth = HALF * 2 + 16; g.stroke(path);     // kerbs
    g.lineCap = 'butt'; g.setLineDash([16, 16]); g.strokeStyle = '#D61F26'; g.stroke(path); g.setLineDash([]); g.lineCap = 'round';
    g.strokeStyle = '#3B3C41'; g.lineWidth = HALF * 2; g.stroke(path);         // asphalt
    g.strokeStyle = '#F4F2EC'; g.lineWidth = HALF * 2 - 4; g.stroke(path);     // white edge lines
    g.strokeStyle = '#3C3D42'; g.lineWidth = HALF * 2 - 10; g.stroke(path);
    g.strokeStyle = 'rgba(18,18,22,.16)'; g.lineWidth = 30; g.stroke(path);    // rubbered racing line
    g.strokeStyle = 'rgba(18,18,22,.10)'; g.lineWidth = 14; g.stroke(path);

    // start line and grid boxes
    var a = track.pointAt(0), b = track.pointAt(0.004);
    var ang = Math.atan2(b.y - a.y, b.x - a.x);
    g.save();
    g.translate(a.x * SCALE, a.y * SCALE); g.rotate(ang);
    for (var r = -HALF; r < HALF; r += 8) for (var c = 0; c < 2; c++) {
      g.fillStyle = ((r / 8 + c) & 1) ? '#141414' : '#F4F2EC';
      g.fillRect(c * 8 - 8, r, 8, 8);
    }
    g.restore();
    for (i = 1; i <= 6; i++) {
      var q = track.pointAt(1 - i * 0.012), q2 = track.pointAt(1 - i * 0.012 + 0.003);
      var qa = Math.atan2(q2.y - q.y, q2.x - q.x), side = i % 2 ? -1 : 1;
      g.save();
      g.translate(q.x * SCALE, q.y * SCALE); g.rotate(qa); g.translate(0, side * 22);
      g.strokeStyle = '#F4F2EC'; g.lineWidth = 2.5;
      g.beginPath(); g.moveTo(-14, -12); g.lineTo(0, -12); g.lineTo(0, 12); g.lineTo(-14, 12); g.stroke();
      g.restore();
    }
    return { canvas: cv, origin: [minX, minY], size: [maxX - minX, maxY - minY] };
  }

  function mulberry(seed) {
    return function () {
      seed |= 0; seed = seed + 0x6D2B79F5 | 0;
      var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  function treeSprite(kind) {
    var cv = canvas(160, 240), g = cv.getContext('2d');
    if (kind === 'palm') {
      g.strokeStyle = '#7A5A3A'; g.lineWidth = 12; g.lineCap = 'round';
      g.beginPath(); g.moveTo(80, 236); g.quadraticCurveTo(70, 150, 86, 70); g.stroke();
      g.strokeStyle = 'rgba(0,0,0,.18)'; g.lineWidth = 4;
      for (var y = 220; y > 80; y -= 16) { g.beginPath(); g.moveTo(74, y); g.lineTo(88, y - 3); g.stroke(); }
      var greens = ['#2F6B2A', '#3C8233', '#2A5E26'];
      for (var i = 0; i < 9; i++) {
        var a = -Math.PI / 2 + (i - 4) * 0.42;
        g.strokeStyle = greens[i % 3]; g.lineWidth = 14;
        g.beginPath(); g.moveTo(86, 72);
        g.quadraticCurveTo(86 + Math.cos(a) * 50, 72 + Math.sin(a) * 40 - 10, 86 + Math.cos(a) * 78, 72 + Math.sin(a) * 30 + 34);
        g.stroke();
      }
      return cv;
    }
    g.fillStyle = '#6B4E33'; g.fillRect(72, 150, 16, 90);
    var blobs = [[80, 112, 62, '#2E6A2B'], [52, 130, 40, '#2A5F27'], [110, 128, 42, '#2A5F27'], [80, 72, 46, '#3A7E33'], [62, 100, 30, '#4A9440'], [100, 92, 28, '#4A9440']];
    blobs.forEach(function (b) { g.fillStyle = b[3]; g.beginPath(); g.arc(b[0], b[1], b[2], 0, Math.PI * 2); g.fill(); });
    g.fillStyle = 'rgba(255,255,230,.12)'; g.beginPath(); g.arc(66, 70, 26, 0, Math.PI * 2); g.fill();
    return cv;
  }

  function standSprite(rand) {
    var cv = canvas(480, 170), g = cv.getContext('2d');
    g.fillStyle = '#C9CCD2'; g.fillRect(14, 20, 452, 10);                         // roof
    g.fillStyle = '#9EA3AB'; g.fillRect(20, 30, 6, 136); g.fillRect(454, 30, 6, 136); g.fillRect(237, 30, 6, 136);
    for (var row = 0; row < 8; row++) {
      var y = 40 + row * 15;
      g.fillStyle = row % 2 ? '#6E737C' : '#7D828B'; g.fillRect(26, y, 428, 15);
      for (var x = 30; x < 450; x += 7) {
        if (rand() < 0.82) {
          g.fillStyle = ['#D40000', '#F2C230', '#1F6FE5', '#F7F4EE', '#12A150', '#16171B', '#FF6FAE'][Math.floor(rand() * 7)];
          g.beginPath(); g.arc(x, y + 6, 2.6, 0, Math.PI * 2); g.fill();
        }
      }
    }
    g.fillStyle = '#16171B'; g.fillRect(26, 148, 428, 20);
    g.fillStyle = '#F7F4EE'; g.font = '700 14px "JetBrains Mono", monospace'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText('CIRCUITO 404 · CIRCUITO 404 · CIRCUITO 404', 240, 158);
    return cv;
  }

  function gantrySprite(lit) {
    var cv = canvas(600, 230), g = cv.getContext('2d');
    g.fillStyle = '#2A2B30'; g.fillRect(8, 30, 22, 200); g.fillRect(570, 30, 22, 200);
    g.fillStyle = '#16171B'; g.fillRect(0, 22, 600, 64);
    g.fillStyle = '#0B0C0E'; g.fillRect(210, 30, 180, 48);
    for (var i = 0; i < 5; i++) {
      var on = i < (lit || 0);
      g.shadowColor = on ? '#FF2525' : 'transparent'; g.shadowBlur = on ? 18 : 0;
      g.fillStyle = on ? '#FF2B2B' : '#3A0E10';
      g.beginPath(); g.arc(234 + i * 33, 54, 12, 0, Math.PI * 2); g.fill();
    }
    g.shadowBlur = 0;
    g.fillStyle = '#F7F4EE'; g.font = '900 30px "Big Shoulders Display", "Arial Narrow", sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText('CIRCUITO 404', 108, 56); g.fillText('START · FINISH', 492, 56);
    return cv;
  }

  function boardSprite(label, active) {
    var cv = canvas(160, 220), g = cv.getContext('2d');
    g.fillStyle = '#3A3B40'; g.fillRect(36, 120, 12, 100); g.fillRect(112, 120, 12, 100);
    g.fillStyle = active ? '#F2C230' : '#16171B'; g.fillRect(4, 8, 152, 122);
    g.fillStyle = active ? '#16171B' : '#F7F4EE';
    g.font = '900 78px "Big Shoulders Display", "Arial Narrow", sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(label, 80, 74);
    return cv;
  }

  function dustSprite() {
    var cv = canvas(64, 64), g = cv.getContext('2d');
    var grad = g.createRadialGradient(32, 32, 2, 32, 32, 30);
    grad.addColorStop(0, 'rgba(214,200,170,.55)'); grad.addColorStop(1, 'rgba(214,200,170,0)');
    g.fillStyle = grad; g.fillRect(0, 0, 64, 64);
    return cv;
  }

  /* ======================= scene ======================= */
  function create(opts) {
    var ground = opts.ground, overlay = opts.overlay, track = opts.track, SCALE = opts.scale, HALF = opts.halfWidth;
    var gl;
    try { gl = ground.getContext('webgl', { antialias: false, alpha: false }) || ground.getContext('experimental-webgl'); } catch (e) { gl = null; }
    if (!gl) return null;

    var prog, loc = {}, tex, map;
    try {
      prog = gl.createProgram();
      gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
    } catch (e) { return null; }
    gl.useProgram(prog);
    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var aP = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(aP);
    gl.vertexAttribPointer(aP, 2, gl.FLOAT, false, 0, 0);
    ['uRes', 'uCam', 'uDir', 'uH', 'uF', 'uHorizon', 'uTex', 'uOrigin', 'uSize'].forEach(function (n) { loc[n] = gl.getUniformLocation(prog, n); });

    map = drawGround(track, SCALE, HALF, Math.min(window.innerWidth, window.innerHeight) > 600 && gl.getParameter(gl.MAX_TEXTURE_SIZE) >= 4096);
    tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, map.canvas);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    var aniso = gl.getExtension('EXT_texture_filter_anisotropic') || gl.getExtension('WEBKIT_EXT_texture_filter_anisotropic');
    if (aniso) gl.texParameterf(gl.TEXTURE_2D, aniso.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(8, gl.getParameter(aniso.MAX_TEXTURE_MAX_ANISOTROPY_EXT)));
    map.canvas = null;

    var ctx = overlay.getContext('2d');
    var lost = false;
    ground.addEventListener('webglcontextlost', function (e) { e.preventDefault(); lost = true; });

    /* ---------- props around the circuit ---------- */
    var rand = mulberry(2026);
    var trees = [treeSprite('round'), treeSprite('palm')];
    var props = [];
    var b = { x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity };
    for (var i = 0; i <= 100; i++) { var p = track.pointAt(i / 100); b.x0 = Math.min(b.x0, p.x); b.y0 = Math.min(b.y0, p.y); b.x1 = Math.max(b.x1, p.x); b.y1 = Math.max(b.y1, p.y); }
    for (i = 0; i < 900 && props.length < 170; i++) {
      var tx = b.x0 - 140 + rand() * (b.x1 - b.x0 + 280), ty = b.y0 - 140 + rand() * (b.y1 - b.y0 + 280);
      var d = track.nearest(tx, ty).dist * SCALE;
      if (d < HALF + 130 || d > 560) continue;
      var palm = rand() < 0.35, size = 0.8 + rand() * 0.5;
      props.push({ x: tx * SCALE, y: ty * SCALE, img: trees[palm ? 1 : 0], w: (palm ? 70 : 84) * size, h: (palm ? 112 : 120) * size });
    }
    var start = track.pointAt(0), ahead = track.pointAt(0.004);
    var sa = Math.atan2(ahead.y - start.y, ahead.x - start.x), rx = -Math.sin(sa), ry = Math.cos(sa);
    [-0.03, 0, 0.03].forEach(function (f) {
      var q = track.pointAt((f + 1) % 1);
      props.push({ x: q.x * SCALE + rx * (HALF + 150), y: q.y * SCALE + ry * (HALF + 150), img: standSprite(rand), w: 280, h: 100 });
    });
    var gantryImgs = [0, 1, 2, 3, 4, 5].map(gantrySprite);               // start lights: 0–5 lit
    props.push({ x: start.x * SCALE, y: start.y * SCALE, img: gantryImgs[0], w: HALF * 2 + 64, h: 66, gantry: true });
    var boards = track.CORNERS.slice(1).map(function (c) {
      var p0 = track.pointAt((c.fraction + 0.99) % 1), p1 = track.pointAt((c.fraction + 0.01) % 1), pc = track.pointAt(c.fraction);
      var ix = (p0.x + p1.x) / 2 - pc.x, iy = (p0.y + p1.y) / 2 - pc.y, l = Math.hypot(ix, iy) || 1;
      var ox = -ix / l, oy = -iy / l;
      var item = { id: c.id, x: pc.x * SCALE + ox * (HALF + 46), y: pc.y * SCALE + oy * (HALF + 46), img: boardSprite(c.id, false), on: boardSprite(c.id, true), w: 30, h: 42 };
      props.push(item);
      return item;
    });
    var dustImg = dustSprite(), dust = [];
    var minimap = new Path2D(track.pathD(1));
    var model = buildCar();
    var cam = { x: 0, y: 0, dir: null, h: CAM.height, f: 1, cx: 0, hy: 0 };
    var W = 1, H = 1, dpr = 1, palette = {}, items = [];

    function resize(w, h, ratio) {
      W = w; H = h; dpr = ratio;
      ground.width = w; ground.height = h;
      overlay.width = w; overlay.height = h;
      gl.viewport(0, 0, w, h);
    }

    function setColors(c) {
      palette = {
        body: parseColor(c.body, [212, 0, 0]), body2: parseColor(c.body2, [22, 23, 27]), accent: parseColor(c.accent, [247, 244, 238]),
        ui: parseColor(c.ui, [212, 0, 0]),
        carbon: [26, 27, 31], dark: [11, 12, 14], tyre: [22, 23, 26], tyreSide: [30, 31, 35], rim: [52, 54, 60], halo: [40, 42, 47],
        light: [255, 46, 46], compound: [242, 194, 48]
      };
    }

    var SUN = norm([-0.35, -0.45, 0.82]);

    function carToWorld(car, steerAngle, p, pivot) {
      var x = p[0], y = p[1];
      if (pivot) {
        var cs = Math.cos(steerAngle), sn = Math.sin(steerAngle), lx = x - pivot[0], ly = y - pivot[1];
        x = pivot[0] + lx * cs - ly * sn; y = pivot[1] + lx * sn + ly * cs;
      }
      var c = Math.cos(car.heading), s = Math.sin(car.heading);
      return [car.x + (x * c - y * s) * K, car.y + (x * s + y * c) * K, p[2] * K];
    }
    function rotN(car, steerAngle, n, pivot) {
      var x = n[0], y = n[1];
      if (pivot) { var cs = Math.cos(steerAngle), sn = Math.sin(steerAngle); var t = x * cs - y * sn; y = x * sn + y * cs; x = t; }
      var c = Math.cos(car.heading), s = Math.sin(car.heading);
      return [x * c - y * s, x * s + y * c, n[2]];
    }

    function pushCar(car, steerAngle, braking) {
      var eye = [cam.x, cam.y, cam.h];
      model.faces.forEach(function (f) {
        var wp = f.pts.map(function (p) { return carToWorld(car, steerAngle, p, f.steer); });
        var wc = carToWorld(car, steerAngle, f.c, f.steer);
        var n = rotN(car, steerAngle, f.n, f.steer);
        var v = norm(sub(eye, wc));
        if (dot(n, v) <= 0.01) return;
        var sp = [];
        for (var i = 0; i < wp.length; i++) { var q = project(cam, wp[i][0], wp[i][1], wp[i][2]); if (!q) return; sp.push(q); }
        var base = palette[f.color] || [255, 0, 255], fill;
        if (f.emissive) fill = f.color === 'light' && !braking ? rgb(base, 0.45) : rgb(base, 1, 30);
        else {
          var lit = 0.48 + 0.52 * Math.max(0, dot(n, SUN));
          var spec = 0;
          if (f.gloss) { var hv = norm([SUN[0] + v[0], SUN[1] + v[1], SUN[2] + v[2]]); spec = Math.pow(Math.max(0, dot(n, hv)), 18) * 70; }
          fill = rgb(base, lit, spec);
        }
        var qc = project(cam, wc[0], wc[1], wc[2]);
        items.push({ z: (qc ? qc.z : sp[0].z) - f.bias * K, kind: 'face', pts: sp, fill: fill });
      });
      model.lines.forEach(function (l) {
        if (l.side) {                                                   // wheel rings only on the visible side
          var wcl = carToWorld(car, steerAngle, l.pts[0], l.steer);
          var axis = rotN(car, steerAngle, [0, l.side, 0], l.steer);
          if (dot(axis, norm(sub(eye, wcl))) <= 0.35) return;
        }
        var sp = [], zs = 0;
        for (var i = 0; i < l.pts.length; i++) {
          var w = carToWorld(car, steerAngle, l.pts[i], l.steer), q = project(cam, w[0], w[1], w[2]);
          if (!q) return;
          sp.push(q); zs += q.z;
        }
        items.push({ z: zs / sp.length - (l.bias || 0) * K, kind: 'line', pts: sp, color: palette[l.color], width: l.width * K, shine: l.shine });
      });
      model.balls.forEach(function (bl) {
        var w = carToWorld(car, steerAngle, bl.c, null), q = project(cam, w[0], w[1], w[2]);
        if (q) items.push({ z: q.z - 0.5 * K, kind: 'helmet', p: q, r: bl.r * K * q.k });
      });
      // shadow on the ground
      var sh = [[-2.55, -1.0], [3.0, -1.0], [3.0, 1.0], [-2.55, 1.0]].map(function (p) { var w = carToWorld(car, 0, [p[0], p[1], 0], null); return project(cam, w[0], w[1], 0); });
      if (sh.every(Boolean)) items.push({ z: Infinity, kind: 'shadow', pts: sh, after: true });
    }

    function drawItem(it) {
      var i;
      if (it.kind === 'face') {
        ctx.beginPath(); ctx.moveTo(it.pts[0].x, it.pts[0].y);
        for (i = 1; i < it.pts.length; i++) ctx.lineTo(it.pts[i].x, it.pts[i].y);
        ctx.closePath();
        ctx.fillStyle = it.fill; ctx.fill();
        ctx.strokeStyle = it.fill; ctx.lineWidth = 0.8; ctx.stroke();            // hide hairline seams
      } else if (it.kind === 'line') {
        ctx.beginPath(); ctx.moveTo(it.pts[0].x, it.pts[0].y);
        for (i = 1; i < it.pts.length; i++) ctx.lineTo(it.pts[i].x, it.pts[i].y);
        var wpx = Math.max(1, it.width * it.pts[0].k);
        ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        ctx.strokeStyle = rgb(it.color, 1); ctx.lineWidth = wpx; ctx.stroke();
        if (it.shine) { ctx.strokeStyle = 'rgba(255,255,255,.28)'; ctx.lineWidth = wpx * 0.35; ctx.stroke(); }
      } else if (it.kind === 'helmet') {
        var p = it.p, r = it.r;
        ctx.fillStyle = rgb(palette.accent, 0.95); ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = rgb(palette.body, 1); ctx.beginPath(); ctx.arc(p.x, p.y, r, Math.PI * 1.05, Math.PI * 1.95); ctx.lineTo(p.x, p.y - r * 0.2); ctx.fill();
        var gr = ctx.createRadialGradient(p.x - r * 0.35, p.y - r * 0.4, r * 0.1, p.x, p.y, r);
        gr.addColorStop(0, 'rgba(255,255,255,.55)'); gr.addColorStop(1, 'rgba(0,0,0,.25)');
        ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI * 2); ctx.fill();
      } else if (it.kind === 'shadow') {
        ctx.beginPath(); ctx.moveTo(it.pts[0].x, it.pts[0].y);
        for (i = 1; i < 4; i++) ctx.lineTo(it.pts[i].x, it.pts[i].y);
        ctx.closePath();
        ctx.fillStyle = 'rgba(0,0,0,.30)'; ctx.fill();
        ctx.strokeStyle = 'rgba(0,0,0,.14)'; ctx.lineWidth = 1.6 * it.pts[2].k; ctx.lineJoin = 'round'; ctx.stroke();
      } else if (it.kind === 'sprite') {
        ctx.globalAlpha = it.alpha;
        ctx.drawImage(it.img, it.x, it.y, it.w, it.h);
        ctx.globalAlpha = 1;
      }
    }

    function drawMinimap(car, cps, next) {
      var mw = Math.min(190 * dpr, W * 0.3), mh = mw * 0.62, m = 12 * dpr;
      var x0 = W - mw - m, y0 = m;
      ctx.fillStyle = 'rgba(18,19,22,.62)';
      ctx.fillRect(x0, y0, mw, mh);
      var s = (mw - 16 * dpr) / 1000;
      ctx.save();
      ctx.translate(x0 + 8 * dpr, y0 + (mh - 620 * s) / 2);
      ctx.scale(s, s);
      ctx.strokeStyle = 'rgba(247,244,238,.85)'; ctx.lineWidth = 18; ctx.lineJoin = 'round';
      ctx.stroke(minimap);
      cps.forEach(function (c, i) {
        ctx.fillStyle = i === next ? '#F2C230' : (i < next ? rgb(palette.ui, 1) : '#6C6E76');
        ctx.beginPath(); ctx.arc(c.point[0], c.point[1], i === next ? 30 : 20, 0, Math.PI * 2); ctx.fill();
      });
      ctx.fillStyle = rgb(palette.ui, 1); ctx.strokeStyle = '#F7F4EE'; ctx.lineWidth = 8;
      ctx.beginPath(); ctx.arc(car.x / SCALE, car.y / SCALE, 26, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.restore();
    }

    /** state: { car, lap, cps, keys, dt, now, reduceMotion } */
    function render(st) {
      if (lost) return false;
      var car = st.car, dt = st.dt || 0;
      var ratio = Math.max(0, car.speed) / 620;
      follow(cam, car, dt, ratio);
      var f0 = Math.min(1.25 * H, 1.25 * W);
      cam.f = f0 * (1 - 0.1 * ratio);                                   // a slightly wider view at speed
      cam.cx = W / 2;
      // keep the car near the bottom of the frame on wide and on tall (phone) screens
      var contact = f0 * CAM.height / (CAM.behind - 18);
      cam.hy = Math.max(0.3 * H, Math.min(0.5 * H, 0.82 * H - contact));
      if (car.offTrack && !st.reduceMotion && Math.abs(car.speed) > 40) cam.hy += Math.sin(st.now * 0.06) * 2 * dpr;

      gl.uniform2f(loc.uRes, W, H);
      gl.uniform2f(loc.uCam, cam.x, cam.y);
      gl.uniform1f(loc.uDir, cam.dir);
      gl.uniform1f(loc.uH, cam.h);
      gl.uniform1f(loc.uF, cam.f);
      gl.uniform1f(loc.uHorizon, cam.hy);
      gl.uniform2f(loc.uOrigin, map.origin[0], map.origin[1]);
      gl.uniform2f(loc.uSize, map.size[0], map.size[1]);
      gl.uniform1i(loc.uTex, 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, W, H);
      items.length = 0;

      var next = st.lap && st.lap.startedAt != null ? st.lap.next : 0;
      props.forEach(function (pr) {
        var q = project(cam, pr.x, pr.y, 0);
        if (!q || q.z > 4200) return;
        var w = pr.w * q.k, h = pr.h * q.k;
        if (q.x + w / 2 < 0 || q.x - w / 2 > W) return;
        var img = pr.gantry ? gantryImgs[st.lamps || 0] : (pr.on && boards.indexOf(pr) === next ? pr.on : pr.img);
        items.push({ z: q.z, kind: 'sprite', img: img, x: q.x - w / 2, y: q.y - h, w: w, h: h, alpha: 1 - 0.75 * Math.min(1, Math.max(0, (q.z - 700) / 2900)) });
      });

      // dust when running wide
      if (car.offTrack && Math.abs(car.speed) > 60 && !st.reduceMotion) {
        for (var s = -1; s <= 1; s += 2) {
          var wpos = carToWorld(car, 0, [-1.9, s * 0.85, 0.2], null);
          dust.push({ x: wpos[0], y: wpos[1], z: 2, vz: 14 + Math.random() * 10, life: 0, max: 0.7 + Math.random() * 0.4 });
        }
      }
      dust = dust.filter(function (d) { d.life += dt; d.z += d.vz * dt; return d.life < d.max; });
      dust.forEach(function (d) {
        var q = project(cam, d.x, d.y, d.z);
        if (!q) return;
        var size = (10 + d.life * 40) * q.k;
        items.push({ z: q.z, kind: 'sprite', img: dustImg, x: q.x - size / 2, y: q.y - size / 2, w: size, h: size, alpha: 1 - d.life / d.max });
      });

      var steerAngle = ((st.keys.right ? 1 : 0) - (st.keys.left ? 1 : 0)) * 0.32;
      pushCar(car, steerAngle, !!st.keys.down && car.speed > 5);
      items.sort(function (a, b) { return b.z - a.z; });
      var shadow = null;
      for (var i = 0; i < items.length; i++) { if (items[i].kind === 'shadow') { shadow = items[i]; break; } }
      // the car's shadow goes right before the car's own polygons
      var firstCar = -1;
      for (i = 0; i < items.length; i++) { var k = items[i].kind; if (k === 'face' || k === 'line' || k === 'helmet') { firstCar = i; break; } }
      items.forEach(function (it, idx) {
        if (idx === firstCar && shadow) drawItem(shadow);
        if (it.kind !== 'shadow') drawItem(it);
      });

      drawMinimap(car, st.cps, next);
      return true;
    }

    function reset() { cam.dir = null; dust = []; }

    return { resize: resize, render: render, setColors: setColors, reset: reset };
  }

  root.C404 = root.C404 || {};
  root.C404.scene = { create: create, project: project, follow: follow, wrapAngle: wrapAngle, drawGround: drawGround };
})(typeof window !== 'undefined' ? window : globalThis);
