/**
 * projects-data.js
 * Curated projects catalog with in-depth engineering breakdowns for Gabriel Martínez (gabom404)
 */

const PROJECTS = [
  {
    id: "promora",
    title: "Promora: Motor Transaccional de Cupones",
    category: "backend",
    categoryLabel: "Backend y APIs",
    tagline: "Motor transaccional de cupones y catálogo de ofertas de alto rendimiento con validación atómica y pruebas unitarias automatizadas.",
    badge: "Arquitectura de APIs",
    repoUrl: "https://github.com/Desarrollo-de-apis-Chocolatina/Promora-Marketplace",
    demoUrl: null,
    stack: ["PHP", "Laravel 11", "PHPUnit", "Postman", "MySQL", "API REST", "Git"],
    metrics: [
      "100% prevención de doble gasto en cupones concurrentes",
      "Reducción del 35% en tiempo de procesamiento de compras",
      "Batería de pruebas unitarias automatizadas con PHPUnit"
    ],
    star: {
      situation: "Las plataformas de comercio digital que procesan promociones concurrentes y canje masivo de cupones suelen experimentar colisiones transaccionales, vulnerabilidades por doble canje simultáneo y cuellos de botella en la validación de reglas de descuento en tiempo real.",
      task: "Diseñar e implementar un motor transaccional de cupones y procesamiento promocional de compras con validaciones de negocio multicapa (vigencia temporal, límites máximos de uso, restricciones por usuario y categorías de productos), garantizando consistencia transaccional y amplia cobertura de pruebas unitarias.",
      action: "Se implementó una API REST desacoplada en Laravel 11 bajo patrones de Capa de Servicio (Service Layer) y Repositorio. Se emplearon validaciones estrictas en Form Requests para sanitización de datos, transacciones atómicas con bloqueos pesimistas en MySQL (`SELECT ... FOR UPDATE`) para evitar condiciones de carrera, una batería exhaustiva de pruebas unitarias y de integración con PHPUnit simulando concurrencia de canjes, y una colección en Postman con aserciones automatizadas para validación continua.",
      result: "Cero fallas por doble gasto en pruebas de estrés concurrentes, reducción del 35% en la latencia del cálculo de promociones y documentación interactiva para consumo de clientes web y móviles."
    },
    featured: true
  },
  {
    id: "biblioteca",
    title: "Biblioteca: API REST y Contratos OpenAPI",
    category: "backend",
    categoryLabel: "Backend y APIs",
    tagline: "API REST con especificación formal OpenAPI 3.0, Stoplight y batería de pruebas automatizadas en Postman para control bibliotecario.",
    badge: "Especificación OpenAPI 3.0",
    repoUrl: "https://github.com/RivasMel2024/biblioteca",
    demoUrl: null,
    stack: ["PHP", "Laravel", "OpenAPI 3.0", "Stoplight", "Postman", "MySQL", "Vite"],
    metrics: [
      "100% de puntos de enlace validados contra contrato OpenAPI",
      "Reducción del 50% en tiempo de integración con clientes web",
      "Pruebas automatizadas de contrato y esquemas en Postman"
    ],
    star: {
      situation: "Los sistemas de préstamo y gestión de catálogos bibliotecarios compartidos entre múltiples clientes (aplicaciones web y de escritorio) presentaban divergencias en las respuestas de la API, falta de tipado estricto y documentación desactualizada que retrasaba el desarrollo de los clientes.",
      task: "Desarrollar una API REST robusta aplicando el enfoque de diseño primero (API-First), definiendo un contrato OpenAPI formal previo y asegurando que las respuestas de Laravel y las colecciones de prueba cumplieran rigurosamente con dicho estándar.",
      action: "Se diseñaron los esquemas de datos y contratos en Stoplight Studio bajo el estándar OpenAPI 3.0. En el backend con Laravel, se estructuraron colecciones de recursos API (Resource Collections) para tipado homogéneo de respuestas, autenticación por tokens con Laravel Sanctum, control granular de relaciones (libros, autores, préstamos y usuarios), y se generó una colección de pruebas automatizadas en Postman con verificaciones de esquemas JSON para cada punto de enlace.",
      result: "Integración de clientes web un 50% más ágil gracias a los contratos OpenAPI sincronizados, eliminación total de discrepancias de tipos en cargas útiles y documentación navegable e interactiva para desarrolladores."
    },
    featured: true
  },
  {
    id: "novapos",
    title: "NovaPOS: Sistema de Punto de Venta",
    category: "fullstack",
    categoryLabel: "Full Stack",
    isWorkExperience: true,
    workExperienceCompany: "Empire Barber Shop",
    tagline: "Sistema comercial de Punto de Venta, inventario y facturación desarrollado e implementado en producción para Empire Barber Shop con PHP 8 nativo, consultas preparadas PDO y seguridad BCrypt.",
    badge: "Experiencia Laboral • Sistema en Producción",
    repoUrl: "https://github.com/gabom404/novapos-system",
    demoUrl: null,
    stack: ["PHP 8", "PDO MySQL", "BCrypt", "Bootstrap 5", "HTML5 y CSS3", "JavaScript"],
    metrics: [
      "Implementado y operando en producción comercial para Empire Barber Shop",
      "Reducción del 40% en tiempos de espera en caja y mostrador",
      "0 vulnerabilidades de inyección SQL (100% consultas preparadas)"
    ],
    star: {
      situation: "Durante mi experiencia laboral para Empire Barber Shop, el negocio requería modernizar su operación y sustituir el registro manual por un sistema comercial de punto de venta, facturación rápida y administración de inventario sin incurrir en licencias costosas ni marcos de trabajo pesados.",
      task: "Construir y desplegar en producción un software de punto de venta integral para la gestión ágil de productos, inventario con existencias mínimas, clientes, corte de caja diario y emisión de comprobantes, manteniendo altos estándares de seguridad y confiabilidad operativa.",
      action: "Se diseñó y programó en producción una arquitectura modular en PHP 8 nativo utilizando PDO para todas las operaciones con MySQL, garantizando el 100% de consultas preparadas para eliminar riesgos de inyección SQL. Se integró cifrado de contraseñas de alta seguridad con BCrypt (`password_hash`), control de sesiones seguras contra secuestro, transacciones ACID para el descuento atómico de existencias al momento de cobrar, y una interfaz responsiva con Bootstrap 5.",
      result: "Despliegue exitoso en producción para Empire Barber Shop con reducción del 40% en tiempos de espera de clientes en caja frente a métodos manuales, cero brechas de seguridad identificadas en auditoría de código y empaquetado profesional con esquemas SQL de migración y datos de prueba."
    },
    featured: true
  },
  {
    id: "wallet-id",
    title: "WalletID: Billetera Digital Institucional",
    category: "fullstack",
    categoryLabel: "Full Stack",
    tagline: "Plataforma de billetera digital y cobro sin efectivo con doble portal desacoplado para instituciones educativas.",
    badge: "Tecnología Financiera para Campus",
    repoUrl: "https://github.com/gabom404/wallet-id-platform",
    demoUrl: null,
    stack: ["PHP", "MySQL", "JavaScript ES6", "CSS3", "API REST", "Identidad Digital"],
    metrics: [
      "100% de eliminación de efectivo en terminales del campus",
      "Procesamiento de pagos por saldo digital en menos de un segundo",
      "Conciliación contable automatizada sin descuadres"
    ],
    star: {
      situation: "El manejo de efectivo físico en cafeterías y librerías de campus educativos causaba aglomeraciones, pérdidas por cambio incorrecto y falta de control de los responsables de familia sobre los consumos diarios de los alumnos.",
      task: "Diseñar una plataforma de identidad y billetera digital compuesta por un portal de autoservicio para estudiantes y tutores, y un sistema de cobro rápido para cajas, con conciliación de saldos en tiempo real.",
      action: "Se estructuró una arquitectura desacoplada en dos subsistemas independientes (portal de autoservicio para usuarios y módulo administrativo para cajas y recargas). Se diseñó una base de datos relacional con 14 tablas normalizadas en MySQL con integridad referencial estricta, validaciones transaccionales para impedir saldos negativos, módulo de recargas auditadas y saneamiento completo de credenciales institucionales.",
      result: "Transacciones de compra completadas en menos de 10 segundos, cero inconsistencias en los balances de cuenta durante pruebas de carga y una experiencia de cobro moderna y sin contacto."
    },
    featured: false
  },
  {
    id: "attendance-track",
    title: "AttendanceTrack: Control de Asistencia y Turnos",
    category: "backend",
    categoryLabel: "Backend y APIs",
    isWorkExperience: true,
    workExperienceCompany: "Dipal Design",
    tagline: "Sistema comercial de control de asistencias y turnos laborales con validación biométrica/visual vía cámara web, desarrollado e implementado en producción para Dipal Design.",
    badge: "Experiencia Laboral • Sistema en Producción",
    repoUrl: "https://github.com/gabom404/attendance-track",
    demoUrl: null,
    stack: ["PHP", "API de Cámara Web", "API REST", "TCPDF", "MySQL", "JavaScript"],
    metrics: [
      "Implementado y operando en entorno productivo real para Dipal Design",
      "Cero suplantaciones de identidad mediante foto-verificación en vivo",
      "85% de ahorro de tiempo administrativo en consolidación de planillas"
    ],
    star: {
      situation: "Durante mi experiencia laboral en Dipal Design, la empresa contaba con personal distribuido y turnos rotativos donde se presentaban retrasos en la toma de asistencia, riesgos de suplantación de identidad y más de 8 horas semanales invertidas en la consolidación manual de planillas.",
      task: "Diseñar, desarrollar e implementar en producción para Dipal Design una solución de marcaje instantáneo que capture una fotografía en tiempo real del empleado al marcar, calcule retardos según reglas de turno y provea puntos de enlace REST y reportes consolidados en PDF.",
      action: "Se implementó en producción un módulo cliente con la API de dispositivos multimedia de HTML5 que captura y comprime imágenes en el navegador antes de enviarlas al servidor. En el backend en PHP y MySQL, se crearon controladores para verificar la ventana horaria del turno asignado (lunes a domingo con tolerancias configurables), puntos de enlace REST en formato JSON para terminales de autoservicio, generador de reportes consolidados con TCPDF y saneamiento estricto de datos sensibles.",
      result: "Puesta en marcha exitosa en producción en Dipal Design con eliminación total de suplantaciones de identidad gracias al respaldo fotográfico automático, reducción del 85% en tiempo de procesamiento administrativo de nómina y 286 archivos de código limpios y documentados."
    },
    featured: false
  },
  {
    id: "proyecto-arqui",
    title: "Plataforma de Microservicios Contenerizados",
    category: "fullstack",
    categoryLabel: "Full Stack",
    tagline: "Arquitectura de microservicios políglota contenerizada con Docker Compose orquestando servicios en TypeScript y Python.",
    badge: "Microservicios y Docker",
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
      task: "Diseñar e implementar una arquitectura de microservicios desacoplada y contenerizada, aprovechando las fortalezas de TypeScript para la pasarela de la API pública y Python para el procesamiento analítico interno.",
      action: "Se crearon servicios independientes contenerizados con Docker: una pasarela de API y servicio de cara al cliente desarrollado en TypeScript con Node.js, conectado a microservicios especializados en Python mediante comunicación por red interna aislada. Se orquestó la persistencia mediante PostgreSQL con volúmenes dedicados y se definió el archivo `docker-compose.yml` para garantizar repetibilidad determinista en cualquier entorno.",
      result: "Configuración y despliegue del ecosistema completo en menos de 2 minutos con Docker Compose, cero conflictos de dependencias entre entornos políglotas y arquitectura modular preparada para escalamiento horizontal."
    },
    featured: true
  },
  {
    id: "cupon-x",
    title: "Cupon-X: Motor de Cupones de Alto Desempeño",
    category: "backend",
    categoryLabel: "Backend y APIs",
    tagline: "Plataforma de comercio con lógica de negocio atómica en procedimientos almacenados PL/pgSQL de PostgreSQL y Node.js.",
    badge: "Alto Rendimiento con PL/pgSQL",
    repoUrl: "https://github.com/RivasMel2024/webII_proyecto",
    demoUrl: null,
    stack: ["JavaScript", "Node.js", "PostgreSQL", "PL/pgSQL", "Express", "Netlify"],
    metrics: [
      "Validaciones de compra y existencias inferiores a 25ms en base de datos",
      "Garantía transaccional ACID absoluta contra condiciones de carrera",
      "Despliegue ágil con separación entre backend y frontend"
    ],
    star: {
      situation: "En plataformas de comercio electrónico y ofertas masivas, ejecutar las complejas reglas de validación de cupones y control de inventario en la capa de aplicación web genera múltiples viajes de red de ida y vuelta a la base de datos y riesgo de inconsistencias ante accesos concurrentes.",
      task: "Desarrollar una solución integral donde la lógica crítica de canje, validación de expiración y existencias se procese directamente en el motor de base de datos relacional para máxima velocidad y consistencia.",
      action: "Se diseñó e implementó un esquema relacional avanzado en PostgreSQL con disparadores (triggers) y funciones almacenadas en PL/pgSQL que ejecutan las validaciones atómicas en milisegundos. Se conectó una API ligera en Node.js y Express que orquesta las solicitudes y una interfaz moderna alojada en Netlify, logrando una estricta separación de responsabilidades.",
      result: "Tiempos de respuesta de canje inferiores a 25 milisegundos en la base de datos, total blindaje contra condiciones de carrera y reducción drástica de la carga de cómputo en el servidor de aplicación."
    },
    featured: false
  },
  {
    id: "enfoque-app",
    title: "Enfoque: Aplicación Móvil de Productividad",
    category: "mobile",
    categoryLabel: "Desarrollo Móvil",
    tagline: "Aplicación móvil multiplataforma para gestión del tiempo y productividad personal con Flutter y técnica Pomodoro.",
    badge: "Productividad y Experiencia Móvil",
    repoUrl: "https://github.com/Gaboum11/enfoque_app",
    demoUrl: null,
    stack: ["Flutter", "Dart", "BLoC y Provider", "SQLite", "Notificaciones Locales", "Material 3"],
    metrics: [
      "Renderizado fluido a 60 FPS constante en dispositivos móviles",
      "Persistencia local de hábitos sin requerir conexión a internet",
      "Arquitectura reactiva desacoplada para gestión de estado"
    ],
    star: {
      situation: "La constante sobrecarga de estímulos y notificaciones dificulta mantener la concentración en bloques de estudio prolongados, y la mayoría de aplicaciones de temporizador existentes sufren de interfaces saturadas o alto consumo de batería en segundo plano.",
      task: "Construir una aplicación móvil nativa y minimalista basada en la técnica Pomodoro, con un diseño visual libre de distracciones, persistencia local de métricas de desempeño y bajo impacto energético.",
      action: "Se desarrolló la aplicación con Flutter y Dart empleando principios de Arquitectura Limpia y gestión reactiva del estado. Se implementaron temporizadores optimizados en segundo plano con notificaciones locales del sistema, persistencia estructurada de sesiones de concentración en SQLite para auditoría de productividad, y una interfaz inmersiva basada en Material Design 3 con soporte dinámico de modo oscuro.",
      result: "Tasa de rendimiento estable a 60 fotogramas por segundo con mínimo impacto en la batería, funcionamiento completamente local y sin conexión, y retroalimentación altamente positiva de estudiantes para el seguimiento de sus metas de estudio."
    },
    featured: false
  },
  {
    id: "delieat",
    title: "DeliEat: Asistente Gastronómico Inteligente",
    category: "python-ai",
    categoryLabel: "Python e IA",
    tagline: "Asistente conversacional inteligente para recomendación gastronómica con procesamiento de lenguaje natural en Python.",
    badge: "Inteligencia Artificial Conversacional",
    repoUrl: "https://github.com/Gaboum11/DeliEat",
    demoUrl: null,
    stack: ["Python", "Django", "Procesamiento de Lenguaje Natural", "JavaScript", "NLTK", "Expresiones Regulares"],
    metrics: [
      "Más del 88% de precisión en extracción de ingredientes y platillos",
      "Tiempo de inferencia del asistente menor a 300ms por interacción",
      "Algoritmo de similitud semántica para recomendaciones culinarias"
    ],
    star: {
      situation: "Los usuarios a menudo no saben qué preparar con los ingredientes específicos que tienen disponibles en casa, y los buscadores tradicionales exigen coincidencias de texto exactas sin interpretar sinónimos ni lenguaje coloquial.",
      task: "Desarrollar un asistente conversacional interactivo capaz de comprender intenciones en lenguaje natural, extraer ingredientes ingresados por el usuario y recomendar opciones culinarias óptimas en tiempo real.",
      action: "Se implementó un backend en Python con Django integrando algoritmos de procesamiento de lenguaje natural para tokenización, lematización y extracción de entidades. Se desarrolló un algoritmo de similitud semántica y puntuación ponderada para correlacionar la despensa del usuario con la base de conocimiento culinaria, respaldado por una interfaz de chat web fluida en JavaScript.",
      result: "Tasa de acierto superior al 88% en la interpretación de peticiones de usuario, respuestas del asistente en menos de 300 milisegundos y una experiencia de usuario interactiva y amigable."
    },
    featured: false
  },
  {
    id: "data-analytics",
    title: "Sistema Central de Análisis de Datos",
    category: "python-ai",
    categoryLabel: "Python e IA",
    tagline: "Motor de análisis, transformación y visualización de datos estructurados bajo arquitectura MVC pura en Python.",
    badge: "Arquitectura MVC en Python",
    repoUrl: "https://github.com/Dae51/Proyecto_DAI",
    demoUrl: null,
    stack: ["Python 3", "Arquitectura MVC", "Pandas", "NumPy", "Matplotlib", "Flujos de Datos"],
    metrics: [
      "60% de reducción de código redundante mediante patrón MVC",
      "Ingesta y limpieza automatizada de conjuntos de datos heterogéneos",
      "Generación de reportes analíticos con métricas estadísticas"
    ],
    star: {
      situation: "Los proyectos de ciencia de datos suelen implementarse en archivos desestructurados donde la limpieza de datos, los cálculos estadísticos y la visualización se mezclan, dificultando la mantenibilidad y reutilización.",
      task: "Diseñar un flujo estructurado y sistema de procesamiento analítico aplicando el patrón arquitectónico Modelo-Vista-Controlador (MVC) en Python, separando rigurosamente el modelado de datos, la lógica de agregación y la presentación gráfica.",
      action: "Se crearon modelos de datos con Pandas y NumPy dedicados exclusivamente a la validación de tipos, saneamiento de valores atípicos y normalización; controladores encargados de aplicar reglas de negocio y cálculo de estadísticos descriptivos; y vistas modulares generadoras de gráficos interactivos con Matplotlib e informes estructurados.",
      result: "Arquitectura modular que permitió integrar nuevos orígenes de datos sin alterar la lógica de visualización, reducción del 60% en duplicación de código analítico y facilidad de auditoría de resultados."
    },
    featured: false
  },
  {
    id: "turimox",
    title: "Turimox: Portal de Ecoturismo",
    category: "frontend",
    categoryLabel: "Frontend Web",
    tagline: "Plataforma web de promoción ecoturística con diseño responsivo de alta fidelidad, SCSS modular y Firebase.",
    badge: "Diseño Web y Turismo",
    repoUrl: "https://github.com/ChristianRende22/Turimox",
    demoUrl: null,
    stack: ["HTML5 Semántico", "SCSS y SASS", "JavaScript ES6+", "Firebase", "Diseño Responsivo"],
    metrics: [
      "Puntuación 95+ en métricas de rendimiento y accesibilidad web",
      "Arquitectura SCSS modular con metodología BEM",
      "100% responsivo para dispositivos móviles, tabletas y computadoras"
    ],
    star: {
      situation: "Destinos turísticos locales y microempresarios de ecoturismo carecían de una plataforma moderna y atractiva para difundir sus rutas, servicios de guía y actividades al aire libre ante visitantes nacionales e internacionales.",
      task: "Diseñar y desarrollar un portal web rápido, interactivo y visualmente envolvente con arquitectura de estilos mantenible (SCSS modular) y sistema de consulta de rutas dinámicas.",
      action: "Se construyó la interfaz con HTML5 semántico aplicando convenciones BEM para nomenclatura CSS. Se estructuró un sistema de diseño con SCSS (variables de color, tipografía y reglas responsivas), se agregaron componentes dinámicos en JavaScript nativo para filtros de itinerarios y visualización de galerías interactivas, y se integró Firebase para la gestión en la nube.",
      result: "Puntuación de rendimiento y buenas prácticas superior a 95 puntos en auditorías web, experiencia de usuario fluida y carga instantánea en conexiones móviles."
    },
    featured: false
  }
];

