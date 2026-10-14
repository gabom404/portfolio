# Minimal Portfolio & Projects Sanitization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a minimalist, zero-build developer portfolio website hosted on GitHub Pages for `gabom404`, highlighting 11 curated full-stack projects, and sanitize 3 local enterprise systems from `htdocs` to publish clean public repositories under `gabom404`.

**Architecture:** A zero-build, ultra-fast static portfolio using semantic HTML5, modern CSS (variables, dark/light mode, mobile-first responsive grid), and vanilla ES6+ JavaScript. Three local enterprise projects from `htdocs` are cleaned of all confidential data/PII, structured with `.env.example`, clean SQL schemas, and professional README documentation before publishing.

**Tech Stack:** HTML5, CSS3 (Modern custom properties & responsive grid), Vanilla JavaScript ES6+, PHP 8 (PDO/MySQL), Flutter/Dart, Python, Docker, GitHub CLI & Git.

## Global Constraints

- **Destination Account:** `gabom404` (`gemc1172005@gmail.com`).
- **Contributing Account to Reference:** `Gaboum11` (157+ commits/contributions, 23 public repos).
- **Sanitization Rule:** Zero confidential data, zero production DB dumps with real PII, zero server credentials, zero real business/institutional names.
- **Excluded Projects:** `xm-trading-bot` (XM trading bot) and `devsecops-pipeline-lab` are completely excluded.
- **Zero Build Requirement:** Portfolio website must run directly in any browser without npm build steps.

---

### Task 1: Environment & Git Account Preparation

**Files:**
- Create: `C:\Users\gemc1\.gemini\antigravity\scratch\portfolio-gabom404\.gitconfig-local`
- Test: Verify git author identity and GitHub CLI authentication for `gabom404`.

**Interfaces:**
- Produces: Verified git configuration with user `gabom404` and email `gemc1172005@gmail.com`.

- [ ] **Step 1: Check GitHub CLI account status and set git user credentials**

Run:
```powershell
git config --global user.name "gabom404"
git config --global user.email "gemc1172005@gmail.com"
git config --global user.name
git config --global user.email
```
Expected output:
```text
gabom404
gemc1172005@gmail.com
```

- [ ] **Step 2: Commit initial configuration in the portfolio workspace**

Run:
```powershell
git -C "C:\Users\gemc1\.gemini\antigravity\scratch\portfolio-gabom404" status
```
Expected: Clean working tree or ready to commit.

---

### Task 2: Sanitization and Packaging of `NovaPOS` (`Sistema`)

**Files:**
- Create: `C:\Users\gemc1\.gemini\antigravity\scratch\novapos-system\config.example.php`
- Create: `C:\Users\gemc1\.gemini\antigravity\scratch\novapos-system\database\schema.sql`
- Create: `C:\Users\gemc1\.gemini\antigravity\scratch\novapos-system\database\seeds.sql`
- Create: `C:\Users\gemc1\.gemini\antigravity\scratch\novapos-system\README.md`
- Source: `C:\xampp\htdocs\htdocs\Sistema`

**Interfaces:**
- Produces: Standalone clean repository ready for `https://github.com/gabom404/novapos-system`.

- [ ] **Step 1: Copy `Sistema` source files excluding sensitive/temp files**

Copy all core application files (`agregar_*.php`, `editar_*.php`, `eliminar_*.php`, `dashboard.php`, `funciones.php`, `index.php`, `vender.php`, etc.) into `C:\Users\gemc1\.gemini\antigravity\scratch\novapos-system`. Exclude any cache, temporary zip or backup files.

- [ ] **Step 2: Create `config.example.php` and update `funciones.php`**

Create `config.example.php`:
```php
<?php
// Configuration example for NovaPOS Database Connection
define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
define('DB_NAME', getenv('DB_NAME') ?: 'novapos_db');
define('DB_USER', getenv('DB_USER') ?: 'root');
define('DB_PASS', getenv('DB_PASS') ?: '');
define('DB_CHARSET', 'utf8mb4');
```
Ensure `funciones.php` imports or defaults to these configuration constants safely without hardcoded production passwords.

