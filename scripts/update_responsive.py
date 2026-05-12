import os
import re

def make_responsive(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Main Wrapper
    content = content.replace(
        '<div className="flex h-screen overflow-hidden bg-slate-50 text-gray-900 font-sans">',
        '<div className="flex flex-col md:flex-row h-screen overflow-hidden bg-slate-50 text-gray-900 font-sans">'
    )
    
    # 2. Sidebar Hide on Mobile
    content = content.replace(
        '<aside className="w-72 bg-slate-50 flex flex-col h-screen sticky top-0">',
        '<aside className="hidden md:flex w-72 bg-slate-50 flex-col h-screen sticky top-0">'
    )

    # 3. Grids & Layouts
    content = content.replace('grid-cols-[1fr_320px]', 'flex flex-col md:grid md:grid-cols-[1fr_320px]')
    content = content.replace('grid grid-cols-4', 'grid grid-cols-2 md:grid-cols-4')
    content = content.replace('grid grid-cols-5', 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5')
    content = content.replace('grid grid-cols-[300px_1fr]', 'flex flex-col md:grid md:grid-cols-[300px_1fr]')
    
    # Padding and rounding fixes
    content = content.replace('rounded-tl-[2.5rem]', 'rounded-t-[2.5rem] md:rounded-t-none md:rounded-tl-[2.5rem]')
    content = content.replace('p-8 pb-12 pt-6', 'p-4 pb-24 md:p-8 md:pb-12 md:pt-6')
    content = content.replace('p-10 flex items-center mb-6', 'p-4 md:p-10 flex items-center md:mb-6 mb-2')
    
    # Make typography scalable
    content = content.replace('text-6xl', 'text-4xl md:text-6xl')
    content = content.replace('text-5xl', 'text-3xl md:text-5xl')
    content = content.replace('text-4xl', 'text-2xl md:text-4xl')

    # Add BottomNav Component if it doesn't exist
    if 'function BottomNav' not in content:
        bottom_nav_code = """
function BottomNav({ currentView, setCurrentView }: { currentView: string, setCurrentView: (v: string) => void }) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center h-16 px-4 z-50 pb-safe">
      <button onClick={() => setCurrentView('dashboard')} className={`flex flex-col items-center justify-center w-full h-full ${currentView === 'dashboard' ? 'text-primary' : 'text-gray-400'}`}>
        <LayoutGrid className="w-5 h-5 mb-1" />
        <span className="text-[10px] font-bold">Inicio</span>
      </button>
      <button onClick={() => setCurrentView('discovery')} className={`flex flex-col items-center justify-center w-full h-full ${currentView === 'discovery' ? 'text-primary' : 'text-gray-400'}`}>
        <Search className="w-5 h-5 mb-1" />
        <span className="text-[10px] font-bold">Buscar</span>
      </button>
      <button onClick={() => setCurrentView('library')} className={`flex flex-col items-center justify-center w-full h-full ${currentView === 'library' || currentView === 'categories' || currentView === 'collections' ? 'text-primary' : 'text-gray-400'}`}>
        <Library className="w-5 h-5 mb-1" />
        <span className="text-[10px] font-bold">Biblio</span>
      </button>
      <button onClick={() => setCurrentView('statistics')} className={`flex flex-col items-center justify-center w-full h-full ${currentView === 'statistics' ? 'text-primary' : 'text-gray-400'}`}>
        <BarChart3 className="w-5 h-5 mb-1" />
        <span className="text-[10px] font-bold">Stats</span>
      </button>
    </nav>
  )
}
"""
        # Insert BottomNav before App function
        content = content.replace('export default function App() {', bottom_nav_code + '\nexport default function App() {')
        
        # Inject BottomNav inside the App return, at the very end of the main wrapper
        # We find the final </div> that closes the App
        # Let's just insert it before the last </div>
        # Or better, insert it after Sidebar
        content = content.replace(
            '<Sidebar \n        currentView={currentView} \n        setCurrentView={(v) => { setCurrentView(v); setSelectedGroupId(null); setSelectedBookId(null); }} \n        userProfile={userProfile}\n      />',
            '<Sidebar \n        currentView={currentView} \n        setCurrentView={(v) => { setCurrentView(v); setSelectedGroupId(null); setSelectedBookId(null); }} \n        userProfile={userProfile}\n      />\n      <BottomNav currentView={currentView} setCurrentView={setCurrentView} />'
        )

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"Made {filepath} responsive successfully.")

if __name__ == "__main__":
    app_tsx_path = os.path.join(os.path.dirname(__file__), '..', 'src', 'App.tsx')
    make_responsive(app_tsx_path)
