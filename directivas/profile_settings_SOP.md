# Directiva: Perfil y Configuración (Profile Settings SOP)

## Objetivo
Implementar las vistas de "Editar perfil", "Configuración" y "Preferencias" accesibles desde el menú desplegable del perfil en la barra lateral.

## Entradas y Dependencias
- **Frontend**: Componentes de React en `App.tsx` utilizando estado para cambiar de vista.
- **Backend**: Integración con Supabase para actualizar metadatos del usuario. Se requiere una tabla `profiles` vinculada a `auth.users`.

## Arquitectura de Datos (Perfiles)
- `profiles`
  - `id`: UUID (Primary Key, Referencia a `auth.users.id` en cascada).
  - `username`: Texto (Nombre mostrado).
  - `avatar_url`: Texto (URL de la foto de perfil).
  - `bio`: Texto (Biografía).
  - `country`: Texto (País).
  - `favorite_genres`: Texto (Géneros favoritos, separados por comas).
  - `updated_at`: Timestamp.

## Lógica y Pasos de Ejecución
1. **Actualizar Navegación**: Ampliar el estado `currentView` en `App.tsx` para soportar `profile_settings`.
2. **Construir Vistas (Layout Unificado)**:
   - Crear un componente `ProfileSettingsLayout` que contenga un menú lateral (navegación interna) para cambiar entre Editar Perfil, Configuración y Preferencias.
   - `EditProfileView`: Formulario para Nombre de usuario, Nombre completo, Avatar, Biografía, País, y Géneros favoritos.
   - `SettingsView`: Opciones para cambiar email, cambiar contraseña, gestionar notificaciones, borrar cuenta, y una opción para compartir la plataforma mediante un enlace.
   - `PreferencesView`: Ajustes de la aplicación (Tema, metas de lectura predeterminadas, idiomas).
3. **Conexión de Interfaz**: Al hacer clic en las opciones del menú de perfil, cambiar la vista principal a `profile_settings` con la sub-pestaña correspondiente, permitiendo navegación fluida dentro de la misma pantalla.

## Restricciones y Casos Borde
- *Temas visuales*: La aplicación por ahora soporta exclusivamente Light Mode. El selector de temas en Preferencias debe indicar que el Modo Oscuro es una función "Próximamente".
- *Gestión de estado temporal*: Los formularios pueden usar estado local simulado y botones estéticos inicialmente, preparando la UI antes de la conexión profunda a Supabase.
