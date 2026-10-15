# Especificación de Diseño: Carro de F1 Cartoon con Deslizamiento y Efectos de Pista

## 1. Visión General
Esta especificación define la incorporación de un carro de Fórmula 1 ilustrado en estilo cartoon/cómic vectorial que desciende suavemente por una pista lateral conforme el usuario se desplaza verticalmente por el portafolio de Gabriel Martínez (`gabom404`). Además, se añaden elementos decorativos de circuito automovilístico (bandera a cuadros en la meta, conos de pista naranja en los hitos de experiencia, y estelas de humo/chispas con transiciones CSS fluidas).

---

## 2. Requisitos y Restricciones
1. **Estilo Gráfico Cartoon / Ilustrado:**
   - Ilustración vectorial pura en formato SVG sin dependencias externas de imágenes PNG/JPG ni fuentes de emojis.
   - Trazos definidos con bordes oscuros estilo cómic (stroke de 2 a 3px), proporciones aerodinámicas estilizadas (alerón trasero llamativo, neumáticos slick de competición, morro afilado y piloto con casco reflectante).
   - Acordes con la paleta del portafolio: acento naranja fuego (`#F95721`), gris grafito y blanco.

2. **Regla Estricta Cero Emojis:**
   - Queda terminantemente prohibido el uso de caracteres Unicode emoji (como 🏎️, 🏁, 💨, ⚠️, ✨). Toda la iconografía y gráficos serán SVGs renderizados en el DOM o glifos de Google Material Symbols.

3. **Mecánica de Deslizamiento y Transiciones:**
   - El vehículo desciende sobre un riel lateral fijo situado en el margen derecho de la pantalla (`position: fixed`).
   - El cálculo de posición se sincroniza con el porcentaje de scroll de la página (`window.scrollY / (documentHeight - windowHeight)`).
   - El movimiento utiliza aceleración por GPU (`transform: translate3d(...) rotate(...)`) con transiciones suaves en CSS (`transition: transform 0.16s cubic-bezier(0.2, 0.9, 0.4, 1.0)`).
   - **Efectos dinámicos activos al bajar:**
     - **Inclinación de derrape:** El carro rota ligeramente hacia la dirección del desplazamiento (giro de -6° a +6° según velocidad y dirección de scroll).
     - **Estela de humo cartoon:** Bocanadas de humo circulares (`svg cloud puffs`) que aparecen tras el escape mientras el carro se mueve y se desvanecen con `opacity` y `transform: scale()`.
     - **Chispas y líneas de viento:** Pequeñas líneas cinéticas y chispas de derrape que brotan al acelerar.
     - **Tacómetro / Indicador de Posición:** Pequeño globo flotante cartoon que muestra el tramo o sección actual (ejemplo: "P1 • INICIO", "SECTOR 2 • PROYECTOS", "META • CONTACTO").

4. **Elementos de Circuito Cartoon Complementarios:**
   - **Bandera a Cuadros (Checkered Flag):** Animada en la sección final de Contacto / Footer y en el límite inferior del riel de carrera.
   - **Conos de Pista Naranja (Traffic Cones):** Ubicados como hitos en las tarjetas de Experiencia Profesional, con micro-animación elástica de rebote al pasar el ratón (`hover`).
   - **Líneas de Pista:** Marcadores punteados sutiles que delimitan la trayectoria del auto.

5. **Responsividad y Rendimiento:**
   - **Desktop (>1024px):** Riel lateral derecho completo con tacómetro, humo y chispas.
   - **Tableta (600px - 1024px):** Riel lateral compacto para no interferir con las tarjetas de proyectos.
   - **Móvil (<600px):** Riel minimalista estilizado en el borde derecho (12px de ancho) con el carro F1 miniaturizado y botón táctil para volver al inicio ("Pit Stop / Vuelta Rápida").
   - **Rendimiento:** Escucha de scroll con `requestAnimationFrame` pasivo (`{ passive: true }`), evitando reflows forzados (`layout thrashing`).
   - **Accesibilidad:** Soporte para `@media (prefers-reduced-motion: reduce)` que fija transiciones inmediatas y desactiva oscilaciones de derrape.

---

## 3. Arquitectura de Componentes

### 3.1 Estructura en el DOM (`index.html`)
Se introduce un contenedor dedicado para el riel y el carro:
```html
<aside id="f1-track-container" class="f1-track-container" aria-hidden="true">
  <div class="f1-track-line"></div>
  <div id="f1-car-wrapper" class="f1-car-wrapper">
    <div id="f1-smoke-container" class="f1-smoke-container"></div>
    <div id="f1-badge" class="f1-lap-badge">P1</div>
    <div class="f1-car-svg-box">
      <!-- SVG del carro de F1 cartoon -->
    </div>
  </div>
  <div class="f1-finish-flag">
    <!-- SVG de bandera a cuadros -->
  </div>
</aside>
```

### 3.2 Lógica de Controlador (`js/f1-racer.js` o integrado en `js/app.js`)
- Inicialización en `DOMContentLoaded`.
- Cálculo del porcentaje de scroll:
  `progress = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)`
- Cálculo de la velocidad de scroll (\(\Delta scroll / \Delta t\)) para disparar efectos de humo y rotación de derrape.
- Asignación de clases `is-moving`, `is-drifting-left`, `is-drifting-right`, `is-stopped`.
- Temporizador para disipar el humo y enderezar el auto cuando el scroll se detiene (150ms debounce).

### 3.3 Estilos y Transiciones (`css/style.css` o `css/f1-track.css`)
- Variables CSS para colores cartoon y velocidades de transición.
- Animación `@keyframes f1-smoke-puff` con `transform: scale(0.2) translateY(0)` a `scale(1.2) translateY(12px)` y `opacity: 1` a `0`.
- Animación `@keyframes f1-flag-wave` para la bandera a cuadros.
- Estilos para los conos de pista en `.exp-icon-circle` o cabeceras de experiencia.

---

## 4. Plan de Pruebas y Verificación
1. **Verificación de Cero Emojis:** Ejecutar el escáner regex automatizado en `tests/verify-portfolio.cjs` para asegurar 0 emojis en todo el repositorio.
2. **Pruebas de Transiciones y Rendimiento:** Comprobar desplazamiento sin caídas de cuadros (60 FPS) tanto en subida como en bajada.
3. **Pruebas Responsivas:** Inspección a 375px (iPhone), 768px (iPad) y 1440px (Desktop) para garantizar legibilidad completa del contenido.
4. **Verificación de Despliegue:** Commit, push a GitHub y confirmación de estado `built` en GitHub Pages con código HTTP 200.
