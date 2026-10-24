/**
 * Unit tests for the pure logic in js/race/*.js (no browser needed).
 * Run: node tests/race-logic.cjs
 */
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const assert = require("assert");

const root = path.resolve(__dirname, "..");
const ctx = { Math, console };
ctx.globalThis = ctx;
vm.createContext(ctx);
for (const f of ["js/race/track.js", "js/race/lights.js", "js/race/pitstop.js", "js/race/circuit-nav.js", "js/race/drive.js", "js/race/scene.js", "js/race/visitors.js"]) {
  vm.runInContext(fs.readFileSync(path.join(root, f), "utf8"), ctx, { filename: f });
}
const { track, lights, pitstop, circuitNav, drive, scene, visitors } = ctx.C404;

let passed = 0;
function test(name, fn) { fn(); passed++; console.log("ok -", name); }

/* ---------- track ---------- */
test("track is a closed loop with 7 corners in lap order", () => {
  assert.strictEqual(track.CORNERS.length, 7);
  const fr = track.CORNERS.map(c => c.fraction);
  assert.strictEqual(fr[0], 0);
  for (let i = 1; i < fr.length; i++) assert.ok(fr[i] > fr[i - 1], "corners must be in lap order");
  const a = track.pointAt(0), b = track.pointAt(0.99999);
  assert.ok(Math.hypot(a.x - b.x, a.y - b.y) < 2, "start and end must meet");
});
test("nearest() finds points on the centre line", () => {
  const p = track.pointAt(0.42);
  const n = track.nearest(p.x, p.y);
  assert.ok(n.dist < 3);
  assert.ok(Math.abs(n.fraction - 0.42) < 0.01);
});

/* ---------- start lights ---------- */
test("hold time is between 0.2 and 3 seconds", () => {
  assert.strictEqual(lights.randomHold(0), 200);
  assert.strictEqual(lights.randomHold(1), 3000);
});
test("pressing before lights out is a jump start", () => {
  assert.deepStrictEqual({ ...lights.evaluate(null, 500) }, { jump: true, ms: null });
  assert.deepStrictEqual({ ...lights.evaluate(1000, 900) }, { jump: true, ms: null });
});
test("reaction time is measured in whole milliseconds", () => {
  assert.deepStrictEqual({ ...lights.evaluate(1000, 1234.6) }, { jump: false, ms: 235 });
});
test("best reaction keeps the lowest time", () => {
  assert.strictEqual(lights.bestOf(null, 300), 300);
  assert.strictEqual(lights.bestOf(250, 300), 250);
  assert.strictEqual(lights.bestOf(250, 200), 200);
  assert.strictEqual(lights.bestOf(250, null), 250);
});

/* ---------- pit stop ---------- */
test("shuffle keeps all four tyres", () => {
  const s = pitstop.shuffle([0, 1, 2, 3], () => 0.3);
  assert.deepStrictEqual([...s].sort(), [0, 1, 2, 3]);
});
test("tyres must be changed in the lit order; mistakes add one second", () => {
  const stop = pitstop.createStop([2, 0, 3, 1], 0);
  assert.strictEqual(pitstop.press(stop, 0, 100).ok, false);   // wrong tyre
  assert.strictEqual(pitstop.press(stop, 2, 200).ok, true);
  assert.strictEqual(pitstop.press(stop, 0, 300).ok, true);
  assert.strictEqual(pitstop.press(stop, 3, 400).ok, true);
  const r = pitstop.press(stop, 1, 2500);
  assert.strictEqual(r.done, true);
  assert.strictEqual(r.time, 2.5 + pitstop.PENALTY_S);
});

/* ---------- circuit navigator ---------- */
test("scroll position maps to a lap fraction between corners", () => {
  const bounds = [{ top: 0, bottom: 100 }, { top: 100, bottom: 300 }, { top: 300, bottom: 400 }];
  const fr = [0, 0.4, 0.8];
  assert.deepStrictEqual({ ...circuitNav.lapPosition(bounds, fr, -50) }, { fraction: 0, index: 0 });
  const mid = circuitNav.lapPosition(bounds, fr, 200);
  assert.strictEqual(mid.index, 1);
  assert.ok(Math.abs(mid.fraction - 0.6) < 1e-9);
  const last = circuitNav.lapPosition(bounds, fr, 350);
  assert.strictEqual(last.index, 2);
  assert.ok(Math.abs(last.fraction - 0.9) < 1e-9);
});

