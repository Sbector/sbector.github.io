# Plan: Quitar ClientRouter y usar View Transitions nativas (Opción B)

## Objetivo

Arreglar los videos de las obras que no cargan al navegar con ClientRouter
(las páginas nuevas se parsean con DOMParser en un documento "inerte" y los
`<video>` no disparan la carga de red). Eliminar ClientRouter → navegación de
carga completa → los videos siempre cargan. Mantener transiciones visuales
bonitas usando las *cross-document view transitions* nativas del navegador
(`@view-transition { navigation: auto }`), con morphing del hero gracias a los
`transition:name` que ya existen.

## Cambios

### 1. `src/layouts/Layout.astro`
- Quitar `import { ClientRouter } from "astro:transitions";` (línea 3).
- Quitar `<ClientRouter />` (línea 22).
- En el script de tema: quitar `document.addEventListener('astro:after-swap', applyTheme);`
  (línea 32) y su comentario; dejar solo `applyTheme()`.

### 2. `src/components/Nav.astro`
- Línea 280: reemplazar `document.addEventListener('astro:page-load', initNav);`
  por `initNav();` (sin ClientRouter, `astro:page-load` ya no se dispara;
  el script corre al final del body con el DOM listo).

### 3. `src/pages/obras/[slug].astro`
- Línea 107: reemplazar `document.addEventListener('astro:page-load', setupScrollIndicator);`
  por `setupScrollIndicator();`.
- Líneas 102-104: quitar el listener `astro:before-preparation` (innecesario con
  carga completa).

### 4. `src/components/MediaViewer.astro`
Simplificar el `<script>` (líneas 167-349):
- Quitar `let previousCleanup`, `let transitionObs`, `const DIRECTION_ATTR` y la
  función `ensureLiveVideos`.
- Quitar la llamada `previousCleanup?.()` al inicio de `setupMediaViewer()`.
- Quitar `ensureLiveVideos(viewer);` y los retries `[150,400,900]`.
- Quitar el `const cleanup`/`previousCleanup`/listener `astro:before-preparation`.
- Quitar `setupMediaViewer();` duplicado + listeners `astro:page-load`/`astro:after-swap`
  + el bloque del `MutationObserver`.
- Dejar un único `setupMediaViewer();` al final del script.
- Mantener `transition:name` en el `<img>` (línea 113) para el morphing del hero.

### 5. `src/styles/global.css`
- Añadir al inicio:
  ```css
  @view-transition {
    navigation: auto;
  }
  ```
  Habilita cross-document view transitions nativas (Chrome/Edge; Safari parcial;
  Firefox cae a reload sin animación).

## Verificación
- `npm run build` sin errores.
- En dev: navegar home→obra y obra→obra; el video debe cargar siempre (carga
  completa), y debe verse cross-fade + morph del hero en Chromium.
- Desplegar a Netlify y confirmar que el video aparece sin refresh.

## Notas
- Los scripts de Nav/[slug]/MediaViewer ya no dependen de eventos de transición;
  se inicializan directo por página.
- El cambio es reversible: restaurar ClientRouter en Layout re-vertiría la
  navegación SPA.
