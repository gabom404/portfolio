/**
 * projects-data.js
 * Catálogo de proyectos de Gabriel Martínez (gabom404).
 *
 * Criterio editorial: cada dato debe poder comprobarse en el repositorio
 * (tecnologías, estructura, pruebas). Los proyectos de equipo se marcan con `team: true`.
 * `repoUrl: null` + `private: true` indica un repositorio privado (no se enlaza).
 */

const PROJECTS = [
  {
    id: "promora",
    title: "Promora: Motor de Códigos Promocionales",
    category: "backend",
    categoryLabel: "Backend y APIs",
    team: true,
    tagline: "Motor de cupones y códigos promocionales con el dominio en PHP puro, integrado a Laravel en la capa de infraestructura y cubierto con pruebas automatizadas.",
    repoUrl: "https://github.com/Desarrollo-de-apis-Chocolatina/Promora-Marketplace",
    stack: ["PHP 8", "Laravel", "PHPUnit", "Postman", "MySQL", "API REST"],
    highlights: [
      "Capas Domain, Application e Infrastructure separadas",
      "22 clases de prueba con PHPUnit",
      "Colección de Postman para probar la API"
    ],
    challenge: "Validar el canje de códigos promocionales (vigencia, límites de uso y restricciones por usuario) sin acoplar las reglas de negocio al framework.",
    solution: "Las reglas viven en un dominio de PHP puro; Laravel solo se usa en la infraestructura (Eloquent, rutas y controladores). El canje se persiste dentro de una transacción y el comportamiento se valida con PHPUnit y una colección de Postman."
  },
  {
    id: "biblioteca",
    title: "Biblioteca: API REST con Contrato OpenAPI",
    category: "backend",
    categoryLabel: "Backend y APIs",
    team: true,
    tagline: "API REST para préstamos y catálogo bibliotecario diseñada a partir de un contrato OpenAPI y autenticada con Laravel Sanctum.",
    repoUrl: "https://github.com/RivasMel2024/biblioteca",
    stack: ["PHP", "Laravel", "Laravel Sanctum", "OpenAPI 3", "Stoplight", "Postman", "MySQL"],
    highlights: [
      "Contrato OpenAPI diseñado en Stoplight antes de programar",
      "Autenticación por tokens con Laravel Sanctum",
      "Colección y entorno de Postman incluidos"
    ],
    challenge: "Que los clientes de la API pudieran integrarse sin depender de documentación desactualizada.",
    solution: "Se definió primero el contrato OpenAPI (enfoque API-First) y luego se implementaron los endpoints en Laravel con API Resources para respuestas consistentes, autenticación con Sanctum y pruebas en Postman."
  },
  {
    id: "novapos",
    title: "NovaPOS: Punto de Venta e Inventario",
    category: "fullstack",
    categoryLabel: "Full Stack",
    isWorkExperience: true,
    workExperienceCompany: "Empire Barber Shop",
    tagline: "Sistema de punto de venta, inventario y reportes desarrollado e implementado para Empire Barber Shop.",
    repoUrl: "https://github.com/gabom404/novapos-system",
    stack: ["PHP 8", "PDO", "MySQL", "Bootstrap", "JavaScript", "FPDF"],
    highlights: [
      "Consultas preparadas con PDO en todo el sistema",
      "Ventas registradas dentro de transacciones",
      "Contraseñas protegidas con password_hash (BCrypt)"
    ],
    challenge: "El negocio llevaba ventas e inventario a mano y necesitaba un sistema sencillo, sin licencias costosas.",
    solution: "Aplicación en PHP 8 con PDO y MySQL: productos con existencias mínimas, clientes, vendedores, ventas con descuento de inventario dentro de una transacción, tickets y reportes de ganancias en PDF."
  },
  {
    id: "attendance-track",
    title: "AttendanceTrack: Control de Asistencia y Turnos",
    category: "backend",
    categoryLabel: "Backend y APIs",
    isWorkExperience: true,
    workExperienceCompany: "Dipal Design",
    tagline: "Control de asistencia con credenciales QR leídas por cámara, horarios por turno y reportes en PDF, desarrollado e implementado para Dipal Design.",
    repoUrl: "https://github.com/gabom404/attendance-track",
    stack: ["PHP", "MySQL", "JavaScript", "html5-qrcode", "TCPDF", "API REST"],
    highlights: [
      "Marcaje con credencial QR y foto del empleado para confirmar identidad",
      "Horarios de lunes a domingo con tolerancia y cálculo de horas extra",
      "Endpoint REST en JSON y reportes consolidados en PDF"
    ],
    challenge: "La asistencia del personal en distintos proyectos se registraba y consolidaba a mano.",
    solution: "Terminal web que lee la credencial QR con la cámara, muestra la foto del empleado y registra entrada o salida según su turno. El panel administrativo gestiona empleados, proyectos, justificaciones y genera reportes con TCPDF. Todas las consultas usan sentencias preparadas."
  },
  {
    id: "wallet-id",
    title: "WalletID: Billetera Digital para Campus",
    category: "fullstack",
    categoryLabel: "Full Stack",
    tagline: "Billetera digital y cobro sin efectivo con dos portales: uno para cajas y administración, y otro para titulares.",
    repoUrl: "https://github.com/gabom404/wallet-id-platform",
    stack: ["PHP", "MySQL", "JavaScript", "AJAX / JSON", "Bootstrap"],
    highlights: [
      "Modelo relacional de 14 tablas",
      "Portal administrativo y portal del titular separados",
      "Permisos por rol y consultas parametrizadas"
    ],
    challenge: "El cobro en efectivo en cafeterías y librerías del campus generaba filas y poco control sobre el consumo.",
    solution: "Dos subsistemas sobre la misma base de datos: el administrativo gestiona productos, recargas, ventas y devoluciones; el portal permite al titular consultar saldo y movimientos. Contraseñas con BCrypt y permisos por rol."
  },
  {
    id: "eventos",
    title: "Sistema de Gestión de Eventos",
    category: "fullstack",
    categoryLabel: "Full Stack",
    team: true,
    tagline: "Gestión de eventos, asistentes y registros con API en Flask, frontend en Next.js y todo el entorno en Docker Compose.",
    repoUrl: "https://github.com/ProyectoFinalArquitectura/proyecto_final_arqui",
    stack: ["Python", "Flask", "PostgreSQL", "JWT", "Next.js", "TypeScript", "Docker Compose"],
    highlights: [
      "API en Flask con autenticación JWT",
      "Frontend en Next.js y TypeScript",
      "Entorno completo con Docker Compose"
    ],
    challenge: "Proyecto final de Arquitectura de Software: un sistema completo que cualquiera del equipo pudiera levantar igual.",
    solution: "Backend en Flask con middlewares de autenticación y manejo de errores, PostgreSQL 16 y frontend en Next.js; cada parte tiene su Dockerfile y se orquesta con Docker Compose."
  },
  {
    id: "cupon-x",
    title: "Cupon-X: Plataforma de Cupones",
    category: "backend",
    categoryLabel: "Backend y APIs",
    team: true,
    tagline: "Plataforma de ofertas y cupones con la lógica de canje en funciones PL/pgSQL de PostgreSQL y una API en Node.js.",
    repoUrl: "https://github.com/RivasMel2024/webII_proyecto",
    stack: ["JavaScript", "Node.js", "Express", "PostgreSQL", "PL/pgSQL", "Netlify"],
    highlights: [
      "Reglas de canje en funciones PL/pgSQL",
      "API en Node.js con Express",
      "Frontend publicado en Netlify"
    ],
    challenge: "Validar compras y existencias de cupones de forma consistente aunque varios usuarios compren al mismo tiempo.",
    solution: "La validación crítica se ejecuta en la base de datos mediante funciones PL/pgSQL; la API en Express orquesta las solicitudes y el frontend se despliega por separado en Netlify."
  },
  {
    id: "enfoque-app",
    title: "Enfoque: App de Concentración",
    category: "mobile",
    categoryLabel: "Desarrollo Móvil",
    team: true,
    tagline: "Aplicación móvil en Flutter para organizar tareas y sesiones de concentración tipo Pomodoro.",
    repoUrl: "https://github.com/Gaboum11/enfoque_app",
    stack: ["Flutter", "Dart", "Material 3"],
    highlights: [
      "Sesiones de enfoque, tareas e historial",
      "Interfaz con Material 3",
      "Código organizado en modelos, pantallas y widgets"
    ],
    challenge: "Las apps de temporizador suelen tener interfaces recargadas que distraen.",
    solution: "App en Flutter con pantallas de bienvenida, tareas, sesión activa, historial y perfil, con un tema propio basado en Material 3."
  },
  {
    id: "delieat",
    title: "DeliEat: Recetas con IA",
    category: "python-ai",
    categoryLabel: "Python e IA",
    private: true,
    tagline: "Aplicación web que genera recetas a partir de los ingredientes que el usuario tiene en casa, usando la API de OpenAI.",
    repoUrl: null,
    stack: ["Python", "Django REST Framework", "React", "Tailwind CSS", "OpenAI API"],
    highlights: [
      "Endpoint en Django REST Framework que consulta a la API de OpenAI",
      "Prompt diseñado para devolver receta, ingredientes y pasos",
      "Frontend en React con Tailwind CSS"
    ],
    challenge: "Proponer qué cocinar con ingredientes sueltos sin depender de búsquedas exactas.",
    solution: "El frontend en React envía los ingredientes a un endpoint de Django REST Framework, que arma el prompt y devuelve una receta estructurada generada por el modelo."
  },
  {
    id: "databusters",
    title: "Databusters: Inventario y Ventas",
    category: "python-ai",
    categoryLabel: "Python e IA",
    team: true,
    private: true,
    tagline: "Aplicación de escritorio para inventario y ventas de uniformes médicos con arquitectura MVC y capa DAO.",
    repoUrl: null,
    stack: ["Python 3", "PyQt6", "MySQL", "bcrypt", "Matplotlib"],
    highlights: [
      "Arquitectura MVC con capa DAO para el acceso a datos",
      "CRUD de usuarios, productos, inventario, telas y colores",
      "Dashboard con gráficas en Matplotlib"
    ],
    challenge: "Controlar inventario, telas y ventas de un negocio de uniformes que trabajaba con hojas sueltas.",
    solution: "Aplicación de escritorio en PyQt6 que separa modelos, controladores y vistas, con DAOs sobre MySQL, contraseñas con bcrypt y un dashboard de ventas."
  },
  {
    id: "turimox",
    title: "Turimox: Portal de Ecoturismo",
    category: "frontend",
    categoryLabel: "Frontend Web",
    team: true,
    tagline: "Sitio web para promocionar rutas y actividades de ecoturismo, con estilos en SCSS modular y Firebase.",
    repoUrl: "https://github.com/ChristianRende22/Turimox",
    stack: ["HTML5", "SCSS", "JavaScript", "Firebase", "Diseño responsivo"],
    highlights: [
      "Estilos organizados en módulos SCSS",
      "Integración con Firebase",
      "Diseño responsivo para móvil y escritorio"
    ],
    challenge: "Dar a destinos y emprendedores de ecoturismo un sitio atractivo para difundir sus rutas.",
    solution: "Sitio en HTML semántico con un sistema de estilos SCSS (variables, componentes y reglas responsivas), interacciones en JavaScript y Firebase como backend."
  }
];
