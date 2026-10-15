# Carro de F1 Cartoon con Deslizamiento y Efectos de Pista Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrar un carro de Fórmula 1 ilustrado en estilo cartoon vectorial que desciende dinámicamente sobre una pista lateral en función del scroll, con humo de escape, derrape, líneas de velocidad, conos de tráfico y bandera a cuadros mediante transiciones CSS fluidas.

**Architecture:** Módulo visual desacoplado con marcado semántico SVG en `index.html`, estilos y animaciones aceleradas por GPU en `css/style.css`, controlador reactivo de scroll en `js/f1-racer.js` usando `requestAnimationFrame`, y validación continua con `tests/verify-portfolio.cjs`.

**Tech Stack:** HTML5 Semántico, Gráficos Vectoriales SVG, CSS3 (Transitions, Keyframes, Transforms 3D), JavaScript ES6+, Node.js (Testing Suite).

## Global Constraints
- Estricto cumplimiento de la regla Cero Emojis (todos los elementos visuales son SVG nativos o Google Material Symbols).
- Todo en español profesional (sin términos en Spanglish).
- Transiciones CSS ultra fluidas aceleradas por hardware (`transform: translate3d(...) rotate(...)`).
- 100% responsivo en móviles, tabletas y computadoras de escritorio sin superponer texto.
- Compatibilidad con `prefers-reduced-motion`.

---

### Task 1: Vector Cartoon SVG Assets & Markup Scaffolding

**Files:**
- Modify: `index.html:515-544`
- Test: `tests/verify-portfolio.cjs`

**Interfaces:**
- Produces: Contenedor `#f1-track-container`, auto `#f1-car-wrapper`, generador de humo `#f1-smoke-container`, tacómetro `#f1-badge`, y conos de pista `.f1-cone-badge`.

- [ ] **Step 1: Write test in `tests/verify-portfolio.cjs` checking for F1 DOM elements**
```javascript
const f1Elements = ["f1-track-container", "f1-car-wrapper", "f1-smoke-container", "f1-badge"];
for (const el of f1Elements) {
    if (!html.includes(`id="${el}"`)) {
        console.error(`Missing F1 DOM ID in index.html: ${el}`);
        process.exit(1);
    }
}
```

- [ ] **Step 2: Run test to verify it fails**
Run: `node tests/verify-portfolio.cjs`
Expected: FAIL with "Missing F1 DOM ID in index.html: f1-track-container"

- [ ] **Step 3: Add F1 Track Container and Cartoon SVG Car in `index.html`**
Integrar el componente `#f1-track-container` con la ilustración SVG cartoon del auto de F1 (alerones prominentes, neumáticos slick con rin cartoon, visor de casco reflectante, tubo de escape y bandera a cuadros en la meta).

- [ ] **Step 4: Run test to verify it passes**
Run: `node tests/verify-portfolio.cjs`
Expected: PASS

- [ ] **Step 5: Commit Task 1**
```bash
git add index.html tests/verify-portfolio.cjs
git commit -m "feat(f1): add cartoon F1 SVG car and track container structure"
```

---

### Task 2: CSS Racetrack Styles, Transitions & Keyframe Effects

**Files:**
- Modify: `css/style.css:1580-1620`
- Test: `tests/verify-portfolio.cjs`

**Interfaces:**
- Produces: Clases `.f1-track-container`, `.f1-track-line`, `.f1-car-wrapper`, `.f1-smoke-puff`, `.f1-lap-badge`, `.f1-flag-wave`, `.f1-cone-badge` y variables de transición.

- [ ] **Step 1: Add style verification to `tests/verify-portfolio.cjs`**
```javascript
const cssContent = fs.readFileSync(path.join(root, "css/style.css"), "utf8");
if (!cssContent.includes(".f1-car-wrapper") || !cssContent.includes(".f1-smoke-puff")) {
    console.error("Missing F1 CSS transition classes in style.css");
    process.exit(1);
}
```

- [ ] **Step 2: Run test to verify it fails**
Run: `node tests/verify-portfolio.cjs`
Expected: FAIL with "Missing F1 CSS transition classes in style.css"

- [ ] **Step 3: Implement CSS transitions and keyframes in `css/style.css`**
Añadir reglas para `.f1-track-container`, animación `@keyframes f1-smoke-puff`, `@keyframes f1-flag-wave`, transiciones con curva bézier `cubic-bezier(0.2, 0.9, 0.4, 1.0)`, inclinación de derrape `rotate(6deg)`, y reglas responsivas para pantallas móviles (`max-width: 600px`).