/* ---------- lap game ---------- */
test("throttle accelerates and the car never exceeds top speed", () => {
  let s = { x: 0, y: 0, vx: 0, vy: 0, heading: 0, speed: 0 };
  for (let i = 0; i < 600; i++) s = drive.stepCar(s, { up: true }, 1 / 60, true);
  assert.ok(s.speed > 400 && s.speed <= drive.constants.MAX_SPEED + 1e-6);
  assert.ok(s.x > 0 && Math.abs(s.y) < 1e-6, "drives straight along its heading");
});
test("going off track slows the car down", () => {
  let s = { x: 0, y: 0, vx: 600, vy: 0, heading: 0, speed: 600 };
  for (let i = 0; i < 120; i++) s = drive.stepCar(s, { up: true }, 1 / 60, false);
  assert.ok(s.speed < 260);
});
test("steering turns the car only while it is moving", () => {
  let still = drive.stepCar({ x: 0, y: 0, vx: 0, vy: 0, heading: 0, speed: 0 }, { right: true }, 0.1, true);
  assert.strictEqual(still.heading, 0);
  let moving = drive.stepCar({ x: 0, y: 0, vx: 300, vy: 0, heading: 0, speed: 300 }, { right: true }, 0.1, true);
  assert.ok(moving.heading > 0);
});
test("a lap only counts after every checkpoint, in order", () => {
  const lap = drive.createLap(3);
  drive.startLap(lap, 1000);
  assert.strictEqual(drive.hitCheckpoint(lap, 1), false, "out of order");
  assert.strictEqual(drive.crossLine(lap, 5000), null, "no checkpoints yet");
  [0, 1, 2].forEach(i => assert.strictEqual(drive.hitCheckpoint(lap, i), true));
  assert.strictEqual(drive.crossLine(lap, 62345), 61345);
  assert.strictEqual(lap.best, 61345);
  assert.strictEqual(drive.formatLap(61345), "1:01.345");
});

test("the circuit can be driven clean: a simple autopilot finishes a lap on track", () => {
  const { SCALE, HALF_WIDTH } = drive.constants;
  const p = track.pointAt(0.985), q = track.pointAt(0);
  let car = { x: p.x * SCALE, y: p.y * SCALE, vx: 0, vy: 0, heading: Math.atan2(q.y - p.y, q.x - p.x), speed: 0 };
  const cps = track.CORNERS.slice(1).map(c => ({ x: c.point[0] * SCALE, y: c.point[1] * SCALE }));
  const start = { x: q.x * SCALE, y: q.y * SCALE };
  const lap = drive.createLap(cps.length);
  const dt = 1 / 60;
  let now = 0, off = 0, frames = 0, time = null;
  while (time == null && frames < 60 * 120) {
    frames++; now += dt * 1000;
    const near = track.nearest(car.x / SCALE, car.y / SCALE);
    const onTrack = near.dist * SCALE <= HALF_WIDTH;
    if (!onTrack) off++;
    const aim = track.pointAt((near.fraction + 0.02) % 1);
    let d = Math.atan2(aim.y * SCALE - car.y, aim.x * SCALE - car.x) - car.heading;
    while (d > Math.PI) d -= 2 * Math.PI;
    while (d < -Math.PI) d += 2 * Math.PI;
    const slow = Math.abs(d) >= 0.25;
    car = drive.stepCar(car, { up: !slow || car.speed < 200, down: slow && car.speed > 260, right: d > 0.03, left: d < -0.03 }, dt, onTrack);
    if (lap.startedAt == null && Math.abs(car.speed) > 5) drive.startLap(lap, now);
    const c = cps[lap.next];
    if (c && Math.hypot(car.x - c.x, car.y - c.y) < HALF_WIDTH * 2.2) drive.hitCheckpoint(lap, lap.next);
    if (lap.next >= cps.length && Math.hypot(car.x - start.x, car.y - start.y) < HALF_WIDTH * 1.6) time = drive.crossLine(lap, now);
  }
  assert.ok(time != null, "the lap should finish within two minutes");
  assert.ok(off / frames < 0.05, "the racing line should stay on the asphalt");
});

