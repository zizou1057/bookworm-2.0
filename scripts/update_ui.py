import os

def update_ui(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Reemplazar colores específicos por las variables del design system (Tailwind)
    content = content.replace('[#00BFB3]', 'primary')
    content = content.replace('[#009F95]', 'primary/80')
    
    # Fuentes
    content = content.replace('font-serif', 'font-heading tracking-tight')
    
    # Estilos de "Exaggerated Minimalism": títulos más grandes y agresivos
    content = content.replace('text-3xl font-serif', 'text-5xl font-heading tracking-tight font-bold')
    content = content.replace('text-4xl font-serif', 'text-6xl font-heading tracking-tight font-black')
    content = content.replace('text-2xl font-serif', 'text-4xl font-heading tracking-tight font-bold')
    
    # Reemplazar algunos grises por clases más nativas del tema
    content = content.replace('bg-[#F4F4F5]', 'bg-slate-50')
    
    # Aumentar espacios negativos (Exaggerated whitespace)
    content = content.replace('p-8 flex items-center mb-2', 'p-10 flex items-center mb-6')
    content = content.replace('p-4 flex flex-col gap-3', 'p-6 flex flex-col gap-4')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"Updated {filepath} successfully.")

if __name__ == "__main__":
    app_tsx_path = os.path.join(os.path.dirname(__file__), '..', 'src', 'App.tsx')
    update_ui(app_tsx_path)