- [ ] **Step 3: Generate clean `database/schema.sql` and `database/seeds.sql`**

Write standard DDL tables: `usuarios`, `clientes`, `productos`, `vendedores`, `ventas`, `productos_ventas` with UTF-8 collation. Add demo seed data for an admin user (`admin` / `admin123` hashed via `password_hash`) and 5 sample inventory items.

- [ ] **Step 4: Create professional `README.md`**

Include: Project overview, key features (stock control, sales tickets, reports, security with PDO & password hashing), ER diagram, requirements (PHP 8+, MySQL), and installation guide.

- [ ] **Step 5: Verify PHP syntax and commit**

Run:
```powershell
php -l "C:\Users\gemc1\.gemini\antigravity\scratch\novapos-system\funciones.php"
php -l "C:\Users\gemc1\.gemini\antigravity\scratch\novapos-system\index.php"
```
Expected: `No syntax errors detected`. Initialize git and commit:
```bash
git -C "C:\Users\gemc1\.gemini\antigravity\scratch\novapos-system" init
git -C "C:\Users\gemc1\.gemini\antigravity\scratch\novapos-system" add .
git -C "C:\Users\gemc1\.gemini\antigravity\scratch\novapos-system" commit -m "feat: initial clean release of NovaPOS"
```

---

### Task 3: Sanitization and Packaging of `WalletID` (`WID_PRUEBAFINAL`)

**Files:**
- Create: `C:\Users\gemc1\.gemini\antigravity\scratch\wallet-id-platform\config.example.php`
- Create: `C:\Users\gemc1\.gemini\antigravity\scratch\wallet-id-platform\database\schema.sql`
- Create: `C:\Users\gemc1\.gemini\antigravity\scratch\wallet-id-platform\database\seeds.sql`
- Create: `C:\Users\gemc1\.gemini\antigravity\scratch\wallet-id-platform\README.md`
- Source: `C:\xampp\htdocs\htdocs\WID_PRUEBAFINAL`

**Interfaces:**
- Produces: Standalone clean repository ready for `https://github.com/gabom404/wallet-id-platform`.

- [ ] **Step 1: Unify and organize structure into `admin/` and `portal/`**

Merge `Wallet_Id_page` (User self-service portal) and `wallet_id_system` (Cashier/Admin system) into a cohesive repository structure:
```text
wallet-id-platform/
├── admin/          # Admin POS & Fund recharge system
├── portal/         # User/Student balance & transactions portal
├── database/       # Clean schema & seeds
├── config.example.php
└── README.md
```

- [ ] **Step 2: Sanitize institutional branding and assets**

Replace logos referencing "Colegio Santa Cecilia / Chaleco" with neutral clean vector branding "WalletID". Replace institutional page titles ("Chaleco Wallet") with "WalletID - Campus Digital Wallet".

- [ ] **Step 3: Generate clean database DDL and test seeds**

Create `database/schema.sql` with tables: `usuario` (staff/admins), `users` (cardholders/students), `ventas`, `detalle_venta`, `fondos` (recharges). Seed with 2 demo cardholders and 1 cashier.

- [ ] **Step 4: Create professional `README.md`**

Include: Architecture overview (Dual-portal system: Admin POS vs Cardholder Portal), workflow diagram, security considerations, and installation instructions.

- [ ] **Step 5: Verify PHP syntax and commit**

Run:
```powershell
php -l "C:\Users\gemc1\.gemini\antigravity\scratch\wallet-id-platform\admin\index.php"
php -l "C:\Users\gemc1\.gemini\antigravity\scratch\wallet-id-platform\portal\login.php"
```
Expected: `No syntax errors detected`. Initialize git and commit:
```bash
git -C "C:\Users\gemc1\.gemini\antigravity\scratch\wallet-id-platform" init
git -C "C:\Users\gemc1\.gemini\antigravity\scratch\wallet-id-platform" add .
git -C "C:\Users\gemc1\.gemini\antigravity\scratch\wallet-id-platform" commit -m "feat: initial clean release of WalletID Platform"
```

