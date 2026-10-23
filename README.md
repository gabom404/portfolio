# Portafolio — Gabriel Martínez

> Desarrollador backend y estudiante de Ingeniería de Software en la ESEN (El Salvador).
> PHP · Laravel · Python · TypeScript · MySQL · PostgreSQL

[![Sitio en vivo](https://img.shields.io/badge/Sitio_en_vivo-GitHub_Pages-2563eb?style=flat-square&logo=github)](https://gabom404.github.io/portfolio/)
[![Licencia: MIT](https://img.shields.io/badge/Licencia-MIT-blue.svg?style=flat-square)](LICENSE)

Sitio estático hecho con HTML, CSS y JavaScript sin dependencias ni paso de compilación. Se publica directamente en GitHub Pages.

## Características

- **Proyectos filtrables por categoría** (Backend y APIs, Full Stack, Móvil, Python e IA, Frontend) con un detalle por proyecto: problema, solución, aspectos destacados y tecnologías.
- **Proyectos de equipo identificados**: cada proyecto académico hecho en grupo lleva la etiqueta "En equipo"; los repositorios privados se indican como tales.
- **Pista de F1 animada** (`js/f1-racer.js`): un carro en SVG baja por una pista lateral según el avance del scroll. Se oculta en pantallas pequeñas y cuando el sistema pide reducir el movimiento (`prefers-reduced-motion`).
- **Accesibilidad**: navegación por teclado en el menú móvil y en el diálogo de proyectos (el foco entra y queda dentro del diálogo; `Esc` lo cierra).
- **Vista previa al compartir**: etiquetas Open Graph para LinkedIn, WhatsApp y redes.
- **Carga ligera**: la fuente de íconos Material Symbols se pide solo con los íconos que usa el sitio.

## Estructura

```text
portfolio/
├── index.html            # Contenido y estructura de la página
├── css/style.css         # Estilos, diseño responsivo y pista de F1
├── js/
│   ├── projects-data.js  # Catálogo de proyectos (fuente única de datos)
│   ├── app.js            # Filtros, tarjetas, diálogo de detalle y menú móvil
│   └── f1-racer.js       # Animación de la pista de F1 ligada al scroll
└── tests/
    ├── verify-portfolio.cjs  # Valida datos, enlaces y estructura del HTML
    └── test-f1-racer.cjs     # Pruebas del controlador de la animación
```

## Proyectos

| Proyecto | Tipo | Tecnologías |
|---|---|---|
| **NovaPOS** — punto de venta e inventario | Experiencia laboral (Empire Barber Shop) | PHP 8, PDO, MySQL, FPDF |
| **AttendanceTrack** — asistencia y turnos con QR | Experiencia laboral (Dipal Design) | PHP, MySQL, html5-qrcode, TCPDF |
| **WalletID** — billetera digital para campus | Proyecto personal | PHP, MySQL, JavaScript |
| **Promora** — motor de códigos promocionales | En equipo | PHP 8, Laravel, PHPUnit, Postman |
| **Biblioteca** — API REST con contrato OpenAPI | En equipo | Laravel, Sanctum, OpenAPI, Stoplight |
| **Gestión de Eventos** | En equipo | Flask, PostgreSQL, JWT, Next.js, Docker Compose |
| **Cupon-X** — plataforma de cupones | En equipo | Node.js, Express, PostgreSQL, PL/pgSQL |
| **Enfoque** — app de concentración | En equipo | Flutter, Dart |
| **DeliEat** — recetas con IA | Repositorio privado | Django REST Framework, React, OpenAI API |
| **Databusters** — inventario y ventas | En equipo, privado | Python, PyQt6, MySQL |
| **Turimox** — portal de ecoturismo | En equipo | HTML, SCSS, JavaScript, Firebase |

Para agregar o editar un proyecto basta con modificar `js/projects-data.js`.

## Ejecutar en local

```powershell
python -m http.server 8000
# Abrir http://localhost:8000
```

Pruebas:

```powershell
node tests/verify-portfolio.cjs
node tests/test-f1-racer.cjs
```

## Contacto

- **Correo:** [gemc1172005@gmail.com](mailto:gemc1172005@gmail.com)
- **LinkedIn:** [linkedin.com/in/gabriel-martinez-carballo](https://linkedin.com/in/gabriel-martinez-carballo)
- **GitHub:** [gabom404](https://github.com/gabom404) (cuenta personal) · [Gaboum11](https://github.com/Gaboum11) (cuenta universitaria)

## Licencia

[MIT](LICENSE)