// Technical Skills Matrix Data
const SKILLS_MATRIX = {
  backend: {
    title: "Backend y APIs",
    icon: "server",
    skills: [
      { name: "PHP (Laravel 11, PHP 8 PDO)", level: "Avanzado" },
      { name: "NestJS, Node.js y Express", level: "Intermedio - Avanzado" },
      { name: "Python (Django, FastAPI, MVC)", level: "Avanzado" },
      { name: "Diseño de APIs REST y OpenAPI 3.0", level: "Avanzado" },
      { name: "Colecciones de Postman y Pruebas Automatizadas", level: "Avanzado" },
      { name: "PHPUnit y Pruebas Unitarias", level: "Intermedio" }
    ]
  },
  frontend: {
    title: "Frontend y Tecnologías Web",
    icon: "layout",
    skills: [
      { name: "JavaScript (ES6+) y TypeScript", level: "Avanzado" },
      { name: "HTML5 Semántico y Accesibilidad", level: "Avanzado" },
      { name: "CSS3 Moderno (Flexbox, Grid, Variables CSS)", level: "Avanzado" },
      { name: "SCSS / SASS y Arquitectura BEM", level: "Intermedio" },
      { name: "Bootstrap 5 y Tailwind CSS", level: "Avanzado" },
      { name: "Vite y Herramientas Modernas", level: "Intermedio" }
    ]
  },
  mobileDesktop: {
    title: "Desarrollo Móvil y Escritorio",
    icon: "smartphone",
    skills: [
      { name: "Flutter y Dart", level: "Intermedio - Avanzado" },
      { name: "Gestión de Estado BLoC y Provider", level: "Intermedio" },
      { name: "Material Design 3", level: "Avanzado" },
      { name: "SQLite y Persistencia Local", level: "Intermedio" },
      { name: "Notificaciones Locales y Tareas en Segundo Plano", level: "Intermedio" }
    ]
  },
  databases: {
    title: "Bases de Datos y Persistencia",
    icon: "database",
    skills: [
      { name: "MySQL y MariaDB (Índices, Transacciones ACID)", level: "Avanzado" },
      { name: "PostgreSQL y PL/pgSQL (Disparadores, Procedimientos)", level: "Intermedio - Avanzado" },
      { name: "Modelado Relacional y Normalización (1FN-3FN)", level: "Avanzado" },
      { name: "Firebase Firestore", level: "Intermedio" },
      { name: "Sanitización y Consultas Preparadas con PDO", level: "Avanzado" }
    ]
  },
  devopsTools: {
    title: "DevOps y Herramientas",
    icon: "terminal",
    skills: [
      { name: "Flujo de Trabajo Git y GitHub (157+ contribuciones)", level: "Avanzado" },
      { name: "Docker y Docker Compose", level: "Intermedio" },
      { name: "Entornos Linux, Shell Scripting y Apache", level: "Intermedio - Avanzado" },
      { name: "Stoplight Studio y Swagger UI", level: "Avanzado" },
      { name: "Despliegues en Netlify y GitHub Pages", level: "Avanzado" }
    ]
  }
};

// Experience Data
const EXPERIENCES = [
  {
    role: "Desarrollador Backend",
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
    role: "Desarrollador Web y Soluciones Digitales",
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
    role: "Soporte de Sistemas e Infraestructura",
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
  tagline: "Ingeniero de Software | Desarrollador Backend y Sistemas Web",
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
      degree: "Ingeniería de Software",
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
    { name: "Inglés", level: "Competencia Profesional Completa (B2/C1)" }
  ]
};