---

### Task 4: Sanitization and Packaging of `AttendanceTrack` (`asistencias.dipaldesign.com`)

**Files:**
- Create: `C:\Users\gemc1\.gemini\antigravity\scratch\attendance-track\config.example.php`
- Create: `C:\Users\gemc1\.gemini\antigravity\scratch\attendance-track\database\schema.sql`
- Create: `C:\Users\gemc1\.gemini\antigravity\scratch\attendance-track\database\seeds.sql`
- Create: `C:\Users\gemc1\.gemini\antigravity\scratch\attendance-track\README.md`
- Source: `C:\xampp\htdocs\htdocs\asistencias.dipaldesign.com`

**Interfaces:**
- Produces: Standalone clean repository ready for `https://github.com/gabom404/attendance-track`.

- [ ] **Step 1: Strict elimination of sensitive client data**

Delete all references to "Dipal Design". Exclude `.ftpquota`, `error_log`, and production SQL dumps (`dipaldes_asistencias (8).sql`) containing real employee names, photos, and ID numbers.

- [ ] **Step 2: Sanitize codebase and database connection**

Refactor `includes/db_connect.php` to use `config.example.php`. Rename app title to "AttendanceTrack - Smart Attendance & Shift Control".

- [ ] **Step 3: Generate clean schema and dummy seed records**

Create `database/schema.sql` with tables: `planilla`, `empleados`, `empleados_proyectos`, `asistencias`. Seed with 3 fictional employees ("Dev Tester 1", "Dev Tester 2", "Dev Tester 3") with generic IDs.

- [ ] **Step 4: Create professional `README.md`**

Include: Features (Webcam check-in/out, daily shift rules Monday-Sunday, JSON API endpoints, TCPDF report generator), setup guide, and API specification.

- [ ] **Step 5: Verify PHP syntax and commit**

Run:
```powershell
php -l "C:\Users\gemc1\.gemini\antigravity\scratch\attendance-track\api.php"
php -l "C:\Users\gemc1\.gemini\antigravity\scratch\attendance-track\index.php"
```
Expected: `No syntax errors detected`. Initialize git and commit:
```bash
git -C "C:\Users\gemc1\.gemini\antigravity\scratch\attendance-track" init
git -C "C:\Users\gemc1\.gemini\antigravity\scratch\attendance-track" add .
git -C "C:\Users\gemc1\.gemini\antigravity\scratch\attendance-track" commit -m "feat: initial clean release of AttendanceTrack"
```

---

### Task 5: Development of the Minimalist Portfolio Web Application

