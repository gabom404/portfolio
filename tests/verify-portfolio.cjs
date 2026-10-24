/**
 * Integrity checks for the portfolio: files, project data, translations and markup.
 * Run: node tests/verify-portfolio.cjs
 */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const read = (f) => fs.readFileSync(path.join(root, f), "utf8");
let failures = 0;
function check(cond, msg) { if (!cond) { console.error("FAIL:", msg); failures++; } }

/* ---------- files ---------- */
const files = [
  "index.html", "README.md",
  "css/tokens.css", "css/base.css", "css/sections.css", "css/race.css",
  "js/i18n.js", "js/projects-data.js", "js/livery.js", "js/app.js",
  "js/race/track.js", "js/race/lights.js", "js/race/circuit-nav.js", "js/race/pitstop.js", "js/race/drive.js"
];
files.forEach(f => check(fs.existsSync(path.join(root, f)), `missing file ${f}`));
const html = read("index.html");

/* ---------- scripts and styles are linked (drive.js is loaded on demand) ---------- */
["css/tokens.css", "css/base.css", "css/sections.css", "css/race.css"].forEach(f => check(html.includes(`href="${f}"`), `stylesheet not linked: ${f}`));
["js/i18n.js", "js/projects-data.js", "js/race/track.js", "js/livery.js", "js/race/lights.js", "js/race/circuit-nav.js", "js/race/pitstop.js", "js/app.js"]
  .forEach(f => check(html.includes(`src="${f}"`), `script not linked: ${f}`));
check(!html.includes('src="js/race/drive.js"'), "drive.js must load on demand, not up front");
check(read("js/app.js").includes("js/race/drive.js"), "app.js must lazy-load js/race/drive.js");

/* ---------- load data + i18n in a sandbox ---------- */
const ctx = { console };
ctx.globalThis = ctx;
vm.createContext(ctx);
vm.runInContext(read("js/i18n.js"), ctx);
vm.runInContext(read("js/projects-data.js") + ";globalThis.PROJECTS = PROJECTS;", ctx);
vm.runInContext(read("js/race/track.js"), ctx);
const { EN, UI } = ctx.C404.i18n;
const PROJECTS = ctx.PROJECTS;

/* ---------- projects ---------- */
const bilingual = (v) => v && typeof v === "object" && typeof v.es === "string" && v.es && typeof v.en === "string" && v.en;
const textOrBilingual = (v) => (typeof v === "string" && v) || bilingual(v);
const categories = new Set(["backend", "fullstack", "mobile", "python-ai", "frontend"]);
const ids = new Set();
check(PROJECTS.length > 0, "no projects");
PROJECTS.forEach(p => {
  const where = `project ${p.id}`;
  check(p.id && !ids.has(p.id), `${where}: missing or duplicate id`); ids.add(p.id);
  check(categories.has(p.category), `${where}: invalid category ${p.category}`);
  check(textOrBilingual(p.name), `${where}: name`);
  ["title", "tagline", "challenge", "solution"].forEach(k => check(bilingual(p[k]), `${where}: ${k} needs es and en`));
  check(Array.isArray(p.highlights) && p.highlights.length >= 2 && p.highlights.every(bilingual), `${where}: highlights need es and en`);
  check(Array.isArray(p.stack) && p.stack.length > 0, `${where}: stack`);
  if (p.repoUrl === null) check(p.private === true, `${where}: no repo link but not marked private`);
  else check(/^https:\/\/github\.com\/[\w.-]+\/[\w.-]+$/.test(p.repoUrl), `${where}: bad repo url ${p.repoUrl}`);
  // no unverifiable marketing figures
  const copy = ["tagline", "challenge", "solution"].map(k => p[k].es + " " + p[k].en).join(" ") + p.highlights.map(h => h.es + h.en).join(" ");
  check(!/\d+\s*%/.test(copy), `${where}: percentage claim in copy`);
});
check(html.includes(`<b class="tabular">${PROJECTS.length}</b>`), "driver stats must show the real project count");
const work = PROJECTS.filter(p => p.isWorkExperience).map(p => p.id).sort();
check(JSON.stringify(work) === JSON.stringify(["attendance-track", "novapos"]), "work-experience projects changed unexpectedly");
// former employers and clients are not named anywhere on the site
const clientNames = /dipal|empire|barber/i;
["index.html", "js/i18n.js", "js/projects-data.js", "js/app.js", "README.md"].forEach(f => check(!clientNames.test(read(f)), `client name found in ${f}`));

/* ---------- translations ---------- */
const keys = new Set();
for (const m of html.matchAll(/data-i18n(?:-html)?="([^"]+)"/g)) keys.add(m[1]);
for (const m of html.matchAll(/data-i18n-attr="([^"]+)"/g)) m[1].split(";").forEach(pair => keys.add(pair.split(":")[1].trim()));
keys.forEach(k => check(k in EN, `missing English text for "${k}"`));
Object.keys(UI.es).forEach(k => check(k in UI.en, `UI string "${k}" has no English version`));
Object.keys(UI.en).forEach(k => check(k in UI.es, `UI string "${k}" has no Spanish version`));
ctx.C404.track.CORNERS.forEach(c => check(c.key in EN, `corner label ${c.key} missing in English`));
console.log(`Checked ${keys.size} translated strings and ${Object.keys(UI.es).length} script strings.`);

/* ---------- sections = circuit corners ---------- */
ctx.C404.track.CORNERS.forEach(c => {
  check(html.includes(`id="${c.section}"`), `section #${c.section} missing`);
  check(new RegExp(`id="${c.section}"[^>]*data-corner="${c.id}"`).test(html), `section #${c.section} must be corner ${c.id}`);
});

/* ---------- markup hygiene ---------- */
const idList = [...html.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]);
const dupes = idList.filter((id, i) => idList.indexOf(id) !== i);
check(dupes.length === 0, `duplicate ids: ${[...new Set(dupes)].join(", ")}`);
check(/<html lang="es">/.test(html), "html lang must default to es");
check(html.includes('property="og:title"'), "Open Graph tags missing");
const emoji = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}]/u;
["index.html", "js/app.js", "js/i18n.js", "js/projects-data.js", "README.md"].forEach(f => check(!emoji.test(read(f)), `emoji found in ${f}`));
// nothing official from real motorsport brands
const brands = /\b(Formula ?1|F1®|FIA|Ferrari|Mercedes|Red Bull|McLaren|Pirelli|Petronas)\b/i;
["index.html", "js/i18n.js", "js/projects-data.js"].forEach(f => check(!brands.test(read(f)), `real motorsport brand mentioned in ${f}`));

/* ---------- README ---------- */
const readme = read("README.md");
["js/race/drive.js", "js/race/circuit-nav.js", "tests/race-logic.cjs"].forEach(f => check(readme.includes(f), `README should mention ${f}`));

if (failures) { console.error(`\n${failures} check(s) failed.`); process.exit(1); }
console.log("All portfolio checks passed.");
