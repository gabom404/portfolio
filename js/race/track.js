/**
 * track.js — "Circuito 404", an original circuit layout.
 * Shared by the scroll navigator (minimap) and the lap game.
 *
 * The layout is a closed Catmull-Rom spline through CONTROL points
 * in a 1000 × 620 box. Everything here is pure geometry (no DOM),
 * so it can be unit-tested in Node.
 */
(function (root) {
  'use strict';

  var CONTROL = [
    [180, 540], [520, 548], [790, 530], [900, 470], [912, 360], [838, 296],
    [700, 298], [636, 236], [700, 168], [858, 140], [884, 80], [760, 48],
    [480, 60], [300, 88], [258, 180], [372, 248], [398, 338], [262, 384],
    [112, 420], [96, 500]
  ];

  /* Corner markers: id, index of the control point it sits on, and the section it opens. */
  var CORNERS = [
    { id: 'T1', at: 0, section: 'parrilla', key: 'nav.grid' },
    { id: 'T2', at: 3, section: 'piloto', key: 'nav.driver' },
    { id: 'T3', at: 6, section: 'setup', key: 'nav.setup' },
    { id: 'T4', at: 9, section: 'garaje', key: 'nav.garage' },
    { id: 'T5', at: 12, section: 'historial', key: 'nav.history' },
    { id: 'T6', at: 15, section: 'estrategia', key: 'nav.strategy' },
    { id: 'T7', at: 18, section: 'radio', key: 'nav.radio' }
  ];

  function wrap(i, n) { return ((i % n) + n) % n; }

  /* Bezier control points for span i (from point i to i+1) of the closed spline. */
  function span(points, i) {
    var n = points.length;
    var p0 = points[wrap(i - 1, n)], p1 = points[i], p2 = points[wrap(i + 1, n)], p3 = points[wrap(i + 2, n)];
    return [
      p1,
      [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6],
      [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6],
      p2
    ];
  }

  function cubic(s, t) {
    var u = 1 - t, a = u * u * u, b = 3 * u * u * t, c = 3 * u * t * t, d = t * t * t;
    return [a * s[0][0] + b * s[1][0] + c * s[2][0] + d * s[3][0], a * s[0][1] + b * s[1][1] + c * s[2][1] + d * s[3][1]];
  }

  /** SVG path data for the closed track, optionally scaled. */
  function pathD(scale) {
    var k = scale || 1, pts = CONTROL, d = 'M' + (pts[0][0] * k).toFixed(1) + ' ' + (pts[0][1] * k).toFixed(1);
    for (var i = 0; i < pts.length; i++) {
      var s = span(pts, i);
      d += ' C' + [s[1], s[2], s[3]].map(function (p) { return (p[0] * k).toFixed(1) + ' ' + (p[1] * k).toFixed(1); }).join(' ');
    }
    return d + ' Z';
  }

  /** Dense polyline along the track with cumulative arc length. */
  function sample(perSpan) {
    var steps = perSpan || 40, pts = [], len = [0], total = 0, spanStart = [];
    for (var i = 0; i < CONTROL.length; i++) {
      var s = span(CONTROL, i);
      spanStart.push(pts.length);
      for (var j = 0; j < steps; j++) {
        var p = cubic(s, j / steps);
        if (pts.length) { var q = pts[pts.length - 1]; total += Math.hypot(p[0] - q[0], p[1] - q[1]); len.push(total); }
        pts.push(p);
      }
    }
    var first = pts[0], last = pts[pts.length - 1];
    total += Math.hypot(first[0] - last[0], first[1] - last[1]);
    return { points: pts, lengths: len, total: total, spanStart: spanStart, perSpan: steps };
  }

  var SAMPLE = sample(40);

  /** Point and heading at a fraction (0–1) of the lap. */
  function pointAt(fraction) {
    var f = ((fraction % 1) + 1) % 1, target = f * SAMPLE.total, L = SAMPLE.lengths, P = SAMPLE.points;
    var lo = 0, hi = L.length - 1;
    while (lo < hi) { var mid = (lo + hi + 1) >> 1; if (L[mid] <= target) lo = mid; else hi = mid - 1; }
    var a = P[lo], b = P[(lo + 1) % P.length];
    var segLen = (lo + 1 < L.length ? L[lo + 1] : SAMPLE.total) - L[lo] || 1;
    var t = (target - L[lo]) / segLen;
    return { x: a[0] + (b[0] - a[0]) * t, y: a[1] + (b[1] - a[1]) * t, angle: Math.atan2(b[1] - a[1], b[0] - a[0]) };
  }

  /** Fraction of the lap where control point `index` sits. */
  function fractionOfControl(index) {
    return SAMPLE.lengths[SAMPLE.spanStart[index]] / SAMPLE.total;
  }

  /** Nearest point on the centre line to (x, y) in track units. */
  function nearest(x, y) {
    var P = SAMPLE.points, best = Infinity, bi = 0;
    for (var i = 0; i < P.length; i++) {
      var dx = P[i][0] - x, dy = P[i][1] - y, d = dx * dx + dy * dy;
      if (d < best) { best = d; bi = i; }
    }
    return { dist: Math.sqrt(best), index: bi, fraction: SAMPLE.lengths[bi] / SAMPLE.total };
  }

  root.C404 = root.C404 || {};
  root.C404.track = {
    CONTROL: CONTROL,
    CORNERS: CORNERS.map(function (c) { return Object.assign({}, c, { fraction: fractionOfControl(c.at), point: CONTROL[c.at] }); }),
    WIDTH: 640 / 1000 * 70, // reference width used by the game, in track units
    pathD: pathD,
    sample: SAMPLE,
    pointAt: pointAt,
    nearest: nearest,
    length: SAMPLE.total
  };
})(typeof window !== 'undefined' ? window : globalThis);
