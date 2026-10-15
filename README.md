# Portafolio de Ingeniería de Software — Gabriel Martínez

> **Ingeniero de Software | Desarrollador Backend y Sistemas Web (PHP, Python, TypeScript, Flutter, MySQL)**  
> Portafolio profesional minimalista sin dependencias de compilación construido con HTML5 semántico, CSS3 moderno con variables personalizadas y JavaScript ES6+ nativo, con estudios de caso estructurados en análisis de ingeniería (Contexto y Desafío, Arquitectura y Solución Técnica, e Impacto Medible).

[![Sitio en Vivo](https://img.shields.io/badge/Sitio_en_Vivo-GitHub_Pages-2563eb?style=flat-square&logo=github)](https://gabom404.github.io/portfolio/)
[![Licencia: MIT](https://img.shields.io/badge/Licencia-MIT-blue.svg?style=flat-square)](LICENSE)
[![Zero Build](https://img.shields.io/badge/Arquitectura-Cero_Dependencias-10b981?style=flat-square)](#)

---

## Características Principales

- **Arquitectura Cero Compilación:** HTML5 puro, CSS3 moderno y JavaScript ES6+. Sin sobrecarga de herramientas de compilación, despliegue directo e instantáneo a GitHub Pages.
- **Análisis de Ingeniería Exhaustivo:** Cada proyecto documenta contexto de negocio, desafíos técnicos, decisiones arquitectónicas (Capa de Servicio, concurrencia transaccional, contratos OpenAPI, BCrypt) y resultados cuantificables.
- **Filtrado Dinámico:** Cambio instantáneo por categoría (`Todos`, `Backend y APIs`, `Full Stack`, `Desarrollo Móvil`, `Python e IA`, `Frontend Web`) con conteo en tiempo real.
- **Divulgación Progresiva:** Visualización elegante de tarjetas compactas con paneles desplegables integrados para explorar el desglose técnico sin modales invasivos ni saturación visual.
- **Diseño Editorial Minimalista:** Estética sobria y cálida inspirada en interfaces editoriales modernas, con tipografía nítida, ilustraciones vectoriales en SVG y alto contraste de lectura.
- **100% Responsivo y Accesible:** Distribución adaptativa probada en dispositivos móviles, tabletas y computadoras de escritorio con estándares de accesibilidad web.

---

## Estructura del Repositorio

```text
portfolio-gabom404/
├── index.html              # Estructura semántica accesible
├── css/
│   └── style.css           # Variables CSS, cuadrícula responsiva y animaciones
├── js/
│   ├── projects-data.js    # Catálogo de 11 proyectos con análisis técnico detallado
│   └── app.js              # Controlador interactivo de filtrado y divulgación progresiva
├── assets/
│   └── icons/              # Iconografía vectorial SVG limpia
└── README.md               # Documentación y descripción del portafolio
```

---

## Proyectos Curados (11)

| # | Proyecto | Categoría | Tecnologías | Enfoque Técnico y Resultados Clave |
|---|---|---|---|---|
| 1 | **Promora: Motor Transaccional de Cupones** | Backend y APIs | Laravel 11, PHPUnit, Postman, MySQL | Bloqueos pesimistas (`SELECT FOR UPDATE`), canje atómico, reducción del 35% en tiempo de respuesta. |
| 2 | **Biblioteca: API REST y Contratos OpenAPI** | Backend y APIs | Laravel, OpenAPI 3.0, Stoplight, Postman | Diseño bajo enfoque API-First con Stoplight Studio, integración de clientes web 50% más ágil. |
| 3 | **NovaPOS: Sistema de Punto de Venta** | Full Stack | PHP 8 PDO, MySQL, BCrypt, Bootstrap 5 | Punto de venta sin dependencias externas, 100% consultas preparadas, 40% reducción en tiempos de espera. |
| 4 | **WalletID: Billetera Digital Institucional** | Full Stack | PHP, MySQL, JavaScript, Identidad Digital | Doble portal desacoplado, transacciones sin efectivo en campus, balances atómicos. |
| 5 | **AttendanceTrack: Control de Asistencia y Turnos** | Backend y APIs | PHP, Cámara Web, API REST, TCPDF | Foto-verificación en vivo, motor de reglas de turnos, 85% ahorro administrativo en planillas. |
| 6 | **Plataforma de Microservicios Contenerizados** | Full Stack | TypeScript, Python, Docker Compose, Microservicios | Orquestación políglota de microservicios, redes contenerizadas aisladas, despliegue con un comando. |
| 7 | **Cupon-X: Motor de Cupones de Alto Desempeño** | Backend y APIs | Node.js, PostgreSQL (PL/pgSQL), Netlify | Lógica atómica en procedimientos almacenados PL/pgSQL (<25ms por validación). |
| 8 | **Enfoque: Aplicación Móvil de Productividad** | Desarrollo Móvil | Flutter, Dart, SQLite, Material 3 | Técnica Pomodoro, gestión reactiva de estado, 60 FPS estables, persistencia local. |
| 9 | **DeliEat: Asistente Gastronómico Inteligente** | Python e IA | Python, Django, NLP, NLTK | Procesamiento de lenguaje natural para ingredientes, algoritmo de similitud semántica (>88% acierto). |
| 10 | **Sistema Central de Análisis de Datos** | Python e IA | Python 3, Arquitectura MVC, Pandas, NumPy | Flujo analítico bajo MVC, saneamiento estructurado de datos, 60% reducción de código redundante. |
| 11 | **Turimox: Portal de Ecoturismo** | Frontend Web | HTML5, SCSS (BEM), JavaScript nativo, Firebase | Portal responsivo de turismo, puntuación 95+ en auditorías web, sistema de diseño modular en SCSS. |

---

## Ejecución Local y Pruebas

Al ser un proyecto sin herramientas de compilación pesadas, puede ejecutarse localmente con cualquier servidor estático:

```powershell
# Utilizando el servidor HTTP integrado de Python 3:
python -m http.server 8000

# Abrir en el navegador:
# http://localhost:8000
```

Para ejecutar las pruebas automatizadas de integridad y validación:

```powershell
node tests/verify-portfolio.cjs
```

---

## Perfil Profesional

- **Nombre:** Gabriel Martínez (`gabom404`)
- **Formación Académica:**
  - ESEN (Escuela Superior de Economía y Negocios) — *Ingeniería de Software* (2024 - 2028)
  - Colegio Salesiano Santa Cecilia — *Técnico en Sistemas Informáticos* (2021 - 2023)
- **Ubicación:** Nueva San Salvador, La Libertad, El Salvador
- **Correo Electrónico:** [gemc1172005@gmail.com](mailto:gemc1172005@gmail.com)
- **LinkedIn:** [linkedin.com/in/gabriel-martinez-carballo](https://linkedin.com/in/gabriel-martinez-carballo)
- **GitHub:** [github.com/gabom404](https://github.com/gabom404) (y contribuciones en [github.com/Gaboum11](https://github.com/Gaboum11))

---

## Licencia

Este proyecto es de código abierto y está disponible bajo la [Licencia MIT](LICENSE).
