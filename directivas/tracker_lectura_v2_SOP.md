# Directiva: Tracker de Lectura V2

## Objetivo
Construir una plataforma web de gestión de lectura analítica (versión escritorio optimizada) con un diseño minimalista "Light Mode" y un motor de productividad basado en "Focus Mode".

## Entradas y Dependencias
- **Base de datos**: Supabase (PostgreSQL).
- **Backend/BaaS**: Supabase (Auth, DB, Storage).
- **Frontend**: Web App (Framework por definir, ej. React/Next.js/Vite) con Vanilla CSS o Tailwind (basado en la guía de estilo).
- **Estética**: Light Mode (Fondos #FFFFFF, #F9FAFB), Acento Turquesa (#00BFB3), Tipografía mixta (Sans-serif / Serif).

## Arquitectura de Datos (Core CRUD)
- `books`: Título, Autor, Estado, Páginas, Fecha Inicio, URL Portada, Categoría/Género.
- `daily_logs`: Referencia al libro, Fecha, Páginas leídas, Delta calculado.
- `focus_sessions`: Referencia al libro, Fecha, Tiempo transcurrido, Página alcanzada, Notas por página, ETA calculado.
- `reading_goals`: `user_id`, `goal_type` (books/pages), `target_value`, `period` (month/year), `year`, `month`. Permite a los usuarios fijar metas de lectura para visualizar en el dashboard.

## Lógica y Pasos de Ejecución
1. Inicializar e integrar Supabase (Tablas, Políticas RLS, Auth).
2. Crear directivas de componentes UI base.
3. Desarrollar Layout principal (Sidebar + Canvas).
4. Implementar vistas: Dashboard, Detalle de Libro, Mi Biblioteca.
5. Desarrollar lógica del "Focus Mode" (Timer, guardado de sesión, cálculo de ETA).
6. Implementar el log diario manual de progreso.

## Restricciones y Casos Borde (Conocidos)
- *Seguridad de Datos*: Asegurarse de que Supabase tenga RLS (Row Level Security) habilitado en todas las tablas (`books`, `groups`, `daily_logs`, etc.) para prevenir que los usuarios vean o editen los registros de otros, incluso si el código en frontend realiza los filtros `.eq('user_id', session.user.id)`.
- *El diseño debe ser exclusivamente optimizado para escritorio (Layout expansivo, sin bottom nav).*
- *El timer del Focus Mode debe manejar desconexiones o recargas accidentales.*
- *El cálculo de Delta y ETA debe manejar días saltados sin alterar negativamente las gráficas.*
- *Progreso de lectura: Al registrar progreso, siempre se debe usar la "Página actual alcanzada" (no el delta de páginas). Si un usuario ingresa una página menor o igual a la actual, se debe tratar como una corrección de progreso (actualizar la BD sin crear un nuevo log) para evitar que el sistema falle silenciosamente.*
- *Creación de libros: Si el usuario declara páginas leídas al momento de crear el libro, se debe calcular e insertar el porcentaje de progreso inicial, y registrar automáticamente un log de lectura de "día 0".*
- *Fechas de Lectura: Al insertar un nuevo libro en la base de datos (Supabase), se debe asegurar de enviar explícitamente los campos `start_date` y `end_date` provenientes del modal, de lo contrario la ficha del libro no los mostrará correctamente.*
- *Reordenamiento de libros en grupos: El orden se mantiene por la secuencia de `bookIds` en el estado local. Para persistirlo, se eliminan todos los `group_books` del grupo y se reinsertan en el nuevo orden. No se usa columna `position` por ahora; el orden de inserción en la tabla define el orden de lectura.*
- *API de Búsqueda de Libros*: La API de Google Books sin autenticación tiene límites de uso estrictos (IP rate-limit) que causan demoras y falta de resultados. Utilizar OpenLibrary API (`https://openlibrary.org/search.json`) como alternativa gratuita para búsquedas de autocompletado y metadatos.
- *IA de Descubrimiento*: Se refactorizó la comunicación para utilizar el estándar de APIs online compatibles con OpenAI (ej. OpenAI, Groq, OpenRouter, Gemini). Se requiere configurar en el `.env` las variables `VITE_AI_API_URL`, `VITE_AI_API_KEY`, y opcionalmente `VITE_AI_MODEL`. Esto evita problemas de CORS que ocurrían con instancias locales de Ollama y permite que cualquier usuario externo acceda a las recomendaciones si se provee una API key válida.
- *Menú de Perfil*: El botón de perfil en el Sidebar no debe cerrar sesión directamente al hacer clic. Debe desplegar un menú con las opciones: "Editar perfil", "Configuración", "Preferencias" y "Cerrar sesión".
