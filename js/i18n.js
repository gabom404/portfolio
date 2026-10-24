/**
 * i18n.js — Spanish / English switch.
 *
 * Spanish lives in the HTML itself: on start-up every element marked with
 * data-i18n / data-i18n-html / data-i18n-attr has its original text stored as
 * the Spanish version, so only English needs a dictionary here.
 * Strings that only exist in JavaScript have both languages in UI.
 */
(function (root) {
  'use strict';

  var EN = {
    'skip': 'Skip to content',
    'lights.kicker': 'Circuito 404 · Race start',
    'lights.hint': 'When the lights go out, press any key or tap the screen.',
    'lights.skip': 'Skip',
    'nav.label': 'Sections',
    'nav.grid': 'Grid',
    'nav.driver': 'Driver',
    'nav.setup': 'Setup',
    'nav.garage': 'Garage',
    'nav.history': 'History',
    'nav.strategy': 'Strategy',
    'nav.radio': 'Radio',
    'nav.menu': 'Menu',
    'hero.kicker': '2026 season · <b>Starting grid</b>',
    'hero.role': 'Backend developer. Software Engineering student at ESEN, El Salvador.',
    'hero.fig': 'Fig. 1 · Car 404, side view',
    'hero.timingLabel': 'Timing screen',
    'hero.s1': 'Backend · PHP 8, Laravel, NestJS',
    'hero.s2': 'APIs · REST, OpenAPI, Postman',
    'hero.s3': 'Data · MySQL, PostgreSQL',
    'hero.active': 'active',
    'hero.best': 'best',
    'hero.cta': 'See the garage',
    'hero.drive': 'Drive a lap',
    'hero.lights': 'Replay the start',
    'livery.title': 'Livery',
    'driver.title': 'Driver profile',
    'driver.lead': 'I care about backend design: modelling relational databases, building well-documented APIs and writing code other people can maintain. I like turning a business’s manual processes into software people use every day.',
    'driver.licence': 'Driver licence · Circuito 404',
    'driver.f.name': 'Name',
    'driver.f.base': 'Base',
    'driver.v.base': 'Nueva San Salvador, El Salvador',
    'driver.f.team': 'Team',
    'driver.v.team': 'ESEN · Software Engineering (2024–2028)',
    'driver.f.school': 'Previous training',
    'driver.v.school': 'Computer Systems Technician, Colegio Salesiano Santa Cecilia',
    'driver.f.spec': 'Speciality',
    'driver.v.spec': 'Backend, APIs and databases',
    'driver.s.projects': 'projects in the garage',
    'driver.s.prod': 'systems running in real businesses',
    'driver.s.jobs': 'work experiences',
    'setup.title': 'Car setup',
    'setup.lead': 'Each part of the car is something I know how to do. Hover or tap a part to see its technologies.',
    'setup.motor': 'Engine · Backend',
    'setup.rest': 'REST APIs',
    'setup.chassis': 'Chassis · Data',
    'setup.model': 'Relational modelling',
    'setup.aero': 'Aero · Frontend and mobile',
    'setup.htmlcss': 'HTML and CSS',
    'setup.box': 'Pit box · Tools',
    'setup.git': 'Git and GitHub',
    'garage.title': 'Garage',
    'garage.lead': 'Systems built for real businesses and team projects from university. Pick a compound to filter and open each car’s spec sheet.',
    'garage.filter': 'Filter by category',
    'history.title': 'Race history',
    'history.lead': 'My path as a lap chart: each bar is the time I spent on that track.',
    'history.chartDesc': 'Timeline from 2021 to 2028: CFP Colegio Salesiano Santa Cecilia from 2021 to 2023, NovaPOS in 2023, AttendanceTrack from 2023 to 2024, ESEN from 2024 to 2028 and C3 El Salvador in January 2026.',
    'history.c3.date': 'Jan 2026',
    'history.c3.role': 'Backend developer',
    'history.c3.text': 'Built the backend logic and APIs with NestJS for the official landing page of the Salvadoran Programming Cup, including participant sign-up and management.',
    'history.attendance.role': 'Web and backend developer · Private company',
    'history.attendance.text': 'Built and deployed an attendance and shift system for the staff: check-in with a QR badge read by the camera, late and overtime calculation, PDF badges, an hours report for Excel and a JSON endpoint.',
    'history.novapos.role': 'Junior software developer · Service-sector company',
    'history.novapos.text': 'Built and deployed a point of sale: sales, stock control, customers and profit reports, using prepared statements and hashed passwords.',
    'history.cfp.role': 'Web and systems developer',
    'history.cfp.text': 'Online enrolment system and a payment flow with institutional cards, with PDF receipts.',
    'strategy.title': 'Strategy',
    'strategy.lead': 'How I approach each project: a race split into stints, with a pit stop between each one.',
    'strategy.s1': 'Discover', 'strategy.t1': 'Understand the business, who the system serves and its constraints.',
    'strategy.s2': 'Design', 'strategy.t2': 'Relational model, API contracts with OpenAPI and an architecture that can be maintained.',
    'strategy.s3': 'Build', 'strategy.t3': 'Clear, secure code: prepared statements, hashed passwords and good practices.',
    'strategy.s4': 'Ship', 'strategy.t4': 'Tests with PHPUnit and Postman, configuration outside the code and a documented deployment.',
    'strategy.s5': 'Improve', 'strategy.t5': 'Listen to the people using the system and fix what slows them down most.',
    'pit.kicker': 'Mini-game · Pit stop',
    'pit.title': 'Change all four tyres',
    'pit.how': 'Tap the tyre that lights up, one after another. You can also use keys 1 to 4. Each mistake adds one second.',
    'pit.time': 'Time',
    'pit.best': 'Best',
    'pit.start': 'Start pit stop',
    'radio.title': 'Box, box.',
    'radio.lead': 'Got a project or an opening for a junior backend developer? Write to me and I’ll get back to you.',
    'radio.channel': 'Radio channel',
    'radio.copy': 'Copy',
    'radio.mail': 'Call the pit wall',
    'footer.note': 'Car 404, Circuito 404 and its liveries are original designs, not affiliated with any motorsport series, team or brand.',
    'circuit.label': 'Circuito 404: go to a section',
    'sheet.close': 'Close',
    'drive.title': 'Hot lap · Circuito 404',
    'drive.close': 'Exit',
    'drive.lap': 'Lap',
    'drive.last': 'Last',
    'drive.best': 'Best',
    'drive.cp': 'Corners',
    'drive.canvas': 'Circuito 404 seen from behind the car',
    'drive.help': 'Arrow keys or WASD to drive. Go through the corners to unlock facts from the garage.',
    'drive.left': 'Steer left',
    'drive.right': 'Steer right',
    'drive.brake': 'Brake',
    'drive.gas': 'Accelerate',
  };

  /* Strings used only from JavaScript ({name} placeholders are filled by t()). */
  var UI = {
    es: {
      'doc.title': 'Gabriel Martínez | Desarrollador Backend',
      'lights.ready': 'Preparados…',
      'lights.out': '¡Luces fuera!',
      'lights.reaction': 'Reacción: {ms} ms',
      'lights.jump': 'Salida en falso',
      'lights.best': 'Tu mejor reacción: {ms} ms',
      'livery.label': 'Livery: {name}',
      'cat.all': 'Todos',
      'cat.backend': 'Backend y APIs',
      'cat.fullstack': 'Full stack',
      'cat.mobile': 'Móvil',
      'cat.python-ai': 'Python e IA',
      'cat.frontend': 'Frontend',
      'tag.work': 'Experiencia laboral',
      'tag.team': 'En equipo',
      'tag.private': 'Privado',
      'card.sheet': 'Hoja técnica',
      'card.code': 'Código',
      'sheet.challenge': 'El desafío',
      'sheet.solution': 'La solución',
      'sheet.highlights': 'Aspectos destacados',
      'sheet.stack': 'Tecnologías',
      'sheet.private': 'Repositorio privado: puedo mostrarlo en una entrevista.',
      'sheet.repo': 'Ver el código en GitHub',
      'pit.go': '¡Cambiá llantas!',
      'pit.done': 'Parada de {t} s',
      'pit.record': 'Parada de {t} s · ¡nuevo récord!',
      'pit.wrong': 'Llanta equivocada: +1 s',
      'pit.again': 'Otra parada',
      'copy.ok': 'Copiado',
      'copy.fail': 'Seleccioná el correo y copialo',
      'drive.cpTitle': 'Curva {n} superada',
      'drive.lapDone': 'Vuelta completa',
      'drive.offTrack': 'Fuera de pista',
      'drive.start': 'Acelerá para salir',
    },
    en: {
      'doc.title': 'Gabriel Martínez | Backend Developer',
      'lights.ready': 'Get ready…',
      'lights.out': 'Lights out!',
      'lights.reaction': 'Reaction: {ms} ms',
      'lights.jump': 'Jump start',
      'lights.best': 'Your best reaction: {ms} ms',
      'livery.label': 'Livery: {name}',
      'cat.all': 'All',
      'cat.backend': 'Backend and APIs',
      'cat.fullstack': 'Full stack',
      'cat.mobile': 'Mobile',
      'cat.python-ai': 'Python and AI',
      'cat.frontend': 'Frontend',
      'tag.work': 'Work experience',
      'tag.team': 'Team project',
      'tag.private': 'Private',
      'card.sheet': 'Spec sheet',
      'card.code': 'Code',
      'sheet.challenge': 'The challenge',
      'sheet.solution': 'The solution',
      'sheet.highlights': 'Highlights',
      'sheet.stack': 'Technologies',
      'sheet.private': 'Private repository: I can walk you through it in an interview.',
      'sheet.repo': 'See the code on GitHub',
      'pit.go': 'Change tyres!',
      'pit.done': '{t} s stop',
      'pit.record': '{t} s stop · new record!',
      'pit.wrong': 'Wrong tyre: +1 s',
      'pit.again': 'Another stop',
      'copy.ok': 'Copied',
      'copy.fail': 'Select the address and copy it',
      'drive.cpTitle': 'Corner {n} cleared',
      'drive.lapDone': 'Lap complete',
      'drive.offTrack': 'Off track',
      'drive.start': 'Accelerate to start',
    },
  };

  var ES = {};               // filled from the DOM
  var lang = 'es';
  var listeners = [];
  var captured = false;

  function store(key, value) { if (!(key in ES)) ES[key] = value; }

  function capture() {
    if (captured || typeof document === 'undefined') return;
    captured = true;
    document.querySelectorAll('[data-i18n]').forEach(function (el) { store(el.getAttribute('data-i18n'), el.textContent.trim()); });
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) { store(el.getAttribute('data-i18n-html'), el.innerHTML.trim()); });
    document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      el.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
        var p = pair.split(':'); if (p.length === 2) store(p[1].trim(), el.getAttribute(p[0].trim()) || '');
      });
    });
  }

  function t(key, vars) {
    var s = (lang === 'en' ? (UI.en[key] || EN[key]) : (UI.es[key] || ES[key])) ;
    if (s == null) s = UI.es[key] || ES[key] || key;
    if (vars) Object.keys(vars).forEach(function (k) { s = s.split('{' + k + '}').join(vars[k]); });
    return s;
  }

  function apply() {
    if (typeof document === 'undefined') return;
    capture();
    document.documentElement.lang = lang;
    document.title = t('doc.title');
    document.querySelectorAll('[data-i18n]').forEach(function (el) { el.textContent = t(el.getAttribute('data-i18n')); });
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) { el.innerHTML = t(el.getAttribute('data-i18n-html')); });
    document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      el.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
        var p = pair.split(':'); if (p.length === 2) el.setAttribute(p[0].trim(), t(p[1].trim()));
      });
    });
    document.querySelectorAll('[data-lang]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === lang)); });
  }

  function set(next) {
    lang = next === 'en' ? 'en' : 'es';
    try { localStorage.setItem('c404-lang', lang); } catch (e) { /* storage unavailable */ }
    apply();
    listeners.forEach(function (fn) { fn(lang); });
  }

  function init() {
    capture();
    var saved = null;
    try { saved = localStorage.getItem('c404-lang'); } catch (e) { /* ignore */ }
    lang = saved === 'en' ? 'en' : 'es';
    apply();
    document.querySelectorAll('[data-lang]').forEach(function (b) {
      b.addEventListener('click', function () { set(b.getAttribute('data-lang')); });
    });
  }

  /** Pick the right language from a {es, en} field (or return plain strings as they are). */
  function pick(value) {
    if (value && typeof value === 'object' && !Array.isArray(value)) return value[lang] || value.es;
    return value;
  }

  root.C404 = root.C404 || {};
  root.C404.i18n = {
    EN: EN, UI: UI,
    init: init, t: t, set: set, pick: pick,
    get lang() { return lang; },
    onChange: function (fn) { listeners.push(fn); },
  };
})(typeof window !== 'undefined' ? window : globalThis);
