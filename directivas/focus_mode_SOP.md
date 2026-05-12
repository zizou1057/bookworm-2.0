# Focus Mode SOP

## Objetivo
Implementar la funcionalidad "Focus Mode" en Bookworm 2.0. Esta funcionalidad permite a los usuarios sumergirse en una sesión de lectura cronometrada, libre de distracciones, y registrar el tiempo y las páginas leídas para alimentar las estadísticas de la plataforma.

## Entradas
- **Duración objetivo**: El usuario configura un tiempo en minutos antes de iniciar la sesión.
- **Acción de finalización**: El tiempo se agota, o el usuario decide terminar la sesión prematuramente.
- **Libro actual**: Al finalizar, el usuario selecciona qué libro estaba leyendo (de entre los que están en estado `reading`).
- **Página actual**: El usuario ingresa la página en la que se detuvo tras la lectura.

## Salidas
- **Registro en la tabla `focus_sessions`**: Inserta la sesión con `book_id`, `user_id`, `date`, `duration_seconds` y `pages_read`.
- **Actualización de `books`**: Actualiza `read_pages` y recalcula `progress_percent` del libro seleccionado.
- **Actualización de `daily_logs`**: Inserta o actualiza el registro diario.

## Lógica y Pasos de Ejecución
1. **Interfaz Inmersiva**:
   - Crear un componente `FocusModeView` a pantalla completa. Usar fondo `#00BFB3`.
   - Mostrar un cronómetro con cuenta regresiva.
   - Mostrar un botón discreto de salida.
2. **Ciclo de Sesión**:
   - Configuración inicial: elegir tiempo objetivo en el `FocusModeWidget`.
   - Al iniciar, cambiar `currentView` en `App.tsx` para renderizar el `FocusModeView`.
   - Si se interrumpe (botón salir), mostrar una advertencia nativa o modal.
   - Al finalizar, mostrar un modal interno para recopilar los datos finales de la lectura (libro y página final).
3. **Persistencia (Supabase)**:
   - Al guardar desde el modal, insertar el registro en `focus_sessions` usando el tiempo real transcurrido (`duration_seconds`).
   - Actualizar `books` con la nueva página.
   - Insertar un registro en `daily_logs` para llevar el control diario.

## Restricciones y Casos Borde
- **Restricción**: Solo listar libros en estado `reading` en el modal de finalización.
- **Restricción**: La nueva página debe ser `>=` a la página actual guardada y `<=` al total de páginas del libro.
- **Navegación**: Al iniciar el modo Focus, se debe ocultar el Sidebar general de la app, esto requerirá que `App.tsx` no renderice el `Sidebar` si la vista actual es `focusMode`.
