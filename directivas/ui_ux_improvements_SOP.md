# Directiva: Mejoras de Diseño y UI/UX (Bookworm 2.0)

## Objetivo
Mejorar el diseño visual y la experiencia de usuario de Bookworm 2.0 utilizando los lineamientos y mejores prácticas extraídas del skill `ui-ux-pro-max`. El diseño buscará una estética "Exaggerated Minimalism" (Minimalismo Exagerado) combinada con una paleta de colores clara, de alta jerarquía y excelente accesibilidad.

## Entradas / Dependencias
- Proyecto React + Vite con Tailwind CSS v4.
- Skill `ui-ux-pro-max` analizado.

## Salidas Esperadas
- Archivo global CSS actualizado (`index.css`) para incorporar el tema visual, tipografía y variables de color.
- Configuraciones de Tailwind CSS actualizadas (si corresponde) para reflejar las nuevas escalas de fuentes y utilidades de animación.
- Refactorización de la app base (`App.tsx` y vistas principales) para reflejar la nueva identidad de diseño.

## Lógica y Pasos

1.  **Tipografía:** 
    - Fuentes elegidas: `Fira Code` (Encabezados/Datos) y `Fira Sans` (Cuerpo), u otra combinación minimalista elegante y técnica (Ej. *Inter* u *Outfit* para lectura de libros). 
    - Instalar/importar de Google Fonts en el `index.css` o `index.html`.
    - Ajustar estilos globales usando variables CSS.

2.  **Paleta de Colores (Jerarquía Clara y Funcional):**
    - **Primary:** `#00BFB3` (Turquesa de marca)
    - **Secondary:** `#60A5FA` (Azul claro de soporte)
    - **CTA / Accent:** `#F97316` (Naranja para contrastes secundarios)
    - **Background:** `#F8FAFC` (Slate 50, fondo muy claro)
    - **Text / Foreground:** `#1E293B` (Slate 800)

3.  **Estilo "Exaggerated Minimalism":**
    - Uso de mucho espacio negativo (whitespace).
    - Fuentes de gran tamaño para encabezados (high contrast).
    - Eliminación de bordes innecesarios; separación de contenido mediante espacio.

4.  **Reglas de Interacción (CRÍTICO):**
    - **NO** emojis como iconos. Usar `lucide-react`.
    - Todas las tarjetas, botones y elementos clicables deben tener `cursor-pointer`.
    - Estados hover suaves (transiciones de 150-300ms, `transition-colors duration-200`).
    - Focus visible para navegación por teclado.

5.  **Ejecución:**
    - Modificar `src/index.css`.
    - Revisar `src/App.tsx` para aplicar clases de Tailwind que sigan estos principios.

## Restricciones y Casos Borde
- *Nota: No usar estados hover que cambien el layout (`transform: scale` excesivo que desplace texto), porque causa una experiencia poco profesional. En su lugar, usar cambios de color, opacidad o sombras sutiles.*
- Asegurar contraste WCAG AA mínimo 4.5:1 en textos claros/oscuros.
