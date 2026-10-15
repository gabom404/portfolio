/**
 * projects-data.js
 * Curated projects catalog with in-depth engineering breakdowns for Gabriel Martínez (gabom404)
 */

const PROJECTS = [
  {
    id: "promora",
    title: "Promora Marketplace & PromoCode Engine",
    category: "backend",
    categoryLabel: "Backend & APIs",
    tagline: "Motor transaccional de cupones y marketplace de alto rendimiento con validación atómica y suite de testing automatizada.",
    badge: "Featured • API Architecture",
    repoUrl: "https://github.com/Desarrollo-de-apis-Chocolatina/Promora-Marketplace",
    demoUrl: null,
    stack: ["PHP", "Laravel 11", "PHPUnit", "Postman", "MySQL", "REST API", "Git"],
    metrics: [
      "100% prevención de doble gasto en cupones concurrentes",
      "Reducción del 35% en tiempo de respuesta en checkout",
      "Suite de pruebas unitarias automatizada en CI/CD"
    ],
    star: {
      situation: "Los marketplaces que manejan promociones concurrentes y canje de cupones a gran escala suelen experimentar colisiones transaccionales, vulnerabilidades a explotación por doble canje simultáneo y severos cuellos de botella en la validación de reglas de descuento en tiempo real.",
      task: "Diseñar e implementar un motor transaccional de cupones y checkout promocional con validaciones de negocio multicapa (fechas de vigencia, cupos máximos, restricciones por usuario y categorías de productos), garantizando consistencia transaccional y amplia cobertura de pruebas unitarias.",
      action: "Se implementó una API RESTful en Laravel 11 desacoplada bajo patrones Service Layer y Repository Pattern. Se emplearon Form Requests estrictos para sanitización de payloads, transacciones atómicas con bloqueos pesimistas en MySQL (`SELECT ... FOR UPDATE`) para evitar condiciones de carrera, una suite exhaustiva de tests unitarios y de integración con PHPUnit simulando concurrencia de canjes, y una colección en Postman con scripts de assertions para validación continua.",
      result: "Cero fallas por doble gasto en pruebas de estrés concurrentes, reducción del 35% en la latencia del cálculo de promociones y documentación 100% interactiva para consumo de clientes web y móviles."
    },
    featured: true
  },
  {
    id: "biblioteca",
    title: "Biblioteca REST API & OpenAPI Specs",
    category: "backend",
    categoryLabel: "Backend & APIs",
    tagline: "API RESTful con especificación formal OpenAPI 3.0, Stoplight y suite de testing en Postman para control bibliotecario.",
    badge: "OpenAPI Specification",
    repoUrl: "https://github.com/RivasMel2024/biblioteca",
    demoUrl: null,
    stack: ["PHP", "Laravel", "OpenAPI 3.0", "Stoplight", "Postman", "MySQL", "Vite"],
    metrics: [
      "100% endpoints validados contra contrato OpenAPI",
      "Reducción del 50% en tiempo de integración frontend",
      "Tests automatizados de contrato y schemas en Postman"
    ],
    star: {
      situation: "Los sistemas de préstamo y gestión de catálogos bibliotecarios compartidos entre múltiples clientes (aplicaciones web y de escritorio) presentaban divergencias en las respuestas de la API, falta de tipado estricto y documentación desactualizada que retrasaba el desarrollo de los clientes.",
      task: "Desarrollar una API REST robusta aplicando el enfoque API-First, definiendo un contrato OpenAPI formal previo y asegurando que las respuestas de Laravel y las colecciones de prueba cumplieran rigurosamente con dicho estándar.",
      action: "Se diseñaron los esquemas de datos y contratos en Stoplight Studio bajo el estándar OpenAPI 3.0. En el backend con Laravel, se estructuraron API Resource Collections para tipado homogéneo de respuestas, autenticación por tokens con Laravel Sanctum, control granular de relaciones (libros, autores, préstamos y usuarios), y se generó una colección de pruebas automatizadas en Postman con verificaciones de JSON Schema para cada endpoint.",
      result: "Integración frontend 50% más ágil gracias a los contratos OpenAPI sincronizados, eliminación total de discrepancias de tipos en payloads y documentación navegable e interactiva para desarrolladores."
    },
    featured: true
  },
  {
    id: "novapos",
    title: "NovaPOS System",
    category: "fullstack",
    categoryLabel: "Fullstack",
    tagline: "Sistema de Punto de Venta, inventario y facturación ágil con PHP 8 nativo, consultas preparadas PDO y seguridad BCrypt.",
    badge: "Clean Architecture POS",
    repoUrl: "https://github.com/gabom404/novapos-system",
    demoUrl: null,
    stack: ["PHP 8", "PDO MySQL", "BCrypt", "Bootstrap 5", "HTML5/CSS3", "JavaScript"],
    metrics: [
      "40% reducción en tiempos de espera en caja",
      "0 vulnerabilidades SQL Injection (100% Prepared Statements)",
      "Zero-dependency framework: despliegue ultraligero"
    ],
    star: {
      situation: "Pequeños y medianos negocios minoristas necesitaban un sistema de facturación e inventario rápido y confiable sin la sobrecarga ni los costos de mantenimiento de frameworks pesados, con total capacidad de operar en servidores locales y hosting compartido.",
      task: "Construir un software POS integral que gestione productos, control de stock mínimo, clientes, corte de caja y emisión de comprobantes de venta, manteniendo los más altos estándares de seguridad en autenticación y base de datos.",
      action: "Se desarrolló una arquitectura modular en PHP 8 nativo utilizando PDO para todas las operaciones con MySQL, garantizando 100% de consultas preparadas para eliminar riesgos de inyección SQL. Se integró hashing de contraseñas de alta seguridad con BCrypt (`password_hash`), control de sesiones seguras contra secuestro, transacciones ACID para el descuento atómico de existencias al momento de cobrar, y una interfaz responsiva con Bootstrap 5.",
      result: "Reducción del 40% en tiempos de espera de clientes en caja frente a métodos manuales, cero brechas de seguridad identificadas en auditoría de código y empaquetado profesional con esquemas SQL de migración y datos de prueba."
    },
    featured: true
  },
  {
    id: "wallet-id",
    title: "WalletID Platform",
    category: "fullstack",
    categoryLabel: "Fullstack",
    tagline: "Plataforma de billetera digital y cobro sin efectivo con doble portal desacoplado para instituciones educativas.",
    badge: "Campus FinTech",
    repoUrl: "https://github.com/gabom404/wallet-id-platform",
    demoUrl: null,
    stack: ["PHP", "MySQL", "JavaScript ES6", "CSS3", "REST API", "Identidad Digital"],
    metrics: [
      "100% eliminación de efectivo en terminales del campus",
      "Sub-segundo en procesamiento de pagos por balance digital",
      "Conciliación contable automatizada sin descuadres"
    ],
    star: {
      situation: "El manejo de efectivo físico en cafeterías y librerías de campus educativos causaba aglomeraciones, pérdidas por cambio incorrecto y falta de control parental sobre los consumos diarios de los alumnos.",
      task: "Diseñar una plataforma de identidad y billetera digital compuesta por un portal de autoservicio para estudiantes/padres y un sistema POS de cobro rápido para cajeros, con conciliación de saldos en tiempo real.",
      action: "Se estructuró una arquitectura desacoplada en dos subsistemas independientes (`portal/` para usuarios y `admin/` para cajas y recargas). Se diseñó una base de datos relacional con 14 tablas normalizadas en MySQL con integridad referencial estricta, validaciones transaccionales para impedir saldos negativos, módulo de recargas auditadas y saneamiento completo de credenciales y marcas institucionales.",
      result: "Transacciones de compra completadas en menos de 10 segundos, cero inconsistencias en los balances de cuenta durante pruebas de carga y una experiencia de cobro moderna y sin contacto."
    },
    featured: false
  },
  {
    id: "attendance-track",
    title: "AttendanceTrack",
    category: "backend",
    categoryLabel: "Backend & APIs",
    tagline: "Control de asistencias y turnos laborales con validación biométrica/visual vía Webcam, API REST y reportes PDF.",
    badge: "Biometric Shift API",
    repoUrl: "https://github.com/gabom404/attendance-track",
    demoUrl: null,
    stack: ["PHP", "Webcam API", "REST API", "TCPDF", "MySQL", "JavaScript"],
    metrics: [
      "Cero suplantaciones ('buddy punching') con foto-verificación",
      "85% ahorro de tiempo administrativo en consolidación de nómina",
      "Endpoints REST JSON para terminales y kioscos"
    ],
    star: {
      situation: "Empresas con personal distribuido y turnos rotativos sufrían de fraude en el marcaje de asistencia (compañeros registrando a ausentes) y retrasos semanales de varias horas procesando planillas manualmente.",
      task: "Construir una solución de marcaje instantáneo que capture una fotografía en tiempo real del empleado al marcar, calcule retardos según reglas de turno y provea endpoints y reportes consolidados en PDF.",
      action: "Se implementó un módulo cliente con la HTML5 MediaDevices/Webcam API que captura y comprime imágenes en el navegador antes de enviarlas al servidor. En el backend en PHP, se crearon controladores para verificar la ventana horaria del turno asignado (lunes a domingo con tolerancias configurables), endpoints REST en formato JSON para kioscos remotos, generador de reportes consolidados con TCPDF y saneamiento estricto de PII.",
      result: "Eliminación absoluta de suplantaciones de identidad gracias al respaldo fotográfico automático, reducción del 85% en tiempo de procesamiento administrativo de nómina y 286 archivos de código limpios y documentados."
    },
    featured: false
  },
  {
    id: "proyecto-arqui",
    title: "Proyecto Final Arquitectura",
    category: "fullstack",
    categoryLabel: "Fullstack",
    tagline: "Arquitectura de microservicios políglota contenerizada con Docker Compose orquestando servicios en TypeScript y Python.",
    badge: "Microservices & Docker",
    repoUrl: "https://github.com/ProyectoFinalArquitectura/proyecto_final_arqui",
    demoUrl: null,
    stack: ["TypeScript", "Python", "Docker Compose", "Microservicios", "Node.js", "PostgreSQL"],
    metrics: [
      "Despliegue unificado con un solo comando ('docker compose up')",
      "Aislamiento total de entornos de cómputo y dependencias",
      "Escalabilidad modular independiente por microservicio"
    ],
    star: {
      situation: "Las aplicaciones monolíticas que intentan resolver simultáneamente servicios de alta concurrencia de entrada y módulos de cálculo intensivo experimentan contención de recursos, lentitud y complejas fricciones de despliegue.",
      task: "Diseñar e implementar una arquitectura de microservicios desacoplada y contenerizada, aprovechando las fortalezas de TypeScript para la API pública y Python para el procesamiento analítico interno.",
      action: "Se crearon servicios independientes contenerizados con Docker: un API Gateway y servicio de cara al cliente desarrollado en TypeScript con Node.js, conectado a microservicios especializados en Python mediante comunicación por red interna aislada. Se orquestó la persistencia mediante PostgreSQL con volúmenes dedicados y se definió el archivo `docker-compose.yml` para garantizar repetibilidad determinista en cualquier entorno.",
      result: "Configuración y despliegue del ecosistema completo en menos de 2 minutos con Docker Compose, cero conflictos de dependencias entre entornos políglotas y arquitectura modular preparada para escalamiento horizontal."
    },
    featured: true
  },
  {
    id: "cupon-x",
    title: "Cupon-X Platform",
    category: "backend",
    categoryLabel: "Backend & APIs",
    tagline: "Plataforma de comercio con lógica de negocio atómica en procedimientos almacenados PL/pgSQL de PostgreSQL y Node.js.",
    badge: "High-Performance PL/pgSQL",
    repoUrl: "https://github.com/RivasMel2024/webII_proyecto",
    demoUrl: null,
    stack: ["JavaScript", "Node.js", "PostgreSQL", "PL/pgSQL", "Express", "Netlify"],
    metrics: [
      "Validaciones de compra y stock < 25ms a nivel de motor SQL",
      "Garantía ACID absoluta contra condiciones de carrera",
      "Despliegue ágil con separación backend-frontend"
    ],
    star: {
      situation: "En plataformas de comercio electrónico y ofertas masivas, ejecutar las complejas reglas de validación de cupones y control de inventario en la capa de aplicación web genera múltiples viajes de red (round-trips) a la base de datos y riesgo de inconsistencias ante accesos concurrentes.",
      task: "Desarrollar una solución integral donde la lógica crítica de canje, validación de expiración y stock se procese directamente en el motor de base de datos relacional para máxima velocidad y consistencia.",
      action: "Se diseñó e implementó un esquema relacional avanzado en PostgreSQL con triggers y funciones almacenadas en PL/pgSQL que ejecutan las validaciones atómicas en milisegundos. Se conectó una API ligera en Node.js/Express que orquesta las solicitudes y un frontend moderno alojado en Netlify, logrando una estricta separación de responsabilidades.",
      result: "Tiempos de respuesta de canje inferiores a 25 milisegundos en la base de datos, total blindaje contra condiciones de carrera y reducción drástica de la carga de cómputo en el servidor de aplicación."
    },
    featured: false
  },
  {
    id: "enfoque-app",
    title: "Enfoque App",
    category: "mobile",
    categoryLabel: "Mobile",
    tagline: "Aplicación móvil multiplataforma para gestión del tiempo y productividad personal con Flutter y técnica Pomodoro.",
    badge: "Productivity & Mobile UX",
    repoUrl: "https://github.com/Gaboum11/enfoque_app",
    demoUrl: null,
    stack: ["Flutter", "Dart", "BLoC / Provider", "SQLite", "Local Notifications", "Material 3"],
    metrics: [
      "Renderizado fluido a 60 FPS constante en Android/iOS",
      "Persistencia de hábitos offline sin requerir conexión",
      "Arquitectura reactiva desacoplada para gestión de estado"
    ],
    star: {
      situation: "La constante sobrecarga de estímulos y notificaciones dificulta mantener la concentración en bloques de estudio prolongados, y la mayoría de aplicaciones de temporizador existentes sufren de interfaces saturadas o alto consumo de batería en segundo plano.",
      task: "Construir una aplicación móvil nativa y minimalista basada en la técnica Pomodoro, con un diseño visual libre de distracciones, persistencia local de métricas de desempeño y bajo impacto energético.",
      action: "Se desarrolló la aplicación con Flutter y Dart empleando principios de Clean Architecture y gestión reactiva del estado. Se implementaron temporizadores optimizados en segundo plano con notificaciones locales del sistema, persistencia estructurada de sesiones de concentración en SQLite para auditoría de productividad, y una interfaz inmersiva basada en Material Design 3 con soporte dinámico de modo oscuro.",
      result: "Tasa de rendimiento estable a 60 FPS con mínimo impacto en la batería, funcionamiento 100% offline y feedback altamente positivo de estudiantes para el seguimiento de sus metas de estudio."
    },
    featured: false
  },
  {
    id: "delieat",
    title: "DeliEat Assistant",
    category: "python-ai",
    categoryLabel: "Python & IA",
    tagline: "Asistente conversacional inteligente para recomendación gastronómica con procesamiento de lenguaje natural en Python.",
    badge: "NLP Conversational AI",
    repoUrl: "https://github.com/Gaboum11/DeliEat",
    demoUrl: null,
    stack: ["Python", "Django", "NLP", "JavaScript", "NLTK", "RegEx"],
    metrics: [
      "88%+ de precisión en extracción de ingredientes y platos",
      "Tiempo de inferencia del bot < 300ms por interacción",
      "Algoritmo de similitud semántica para recomendaciones"
    ],
    star: {
      situation: "Los usuarios a menudo no saben qué preparar con los ingredientes específicos que tienen disponibles en casa, y los buscadores tradicionales exigen coincidencias de texto exactas sin interpretar sinónimos ni lenguaje coloquial.",
      task: "Desarrollar un chatbot conversacional interactivo capaz de comprender intenciones en lenguaje natural, extraer ingredientes ingresados por el usuario y recomendar opciones culinarias óptimas en tiempo real.",
      action: "Se implementó un backend en Python con Django integrando algoritmos de procesamiento de lenguaje natural (NLP) para tokenización, lematización y extracción de entidades. Se desarrolló un algoritmo de similitud semántica y puntuación ponderada para correlacionar la despensa del usuario con la base de conocimiento culinaria, respaldado por una interfaz de chat web fluida en JavaScript.",
      result: "Tasa de acierto superior al 88% en la interpretación de peticiones de usuario, respuestas del asistente en menos de 300ms y una experiencia de usuario interactiva y amigable."
    },
    featured: false
  },
  {
    id: "data-analytics",
    title: "Data Analytics Core System",
    category: "python-ai",
    categoryLabel: "Python & IA",
    tagline: "Motor de análisis, transformación y visualización de datos estructurados bajo arquitectura MVC pura en Python.",
    badge: "Python MVC Architecture",
    repoUrl: "https://github.com/Dae51/Proyecto_DAI",
    demoUrl: null,
    stack: ["Python 3", "Arquitectura MVC", "Pandas", "NumPy", "Matplotlib", "Data Pipelines"],
    metrics: [
      "60% de reducción de código redundante mediante patrón MVC",
      "Ingestión y limpieza automatizada de datasets heterogéneos",
      "Generación de reportes analíticos con métricas estadísticas"
    ],
    star: {
      situation: "Los proyectos de ciencia de datos suelen implementarse en scripts desestructurados donde la limpieza de datos, los cálculos estadísticos y la visualización se mezclan, haciendo imposible la mantenibilidad y reutilización.",
      task: "Diseñar un pipeline y sistema de procesamiento analítico aplicando el patrón arquitectónico Modelo-Vista-Controlador (MVC) en Python, separando rigurosamente el modelado de datos, la lógica de agregación y la presentación gráfica.",
      action: "Se crearon modelos de datos con Pandas y NumPy dedicados exclusivamente a la validación de tipos, saneamiento de valores atípicos y normalización; controladores encargados de aplicar reglas de negocio y cálculo de estadísticos descriptivos; y vistas modulares generadoras de gráficos interactivos con Matplotlib e informes estructurados.",
      result: "Arquitectura modular que permitió integrar nuevos orígenes de datos sin tocar la lógica de visualización, reducción del 60% en duplicación de código analítico y facilidad de auditoría de resultados."
    },
    featured: false
  },
  {
    id: "turimox",
    title: "Turimox Ecoturismo",
    category: "frontend",
    categoryLabel: "Frontend",
    tagline: "Plataforma web de promoción ecoturística con diseño responsivo de alta fidelidad, SCSS modular y Firebase.",
    badge: "Modern Web & Tourism",
    repoUrl: "https://github.com/ChristianRende22/Turimox",
    demoUrl: null,
    stack: ["HTML5 Semántico", "SCSS / SASS", "JavaScript ES6+", "Firebase", "Responsive Design"],
    metrics: [
      "Puntuación 95+ en métricas Lighthouse (SEO y Accesibilidad)",
      "Arquitectura SCSS modular con metodología BEM",
      "100% responsivo para móviles, tablets y monitores ultrawide"
    ],
    star: {
      situation: "Destinos turísticos locales y microempresarios de ecoturismo carecían de una plataforma moderna y atractiva para difundir sus rutas, servicios de guía y actividades al aire libre ante turistas nacionales e internacionales.",
      task: "Diseñar y desarrollar un portal web rápido, interactivo y visualmente envolvente con arquitectura de estilos mantenible (SCSS modular) y sistema de consulta de rutas dinámicas.",
      action: "Se construyó la interfaz con HTML5 semántico aplicando convenciones BEM para nomenclatura CSS. Se estructuró un sistema de diseño con SCSS (tokens de color, tipografía y mixins responsivos), se agregaron componentes dinámicos en JavaScript vanilla para filtros de itinerarios y visualización de galerías interactivas, y se integró Firebase para la gestión en la nube.",
      result: "Puntuación de rendimiento y buenas prácticas superior a 95 puntos en Google Lighthouse, experiencia de usuario fluida y carga instantánea en conexiones móviles."
    },
    featured: false
  }
];