- [ ] **Step 4: Run test to verify it passes**
Run: `node tests/verify-portfolio.cjs`
Expected: PASS

- [ ] **Step 5: Commit Task 2**
```bash
git add css/style.css tests/verify-portfolio.cjs
git commit -m "feat(f1): add racetrack CSS layout, smoke keyframes and drift transitions"
```

---

### Task 3: Reactive Scroll Controller & Particle Generator

**Files:**
- Create: `js/f1-racer.js`
- Modify: `index.html:535-544` (enlazar `js/f1-racer.js`)
- Test: `tests/verify-portfolio.cjs`

**Interfaces:**
- Consumes: `#f1-car-wrapper`, `#f1-smoke-container`, `#f1-badge`.
- Produces: Inicialización de `initF1Racer()`, cálculo dinámico de posición de scroll (\(0\%\) a \(100\%\)), generación de partículas de humo al moverse, rotación de derrape según velocidad de scroll, y actualización de sectores en el tacómetro.

- [ ] **Step 1: Add script file check to `tests/verify-portfolio.cjs`**
```javascript
if (!fs.existsSync(path.join(root, "js/f1-racer.js"))) {
    console.error("Missing js/f1-racer.js controller");
    process.exit(1);
}
```

- [ ] **Step 2: Run test to verify it fails**
Run: `node tests/verify-portfolio.cjs`
Expected: FAIL with "Missing js/f1-racer.js controller"

- [ ] **Step 3: Implement `js/f1-racer.js` and link in `index.html`**
Escribir el controlador con `requestAnimationFrame`, cálculo de scroll pasivo, generación controlada de humo, detección de aceleración/parada y sectores dinámicos (P1 Inicio, S1 Habilidades, S2 Proyectos, S3 Experiencia, Meta Contacto).

- [ ] **Step 4: Run test to verify it passes**
Run: `node tests/verify-portfolio.cjs`
Expected: PASS

- [ ] **Step 5: Commit Task 3**
```bash
git add js/f1-racer.js index.html tests/verify-portfolio.cjs
git commit -m "feat(f1): implement reactive scroll controller and dynamic smoke generator"
```

---

### Task 4: Circuit Accents (Traffic Cones & Checkered Flag Integration)

**Files:**
- Modify: `index.html:360-405`
- Modify: `css/style.css`
- Test: `tests/verify-portfolio.cjs`

**Interfaces:**
- Produces: Conos de pista cartoon en los hitos de la línea de tiempo de Experiencia Profesional y bandera a cuadros en la sección final de contacto.

- [ ] **Step 1: Add circuit accent verification to `tests/verify-portfolio.cjs`**
```javascript
if (!html.includes("f1-cone-badge") || !html.includes("f1-checkered-flag")) {
    console.error("Missing circuit accents in index.html");
    process.exit(1);
}
```

- [ ] **Step 2: Run test to verify it fails**
Run: `node tests/verify-portfolio.cjs`
Expected: FAIL with "Missing circuit accents in index.html"

- [ ] **Step 3: Implement SVG traffic cones and checkered flag in `index.html` and `css/style.css`**
Añadir conos de pista animados en las tarjetas de experiencia profesional y bandera de meta ondulante en el pie de página de contacto.

- [ ] **Step 4: Run test to verify it passes**
Run: `node tests/verify-portfolio.cjs`
Expected: PASS

- [ ] **Step 5: Commit Task 4**
```bash
git add index.html css/style.css tests/verify-portfolio.cjs
git commit -m "feat(f1): integrate cartoon traffic cones and animated checkered finish flag"
```

---

### Task 5: Zero-Emoji & Full Portfolio Verification

**Files:**
- Modify: `tests/verify-portfolio.cjs`
- Modify: `README.md`

- [ ] **Step 1: Execute complete test suite**
Run: `node tests/verify-portfolio.cjs`
Expected: 0 emoji violations, 11 projects passing, all DOM hooks valid.

- [ ] **Step 2: Update README with F1 Interactive Circuit feature**
Documentar la nueva característica interactiva y la ingeniería detrás de sus transiciones CSS puras.

- [ ] **Step 3: Commit Task 5**
```bash
git add tests/verify-portfolio.cjs README.md
git commit -m "docs: document cartoon F1 scroll progression feature in README"
```

---

### Task 6: GitHub Deployment & Live Verification

**Files:**
- Remote: `gabom404/portfolio`

- [ ] **Step 1: Push commits to `origin main` using GitHub token**
- [ ] **Step 2: Verify GitHub Pages build status reaches `built`**
- [ ] **Step 3: Verify live site HTTP 200 response**