**Files:**
- Create: `C:\Users\gemc1\.gemini\antigravity\scratch\portfolio-gabom404\index.html`
- Create: `C:\Users\gemc1\.gemini\antigravity\scratch\portfolio-gabom404\css\style.css`
- Create: `C:\Users\gemc1\.gemini\antigravity\scratch\portfolio-gabom404\js\projects-data.js`
- Create: `C:\Users\gemc1\.gemini\antigravity\scratch\portfolio-gabom404\js\app.js`
- Create: `C:\Users\gemc1\.gemini\antigravity\scratch\portfolio-gabom404\assets\icons\` (SVGs)

**Interfaces:**
- Produces: Standalone responsive web application ready for GitHub Pages.

- [ ] **Step 1: Write `js/projects-data.js` containing all 11 projects**

Define an array `PROJECTS` where each object contains: `id`, `title`, `category` (`backend`, `fullstack`, `mobile`, `python-ai`, `frontend`), `tagline`, `description`, `highlights` (array of 3 technical bullet points), `stack` (array of technology strings), `githubUrl`, `demoUrl` (optional), and `badge` ("Featured", "Team Project", "Clean Architecture", etc.).

- [ ] **Step 2: Write semantic `index.html`**

Structure:
- Navigation bar with Logo ("gabo.dev" / "gabom404"), Category anchors, and Theme Toggle button (Moon/Sun).
- Hero section: Headline ("Full-Stack Software Engineer"), subhead focusing on backend APIs, cloud architectures, and mobile development, social links (GitHub, LinkedIn, Email).
- GitHub Activity Banner: Highlights 157+ contributions in the last year, 23 public repositories on GitHub (`Gaboum11`), with a direct link to the contributor profile.
- Filter Bar: Pill buttons for `Todos`, `Backend & APIs`, `Fullstack & Arquitectura`, `Mobile`, `Python & IA`, `Frontend`.
- Projects Grid: Dynamic container rendered by `app.js`.
- Skills & Tech Stack Matrix: Organized by Backend, Frontend, Mobile, Database, DevOps & Tools.
- Footer: Copyright, current year, and contact button.

- [ ] **Step 3: Write modern minimalist `css/style.css`**

Implement:
- CSS custom properties (`--bg-primary`, `--bg-card`, `--text-primary`, `--text-secondary`, `--accent`, `--border`, `--badge-bg`).
- Dark theme as default with automatic system preference detection (`@media (prefers-color-scheme: dark)`) and manual `.light-theme` class override.
- Typography: System font stack prioritizing Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto.
- Smooth transitions for hover states, card elevation, and theme toggling.
- Mobile-first responsive media queries (`@media (min-width: 768px)` and `@media (min-width: 1024px)`).

- [ ] **Step 4: Write interactive `js/app.js`**

Implement:
- Dynamic rendering of cards from `projects-data.js`.
- Category filtering with active pill indicator and smooth fade-in animations.
- Dark/Light mode switcher with persistence in `localStorage`.
- Keyboard accessibility and ARIA attributes for interactive elements.

- [ ] **Step 5: Commit portfolio web application**

Run:
```bash
git -C "C:\Users\gemc1\.gemini\antigravity\scratch\portfolio-gabom404" add index.html css/ js/ assets/
git -C "C:\Users\gemc1\.gemini\antigravity\scratch\portfolio-gabom404" commit -m "feat: complete minimalist portfolio web app with 11 projects"
```

---

### Task 6: Local Verification & Automated Testing

**Files:**
- Test: Local browser / HTTP server verification script.

- [ ] **Step 1: Start local test server and check response**

Run:
```powershell
python -m http.server 8000 --directory "C:\Users\gemc1\.gemini\antigravity\scratch\portfolio-gabom404"
```
Verify `http://localhost:8000`:
- Status 200 OK.
- Check that all 11 project cards render without errors.
- Verify filtering for all 5 categories.
- Test Theme switch (Dark $\leftrightarrow$ Light).
- Verify all GitHub links format correctly.

- [ ] **Step 2: Automated link and syntax validation**

Run a script to verify that all referenced image/icon assets exist and no JavaScript console syntax errors are present.

---

### Task 7: GitHub Deployment & Publication on `gabom404`

**Files:**
- Publish: Repositories created on `gabom404` GitHub account.

- [ ] **Step 1: Verify GitHub CLI authentication for `gabom404`**

Prompt/switch authentication to `gabom404` using `gh auth login` or personal access token to allow creating repositories under `gabom404`.

- [ ] **Step 2: Create and push the 3 sanitized projects**

Run:
```powershell
gh repo create gabom404/novapos-system --public --source="C:\Users\gemc1\.gemini\antigravity\scratch\novapos-system" --push
gh repo create gabom404/wallet-id-platform --public --source="C:\Users\gemc1\.gemini\antigravity\scratch\wallet-id-platform" --push
gh repo create gabom404/attendance-track --public --source="C:\Users\gemc1\.gemini\antigravity\scratch\attendance-track" --push
```

- [ ] **Step 3: Create and push `portfolio` repository**

Run:
```powershell
gh repo create gabom404/portfolio --public --source="C:\Users\gemc1\.gemini\antigravity\scratch\portfolio-gabom404" --push
```

- [ ] **Step 4: Enable GitHub Pages**

Run:
```powershell
gh api -X POST "repos/gabom404/portfolio/pages" -f source[branch]="master" -f source[path]="/"
```
Verify page status and output live URL (`https://gabom404.github.io/portfolio/`).