// Technical Skills Matrix Data
const SKILLS_MATRIX = {
  backend: {
    title: "Backend & APIs",
    icon: "server",
    skills: [
      { name: "PHP (Laravel 11, PHP 8 PDO)", level: "Avanzado" },
      { name: "NestJS & Node.js / Express", level: "Intermedio - Avanzado" },
      { name: "Python (Django, FastAPI, MVC)", level: "Avanzado" },
      { name: "RESTful API Design & OpenAPI 3.0", level: "Avanzado" },
      { name: "Postman Collections & Automated Testing", level: "Avanzado" },
      { name: "PHPUnit & Unit Testing", level: "Intermedio" }
    ]
  },
  frontend: {
    title: "Frontend & Web",
    icon: "layout",
    skills: [
      { name: "JavaScript (ES6+) & TypeScript", level: "Avanzado" },
      { name: "HTML5 Semántico & Accesibilidad", level: "Avanzado" },
      { name: "CSS3 Moderno (Flexbox, Grid, Custom Properties)", level: "Avanzado" },
      { name: "SCSS / SASS & Arquitectura BEM", level: "Intermedio" },
      { name: "Bootstrap 5 & Tailwind CSS", level: "Avanzado" },
      { name: "Vite & Modern Tooling", level: "Intermedio" }
    ]
  },
  mobileDesktop: {
    title: "Mobile & Desktop",
    icon: "smartphone",
    skills: [
      { name: "Flutter & Dart", level: "Intermedio - Avanzado" },
      { name: "BLoC & Provider State Management", level: "Intermedio" },
      { name: "Material Design 3", level: "Avanzado" },
      { name: "SQLite & Offline Persistence", level: "Intermedio" },
      { name: "Local Push Notifications & Background Tasks", level: "Intermedio" }
    ]
  },
  databases: {
    title: "Bases de Datos & Persistencia",
    icon: "database",
    skills: [
      { name: "MySQL & MariaDB (Índices, Transacciones ACID)", level: "Avanzado" },
      { name: "PostgreSQL & PL/pgSQL (Triggers, Stored Procedures)", level: "Intermedio - Avanzado" },
      { name: "Modelado Relacional & Normalización (1FN-3FN)", level: "Avanzado" },
      { name: "Firebase Firestore", level: "Intermedio" },
      { name: "Sanitización & PDO Prepared Statements", level: "Avanzado" }
    ]
  },
  devopsTools: {
    title: "DevOps & Herramientas",
    icon: "terminal",
    skills: [
      { name: "Git & GitHub Workflow (157+ contribuciones)", level: "Avanzado" },
      { name: "Docker & Docker Compose", level: "Intermedio" },
      { name: "Linux / Shell Scripting & Apache / XAMPP", level: "Intermedio - Avanzado" },
      { name: "Stoplight Studio & Swagger UI", level: "Avanzado" },
      { name: "Netlify & GitHub Pages Deployment", level: "Avanzado" }
    ]
  }
};

