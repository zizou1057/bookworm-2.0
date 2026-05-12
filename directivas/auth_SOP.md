# Directiva: Autenticación y Registro (Auth SOP)

## Objetivo
Implementar una página de autenticación unificada que contenga tanto el inicio de sesión como el registro de usuarios, permitiendo alternar entre ambas vistas. Se debe integrar Supabase Auth para manejar la creación de cuentas, inicio de sesión por correo/contraseña y autenticación social con Google.

## Entradas y Dependencias
- **Base de datos / Auth**: Supabase (Autenticación por email y OAuth con Google).
- **Frontend**: React (Vite) con TypeScript, estructurado con componentes reutilizables.
- **Estilos**: CSS modular o clases utilitarias siguiendo el diseño de Bookworm (Light Mode, minimalista, estilo Notion).

## Lógica y Pasos de Ejecución
1. **Configuración Backend**: Asegurar que Supabase esté configurado para aceptar autenticación con email/contraseña y OAuth de Google (los tokens deben estar en `.env`).
2. **Estructura del Componente**:
   - Crear una página principal de Auth (`AuthPage.tsx`).
   - Implementar un diseño de dos columnas (Formulario a la izquierda, Imagen de marca con Glassmorphism a la derecha).
   - Utilizar el enlace inferior ("¿Ya tienes una cuenta? Iniciar Sesión") para alternar vistas.
   - **Animación suave (Soft Animation)**: El formulario debe utilizar clases de Tailwind (`animate-in fade-in slide-in-from-bottom-X`) para transiciones fluidas al cambiar entre registro e inicio de sesión.
5. **Autenticación Social**:
   - Botón de "Continuar con Google" visible y funcional en ambas vistas.
6. **Integración Funcional**:
   - Conectar los formularios con las funciones de Supabase (`supabase.auth.signInWithPassword`, `supabase.auth.signUp`, `supabase.auth.signInWithOAuth`).

## Restricciones y Casos Borde (Conocidos)
- *Validación de contraseñas*: En el registro, verificar que los campos "Contraseña" y "Repetir contraseña" coincidan antes de enviar a Supabase.
- *Términos y condiciones*: El formulario de registro no debe enviarse si el checkbox de términos no está marcado.
- *Manejo de errores*: Mostrar mensajes claros en el UI si las credenciales son incorrectas o si el usuario ya existe.
