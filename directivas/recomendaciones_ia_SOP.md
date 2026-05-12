# Directiva: Recomendador Inteligente (Búsqueda Avanzada)

## Objetivo
Transformar el botón de "Buscar" del menú lateral en una herramienta de **Descubrimiento y Recomendación de Libros basada en IA**. En lugar de simplemente buscar texto local, la herramienta utilizará los datos de lectura del usuario (géneros más leídos, libros con calificaciones altas, estado de lectura) para recomendar obras externas que le podrían interesar.

## Entradas y Dependencias
- **Frontend**: Nuevo componente de UI `DiscoveryView.tsx` (estilo moderno, tarjetas dinámicas).
- **Backend/Datos Locales**: Perfil de biblioteca del usuario (Géneros top, Calificaciones de 4/5 estrellas).
- **Servicios Externos**: 
  - *Modelo de IA (LLM)*: Para procesar los gustos y generar una lista curada de títulos recomendados. Utiliza cualquier API online que siga el estándar de OpenAI (ej. Groq, OpenRouter, OpenAI, Gemini). Se configura mediante `VITE_AI_API_URL`, `VITE_AI_API_KEY` y `VITE_AI_MODEL`.
  - *API de Libros (OpenLibrary)*: Para buscar las portadas, sinopsis y cantidad de páginas de los libros recomendados por la IA.

## Lógica y Pasos de Ejecución
1. **Extracción de Perfil**: El sistema lee la variable `library` del usuario y extrae sus 3 géneros principales y los últimos libros calificados positivamente.
2. **Generación de Prompt**: Se envía un contexto al modelo de lenguaje: *"El usuario lee mucho [Género A, Género B], le encantó [Libro X]. Recomienda 3 libros similares con su título y autor"*.
3. **Enriquecimiento de Datos**: Con los títulos que devuelve la IA, se consulta la API de Google Books para obtener la portada (`cover_url`) y el número de páginas (`pages`).
4. **Renderizado en UI**: Se muestran como tarjetas especiales bajo el título "Recomendados para ti".
5. **Acción "Añadir a Biblioteca"**: Cada tarjeta tiene un botón que, al presionarlo, inserta el libro directamente a Supabase con el estado "unread" (Por leer).
6. **Chat contextual (Opcional)**: Una barra de búsqueda libre donde el usuario pueda pedir algo específico: *"Quiero algo de ciencia ficción pero muy corto"*.

## Restricciones y Casos Borde (Conocidos)
- *Límites de API*: Es vital limitar el uso de la API de IA para no agotar cuotas. Guardar las recomendaciones en una tabla (ej. `user_recommendations`) con una expiración (ej. actualizar cada 7 días).
- *Alucinaciones de IA*: La IA podría inventar libros. Siempre cruzar la recomendación contra la API de Google Books; si Google Books no encuentra el libro, descartarlo de la interfaz.
- *Libros ya leídos*: Al generar la recomendación, filtrar de antemano para asegurar que la IA no recomiende libros que ya están en el arreglo local `library`.
