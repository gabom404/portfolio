const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
console.log("Checking portfolio files in:", root);

const requiredFiles = [
    "index.html",
    "css/style.css",
    "js/projects-data.js",
    "js/app.js",
    "js/f1-racer.js"
];

let allExist = true;
for (const f of requiredFiles) {
    const full = path.join(root, f);
    if (!fs.existsSync(full)) {
        console.error("Missing file:", f);
        allExist = false;
    }
}

if (!allExist) {
    process.exit(1);
}

const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const dataCode = fs.readFileSync(path.join(root, "js/projects-data.js"), "utf8");

const fn = new Function(dataCode + "; return PROJECTS;");
const projects = fn();

console.log(`Loaded ${projects.length} projects.`);
if (projects.length === 0) {
    console.error("No projects found");
    process.exit(1);
}

const categories = new Set(["backend", "fullstack", "mobile", "python-ai", "frontend"]);
const ids = new Set();
for (const p of projects) {
    for (const field of ["id", "title", "category", "categoryLabel", "tagline", "challenge", "solution"]) {
        if (!p[field]) {
            console.error(`Project missing "${field}":`, p.id || p.title);
            process.exit(1);
        }
    }
    if (ids.has(p.id)) {
        console.error("Duplicate project id:", p.id);
        process.exit(1);
    }
    ids.add(p.id);
    if (!categories.has(p.category)) {
        console.error("Invalid category:", p.category, "in", p.title);
        process.exit(1);
    }
    if (!Array.isArray(p.highlights) || p.highlights.length === 0 || !Array.isArray(p.stack) || p.stack.length === 0) {
        console.error("Project needs highlights and stack:", p.title);
        process.exit(1);
    }
    if (p.repoUrl === null && !p.private) {
        console.error("Project without repoUrl must be marked private:", p.title);
        process.exit(1);
    }
    if (p.repoUrl && !/^https:\/\/github\.com\/[\w.-]+\/[\w.-]+$/.test(p.repoUrl)) {
        console.error("Invalid GitHub repo URL:", p.repoUrl);
        process.exit(1);
    }
}

// Unverifiable marketing figures are not allowed in project copy
const percentPattern = /\d+\s*%/;
for (const p of projects) {
    const text = [p.tagline, p.challenge, p.solution, ...p.highlights].join(" ");
    if (percentPattern.test(text)) {
        console.error("Percentage claim found in project copy:", p.title);
        process.exit(1);
    }
}

console.log(`All ${projects.length} projects validated.`);

const idsToCheck = [
    "filter-tabs",
    "projects-grid",
    "skills-container",
    "experience-container",
    "project-modal",
    "modal-close-btn"
];
for (const id of idsToCheck) {
    if (!html.includes(`id="${id}"`)) {
        console.error(`Missing DOM ID in index.html: ${id}`);
        process.exit(1);
    }
}
console.log("All critical DOM hooks verified successfully!");

// Verification of F1 Cartoon Racing Elements
const f1Elements = ["f1-track-container", "f1-car-wrapper", "f1-smoke-container", "f1-badge"];
for (const el of f1Elements) {
    if (!html.includes(`id="${el}"`)) {
        console.error(`Missing F1 DOM ID in index.html: ${el}`);
        process.exit(1);
    }
}
console.log("F1 DOM structure verified successfully!");

// Verification of Circuit Accents (Traffic Cones & Checkered Flag)
if (!html.includes("f1-cone-badge") || !html.includes("f1-checkered-flag")) {
    console.error("Missing circuit accents in index.html");
    process.exit(1);
}
console.log("F1 circuit accents verified successfully!");

// Verification of F1 CSS styles, transitions and keyframes
const cssContent = fs.readFileSync(path.join(root, "css/style.css"), "utf8");
if (!cssContent.includes(".f1-car-wrapper") || !cssContent.includes(".f1-smoke-puff") || !cssContent.includes("@keyframes f1-flag-wave")) {
    console.error("Missing F1 CSS transition classes in style.css");
    process.exit(1);
}
console.log("F1 CSS styles and keyframes verified successfully!");

// Verification of F1 Controller script
if (!fs.existsSync(path.join(root, "js/f1-racer.js"))) {
    console.error("Missing js/f1-racer.js controller");
    process.exit(1);
}
if (!html.includes('src="js/f1-racer.js"')) {
    console.error("Missing js/f1-racer.js script tag in index.html");
    process.exit(1);
}
const readme = fs.readFileSync(path.join(root, "README.md"), "utf8");
if (!readme.includes("js/f1-racer.js")) {
    console.error("Missing js/f1-racer.js in README.md");
    process.exit(1);
}
console.log("F1 Racer controller verified successfully in index.html and README.md!");