test("game start: five lights one by one, then lights out after the hold", () => {
  const st = drive.createStart(0, 1000);
  assert.strictEqual(drive.lampsAt(st, 100), 0, "short pause before the first light");
  assert.strictEqual(drive.lampsAt(st, 650), 1);
  assert.strictEqual(drive.lampsAt(st, 650 + 700 * 4), 5);
  assert.strictEqual(drive.lampsAt(st, st.outAt - 1), 5, "all five stay on during the hold");
  assert.strictEqual(drive.lampsAt(st, st.outAt), 0, "lights out");
  assert.strictEqual(st.outAt, 600 + 5 * 700 + 1000);
});
test("a jump start adds the penalty to that lap only", () => {
  const lap = drive.createLap(1);
  drive.startLap(lap, 0);
  lap.penalty = drive.JUMP_PENALTY;
  drive.hitCheckpoint(lap, 0);
  assert.strictEqual(drive.crossLine(lap, 30000), 31000);
  drive.hitCheckpoint(lap, 0);
  assert.strictEqual(drive.crossLine(lap, 59000), 29000, "next lap has no penalty");
  assert.strictEqual(lap.best, 29000);
});

/* ---------- entry form ---------- */
test("names: real first and last names pass", () => {
  ["Gabriel Martínez", "María José López", "Ana O'Neil", "Jean-Luc Picard", "Lucía de la Cruz", "Li Na", "Óscar Núñez"]
    .forEach(n => assert.strictEqual(visitors.checkName(n), null, n));
});
test("names: placeholders, single words and keyboard mashes are rejected", () => {
  const cases = { "user": "visit.err.length", "Gabriel": "visit.err.surname", "Test User": "visit.err.fake", "Usuario Prueba": "visit.err.fake",
    "asdf qwerty": "visit.err.fake", "Sdfg Hjkl": "visit.err.fake", "Aaaa Bbbb": "visit.err.fake", "Juan Juan": "visit.err.fake",
    "Juan123 Pérez": "visit.err.chars", "@gabo dev": "visit.err.chars", "   ": "visit.err.length", "Admin Gabriel": "visit.err.fake" };
  Object.entries(cases).forEach(([n, err]) => assert.strictEqual(visitors.checkName(n), err, n));
});
test("names are tidied before saving", () => {
  assert.strictEqual(visitors.tidy("  maría   josé  LÓPEZ "), "María José López");
  assert.strictEqual(visitors.tidy("jean-luc picard"), "Jean-Luc Picard");
});
test("Firestore fields use the REST value types", () => {
  const f = visitors.toFields({ nombre: "Ana Pérez", tiempoMs: 45004.4, salidaEnFalso: false, fecha: new Date("2026-10-24T12:00:00Z") }).fields;
  assert.deepStrictEqual({ ...f.nombre }, { stringValue: "Ana Pérez" });
  assert.deepStrictEqual({ ...f.tiempoMs }, { integerValue: "45004" });
  assert.deepStrictEqual({ ...f.salidaEnFalso }, { booleanValue: false });
  assert.deepStrictEqual({ ...f.fecha }, { timestampValue: "2026-10-24T12:00:00.000Z" });
});

/* ---------- 2.5D camera ---------- */
test("chase camera: points ahead project below the horizon, nearer points lower and bigger", () => {
  const cam = { x: 0, y: 0, dir: 0, h: 30, f: 500, cx: 400, hy: 200 };
  const far = scene.project(cam, 600, 0, 0), near = scene.project(cam, 100, 0, 0);
  assert.strictEqual(far.x, 400);
  assert.ok(Math.abs(far.y - (200 + 30 * 500 / 600)) < 1e-9);
  assert.ok(near.y > far.y && near.k > far.k);
  assert.strictEqual(scene.project(cam, -50, 0, 0), null, "behind the camera is not drawn");
  assert.ok(scene.project(cam, 100, 20, 0).x > 400, "+y is to the right when looking along +x");
  assert.ok(scene.project(cam, 100, 0, 30).y === 200, "a point at camera height sits on the horizon");
});
test("chase camera stays behind the car and follows its heading with a lag", () => {
  const cam = { dir: null };
  scene.follow(cam, { x: 100, y: 50, heading: 0 }, 1 / 60, 0);
  assert.ok(cam.x < 100 && Math.abs(cam.y - 50) < 1e-9);
  scene.follow(cam, { x: 100, y: 50, heading: 1 }, 1 / 60, 0);
  assert.ok(cam.dir > 0 && cam.dir < 1, "turns part of the way each frame");
  assert.ok(Math.abs(scene.wrapAngle(Math.PI * 3) - Math.PI) < 1e-9);
});

console.log(`\n${passed} race-logic tests passed.`);
