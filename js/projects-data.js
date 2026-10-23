/**
 * projects-data.js
 * Project catalogue for Gabriel Martínez (gabom404), in Spanish and English.
 *
 * Editorial rule: every fact must be checkable in the repository
 * (technologies, structure, tests). No invented figures.
 *  - team: true        → university team project
 *  - isWorkExperience  → built and deployed for a real business
 *  - repoUrl: null + private: true → private repository (not linked)
 */

var PROJECTS = [
  {
    id: "novapos",
    name: "NovaPOS",
    title: { es: "Punto de venta e inventario", en: "Point of sale and inventory" },
    category: "fullstack",
    isWorkExperience: true,
    workExperienceCompany: "Empire Barber Shop",
    tagline: {
      es: "Sistema de punto de venta, inventario y reportes desarrollado e implementado para Empire Barber Shop.",
      en: "Point of sale, inventory and reporting system built and deployed for Empire Barber Shop."
    },
    repoUrl: "https://github.com/gabom404/novapos-system",
    stack: ["PHP 8", "PDO", "MySQL", "Bootstrap", "JavaScript", "FPDF"],
    highlights: [
      { es: "Consultas preparadas con PDO en todo el sistema", en: "PDO prepared statements across the whole system" },
      { es: "Ventas registradas dentro de transacciones", en: "Sales recorded inside database transactions" },
      { es: "Contraseñas protegidas con password_hash (BCrypt)", en: "Passwords stored with password_hash (BCrypt)" }
    ],
    challenge: {
      es: "El negocio llevaba ventas e inventario a mano y necesitaba un sistema sencillo, sin licencias costosas.",
      en: "The business tracked sales and stock by hand and needed a simple system without expensive licences."
    },
    solution: {
      es: "Aplicación en PHP 8 con PDO y MySQL: productos con existencias mínimas, clientes, vendedores, ventas con descuento de inventario dentro de una transacción, tickets y reportes de ganancias en PDF.",
      en: "A PHP 8 application with PDO and MySQL: products with minimum stock, customers, sellers, sales that update stock inside a transaction, receipts and profit reports in PDF."
    }
  },
  {
    id: "attendance-track",
    name: "AttendanceTrack",
    title: { es: "Control de asistencia y turnos", en: "Attendance and shift tracking" },
    category: "backend",
    isWorkExperience: true,
    workExperienceCompany: "Dipal Design",
    tagline: {
      es: "Control de asistencia con credenciales QR leídas por cámara, horarios por turno y reportes en PDF, desarrollado e implementado para Dipal Design.",
      en: "Attendance tracking with QR badges read by the camera, shift schedules and PDF reports, built and deployed for Dipal Design."
    },
    repoUrl: "https://github.com/gabom404/attendance-track",
    stack: ["PHP", "MySQL", "JavaScript", "html5-qrcode", "TCPDF", "API REST"],
    highlights: [
      { es: "Marcaje con credencial QR y foto del empleado para confirmar identidad", en: "QR badge check-in with the employee photo to confirm identity" },
      { es: "Horarios de lunes a domingo con tolerancia y cálculo de horas extra", en: "Monday-to-Sunday shifts with grace periods and overtime calculation" },
      { es: "Endpoint REST en JSON y reportes consolidados en PDF", en: "JSON REST endpoint and consolidated PDF reports" }
    ],
    challenge: {
      es: "La asistencia del personal en distintos proyectos se registraba y consolidaba a mano.",
      en: "Staff attendance across several projects was recorded and consolidated by hand."
    },
    solution: {
      es: "Terminal web que lee la credencial QR con la cámara, muestra la foto del empleado y registra entrada o salida según su turno. El panel administrativo gestiona empleados, proyectos y justificaciones, y genera reportes con TCPDF. Todas las consultas usan sentencias preparadas.",
      en: "A web terminal reads the QR badge with the camera, shows the employee photo and records check-in or check-out against the shift. The admin panel manages employees, projects and excuses, and produces reports with TCPDF. Every query uses prepared statements."
    }
  },
  {
    id: "wallet-id",
    name: "WalletID",
    title: { es: "Billetera digital para campus", en: "Campus digital wallet" },
    category: "fullstack",
    tagline: {
      es: "Billetera digital y cobro sin efectivo con dos portales: uno para cajas y administración, y otro para titulares.",
      en: "Digital wallet and cashless payments with two portals: one for cashiers and admins, one for cardholders."
    },
    repoUrl: "https://github.com/gabom404/wallet-id-platform",
    stack: ["PHP", "MySQL", "JavaScript", "AJAX / JSON", "Bootstrap"],
    highlights: [
      { es: "Modelo relacional de 14 tablas", en: "14-table relational model" },
      { es: "Portal administrativo y portal del titular separados", en: "Separate admin and cardholder portals" },
      { es: "Permisos por rol y consultas parametrizadas", en: "Role-based permissions and parameterised queries" }
    ],
    challenge: {
      es: "El cobro en efectivo en cafeterías y librerías del campus generaba filas y poco control sobre el consumo.",
      en: "Cash payments at campus cafeterias and bookshops caused queues and gave little control over spending."
    },
    solution: {
      es: "Dos subsistemas sobre la misma base de datos: el administrativo gestiona productos, recargas, ventas y devoluciones; el portal permite al titular consultar saldo y movimientos. Contraseñas con BCrypt y permisos por rol.",
      en: "Two subsystems on the same database: the admin side handles products, top-ups, sales and refunds; the portal lets cardholders check their balance and history. BCrypt passwords and role-based permissions."
    }
  },
  {
    id: "promora",
    name: "Promora",
    title: { es: "Motor de códigos promocionales", en: "Promo code engine" },
    category: "backend",
    team: true,
    tagline: {
      es: "Motor de cupones y códigos promocionales con el dominio en PHP puro, integrado a Laravel en la capa de infraestructura y cubierto con pruebas automatizadas.",
      en: "Coupon and promo code engine with a pure-PHP domain, wired into Laravel at the infrastructure layer and covered by automated tests."
    },
    repoUrl: "https://github.com/Desarrollo-de-apis-Chocolatina/Promora-Marketplace",
    stack: ["PHP 8", "Laravel", "PHPUnit", "Postman", "MySQL", "API REST"],
    highlights: [
      { es: "Capas Domain, Application e Infrastructure separadas", en: "Separate Domain, Application and Infrastructure layers" },
      { es: "22 clases de prueba con PHPUnit", en: "22 PHPUnit test classes" },
      { es: "Colección de Postman para probar la API", en: "Postman collection to test the API" }
    ],
    challenge: {
      es: "Validar el canje de códigos promocionales (vigencia, límites de uso y restricciones por usuario) sin acoplar las reglas de negocio al framework.",
      en: "Validate promo code redemption (validity dates, usage limits and per-user rules) without tying the business rules to the framework."
    },
    solution: {
      es: "Las reglas viven en un dominio de PHP puro; Laravel solo se usa en la infraestructura (Eloquent, rutas y controladores). El canje se guarda dentro de una transacción y el comportamiento se valida con PHPUnit y una colección de Postman.",
      en: "The rules live in a pure-PHP domain; Laravel is only used for infrastructure (Eloquent, routes and controllers). Redemption is saved inside a transaction and the behaviour is checked with PHPUnit and a Postman collection."
    }
  },
  {
    id: "biblioteca",
    name: "Biblioteca API",
    title: { es: "API REST con contrato OpenAPI", en: "REST API with an OpenAPI contract" },
    category: "backend",
    team: true,
    tagline: {
      es: "API REST para préstamos y catálogo bibliotecario diseñada a partir de un contrato OpenAPI y autenticada con Laravel Sanctum.",
      en: "REST API for library loans and catalogue, designed from an OpenAPI contract and secured with Laravel Sanctum."
    },
    repoUrl: "https://github.com/RivasMel2024/biblioteca",
    stack: ["PHP", "Laravel", "Laravel Sanctum", "OpenAPI 3", "Stoplight", "Postman", "MySQL"],
    highlights: [
      { es: "Contrato OpenAPI diseñado en Stoplight antes de programar", en: "OpenAPI contract designed in Stoplight before coding" },
      { es: "Autenticación por tokens con Laravel Sanctum", en: "Token authentication with Laravel Sanctum" },
      { es: "Colección y entorno de Postman incluidos", en: "Postman collection and environment included" }
    ],
    challenge: {
      es: "Que los clientes de la API pudieran integrarse sin depender de documentación desactualizada.",
      en: "Let API clients integrate without relying on outdated documentation."
    },
    solution: {
      es: "Se definió primero el contrato OpenAPI (enfoque API-First) y luego se implementaron los endpoints en Laravel con API Resources para respuestas consistentes, autenticación con Sanctum y pruebas en Postman.",
      en: "The OpenAPI contract came first (API-first), then the endpoints were built in Laravel with API Resources for consistent responses, Sanctum authentication and Postman tests."
    }
  },
  {
    id: "eventos",
    name: { es: "Gestión de Eventos", en: "Event Manager" },
    title: { es: "Sistema de gestión de eventos", en: "Event management system" },
    category: "fullstack",
    team: true,
    tagline: {
      es: "Gestión de eventos, asistentes y registros con API en Flask, frontend en Next.js y todo el entorno en Docker Compose.",
      en: "Events, attendees and registrations with a Flask API, a Next.js frontend and the whole environment in Docker Compose."
    },
    repoUrl: "https://github.com/ProyectoFinalArquitectura/proyecto_final_arqui",
    stack: ["Python", "Flask", "PostgreSQL", "JWT", "Next.js", "TypeScript", "Docker Compose"],
    highlights: [
      { es: "API en Flask con autenticación JWT", en: "Flask API with JWT authentication" },
      { es: "Frontend en Next.js y TypeScript", en: "Next.js and TypeScript frontend" },
      { es: "Entorno completo con Docker Compose", en: "Full environment with Docker Compose" }
    ],
    challenge: {
      es: "Proyecto final de Arquitectura de Software: un sistema completo que cualquiera del equipo pudiera levantar igual.",
      en: "Final project for Software Architecture: a complete system anyone on the team could run the same way."
    },
    solution: {
      es: "Backend en Flask con middlewares de autenticación y manejo de errores, PostgreSQL 16 y frontend en Next.js; cada parte tiene su Dockerfile y se orquesta con Docker Compose.",
      en: "Flask backend with authentication and error-handling middleware, PostgreSQL 16 and a Next.js frontend; each part has its own Dockerfile, orchestrated with Docker Compose."
    }
  },
  {
    id: "cupon-x",
    name: "Cupon-X",
    title: { es: "Plataforma de cupones", en: "Coupon platform" },
    category: "backend",
    team: true,
    tagline: {
      es: "Plataforma de ofertas y cupones con la lógica de canje en funciones PL/pgSQL de PostgreSQL y una API en Node.js.",
      en: "Deals and coupons platform with redemption logic in PostgreSQL PL/pgSQL functions and a Node.js API."
    },
    repoUrl: "https://github.com/RivasMel2024/webII_proyecto",
    stack: ["JavaScript", "Node.js", "Express", "PostgreSQL", "PL/pgSQL", "Netlify"],
    highlights: [
      { es: "Reglas de canje en funciones PL/pgSQL", en: "Redemption rules in PL/pgSQL functions" },
      { es: "API en Node.js con Express", en: "Node.js API with Express" },
      { es: "Frontend publicado en Netlify", en: "Frontend deployed on Netlify" }
    ],
    challenge: {
      es: "Validar compras y existencias de cupones de forma consistente aunque varios usuarios compren al mismo tiempo.",
      en: "Keep coupon purchases and stock consistent even when several users buy at the same time."
    },
    solution: {
      es: "La validación crítica se ejecuta en la base de datos mediante funciones PL/pgSQL; la API en Express orquesta las solicitudes y el frontend se despliega por separado en Netlify.",
      en: "Critical validation runs inside the database through PL/pgSQL functions; the Express API handles requests and the frontend is deployed separately on Netlify."
    }
  },
  {
    id: "enfoque-app",
    name: "Enfoque",
    title: { es: "App de concentración", en: "Focus app" },
    category: "mobile",
    team: true,
    tagline: {
      es: "Aplicación móvil en Flutter para organizar tareas y sesiones de concentración tipo Pomodoro.",
      en: "Flutter mobile app to organise tasks and Pomodoro-style focus sessions."
    },
    repoUrl: "https://github.com/Gaboum11/enfoque_app",
    stack: ["Flutter", "Dart", "Material 3"],
    highlights: [
      { es: "Sesiones de enfoque, tareas e historial", en: "Focus sessions, tasks and history" },
      { es: "Interfaz con Material 3", en: "Material 3 interface" },
      { es: "Código organizado en modelos, pantallas y widgets", en: "Code organised into models, screens and widgets" }
    ],
    challenge: {
      es: "Las apps de temporizador suelen tener interfaces recargadas que distraen.",
      en: "Timer apps often have busy interfaces that get in the way."
    },
    solution: {
      es: "App en Flutter con pantallas de bienvenida, tareas, sesión activa, historial y perfil, con un tema propio basado en Material 3.",
      en: "A Flutter app with welcome, tasks, active session, history and profile screens, using a custom Material 3 theme."
    }
  },
  {
    id: "delieat",
    name: "DeliEat",
    title: { es: "Recetas con IA", en: "AI recipes" },
    category: "python-ai",
    private: true,
    tagline: {
      es: "Aplicación web que genera recetas a partir de los ingredientes que el usuario tiene en casa, usando la API de OpenAI.",
      en: "Web app that suggests recipes from the ingredients you have at home, using the OpenAI API."
    },
    repoUrl: null,
    stack: ["Python", "Django REST Framework", "React", "Tailwind CSS", "OpenAI API"],
    highlights: [
      { es: "Endpoint en Django REST Framework que consulta a la API de OpenAI", en: "Django REST Framework endpoint that calls the OpenAI API" },
      { es: "Prompt diseñado para devolver receta, ingredientes y pasos", en: "Prompt designed to return a recipe, ingredients and steps" },
      { es: "Frontend en React con Tailwind CSS", en: "React frontend with Tailwind CSS" }
    ],
    challenge: {
      es: "Proponer qué cocinar con ingredientes sueltos sin depender de búsquedas exactas.",
      en: "Suggest what to cook from a handful of ingredients without needing exact searches."
    },
    solution: {
      es: "El frontend en React envía los ingredientes a un endpoint de Django REST Framework, que arma el prompt y devuelve una receta estructurada generada por el modelo.",
      en: "The React frontend sends the ingredients to a Django REST Framework endpoint, which builds the prompt and returns a structured recipe generated by the model."
    }
  },
  {
    id: "databusters",
    name: "Databusters",
    title: { es: "Inventario y ventas", en: "Inventory and sales" },
    category: "python-ai",
    team: true,
    private: true,
    tagline: {
      es: "Aplicación de escritorio para inventario y ventas de uniformes médicos con arquitectura MVC y capa DAO.",
      en: "Desktop app for medical uniform inventory and sales, with an MVC architecture and a DAO layer."
    },
    repoUrl: null,
    stack: ["Python 3", "PyQt6", "MySQL", "bcrypt", "Matplotlib"],
    highlights: [
      { es: "Arquitectura MVC con capa DAO para el acceso a datos", en: "MVC architecture with a DAO layer for data access" },
      { es: "CRUD de usuarios, productos, inventario, telas y colores", en: "CRUD for users, products, inventory, fabrics and colours" },
      { es: "Dashboard con gráficas en Matplotlib", en: "Dashboard with Matplotlib charts" }
    ],
    challenge: {
      es: "Controlar inventario, telas y ventas de un negocio de uniformes que trabajaba con hojas sueltas.",
      en: "Track inventory, fabrics and sales for a uniform business that worked on loose sheets of paper."
    },
    solution: {
      es: "Aplicación de escritorio en PyQt6 que separa modelos, controladores y vistas, con DAOs sobre MySQL, contraseñas con bcrypt y un dashboard de ventas.",
      en: "A PyQt6 desktop app that separates models, controllers and views, with DAOs over MySQL, bcrypt passwords and a sales dashboard."
    }
  },
  {
    id: "turimox",
    name: "Turimox",
    title: { es: "Portal de ecoturismo", en: "Eco-tourism site" },
    category: "frontend",
    team: true,
    tagline: {
      es: "Sitio web para promocionar rutas y actividades de ecoturismo, con estilos en SCSS modular y Firebase.",
      en: "Website promoting eco-tourism routes and activities, with modular SCSS styles and Firebase."
    },
    repoUrl: "https://github.com/ChristianRende22/Turimox",
    stack: ["HTML5", "SCSS", "JavaScript", "Firebase"],
    highlights: [
      { es: "Estilos organizados en módulos SCSS", en: "Styles organised into SCSS modules" },
      { es: "Integración con Firebase", en: "Firebase integration" },
      { es: "Diseño responsivo para móvil y escritorio", en: "Responsive layout for mobile and desktop" }
    ],
    challenge: {
      es: "Dar a destinos y emprendedores de ecoturismo un sitio atractivo para difundir sus rutas.",
      en: "Give eco-tourism destinations and small operators an attractive site to promote their routes."
    },
    solution: {
      es: "Sitio en HTML semántico con un sistema de estilos SCSS (variables, componentes y reglas responsivas), interacciones en JavaScript y Firebase como backend.",
      en: "Semantic HTML with an SCSS style system (variables, components and responsive rules), JavaScript interactions and Firebase as the backend."
    }
  }
];

if (typeof window !== 'undefined') window.PROJECTS = PROJECTS;
