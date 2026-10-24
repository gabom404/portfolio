# Portafolio — Gabriel Martínez · Circuito 404

> Desarrollador backend y estudiante de Ingeniería de Software en la ESEN (El Salvador).
> PHP · Laravel · Python · TypeScript · MySQL · PostgreSQL

[![Sitio en vivo](https://img.shields.io/badge/Sitio_en_vivo-GitHub_Pages-2563eb?style=flat-square&logo=github)](https://gabom404.github.io/portfolio/)
[![Licencia: MIT](https://img.shields.io/badge/Licencia-MIT-blue.svg?style=flat-square)](LICENSE)

Portafolio con temática de automovilismo: la página es una vuelta al **Circuito 404**, un trazado inventado, y cada sección es una curva. El carro, el circuito y las liveries son diseños propios; no se usa ninguna marca, equipo, piloto ni circuito real.

Es un sitio estático (HTML, CSS y JavaScript) sin dependencias ni paso de compilación, publicado directamente en GitHub Pages. Está en español y en inglés.

## Recorrido

| Curva | Sección | Qué hay |
|---|---|---|
| T1 | Parrilla de salida | Semáforo de largada que mide tu tiempo de reacción, el monoplaza 404 y el selector de livery |
| T2 | Ficha del piloto | Licencia con formación y datos reales |
| T3 | Setup del carro | Cada parte del carro es un área técnica: motor = backend, chasis = datos, aero = frontend y móvil, box = herramientas |
| T4 | Garaje | Los proyectos como carros en boxes. Los filtros son compuestos de llanta y cada proyecto abre su hoja técnica |
| T5 | Historial de carreras | Experiencia y formación como gráfico de vueltas |
| T6 | Estrategia | Cómo trabajo, en cinco stints, y un pit stop contra reloj |
| T7 | Radio al equipo | Correo, LinkedIn y GitHub |

## Interacciones

- **Semáforo de largada** (`js/race/lights.js`): se encienden cinco luces y se apagan tras un tiempo aleatorio. Mide la reacción en milisegundos y detecta la salida en falso. Aparece en la primera visita y se puede saltar o repetir.
- **Navegador de circuito** (`js/race/circuit-nav.js`): un minimapa con un carro que avanza por el trazado según el scroll. En pantallas anchas flota al costado; en las demás es una barra inferior compacta.
- **Vuelta rápida** (`js/race/drive.js` y `js/race/scene.js`): mini-juego en 2.5D con cámara detrás del monoplaza. La pista y el cielo con volcanes se dibujan con un shader WebGL en estilo "Mode 7"; el carro es un modelo de polígonos pintado con la livery, y hay árboles, tribunas, pórtico de salida y carteles de curva. Física arcade, cronómetro y mejor vuelta; sin WebGL vuelve a la vista superior. Cada curva desbloquea un dato real de un proyecto. Se juega con flechas o WASD, o con botones táctiles en el celular. El código se descarga solo al abrir el juego.
- **Pit stop** (`js/race/pitstop.js`): cambiar las cuatro llantas en el orden en que se iluminan (clic, toque o teclas 1–4). Cada error suma un segundo.
- **Livery** (`js/livery.js`): cuatro combinaciones de color (rojo, azul noche, plata y turquesa, azul y rosa) que cambian el carro y los acentos del sitio.
- **Español / inglés** (`js/i18n.js`): el botón ES/EN cambia los textos, `<html lang>` y los datos de los proyectos.

Los récords, la livery y el idioma se guardan en el navegador (`localStorage`); si no está disponible, el sitio funciona igual.

## Accesibilidad

- Todo se puede usar con teclado: el semáforo y el juego se cierran con `Esc`, y los diálogos mantienen el foco dentro mientras están abiertos.
- Con `prefers-reduced-motion` no aparece la intro y se quitan las animaciones.
- Enlace para saltar al contenido, textos alternativos en los SVG y estados `aria-pressed` / `aria-checked` en filtros y selectores.

## Estructura

```text
portfolio/
├── index.html                 # Contenido de la página (español por defecto)
├── css/
│   ├── tokens.css             # Colores, tipografía, espaciado y variables de livery
│   ├── base.css               # Reset, encabezado, botones y secciones
│   ├── sections.css           # Estilos de cada curva (T1–T7)
│   └── race.css               # Semáforo, navegador de circuito, pit stop y juego
├── js/
│   ├── i18n.js                # Textos en inglés y cambio de idioma
│   ├── projects-data.js       # Catálogo de proyectos en español e inglés (fuente única)
│   ├── livery.js              # Selector de livery
│   ├── app.js                 # Garaje, hoja técnica, setup, menú y arranque
│   └── race/
│       ├── track.js           # Trazado del Circuito 404 (compartido por el minimapa y el juego)
│       ├── lights.js          # Semáforo de largada
│       ├── circuit-nav.js     # Navegador de circuito ligado al scroll
│       ├── pitstop.js         # Pit stop
│       ├── drive.js           # Mini-juego "Vuelta rápida": física, vueltas y controles (se carga al abrirlo)
│       └── scene.js           # Vista 2.5D del juego: cámara de persecución, pista en WebGL y carro 3D
└── tests/
    ├── verify-portfolio.cjs   # Datos, traducciones completas, enlaces y estructura del HTML
    └── race-logic.cjs         # Lógica del semáforo, pit stop, circuito y juego
```

## Proyectos

| Proyecto | Tipo | Tecnologías |
|---|---|---|
| **NovaPOS** — punto de venta e inventario | Experiencia laboral | PHP 8, PDO, MySQL, FPDF |
| **AttendanceTrack** — asistencia y turnos con QR | Experiencia laboral | PHP, MySQL, html5-qrcode, TCPDF |
| **WalletID** — billetera digital para campus | Proyecto personal | PHP, MySQL, JavaScript |
| **Promora** — motor de códigos promocionales | En equipo | PHP 8, Laravel, PHPUnit, Postman |
| **Biblioteca** — API REST con contrato OpenAPI | En equipo | Laravel, Sanctum, OpenAPI, Stoplight |
| **Gestión de Eventos** | En equipo | Flask, PostgreSQL, JWT, Next.js, Docker Compose |
| **Cupon-X** — plataforma de cupones | En equipo | Node.js, Express, PostgreSQL, PL/pgSQL |
| **Enfoque** — app de concentración | En equipo | Flutter, Dart |
| **DeliEat** — recetas con IA | Repositorio privado | Django REST Framework, React, OpenAI API |
| **Databusters** — inventario y ventas | En equipo, privado | Python, PyQt6, MySQL |
| **Turimox** — portal de ecoturismo | En equipo | HTML, SCSS, JavaScript, Firebase |

Para agregar o editar un proyecto basta con modificar `js/projects-data.js` (cada texto lleva su versión `es` y `en`).

## Ejecutar en local

```powershell
python -m http.server 8000
# Abrir http://localhost:8000
```

Pruebas (Node.js, sin dependencias):

```powershell
node tests/verify-portfolio.cjs
node tests/race-logic.cjs
```

## Contacto

- **Correo:** [gemc1172005@gmail.com](mailto:gemc1172005@gmail.com)
- **LinkedIn:** [linkedin.com/in/gabriel-martinez-carballo](https://linkedin.com/in/gabriel-martinez-carballo)
- **GitHub:** [gabom404](https://github.com/gabom404) (cuenta personal) · [Gaboum11](https://github.com/Gaboum11) (cuenta universitaria)

## Licencia

[MIT](LICENSE)
