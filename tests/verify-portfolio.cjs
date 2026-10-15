const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
console.log("Checking portfolio files in:", root);

const requiredFiles = [
    "index.html",
    "css/style.css",
    "js/projects-data.js",
    "js/app.js",
    "assets/icons/github.svg",
    "assets/icons/linkedin.svg",
    "assets/icons/mail.svg",
    "assets/icons/external-link.svg",
    "assets/icons/star.svg",
    "assets/icons/sun.svg",
    "assets/icons/moon.svg"
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
if (projects.length !== 11) {
    console.error("Expected 11 projects, found:", projects.length);
    process.exit(1);
}

const categories = new Set(["backend", "fullstack", "mobile", "python-ai", "frontend"]);
for (const p of projects) {
    if (!p.id || !p.title || !p.category || !p.star) {
        console.error("Project missing required fields:", p);
        process.exit(1);
    }
    if (!categories.has(p.category)) {
        console.error("Invalid category:", p.category, "in", p.title);
        process.exit(1);
    }
    const { situation, task, action, result } = p.star;
    if (!situation || !task || !action || !result) {
        console.error("Project missing STAR field:", p.title);
        process.exit(1);
    }
}

console.log("All 11 projects successfully validated with complete STAR criteria.");

const idsToCheck = [
    "filter-tabs",
    "projects-grid",
    "star-modal",
    "modal-close-btn",
    "modal-title",
    "modal-star-situation",
    "modal-star-action",
    "modal-star-result",
    "skills-container",
    "experience-container"
];
for (const id of idsToCheck) {
    if (!html.includes(`id="${id}"`)) {
        console.error(`Missing DOM ID in index.html: ${id}`);
        process.exit(1);
    }
}
console.log("All critical DOM hooks verified successfully!");

// Strict Zero-Emoji Rule Verification
const emojiRegex = /[\u{1F000}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1FA00}-\u{1FAFF}\u{2300}-\u{23FF}\u{2B50}\u{2B55}\u{200D}\u{FE0F}]/u;
const filesToVerifyForEmojis = [
    "index.html",
    "css/style.css",
    "js/app.js",
    "js/projects-data.js",
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
