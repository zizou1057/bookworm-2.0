import os

def fix_app_tsx():
    p = os.path.join('src', 'App.tsx')
    with open(p, 'r', encoding='utf-8') as f:
        content = f.read()

    # Fix Progress value
    content = content.replace('<Progress value={book.progressPercent} className="h-1.5"', '<Progress value={book.progressPercent ?? null} className="h-1.5"')
    
    # Fix missing session in BookDetailView props
    old_props = """  onDeleteBook
}: {"""
    new_props = """  onDeleteBook,
  session
}: {"""
    content = content.replace(old_props, new_props)

    # Fix unused index
    content = content.replace('newBookIds.map((bookId, index) =>', 'newBookIds.map((bookId) =>')

    # Fix FocusModeView session prop
    content = content.replace('<FocusModeView session={session} library={library} onExit={() => setCurrentView(\'dashboard\')} onSaveSession={handleSaveFocusSession} />', '<FocusModeView library={library} onExit={() => setCurrentView(\'dashboard\')} onSaveSession={handleSaveFocusSession} />')

    with open(p, 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == '__main__':
    fix_app_tsx()
    print("App.tsx TS errors fixed.")