// Verification of Work Experience in Production (Dipal Design & Empire Barber Shop / NovaPOS)
const experienceMentions = ["Dipal Design", "Empire Barber Shop", "C3 El Salvador", "CFP Colegio Salesiano Santa Cecilia"];
for (const company of experienceMentions) {
    if (!html.includes(company)) {
        console.error(`Missing expected experience entry in index.html: ${company}`);
        process.exit(1);
    }
}

const attendanceProj = projects.find(p => p.id === "attendance-track");
if (!attendanceProj || !attendanceProj.isWorkExperience || attendanceProj.workExperienceCompany !== "Dipal Design") {
    console.error("AttendanceTrack must be marked as work experience for Dipal Design");
    process.exit(1);
}

const novaposProj = projects.find(p => p.id === "novapos");
if (!novaposProj || !novaposProj.isWorkExperience || novaposProj.workExperienceCompany !== "Empire Barber Shop") {
    console.error("NovaPOS must be marked as work experience for Empire Barber Shop");
    process.exit(1);
}
console.log("Work experience verification PASSED (Dipal Design & Empire Barber Shop / NovaPOS).");

// Strict Zero Explicit STAR Mention Verification (Natural Storytelling Rule)
const forbiddenVisibleKeywords = ["metodología star", "método star", "arquitectura star", "ciclo star", "star methodology"];
const filesToCheckForStar = ["index.html", "README.md"];
for (const rel of filesToCheckForStar) {
    const full = path.join(root, rel);
    const content = fs.readFileSync(full, "utf8").toLowerCase();
    for (const kw of forbiddenVisibleKeywords) {
        if (content.includes(kw)) {
            console.error(`Explicit STAR keyword "${kw}" found in ${rel}`);
            process.exit(1);
        }
    }
}
console.log("Zero explicit STAR keyword violations verified successfully!");

// Strict Zero-Emoji Rule Verification
const emojiRegex = /[\u{1F000}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1FA00}-\u{1FAFF}\u{2300}-\u{23FF}\u{2B50}\u{2B55}\u{200D}\u{FE0F}]/u;
const filesToVerifyForEmojis = [
    "index.html",
    "css/style.css",
    "js/app.js",
    "js/projects-data.js",
    "js/f1-racer.js",
    "README.md"
];

let emojiViolations = 0;
for (const relFile of filesToVerifyForEmojis) {
    const full = path.join(root, relFile);
    const content = fs.readFileSync(full, "utf8");
    const lines = content.split("\n");
    lines.forEach((line, idx) => {
        if (emojiRegex.test(line)) {
            console.error(`Emoji violation in ${relFile}:${idx + 1} -> ${line.trim()}`);
            emojiViolations++;
        }
    });
}

if (emojiViolations > 0) {
    console.error(`FAIL: Found ${emojiViolations} emoji occurrences. Emojis are strictly prohibited.`);
    process.exit(1);
}

console.log("Zero-Emoji verification PASSED: 0 emojis found across all files.");

// Friendly Horizontal Filter Bar Verification
const appJsContent = fs.readFileSync(path.join(root, "js/app.js"), "utf8");
const expectedFilterIcons = ["apps", "dns", "layers", "smartphone", "psychology", "public"];
for (const icon of expectedFilterIcons) {
    if (!appJsContent.includes(`icon: '${icon}'`)) {
        console.error(`Missing expected category filter icon: ${icon}`);
        process.exit(1);
    }
}
if (!appJsContent.includes("chip-count") || !cssContent.includes(".chip-count")) {
    console.error("Missing chip-count badge in filter bar");
    process.exit(1);
}
console.log("Friendly Filter Bar with category icons & micro-badges verified successfully!");

// Concise Executive Project Modal & README Callout Verification
const modalRequiredClasses = ["modal-executive-grid", "modal-exec-card", "modal-readme-box", "btn-modal-github"];
for (const cls of modalRequiredClasses) {
    if (!appJsContent.includes(cls)) {
        console.error(`Missing modal class ${cls} in js/app.js`);
        process.exit(1);
    }
    if (!cssContent.includes(`.${cls}`)) {
        console.error(`Missing modal class .${cls} in css/style.css`);
        process.exit(1);
    }
}
if (!appJsContent.includes("Repositorio privado") || !appJsContent.includes("card-private-label")) {
    console.error("Missing private repository handling in js/app.js");
    process.exit(1);
}
console.log("Project modal verified successfully!");
