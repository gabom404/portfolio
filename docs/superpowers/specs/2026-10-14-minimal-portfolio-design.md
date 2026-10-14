# Especificación de Diseño: Portafolio Minimalista y Sanitización de Proyectos

- **Fecha:** 2026-10-14
- **Cuenta GitHub Destino:** `gabom404` (`gemc1172005@gmail.com`)
- **Cuenta GitHub Complementaria:** `Gaboum11` (157+ contribuciones en el último año)
- **Estado:** Validado y Aprobado por el Usuario

---

## 1. Visión y Objetivos

Construir un portafolio web minimalista de alto rendimiento alojado en **GitHub Pages** bajo la cuenta `gabom404`, que proyecte un perfil sólido de **Full-Stack Developer (Backend, Cloud/DevOps & Mobile)**.

El portafolio curará y exhibirá **11 proyectos de alto valor técnico**, asegurando la **eliminación total de cualquier dato sensible o confidencial** de los proyectos provenientes de entornos empresariales/locales (`htdocs`), y enlazando los repositorios colaborativos clave en GitHub.

---

## 2. Estrategia de Proyectos y Sanitización

### A. Proyectos Locales de `htdocs` a Sanitizar y Publicar en `gabom404`

| Proyecto Original | Nombre Público en `gabom404` | Stack Técnico | Acciones de Sanitización y Limpieza |
| :--- | :--- | :--- | :--- |
| `Sistema` | `novapos-system` | PHP 8, PDO, MySQL, BCrypt, Bootstrap | 1. Separar credenciales a `config.example.php`.<br>2. Crear script `database/schema.sql` y `database/seeds.sql` con datos demo genéricos.<br>3. Generar `README.md` con arquitectura, endpoints y manual de despliegue. |
| `WID_PRUEBAFINAL` | `wallet-id-platform` | PHP, MySQL, JavaScript, Bootstrap | 1. Eliminar logos y marcas de "Colegio Santa Cecilia / Chaleco".<br>2. Reemplazar por identidad neutra **"WalletID"**.<br>3. Purgar base de datos de números de carnet y nombres reales de alumnos.<br>4. Separar portal de usuario (`Wallet_Id_page`) y panel administrativo (`wallet_id_system`). |
| `asistencias.dipaldesign.com` | `attendance-track` | PHP, Webcam API, TCPDF, REST API | 1. **Sanitización Crítica:** Eliminar toda mención a "Dipal Design".<br>2. Eliminar dump SQL con planillas, fotos y registros de empleados reales (`dipaldes_asistencias (8).sql`).<br>3. Eliminar credenciales FTP (`.ftpquota`) y logs del servidor (`error_log`).<br>4. Crear `schema.sql` con 3 empleados ficticios de prueba. |

### B. Proyectos Colaborativos y Públicos a Enlazar Directamente

1. **`Promora Marketplace & PromoCode Engine`** (`Desarrollo-de-apis-Chocolatina/Promora-Marketplace`):
   - *Stack:* PHP / Laravel 11, PHPUnit, Postman Collection, REST API.
   - *Rol:* Motor de cupones, arquitectura de APIs y testing automatizado.
2. **`Biblioteca REST API`** (`RivasMel2024/biblioteca`):
   - *Stack:* PHP / Laravel, OpenAPI / Stoplight, Postman, Vite.
   - *Rol:* Documentación OpenAPI, contratos de API y testing.
3. **`Proyecto Final Arquitectura`** (`ProyectoFinalArquitectura/proyecto_final_arqui`):
   - *Stack:* TypeScript, Python, Docker Compose, Microservicios.
   - *Rol:* Arquitectura desacoplada basada en contenedores.
4. **`Cupon-X Platform`** (`RivasMel2024/webII_proyecto`):
   - *Stack:* JavaScript, Node/Express, PostgreSQL (PLpgSQL), Netlify.
   - *Rol:* Lógica de base de datos relacional y funciones PLpgSQL.
