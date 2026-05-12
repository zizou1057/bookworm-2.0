# Mobile Responsive Design SOP (Bookworm 2.0)

## 1. Contexto
La aplicación Bookworm 2.0 se utilizará principalmente en dispositivos móviles. De acuerdo con el skill `mobile-design`, el diseño debe ser **Mobile-First**, **Touch-First** y respetar las plataformas. No podemos simplemente encoger el diseño de escritorio.

## 2. Decisiones de Arquitectura Responsiva
- **Navegación:**
  - *Desktop (`md:` en adelante):* Se mantiene el `Sidebar` lateral.
  - *Mobile:* El `Sidebar` se oculta (`hidden md:flex`) y se reemplaza por una **Bottom Navigation Bar** fijada en la parte inferior (`fixed bottom-0 w-full`).
- **Grillas (Grids):**
  - Dashboard: Pasa de `grid-cols-4` a `grid-cols-2 md:grid-cols-4`.
  - Daily Tracker + Focus Mode: Pasa de `grid-cols-[1fr_320px]` a `flex flex-col md:grid md:grid-cols-[1fr_320px]`.
  - Mi Biblioteca: Pasa de `grid-cols-5` a `grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5`.
- **Interacciones Touch (Fitts' Law):**
  - Todos los botones (`<Button>`, `<button>`) deben tener un tamaño táctil mínimo de `44px` (equivalente a `h-11` o `p-3`).
  - Botón flotante o fijo para añadir libros (`+`), fácilmente alcanzable con el pulgar.
- **Espaciados:**
  - Márgenes en móviles se reducen (`p-4` en lugar de `p-8`) para maximizar el uso de pantalla.
  - Se quita el `rounded-tl-[2.5rem]` en móvil porque desperdicia espacio en esquinas.

## 3. Casos Borde y Limitaciones
- **Error Evitado:** Mantener elementos pesados en el top nav.
- **Error Evitado:** Paginación de libros en formato tabla horizontal en móvil. En lugar de esto, usamos tarjetas verticales (`grid-cols-2`).
- **Scroll:** Asegurar que el padding inferior (`pb-20` o similar) exista en el contenedor principal en móvil para que el Bottom Nav no oculte el último contenido.

## 4. MOBILE CHECKPOINT
Platform: Responsive Web (iOS/Android browsers)
Framework: React + Tailwind CSS
3 Principles I Will Apply:
1. Thumb zone navigation (Bottom Nav)
2. Fluid grids (1-2 cols mobile, up to 5 cols desktop)
3. Minimum 44px touch targets.
Anti-Patterns I Will Avoid:
1. Desktop sidebar squeezed into mobile.
2. Hover-only actions (must have explicit touch action).