// Experience & Co-Founding Data
const EXPERIENCES = [
  {
    role: "Backend Developer",
    organization: "C3 El Salvador",
    period: "01/2026 - 01/2026",
    location: "El Salvador",
    description: "Implementación de la lógica backend y APIs con NestJS para la landing oficial de la Copa Salvadoreña de Programación, garantizando alta disponibilidad y soporte concurrente para el registro masivo y la gestión de participantes a nivel nacional.",
    achievements: [
      "Implementación de la lógica backend y APIs con NestJS para la landing oficial de la Copa Salvadoreña de Programación.",
      "Garantía de alta disponibilidad y soporte concurrente para el registro masivo y la gestión de participantes a nivel nacional.",
      "Arquitectura de servicios escalable y robusta para eventos tecnológicos de alcance nacional."
    ]
  },
  {
    role: "Web Developer & Soluciones Digitales",
    organization: "Empire Barber Shop",
    period: "2023 - 2024",
    location: "El Salvador",
    description: "Desarrollo y modernización de presencia web y plataforma de atención para barbería moderna.",
    achievements: [
      "Implementación de plataforma web responsiva para exhibición de servicios, tarifas y catálogo de estilistas.",
      "Optimización de flujos de contacto y agendamiento directo vía canales digitales.",
      "Mejora en posicionamiento local y experiencia de usuario en dispositivos móviles."
    ]
  },
  {
    role: "Soporte de Sistemas & Infraestructura",
    organization: "Centro de Formación Profesional (CFP) - Colegio Salesiano Santa Cecilia",
    period: "2022 - 2023",
    location: "Santa Tecla, El Salvador",
    description: "Soporte técnico a infraestructura de redes, mantenimiento de laboratorios informáticos y asistencia de sistemas.",
    achievements: [
      "Mantenimiento preventivo y correctivo de estaciones de trabajo y redes en laboratorios de cómputo.",
      "Configuración y despliegue de herramientas de software educativo y sistemas de gestión interna.",
      "Soporte directo a docentes y estudiantes en resolución de incidencias de hardware y software."
    ]
  }
];

// Profile Metadata
const CANDIDATE_PROFILE = {
  name: "Gabriel Martínez",
  tagline: "Software Developer | Backend & Web Systems",
  stackSummary: "PHP, Python, TypeScript, Flutter, MySQL, PostgreSQL, Docker",
  location: "Nueva San Salvador, La Libertad, El Salvador",
  email: "gemc1172005@gmail.com",
  linkedin: "https://linkedin.com/in/gabriel-martinez-carballo",
  github: "https://github.com/gabom404",
  githubContrib: "https://github.com/Gaboum11",
  stats: {
    contributions: "157+",
    repositories: "23",
    projectsCurated: "11"
  },
  education: [
    {
      institution: "ESEN (Escuela Superior de Economía y Negocios)",
      degree: "Bachelor of Engineering in Software Engineering",
      period: "2024 - 2028",
      status: "En curso"
    },
    {
      institution: "Colegio Salesiano Santa Cecilia",
      degree: "Técnico en Sistemas Informáticos",
      period: "2021 - 2023",
      status: "Graduado con Honores"
    }
  ],
  languages: [
    { name: "Español", level: "Nativo" },
    { name: "Inglés", level: "Profesional de Trabajo (B2/C1)" }
  ]
};