5. **`Enfoque App`** (`Gaboum11/enfoque_app`):
   - *Stack:* Flutter / Dart.
   - *Rol:* App móvil de productividad y gestión del tiempo.
6. **`DeliEat Assistant`** (`Gaboum11/DeliEat`):
   - *Stack:* Python, NLP, Flask, JavaScript.
   - *Rol:* Chatbot conversacional para pedidos gastronómicos.
7. **`Data Analytics Core System`** (`Dae51/Proyecto_DAI`):
   - *Stack:* Python (Arquitectura MVC pura: Controller, Model, View).
   - *Rol:* Procesamiento de datos estructurados.
8. **`Turimox`** (`ChristianRende22/Turimox`):
   - *Stack:* HTML5, CSS3, SCSS, JavaScript interactivo.
   - *Rol:* Plataforma turística y portal de administración.

---

## 3. Arquitectura del Repositorio del Portafolio

- **Estructura del Repositorio:**
  ```text
  portfolio/
  ├── index.html              # Estructura semántica accesible (Zero-Build)
  ├── css/
  │   └── style.css           # Variables CSS, Dark/Light mode, diseño responsive
  ├── js/
  │   ├── app.js              # Lógica de filtros, toggle de tema y animaciones
  │   └── projects-data.js    # Catálogo estructurado de los 11 proyectos
  ├── assets/
  │   ├── icons/              # Iconografía SVG optimizada
  │   └── screenshots/        # Capturas limpias de interfaces de proyectos
  └── README.md               # Documentación del portafolio y despliegue
  ```

- **Características de la Interfaz:**
  1. **Minimalismo Tipográfico:** Inspirado en Linear y Vercel (fuente Inter/Geist, contraste limpio, modo oscuro por defecto con interruptor claro/oscuro persistente).
  2. **Banner de Contribuciones:** Destaca el historial de código abierto y contribuciones activas (157+ commits anuales en `Gaboum11`, badges de tecnologías principales).
  3. **Filtro Dinámico:** Pestañas interactivas para filtrar instantáneamente:
     - `Todos (11)`
     - `Backend & APIs (4)`
     - `Fullstack & Arquitectura (3)`
     - `Mobile (1)`
     - `Python & IA (2)`
     - `Frontend (1)`
  4. **Tarjetas de Proyecto Detalladas:**
     - Título y propuesta de valor técnica.
     - Insignias de stack tecnológico.
     - Viñetas de logros técnicos clave (patrones, seguridad, base de datos).
     - Botones de acción: Enlace a repositorio GitHub y Documentación / Demo.
  5. **Sección de Contacto & Disponibilidad:** Enlaces directos a perfil de GitHub, LinkedIn y correo profesional.

---

## 4. Flujo de Autenticación y Despliegue en `gabom404`

1. **Gestión de Cuentas GitHub:**
   - La máquina cuenta con `gh auth` actualmente en `Gaboum11`.
   - Se configurará la sesión para interactuar con `gabom404` (mediante token PAT o `gh auth login`).
   - Se asegura la autoría de los commits con:
     ```bash
     git config user.name "gabom404"
     git config user.email "gemc1172005@gmail.com"
     ```
2. **Publicación en GitHub Pages:**
   - Creación del repositorio `portfolio` en la cuenta `gabom404`.
   - Habilitación de GitHub Pages apuntando a la rama `main` en la raíz `/`.
   - URL resultante: `https://gabom404.github.io/portfolio/`.

---

## 5. Criterios de Aceptación y Verificación

- [ ] Cero datos sensibles (sin contraseñas, sin datos personales de empleados ni nombres comerciales protegidos).
- [ ] Repositorios sanitizados de `htdocs` creados y probados con estructuras limpias.
- [ ] Sitio web del portafolio 100% responsivo en móvil y escritorio.
- [ ] Filtros de categorías funcionando en tiempo real sin recargar página.
- [ ] Conmutador de Modo Oscuro / Claro operativo con guardado en `localStorage`.
- [ ] Enlaces a los 11 proyectos comprobados y verificados contra errores 404.
