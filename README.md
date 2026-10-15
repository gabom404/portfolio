# Gabriel Martínez — Developer Portfolio

> **Software Developer | Backend & Web Systems (PHP, Python, TypeScript, Flutter, MySQL)**  
> Minimalist, zero-build developer portfolio web application built with semantic HTML5, CSS3 Custom Properties, and Vanilla ES6+ JavaScript, featuring structured technical case studies (Context & Challenge, Architecture & Implementation, and Quantifiable Impact).

[![Live Site](https://img.shields.io/badge/Live_Site-GitHub_Pages-2563eb?style=flat-square&logo=github)](https://gabom404.github.io/portfolio/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
[![Zero Build](https://img.shields.io/badge/Build-Zero_Dependencies-10b981?style=flat-square)](#)

---

## Highlights

- **Zero-Build Architecture:** Pure HTML5, modern CSS3, and ES6+ JavaScript. No npm build, no bundler overhead, instant deployment directly to GitHub Pages.
- **In-Depth Engineering Breakdowns:** Every project is documented with business context, technical challenges, architectural decisions (Service Layer, concurrency locking, OpenAPI contracts, BCrypt) and quantifiable results.
- **Dynamic Project Filtering:** Instant category switching (`Todos`, `Backend & APIs`, `Fullstack`, `Mobile`, `Python & IA`, `Frontend`) with real-time project counts.
- **Integrated On-Card Technical Breakdown:** Direct access to architectural decisions, concurrency models, database schemas, and benchmarks right on each project card without artificial popups.
- **Minimalist Editorial UI:** Warm, distraction-free aesthetic with crisp typography, line-art SVG visuals, and high contrast readability.
- **100% Responsive & Accessible:** Fluid layouts tested across mobile, tablet, and desktop screens with semantic HTML and keyboard accessibility.

---

## Repository Structure

```text
portfolio-gabom404/
├── index.html              # Accessible semantic structure
├── css/
│   └── style.css           # CSS Custom properties, responsive grid & animations
├── js/
│   ├── projects-data.js    # 11 curated projects with engineering breakdown data
│   └── app.js              # Theme switcher, filtering, and DOM renderer
├── assets/
│   └── icons/              # Clean inline & standalone SVG assets
└── README.md               # Technical overview & documentation
```

---

## Curated Projects (11)

| # | Project | Category | Tech Stack | Key Technical Focus & Outcomes |
|---|---|---|---|---|
| 1 | **Promora Marketplace & Engine** | Backend & APIs | Laravel 11, PHPUnit, Postman, MySQL | Concurrency locking (`SELECT FOR UPDATE`), atomic coupon redemption, 35% checkout latency reduction. |
| 2 | **Biblioteca REST API** | Backend & APIs | Laravel, OpenAPI 3.0, Stoplight, Postman | API-First contract design, Stoplight Studio, 50% faster client integration. |
| 3 | **NovaPOS System** | Fullstack | PHP 8 PDO, MySQL, BCrypt, Bootstrap 5 | Zero-framework lightweight POS, 100% prepared statements, 40% reduction in cashier wait times. |
| 4 | **WalletID Platform** | Fullstack | PHP, MySQL, JavaScript, FinTech | Dual decoupled portals (`portal/` & `admin/`), cashless campus digital transactions, atomic balances. |
| 5 | **AttendanceTrack** | Backend & APIs | PHP, Webcam API, REST API, TCPDF | Biometric webcam capture, shift rules engine, 85% time savings in payroll consolidation. |
| 6 | **Proyecto Final Arquitectura** | Fullstack | TypeScript, Python, Docker Compose, Microservices | Polyglot microservices orchestration, containerized networks, single-command setup. |
| 7 | **Cupon-X Platform** | Backend & APIs | Node.js, PostgreSQL (PL/pgSQL), Netlify | Business logic encapsulated in PostgreSQL PL/pgSQL stored procedures (<25ms validation). |
| 8 | **Enfoque App** | Mobile | Flutter, Dart, SQLite, Material 3 | Pomodoro productivity app, reactive state management, stable 60 FPS, offline persistence. |
| 9 | **DeliEat Assistant** | Python & IA | Python, Django, NLP, NLTK | Natural language ingredient parsing, semantic recipe matching (>88% accuracy), <300ms latency. |
| 10 | **Data Analytics Core System** | Python & IA | Python 3, MVC, Pandas, NumPy, Matplotlib | Pure MVC analytical pipeline, structured data cleaning, 60% code redundancy reduction. |
| 11 | **Turimox Ecoturismo** | Frontend | HTML5, SCSS (BEM), Vanilla JS, Firebase | Responsive tourism portal, 95+ Lighthouse score, modular CSS design system. |

---

## Local Development & Testing

Since this project requires zero build steps, you can serve it locally using any static web server:

```powershell
# Using Python 3 built-in HTTP server:
python -m http.server 8000

# Open in browser:
# http://localhost:8000
```

---

## Candidate Profile

- **Name:** Gabriel Martínez (`gabom404`)
- **Education:**
  - ESEN (Escuela Superior de Economía y Negocios) — *Bachelor of Engineering in Software Engineering* (2024 - 2028)
  - Colegio Salesiano Santa Cecilia — *Técnico en Sistemas Informáticos* (2021 - 2023)
- **Location:** Nueva San Salvador, La Libertad, El Salvador
- **Email:** [gemc1172005@gmail.com](mailto:gemc1172005@gmail.com)
- **LinkedIn:** [linkedin.com/in/gabriel-martinez-carballo](https://linkedin.com/in/gabriel-martinez-carballo)
- **GitHub:** [github.com/gabom404](https://github.com/gabom404) (and contributions on [github.com/Gaboum11](https://github.com/Gaboum11))

---

## License

This project is open-source and available under the [MIT License](LICENSE).
