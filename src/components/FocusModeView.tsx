import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { BookOpen, X, Clock, CheckCircle } from 'lucide-react'
import type { Book } from '@/types'

type FocusModeViewProps = {
  session: any;
  library: Book[];
  onExit: () => void;
  onSaveSession: (bookId: string, durationSeconds: number, previousPage: number, newPage: number) => Promise<void>;
}

export function FocusModeView({ session, library, onExit, onSaveSession }: FocusModeViewProps) {
  const [step, setStep] = useState<'setup' | 'running' | 'completed'>('setup')
  const [targetMinutes, setTargetMinutes] = useState(30)
  const [timeLeft, setTimeLeft] = useState(0)
  
  // States for completion
  const readingBooks = library.filter(b => b.status === 'reading')
  const [selectedBookId, setSelectedBookId] = useState<string>(readingBooks.length === 1 ? readingBooks[0].id : "")
  const [currentPage, setCurrentPage] = useState<string>("")
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    let interval: any;
    if (step === 'running' && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(interval)
            setStep('completed')
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [step, timeLeft])

  const handleStart = () => {
    setTimeLeft(targetMinutes * 60)
    setStep('running')
  }

  const handleExitEarly = () => {
    if (window.confirm("¿Estás seguro de que deseas terminar la sesión anticipadamente? Se guardará el tiempo transcurrido.")) {
      setStep('completed')
    }
  }

  const handleCancelCompletely = () => {
    if (window.confirm("¿Seguro que deseas salir sin guardar nada?")) {
      onExit()
    }
  }

  const handleSave = async () => {
    if (!selectedBookId) return alert("Selecciona un libro.")
    const book = library.find(b => b.id === selectedBookId)
    if (!book) return
    const newPageNum = parseInt(currentPage, 10)
    if (isNaN(newPageNum) || newPageNum < (book.readPages || 0) || newPageNum > book.pages) {
      return alert(`La página debe ser mayor o igual a ${book.readPages || 0} y menor o igual a ${book.pages}.`)
    }

    setIsSaving(true)
    const durationSeconds = (targetMinutes * 60) - timeLeft
    await onSaveSession(selectedBookId, durationSeconds, book.readPages || 0, newPageNum)
    setIsSaving(false)
    onExit()
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0')
    const s = (seconds % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  if (step === 'setup') {
    return (
      <div className="min-h-screen bg-[#00BFB3] flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-none shadow-2xl bg-white/10 backdrop-blur-md text-white">
          <CardContent className="p-8 flex flex-col items-center">
            <Clock className="w-16 h-16 mb-6 opacity-80" />
            <h2 className="text-3xl font-serif font-bold mb-2">Focus Mode</h2>
            <p className="text-white/80 mb-8 text-center">Configura el tiempo de tu sesión inmersiva de lectura.</p>
            
            <div className="grid grid-cols-3 gap-4 w-full mb-8">
              {[15, 30, 45, 60, 90, 120].map(mins => (
                <button
                  key={mins}
                  onClick={() => setTargetMinutes(mins)}
                  className={`py-3 rounded-xl font-bold text-lg transition-all ${
                    targetMinutes === mins 
                      ? 'bg-white text-[#00BFB3] shadow-lg scale-105' 
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  {mins}m
                </button>
              ))}
            </div>

            <div className="flex w-full gap-4">
              <Button onClick={onExit} variant="ghost" className="flex-1 text-white hover:bg-white/10 h-12">Cancelar</Button>
              <Button onClick={handleStart} className="flex-1 bg-white text-[#00BFB3] hover:bg-gray-100 font-bold h-12 text-lg">Comenzar</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (step === 'running') {
    return (
      <div className="min-h-screen bg-[#00BFB3] flex flex-col items-center justify-center p-4">
        <div className="text-[12rem] font-bold text-white tracking-tighter leading-none drop-shadow-md">
          {formatTime(timeLeft)}
        </div>
        <p className="text-white/80 text-xl mt-4 font-medium tracking-widest uppercase">Tiempo Restante</p>
        
        <button 
          onClick={handleExitEarly}
          className="mt-16 px-6 py-3 rounded-full border-2 border-white/30 text-white hover:bg-white/10 transition-colors font-semibold"
        >
          Terminar anticipadamente
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#00BFB3] flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-none shadow-2xl bg-white text-gray-900 overflow-hidden">
        <div className="bg-gradient-to-r from-[#00BFB3] to-[#009F95] p-6 text-center text-white">
          <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-90" />
          <h2 className="text-2xl font-serif font-bold">¡Sesión Terminada!</h2>
          <p className="text-white/80 mt-1">Has leído durante {Math.round(((targetMinutes * 60) - timeLeft) / 60)} minutos.</p>
        </div>
        <CardContent className="p-8 space-y-6">
          {readingBooks.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-gray-500 mb-6">No tienes libros en progreso actualmente.</p>
              <Button onClick={onExit} className="w-full bg-[#00BFB3] hover:bg-[#009F95] text-white">
                Volver al Dashboard
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 flex items-center">
                  <BookOpen className="w-4 h-4 mr-1.5 text-gray-400" />
                  ¿Qué libro leíste?
                </label>
                <select 
                  value={selectedBookId}
                  onChange={e => {
                    setSelectedBookId(e.target.value)
                    setCurrentPage("")
                  }}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#00BFB3] bg-white"
                >
                  <option value="" disabled>Selecciona un libro</option>
                  {readingBooks.map(b => (
                    <option key={b.id} value={b.id}>{b.title}</option>
                  ))}
                </select>
              </div>

              {selectedBookId && (
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">
                    Página actual (antes: {library.find(b => b.id === selectedBookId)?.readPages || 0})
                  </label>
                  <input 
                    type="number" 
                    value={currentPage}
                    onChange={e => setCurrentPage(e.target.value)}
                    placeholder="Ej. 120"
                    min={library.find(b => b.id === selectedBookId)?.readPages || 0}
                    max={library.find(b => b.id === selectedBookId)?.pages}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#00BFB3]"
                  />
                </div>
              )}

              <div className="pt-4 flex gap-3">
                <Button onClick={handleCancelCompletely} variant="outline" className="flex-1" disabled={isSaving}>Descartar</Button>
                <Button onClick={handleSave} className="flex-1 bg-[#00BFB3] hover:bg-[#009F95] text-white" disabled={isSaving || !currentPage}>
                  {isSaving ? "Guardando..." : "Guardar Sesión"}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
