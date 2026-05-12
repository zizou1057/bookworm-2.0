import { useState, useEffect } from "react"
import type { Book, BookStatus, Group, GroupType } from "@/types"
import { supabase } from "./lib/supabase"
import { BookOpen, Search, PlusCircle, Library, CheckCircle2, Circle, BarChart3, Calendar, TrendingUp, Star, Clock, X, LayoutGrid, ChevronUp, ChevronDown, ArrowUpDown, GripVertical, Trash2, AlertTriangle, Glasses, LogOut, Settings, User, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { AuthPage } from "@/components/auth/AuthPage"
import { DiscoveryView } from "@/components/DiscoveryView"
import { ReadingGoalsWidget } from "@/components/ReadingGoalsWidget"
import { ProfileSettingsLayout } from "@/components/ProfileViews"
import { FocusModeView } from "@/components/FocusModeView"

function Sidebar({ currentView, setCurrentView, userProfile }: { currentView: string, setCurrentView: (v: string) => void, userProfile?: any }) {
  const isLibraryActive = ['library', 'categories', 'collections', 'groupDetail'].includes(currentView);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  return (
    <aside className="hidden md:flex w-72 bg-slate-50 flex-col h-screen sticky top-0">
      <div className="p-4 md:p-10 flex items-center md:mb-6 mb-2">
        <img src="/logo.png" alt="Bookworm Logo" className="h-10 w-auto" />
      </div>

      <nav className="flex-1 px-4 space-y-1.5 text-[15px] font-medium">
        <button
          onClick={() => setCurrentView('dashboard')}
          className={`w-full flex items-center px-4 py-3 rounded-2xl transition-all ${currentView === 'dashboard' ? 'bg-white shadow-sm text-gray-900 font-semibold' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200/50'}`}>
          <LayoutGrid className={`mr-4 h-[20px] w-[20px] stroke-[1.5] ${currentView === 'dashboard' ? 'text-gray-900' : 'text-gray-500'}`} />
          Dashboard
        </button>
        <button
          onClick={() => setCurrentView('statistics')}
          className={`w-full flex items-center px-4 py-3 rounded-2xl transition-all ${currentView === 'statistics' ? 'bg-white shadow-sm text-gray-900 font-semibold' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200/50'}`}>
          <BarChart3 className={`mr-4 h-[20px] w-[20px] stroke-[1.5] ${currentView === 'statistics' ? 'text-gray-900' : 'text-gray-500'}`} />
          Estadísticas
        </button>
        <button
          onClick={() => setCurrentView('discovery')}
          className={`w-full flex items-center px-4 py-3 rounded-2xl transition-all ${currentView === 'discovery' ? 'bg-white shadow-sm text-gray-900 font-semibold' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200/50'}`}>
          <Search className={`mr-4 h-[20px] w-[20px] stroke-[1.5] ${currentView === 'discovery' ? 'text-gray-900' : 'text-gray-500'}`} />
          Buscar
        </button>

        <div className="pt-2">
          <button
            onClick={() => setCurrentView('library')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all ${currentView === 'library' ? 'bg-white shadow-sm text-gray-900 font-semibold' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200/50'}`}>
            <div className="flex items-center">
              <Library className={`mr-4 h-[20px] w-[20px] stroke-[1.5] ${isLibraryActive ? 'text-gray-900' : 'text-gray-500'}`} />
              <span className={isLibraryActive ? 'text-gray-900 font-semibold' : ''}>Mi Biblioteca</span>
            </div>
            {isLibraryActive ? <ChevronUp className="h-4 w-4 text-gray-500" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
          </button>

          {isLibraryActive && (
            <div className="relative mt-2 ml-[35px] pl-4 space-y-1.5 border-l-2 border-gray-200/70">
              <button
                onClick={() => setCurrentView('categories')}
                className={`w-full flex items-center px-4 py-2.5 rounded-xl transition-all text-[14px] ${currentView === 'categories' ? 'bg-white shadow-sm text-gray-900 font-semibold' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200/50'}`}>
                Categorías
              </button>
              <button
                onClick={() => setCurrentView('collections')}
                className={`w-full flex items-center px-4 py-2.5 rounded-xl transition-all text-[14px] ${currentView === 'collections' ? 'bg-white shadow-sm text-gray-900 font-semibold' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200/50'}`}>
                Colecciones
              </button>
            </div>
          )}
        </div>
      </nav>

      <div className="p-4 mt-auto mb-4 border-t border-gray-200/50 relative">
        <div 
          onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
          className="flex items-center space-x-3 cursor-pointer hover:bg-gray-200/60 p-2 rounded-xl transition-colors"
          title="Opciones de cuenta"
        >
          <Avatar className="h-10 w-10 border border-gray-200/50">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>AX</AvatarFallback>
          </Avatar>
          <div className="text-left flex-1">
            <p className="text-sm font-semibold text-gray-900">{userProfile?.username || 'Axel M.'}</p>
            <p className="text-[11px] text-gray-500 font-medium">Mi Cuenta</p>
          </div>
        </div>

        {isProfileMenuOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsProfileMenuOpen(false)}
            />
            <div className="absolute bottom-full left-4 right-4 mb-2 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-bottom-2">
              <button 
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 flex items-center transition-colors"
                onClick={() => {
                  setIsProfileMenuOpen(false);
                  setCurrentView('edit_profile');
                }}
              >
                <User className="w-4 h-4 mr-3 text-gray-400" />
                Editar perfil
              </button>
              <button 
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 flex items-center transition-colors"
                onClick={() => {
                  setIsProfileMenuOpen(false);
                  setCurrentView('settings');
                }}
              >
                <Settings className="w-4 h-4 mr-3 text-gray-400" />
                Configuración
              </button>
              <button 
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 flex items-center transition-colors"
                onClick={() => {
                  setIsProfileMenuOpen(false);
                  setCurrentView('preferences');
                }}
              >
                <SlidersHorizontal className="w-4 h-4 mr-3 text-gray-400" />
                Preferencias
              </button>
              <div className="h-px bg-gray-100 my-1 mx-4" />
              <button 
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center transition-colors font-medium"
                onClick={() => {
                  setIsProfileMenuOpen(false);
                  supabase.auth.signOut();
                }}
              >
                <LogOut className="w-4 h-4 mr-3 text-red-500" />
                Cerrar sesión
              </button>
            </div>
          </>
        )}
      </div>
    </aside>
  )
}

function DailyTracker({ session }: { session: any }) {
  const [readDays, setReadDays] = useState<Record<number, boolean>>({});

  useEffect(() => {
    async function loadLogs() {
      // Get current week Monday to Sunday
      const today = new Date();
      const currentDay = today.getDay();
      const distanceToMonday = currentDay === 0 ? 6 : currentDay - 1;
      const monday = new Date(today);
      monday.setDate(today.getDate() - distanceToMonday);
      monday.setHours(0, 0, 0, 0);

      const mondayStr = monday.toISOString().split('T')[0];

      let localDaysRecord: Record<number, boolean> = {};
      const localDataStr = localStorage.getItem('bookworm_daily_tracker');
      if (localDataStr) {
        try {
          const localData = JSON.parse(localDataStr);
          if (localData.weekOf === mondayStr) {
            localDaysRecord = localData.days || {};
          } else {
            localStorage.removeItem('bookworm_daily_tracker');
          }
        } catch (e) {
          // ignore parsing error
        }
      }

      const { data } = await supabase
        .from('daily_logs')
        .select('date')
        .gte('date', mondayStr)
        .eq('user_id', session.user.id);

      const daysRecord: Record<number, boolean> = { ...localDaysRecord };
      if (data) {
        data.forEach(log => {
          const logDate = new Date(log.date);
          // adjust to local timezone date to avoid shift issues
          const localLogDate = new Date(logDate.getTime() + logDate.getTimezoneOffset() * 60000);
          const dayIdx = localLogDate.getDay() === 0 ? 6 : localLogDate.getDay() - 1;
          daysRecord[dayIdx] = true;
        });
      }
      setReadDays(daysRecord);
    }
    loadLogs();
  }, []);

  const days = [
    { label: "L", read: !!readDays[0] },
    { label: "M", read: !!readDays[1] },
    { label: "M", read: !!readDays[2] },
    { label: "J", read: !!readDays[3] },
    { label: "V", read: !!readDays[4] },
    { label: "S", read: !!readDays[5] },
    { label: "D", read: !!readDays[6] },
  ];

  const currentDayIdx = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;
  const isReadToday = !!readDays[currentDayIdx];

  return (
    <Card className="border-none shadow-sm bg-white overflow-hidden h-full flex flex-col">
      <CardContent className="p-0 flex items-stretch flex-1">
        <div className="w-32 bg-gray-50 p-4 flex items-center justify-center">
          <Glasses className="w-16 h-16 text-gray-300 stroke-[1.5]" />
        </div>
        <div className="flex-1 p-6 flex flex-col justify-center">
          <h2 className="text-xl font-heading tracking-tight font-bold text-gray-900 mb-4">¿Leíste hoy?</h2>
          <div className="flex items-center space-x-4 mb-4">
            {days.map((day, i) => (
              <div key={i} className="flex flex-col items-center space-y-2">
                <span className="text-xs text-gray-500 font-medium">{day.label}</span>
                {day.read ? (
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                ) : (
                  <Circle className="h-6 w-6 text-gray-200" />
                )}
              </div>
            ))}
          </div>
          {isReadToday ? (
            <div className="flex items-center space-x-2 text-primary bg-primary/10 px-4 py-2.5 rounded-lg font-medium text-sm">
              <Star className="h-4 w-4 fill-current" />
              <span>¡Felicidades! Has cumplido tu objetivo de hoy.</span>
            </div>
          ) : (
            <div className="flex space-x-3">
              <Button className="bg-primary text-white hover:bg-primary/80 font-semibold" onClick={() => {
                setReadDays(prev => {
                  const newDays = { ...prev, [currentDayIdx]: true };
                  
                  const today = new Date();
                  const currentDay = today.getDay();
                  const distanceToMonday = currentDay === 0 ? 6 : currentDay - 1;
                  const monday = new Date(today);
                  monday.setDate(today.getDate() - distanceToMonday);
                  monday.setHours(0, 0, 0, 0);
                  
                  localStorage.setItem('bookworm_daily_tracker', JSON.stringify({
                    weekOf: monday.toISOString().split('T')[0],
                    days: newDays
                  }));
                  
                  return newDays;
                });
              }}>
                Sí, ya leí
              </Button>
              <Button variant="outline" className="text-gray-600">
                Aún no
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function FocusModeWidget({ focusSessions, onStart }: { focusSessions: any[], onStart: () => void }) {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const monthSessions = focusSessions.filter((s: any) => {
    const d = new Date(s.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const totalSeconds = focusSessions.reduce((acc, s) => acc + (s.duration_seconds || 0), 0);
  const totalHours = Math.floor(totalSeconds / 3600);
  const totalMins = Math.floor((totalSeconds % 3600) / 60);

  const totalPages = focusSessions.reduce((acc, s) => acc + (s.pages_read || 0), 0);
  const avgSpeed = totalHours > 0 ? Math.round(totalPages / (totalSeconds / 3600)) : (totalPages > 0 ? Math.round(totalPages / (totalSeconds / 3600)) : '--');

  return (
    <Card className="border-none shadow-sm bg-white h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-bold text-gray-500 uppercase tracking-wider">Focus Mode</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 flex-1">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Velocidad prom.</span>
          <Badge variant="secondary" className="bg-primary/10 text-primary/80 font-semibold border-none">{avgSpeed} pág/h</Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Sesiones (mes)</span>
          <span className="text-sm font-semibold text-gray-900">{monthSessions.length}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Tiempo total</span>
          <span className="text-sm font-semibold text-gray-900">{totalHours}h {totalMins}m</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onStart} className="w-full bg-gray-900 text-white hover:bg-gray-800">
          Iniciar Sesión
        </Button>
      </CardFooter>
    </Card>
  )
}

function StatisticsWidget({ library }: { library: Book[] }) {
  const readLast30d = library.filter(b => {
    if (b.status !== 'read' || !b.endDate) return false;
    const end = new Date(b.endDate).getTime();
    const now = new Date().getTime();
    return (now - end) / (1000 * 3600 * 24) <= 30;
  }).length;

  const pendingBooks = library.filter(b => b.status === 'unread').length;

  const genreCounts: Record<string, number> = {};
  let totalGenres = 0;
  library.forEach(b => {
    if (b.genres) {
      b.genres.forEach(g => {
        genreCounts[g] = (genreCounts[g] || 0) + 1;
        totalGenres++;
      });
    }
  });

  const topGenres = Object.entries(genreCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name, count]) => ({
      name,
      percentage: totalGenres > 0 ? Math.round((count / totalGenres) * 100) : 0
    }));

  return (
    <Card className="border-none shadow-sm bg-white">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-bold text-gray-500 uppercase tracking-wider">Estadísticas</CardTitle>
        <BarChart3 className="w-4 h-4 text-gray-400" />
      </CardHeader>
      <CardContent className="space-y-6">

        {/* KPIs */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
            <p className="text-[10px] uppercase font-bold text-gray-500 mb-1">Libros (30d)</p>
            <p className="text-2xl font-heading tracking-tight font-bold text-primary">{readLast30d}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
            <p className="text-[10px] uppercase font-bold text-gray-500 mb-1">Páginas (7d)</p>
            <div className="flex items-end justify-between">
              <p className="text-2xl font-heading tracking-tight font-bold text-gray-900">--</p>
              {/* Fake Sparkline temporal */}
              <div className="flex items-end space-x-1 h-6 pb-1">
                <div className="w-1.5 bg-gray-200 h-[20%] rounded-t-sm"></div>
                <div className="w-1.5 bg-gray-200 h-[20%] rounded-t-sm"></div>
                <div className="w-1.5 bg-gray-200 h-[20%] rounded-t-sm"></div>
                <div className="w-1.5 bg-gray-200 h-[20%] rounded-t-sm"></div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 col-span-2 flex justify-between items-center">
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-500 mb-1">Libros Pendientes</p>
              <p className="text-2xl font-heading tracking-tight font-bold text-gray-900">{pendingBooks}</p>
            </div>
            <BookOpen className="text-gray-300 w-6 h-6" />
          </div>
        </div>

        {/* Géneros */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm font-semibold text-gray-900">Top Géneros</p>
            <select className="text-[10px] font-bold uppercase tracking-wider border-none bg-gray-100 rounded px-2 py-1 text-gray-600 outline-none cursor-pointer">
              <option>Total</option>
            </select>
          </div>
          <div className="space-y-3">
            {topGenres.length > 0 ? topGenres.map((g, i) => (
              <div key={i}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600">{g.name}</span>
                  <span className="font-semibold text-gray-900">{g.percentage}%</span>
                </div>
                <Progress value={g.percentage} className="h-1.5" indicatorClassName={i === 0 ? "bg-primary" : i === 1 ? "bg-gray-800" : "bg-gray-300"} />
              </div>
            )) : (
              <p className="text-xs text-gray-500 italic">No hay géneros registrados.</p>
            )}
          </div>
        </div>

      </CardContent>
    </Card>
  )
}

function StatisticsView({ library }: { library: Book[] }) {
  const ratingsCount = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let totalRated = 0;
  library.forEach(b => {
    if (b.status === 'read' && b.rating && b.rating > 0) {
      ratingsCount[b.rating as keyof typeof ratingsCount]++;
      totalRated++;
    }
  });

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-3xl font-heading tracking-tight font-bold text-gray-900 mb-8">Estadísticas Detalladas</h2>

      <div className="grid grid-cols-1 gap-8 mb-8">
        <Card className="border-none shadow-sm bg-white overflow-hidden opacity-50">
          <CardHeader className="pb-2 border-b border-gray-50 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-400" />
              <CardTitle className="text-lg font-bold text-gray-800">Heatmap de Actividad (Próximamente)</CardTitle>
            </div>
            <select className="text-[10px] font-bold uppercase tracking-wider border-none bg-gray-100 rounded px-2 py-1 text-gray-400 outline-none cursor-not-allowed" disabled>
              <option>{new Date().getFullYear()}</option>
            </select>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[120px] flex items-center justify-center border-2 border-dashed border-gray-100 rounded-lg">
               <span className="text-sm font-medium text-gray-400">Registrando datos...</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <Card className="border-none shadow-sm bg-white h-80 flex flex-col opacity-50">
          <CardHeader className="pb-2 border-b border-gray-50 flex flex-row items-center space-y-0 gap-2">
            <TrendingUp className="w-5 h-5 text-gray-400" />
            <CardTitle className="text-lg font-bold text-gray-800">Velocidad de Lectura (Pág/h)</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 flex-1 flex items-center justify-center">
            <span className="text-sm font-medium text-gray-400">Sin suficientes sesiones de Focus Mode</span>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white h-80 flex flex-col">
          <CardHeader className="pb-2 border-b border-gray-50 flex flex-row items-center space-y-0 gap-2">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            <CardTitle className="text-lg font-bold text-gray-800">Distribución de Calificaciones</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 flex-1 flex flex-col gap-4 justify-center">
            {[5, 4, 3, 2, 1].map((star) => {
               const count = ratingsCount[star as keyof typeof ratingsCount];
               const percentage = totalRated > 0 ? (count / totalRated) * 100 : 0;
               return (
                <div key={star} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-600 w-16 text-right">{star} Estrellas</span>
                  <Progress value={percentage} className="h-3 flex-1" indicatorClassName="bg-yellow-400" />
                  <span className="text-[10px] text-gray-400 w-6">{count}</span>
                </div>
               );
            })}
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white h-80 flex flex-col col-span-2 opacity-50">
          <CardHeader className="pb-2 border-b border-gray-50 flex flex-row items-center space-y-0 gap-2">
            <Clock className="w-5 h-5 text-gray-400" />
            <CardTitle className="text-lg font-bold text-gray-800">Días más productivos</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 flex-1 flex items-center justify-center">
            <span className="text-sm font-medium text-gray-400">Recopilando datos de lectura diaria...</span>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}



// Removed MOCK_LIBRARY

function LibraryView({ library, onSelectBook }: { library: Book[], onSelectBook: (id: string) => void }) {
  const [sortBy, setSortBy] = useState('added');
  const [filter, setFilter] = useState('all');

  let filteredBooks = library.filter(b => filter === 'all' ? true : b.status === filter);

  filteredBooks = [...filteredBooks].sort((a, b) => {
    if (sortBy === 'alphabetical') return a.title.localeCompare(b.title);
    if (sortBy === 'pages') return b.pages - a.pages;
    return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
  });

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end mb-8">
        <h2 className="text-3xl font-heading tracking-tight font-bold text-gray-900">Mi Biblioteca</h2>
        <div className="flex gap-4">
          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="text-sm font-semibold border border-gray-200 bg-white shadow-sm rounded-lg px-4 py-2 text-gray-700 outline-none cursor-pointer">
            <option value="all">Todas las categorías</option>
            <option value="unread">Por leer</option>
            <option value="reading">Leyendo</option>
            <option value="read">Leídos</option>
          </select>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="text-sm font-semibold border border-gray-200 bg-white shadow-sm rounded-lg px-4 py-2 text-gray-700 outline-none cursor-pointer">
            <option value="added">Agregados recientemente</option>
            <option value="alphabetical">Orden alfabético</option>
            <option value="pages">Número de páginas</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {filteredBooks.map(book => (
          <Card key={book.id} onClick={() => onSelectBook(book.id)} className="border-none shadow-sm hover:shadow-md transition-shadow group cursor-pointer h-full">
            <CardContent className="p-6 flex flex-col gap-4 h-full">
              <div className="w-full aspect-[2/3] overflow-hidden rounded shadow-sm relative bg-gray-100">
                <img
                  src={book.coverUrl}
                  alt={book.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform absolute inset-0"
                />
              </div>
              <div className="flex flex-col gap-1 mt-1 flex-1">
                <div>
                  <h4 className="font-heading tracking-tight font-bold text-gray-900 line-clamp-1" title={book.title}>
                    {book.title}
                  </h4>
                  <p className="text-sm text-gray-500 line-clamp-1">
                    {book.author}
                  </p>
                </div>

                <div className="mt-auto pt-3 flex flex-col gap-2">
                  {book.status === 'unread' && (
                    <div className="flex justify-between text-xs text-gray-500 items-center">
                      <Badge variant="secondary" className="bg-gray-100 text-gray-600 border-none px-2 py-0.5 rounded text-[10px] uppercase">Por leer</Badge>
                      <span className="font-semibold">{book.pages} pág</span>
                    </div>
                  )}

                  {book.status === 'reading' && (
                    <>
                      <div className="flex justify-between text-xs text-gray-500 items-end">
                        <span className="font-semibold text-primary">{book.progressPercent}%</span>
                        <span className="text-[10px]">{book.readPages} / {book.pages}p</span>
                      </div>
                      <Progress value={book.progressPercent ?? null} className="h-1.5" indicatorClassName="bg-primary" />
                    </>
                  )}

                  {book.status === 'read' && (
                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between text-xs text-gray-500 items-center">
                        <Badge variant="secondary" className="bg-primary/10 text-primary/80 border-none px-2 py-0.5 rounded text-[10px] uppercase">Leído</Badge>
                        <span className="font-semibold">{book.pages} pág</span>
                      </div>
                      <div className="flex justify-between text-[10px] text-gray-400">
                        <span>{book.startDate}</span>
                        <span>-</span>
                        <span>{book.endDate}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function BookDetailView({
  bookId,
  library,
  categories,
  collections,
  onBack,
  onUpdateBook,
  onSelectGroup,
  onSelectGenre,
  onAddBookToGroups,
  onDeleteBook,
  session
}: {
  bookId: string;
  library: Book[];
  categories: Group[];
  collections: Group[];
  onBack: () => void;
  onUpdateBook: (id: string, updates: Partial<Book>) => Promise<void>;
  onSelectGroup: (id: string, type: GroupType) => void;
  onSelectGenre: (genre: string) => void;
  onAddBookToGroups: (bookId: string, groupIds: string[]) => Promise<void>;
  onDeleteBook: (id: string) => Promise<void>;
  session: any;
}) {
  const book = library.find(b => b.id === bookId);
  const [logs, setLogs] = useState<any[]>([]);
  const [isAddToGroupModalOpen, setIsAddToGroupModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [logPage, setLogPage] = useState('');
  const [logDate, setLogDate] = useState(new Date().toISOString().split('T')[0]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    if (!book) return;
    async function loadExtra() {
      const { data: logData } = await supabase.from('daily_logs').select('*').eq('book_id', bookId).order('created_at', { ascending: false });
      if (logData) setLogs(logData);
      const { data: commentData } = await supabase.from('book_comments').select('*').eq('book_id', bookId).order('created_at', { ascending: false });
      if (commentData) setComments(commentData);
    }
    loadExtra();
  }, [bookId]);

  if (!book) return null;

  const bookCategories = categories.filter(c => c.bookIds.includes(book.id));
  const bookCollections = collections.filter(c => c.bookIds.includes(book.id));

  const handleAddLog = async () => {
    const pageNum = parseInt(logPage);
    if (isNaN(pageNum) || pageNum < 0 || pageNum > (book.pages || 0)) return;

    const prevPage = book.readPages || 0;
    const pagesRead = pageNum - prevPage;
    
    // Calcular el porcentaje real
    const newPercent = book.pages ? Math.round((pageNum / book.pages) * 100) : 0;

    const { data, error } = await supabase.from('daily_logs').insert({
      book_id: book.id,
      user_id: session.user.id,
      date: logDate,
      previous_page: prevPage,
      current_page: pageNum,
      pages_read: pagesRead
    }).select().single();

    if (error) {
      console.error("Error inserting daily log:", error);
    }

    if (data) {
      setLogs([data, ...logs]);
      await onUpdateBook(book.id, { readPages: pageNum, progressPercent: newPercent });
      setLogPage('');
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    const { data } = await supabase.from('book_comments').insert({
      book_id: book.id,
      user_id: session.user.id,
      content: newComment.trim()
    }).select().single();
    if (data) {
      setComments([data, ...comments]);
      setNewComment('');
    }
  };

  const setStatus = async (status: BookStatus) => {
    const updates: Partial<Book> = { status };
    if (status === 'reading' && !book.startDate) {
      updates.startDate = new Date().toISOString().split('T')[0];
    } else if (status === 'read') {
      updates.endDate = new Date().toISOString().split('T')[0];
      updates.progressPercent = 100;
      updates.readPages = book.pages;
    }
    await onUpdateBook(book.id, updates);
  };

  return (
    <div className="w-full animate-in fade-in duration-500">
      <AddToGroupModal
        isOpen={isAddToGroupModalOpen}
        onClose={() => setIsAddToGroupModalOpen(false)}
        categories={categories}
        collections={collections}
        currentGroups={[...bookCategories.map(c => c.id), ...bookCollections.map(c => c.id)]}
        onSave={async (groupIds) => {
          await onAddBookToGroups(book.id, groupIds);
          setIsAddToGroupModalOpen(false);
        }}
      />
      <button onClick={onBack} className="text-sm font-semibold text-gray-500 hover:text-gray-900 mb-6 flex items-center transition-colors">
        <ChevronDown className="w-4 h-4 mr-1 rotate-90" />
        Volver
      </button>

      <div className="mb-8">
        <h1 className="text-2xl md:text-4xl font-heading tracking-tight font-bold text-gray-900">{book.title}</h1>
        <p className="text-xl text-gray-500 mt-2">{book.author}</p>
      </div>

      <div className="flex flex-col md:grid md:grid-cols-[300px_1fr] gap-12">
        <div className="space-y-8">
          <div>
            <img src={book.coverUrl} alt={book.title} className="w-full aspect-[2/3] object-cover rounded-xl shadow-lg border border-gray-100" />
            <div className="mt-6">
              <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6 flex flex-col items-center justify-center shadow-sm">
                <div className="flex items-baseline gap-2">
                  <input
                    type="number"
                    value={book.pages || ''}
                    onChange={e => onUpdateBook(book.id, { pages: parseInt(e.target.value) || 0 })}
                    className="w-32 text-center text-3xl md:text-5xl font-black text-primary/80 outline-none bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="text-sm font-bold text-primary/80 uppercase tracking-wider">Páginas</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="flex flex-wrap gap-2 items-center">
            {book.genres?.map((g, i) => (
              <Badge key={i} variant="outline" className="cursor-pointer bg-white hover:bg-gray-50" onClick={() => onSelectGenre(g)}>{g}</Badge>
            ))}
            {bookCategories.map(c => (
              <Badge key={c.id} variant="secondary" className="cursor-pointer bg-primary/10 text-primary/80 hover:bg-primary/20" onClick={() => onSelectGroup(c.id, 'category')}>{c.name}</Badge>
            ))}
            {bookCollections.map(c => (
              <Badge key={c.id} variant="secondary" className="cursor-pointer bg-purple-100 text-purple-700 hover:bg-purple-200" onClick={() => onSelectGroup(c.id, 'collection')}>{c.name}</Badge>
            ))}
            <button 
              onClick={() => setIsAddToGroupModalOpen(true)} 
              className="h-6 px-2.5 text-xs font-semibold rounded-full border border-dashed border-gray-300 text-gray-500 hover:text-gray-900 hover:border-gray-400 transition-colors flex items-center gap-1"
            >
              + Añadir a Grupo
            </button>
          </div>

          <div className="bg-gray-100 p-1 rounded-xl flex">
            <button onClick={() => setStatus('unread')} className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${book.status === 'unread' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>Por leer</button>
            <button onClick={() => setStatus('reading')} className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${book.status === 'reading' ? 'bg-white shadow-sm text-primary' : 'text-gray-500 hover:text-gray-700'}`}>Leyendo</button>
            <button onClick={() => setStatus('read')} className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${book.status === 'read' ? 'bg-white shadow-sm text-primary/80' : 'text-gray-500 hover:text-gray-700'}`}>Leído</button>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            {book.status === 'unread' && (
              <div className="text-center py-8">
                <p className="text-gray-500">Este libro tiene <strong className="text-gray-900">{book.pages} páginas</strong>. ¡Empieza a leer cuando estés listo!</p>
              </div>
            )}

            {book.status === 'reading' && (
              <div className="space-y-8">
                <div className="flex justify-between items-center text-sm">
                  <div className="flex flex-col">
                    <span className="text-gray-500 font-medium">Fecha de inicio</span>
                    <input
                      type="date"
                      value={book.startDate || ''}
                      onChange={e => onUpdateBook(book.id, { startDate: e.target.value })}
                      className="font-bold text-gray-900 outline-none border-b border-transparent focus:border-primary bg-transparent"
                    />
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-primary text-2xl">{book.progressPercent || 0}%</div>
                    <div className="text-gray-500">{book.readPages || 0} / {book.pages} pág</div>
                  </div>
                </div>
                <Progress value={book.progressPercent || 0} className="h-2" indicatorClassName="bg-primary" />

                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                  <h4 className="font-bold text-gray-900 mb-3 text-sm">Actualizar progreso</h4>
                  <div className="flex gap-4 items-end">
                    <div className="flex-1 space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">¿En qué página te quedaste?</label>
                      <input
                        type="number"
                        value={logPage}
                        onChange={e => setLogPage(e.target.value)}
                        placeholder={`Ej. ${book.readPages ? book.readPages + 10 : 10}`}
                        className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-primary"
                        title="Ingresa el número de página en el que te encuentras ahora"
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Fecha</label>
                      <input
                        type="date"
                        value={logDate}
                        onChange={e => setLogDate(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-primary bg-white"
                      />
                    </div>
                    <Button onClick={handleAddLog} className="bg-primary text-white hover:bg-primary/80 h-10">Guardar</Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-bold text-gray-900 text-sm">Historial de lectura</h4>
                  {logs.length > 0 ? logs.map(log => (
                    <div key={log.id} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          <BookOpen className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">Alcanzó pág. {log.current_page}</p>
                          <p className="text-[10px] text-gray-500 uppercase">{log.date}</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-gray-100 text-gray-600">+{log.pages_read} pág</Badge>
                    </div>
                  )) : (
                    <p className="text-sm text-gray-500 italic">No hay registros todavía.</p>
                  )}
                </div>
              </div>
            )}

            {book.status === 'read' && (
              <div className="flex gap-12 justify-center py-4">
                <div className="flex flex-col items-center">
                  <span className="text-xs font-bold text-gray-500 uppercase mb-1">Fecha de inicio</span>
                  <input
                    type="date"
                    value={book.startDate || ''}
                    onChange={e => onUpdateBook(book.id, { startDate: e.target.value })}
                    className="font-bold text-gray-900 text-lg outline-none border-b border-transparent focus:border-primary text-center bg-transparent"
                  />
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xs font-bold text-gray-500 uppercase mb-1">Fecha de fin</span>
                  <input
                    type="date"
                    value={book.endDate || ''}
                    onChange={e => onUpdateBook(book.id, { endDate: e.target.value })}
                    className="font-bold text-gray-900 text-lg outline-none border-b border-transparent focus:border-primary text-center bg-transparent"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-8 pt-6 border-t border-gray-100">
            <div className="space-y-4">
              <h3 className="font-bold text-gray-900">Calificación</h3>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    onClick={() => onUpdateBook(book.id, { rating: star })}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star className={`w-8 h-8 ${book.rating && book.rating >= star ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200 hover:text-gray-300'}`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-gray-900">Comentarios</h3>
              <div className="flex flex-col gap-3">
                <textarea
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  placeholder="Escribe un comentario o nota de lectura..."
                  className="w-full border border-gray-200 rounded-xl p-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none h-28 shadow-sm"
                />
                <Button onClick={handleAddComment} className="bg-primary text-white hover:bg-primary/80 self-end rounded-lg px-6">Guardar</Button>
              </div>
              <div className="space-y-4 mt-8">
                {comments.map(c => (
                  <div key={c.id} className="bg-white border border-gray-100 p-5 rounded-xl shadow-sm">
                    <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">{c.content}</p>
                    <p className="text-[10px] text-gray-400 mt-3 uppercase font-bold tracking-wider">
                      {new Date(c.created_at).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Zona de peligro */}
      <div className="mt-12 pt-8 border-t border-red-100">
        <div className="flex items-center justify-between bg-red-50/50 border border-red-100 rounded-xl p-5">
          <div>
            <h4 className="text-sm font-bold text-red-600">Eliminar libro</h4>
            <p className="text-xs text-red-400 mt-0.5">Esta acción es irreversible. Se eliminarán todos los datos, historial y comentarios asociados.</p>
          </div>
          <Button
            variant="outline"
            className="text-red-500 hover:bg-red-500 hover:text-white border-red-200 transition-colors"
            onClick={() => setIsDeleteModalOpen(true)}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Eliminar Libro
          </Button>
        </div>
      </div>

      {/* Modal de confirmación de eliminación */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center animate-in fade-in duration-200 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <AlertTriangle className="w-7 h-7 text-red-500" />
              </div>
              <h2 className="text-xl font-heading tracking-tight font-bold text-gray-900 mb-2">¿Eliminar este libro?</h2>
              <p className="text-sm text-gray-500 leading-relaxed">
                Estás a punto de eliminar <strong className="text-gray-900">{book.title}</strong>. 
                Se borrarán permanentemente su historial de lectura, comentarios y asociaciones a categorías/colecciones.
              </p>
            </div>
            <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setIsDeleteModalOpen(false)}
                className="font-semibold text-gray-600 bg-white"
                disabled={isDeleting}
              >
                Cancelar
              </Button>
              <Button
                className="bg-red-500 text-white hover:bg-red-600 font-semibold"
                disabled={isDeleting}
                onClick={async () => {
                  setIsDeleting(true);
                  await onDeleteBook(book.id);
                  setIsDeleting(false);
                  setIsDeleteModalOpen(false);
                }}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {isDeleting ? 'Eliminando...' : 'Sí, eliminar'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function AddToGroupModal({ 
  isOpen, onClose, onSave, categories, collections, currentGroups 
}: { 
  isOpen: boolean, onClose: () => void, onSave: (groupIds: string[]) => void, 
  categories: Group[], collections: Group[], currentGroups: string[] 
}) {
  const [selectedGroupIds, setSelectedGroupIds] = useState<Set<string>>(new Set(currentGroups));

  useEffect(() => {
    if (isOpen) setSelectedGroupIds(new Set(currentGroups));
  }, [isOpen, currentGroups]);

  if (!isOpen) return null;

  const toggleGroup = (id: string) => {
    const newSelected = new Set(selectedGroupIds);
    if (newSelected.has(id)) newSelected.delete(id);
    else newSelected.add(id);
    setSelectedGroupIds(newSelected);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center animate-in fade-in duration-200 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white">
          <h2 className="text-xl font-heading tracking-tight font-bold text-gray-900">Añadir a Grupo</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 text-gray-500 hover:text-gray-900">
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="p-5 overflow-y-auto max-h-[60vh] space-y-6">
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Categorías</h3>
            {categories.length === 0 ? <p className="text-sm text-gray-400 italic">No hay categorías creadas.</p> : (
              <div className="grid grid-cols-2 gap-2">
                {categories.map(c => (
                  <button
                    key={c.id}
                    onClick={() => toggleGroup(c.id)}
                    className={`text-left p-3 rounded-lg text-sm font-medium border transition-colors ${selectedGroupIds.has(c.id) ? 'border-primary bg-primary/10 text-primary/80' : 'border-gray-100 hover:border-gray-300'}`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Colecciones</h3>
            {collections.length === 0 ? <p className="text-sm text-gray-400 italic">No hay colecciones creadas.</p> : (
              <div className="grid grid-cols-2 gap-2">
                {collections.map(c => (
                  <button
                    key={c.id}
                    onClick={() => toggleGroup(c.id)}
                    className={`text-left p-3 rounded-lg text-sm font-medium border transition-colors ${selectedGroupIds.has(c.id) ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-100 hover:border-gray-300'}`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} className="font-semibold text-gray-600 bg-white">Cancelar</Button>
          <Button onClick={() => onSave(Array.from(selectedGroupIds))} className="bg-primary text-white hover:bg-primary/80 font-semibold">Guardar Cambios</Button>
        </div>
      </div>
    </div>
  )
}

function AddBookModal({ isOpen, onClose, onSave }: { isOpen: boolean, onClose: () => void, onSave: (book: Partial<Book>) => void }) {
  const [status, setStatus] = useState('unread');
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [pages, setPages] = useState('');
  const [genres, setGenres] = useState('');
  const [publishDate, setPublishDate] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [readPages, setReadPages] = useState('');

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length > 2) {
        setIsSearching(true);
        try {
          const res = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(searchQuery)}&limit=5`);
          const data = await res.json();
          if (data.docs) {
            setSuggestions(data.docs);
            setShowSuggestions(true);
          }
        } catch (error) {
          console.error(error);
        }
        setIsSearching(false);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSelectSuggestion = (book: any) => {
    setTitle(book.title || '');
    setAuthor(book.author_name ? book.author_name.join(', ') : '');
    setPages(book.number_of_pages_median ? book.number_of_pages_median.toString() : '');
    setGenres(book.subject ? book.subject.slice(0, 3).join(', ') : '');
    setPublishDate(book.first_publish_year ? book.first_publish_year.toString() : '');
    if (book.cover_i) {
      setCoverUrl(`https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`);
    } else {
      setCoverUrl('');
    }
    setShowSuggestions(false);
    setSearchQuery('');
  };

  const handleSaveClick = () => {
    onSave({
      title,
      author,
      pages: parseInt(pages) || 0,
      genres: genres.split(',').map(g => g.trim()).filter(Boolean),
      publishDate,
      coverUrl,
      status: status as any,
      readPages: parseInt(readPages) || 0,
      startDate,
      endDate
    });
    setTitle(''); setAuthor(''); setPages(''); setGenres(''); setPublishDate(''); setCoverUrl(''); setReadPages(''); setStartDate(''); setEndDate(''); setStatus('unread'); setSearchQuery('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center animate-in fade-in duration-200 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
          <h2 className="text-xl font-heading tracking-tight font-bold text-gray-900">Añadir Libro</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 text-gray-500 hover:text-gray-900">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          <div className="relative z-10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Auto-completar con Google Books..."
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium placeholder:font-normal"
              />
              {isSearching && <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">Buscando...</div>}
            </div>
            
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden border-t-0">
                {suggestions.map(book => (
                  <div
                    key={book.key}
                    onClick={() => handleSelectSuggestion(book)}
                    className="p-3 hover:bg-gray-50 cursor-pointer flex gap-3 items-center border-b border-gray-50 last:border-0"
                  >
                    {book.cover_i ? (
                      <img src={`https://covers.openlibrary.org/b/id/${book.cover_i}-S.jpg`} alt="cover" className="w-8 h-12 object-cover rounded shadow-sm" />
                    ) : (
                      <div className="w-8 h-12 bg-gray-100 rounded flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-gray-900 line-clamp-1">{book.title}</h4>
                      <p className="text-xs text-gray-500 line-clamp-1">{book.author_name?.join(', ') || 'Autor desconocido'}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Nombre</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary" placeholder="Ej. Dune" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Autor</label>
              <input type="text" value={author} onChange={e => setAuthor(e.target.value)} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary" placeholder="Ej. Frank Herbert" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Páginas</label>
              <input type="number" value={pages} onChange={e => setPages(e.target.value)} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary" placeholder="Ej. 450" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Géneros</label>
              <input type="text" value={genres} onChange={e => setGenres(e.target.value)} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary" placeholder="Ej. Ficción, Fantasía" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Fecha de Publicación</label>
              <input type="text" value={publishDate} onChange={e => setPublishDate(e.target.value)} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white text-gray-700" placeholder="Ej. 1965-08" />
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Estado de lectura</label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setStatus('unread')}
                  className={`p-2.5 rounded-lg text-sm font-semibold border transition-colors ${status === 'unread' ? 'border-primary bg-primary/10 text-primary/80' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                  Por leer
                </button>
                <button
                  onClick={() => setStatus('reading')}
                  className={`p-2.5 rounded-lg text-sm font-semibold border transition-colors ${status === 'reading' ? 'border-primary bg-primary/10 text-primary/80' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                  Leyendo
                </button>
                <button
                  onClick={() => setStatus('read')}
                  className={`p-2.5 rounded-lg text-sm font-semibold border transition-colors ${status === 'read' ? 'border-primary bg-primary/10 text-primary/80' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                  Leído
                </button>
              </div>
            </div>

            <div className="mt-5 min-h-[70px]">
              {status === 'reading' && (
                <div className="grid grid-cols-2 gap-5 animate-in fade-in slide-in-from-top-2">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Fecha de inicio</label>
                    <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary text-gray-700" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Páginas leídas</label>
                    <input type="number" value={readPages} onChange={e => setReadPages(e.target.value)} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary" placeholder="Ej. 120" />
                  </div>
                </div>
              )}

              {status === 'read' && (
                <div className="grid grid-cols-2 gap-5 animate-in fade-in slide-in-from-top-2">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Fecha de inicio</label>
                    <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary text-gray-700" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Fecha de fin</label>
                    <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary text-gray-700" />
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-xl">
          <Button variant="outline" onClick={onClose} className="font-semibold text-gray-600 bg-white">
            Cancelar
          </Button>
          <Button onClick={handleSaveClick} className="bg-primary text-white hover:bg-primary/80 font-semibold">
            Guardar Libro
          </Button>
        </div>
      </div>
    </div>
  )
}

function NewGroupModal({ isOpen, onClose, onSave, type, library }: { isOpen: boolean, onClose: () => void, onSave: (name: string, ids: string[]) => void, type: GroupType, library: Book[] }) {
  const [name, setName] = useState('');
  const [selectedBookIds, setSelectedBookIds] = useState<Set<string>>(new Set());

  if (!isOpen) return null;

  const title = type === 'category' ? 'Nueva Categoría' : 'Nueva Colección';
  const nameLabel = type === 'category' ? 'Nombre de la Categoría' : 'Nombre de la Colección';

  const toggleBook = (id: string) => {
    const newSelected = new Set(selectedBookIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedBookIds(newSelected);
  };

  const selectedBooks = library.filter(b => selectedBookIds.has(b.id));

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center animate-in fade-in duration-200 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
          <h2 className="text-xl font-heading tracking-tight font-bold text-gray-900">{title}</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 text-gray-500 hover:text-gray-900">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{nameLabel}</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder={`Ej. ${type === 'category' ? 'Fantasía Épica' : 'Para leer este verano'}`}
            />
          </div>

          <div className="space-y-3 flex-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Seleccionar Libros</label>
            <div className="grid grid-cols-2 md:grid-cols-4 md:grid-cols-5 gap-4">
              {library.map(book => {
                const isSelected = selectedBookIds.has(book.id);
                return (
                  <div
                    key={book.id}
                    onClick={() => toggleBook(book.id)}
                    className={`cursor-pointer rounded-lg border-2 transition-all overflow-hidden ${isSelected ? 'border-primary' : 'border-transparent hover:border-gray-200'}`}
                  >
                    <div className="w-full aspect-[2/3] relative bg-gray-100">
                      <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
                      {isSelected && (
                        <div className="absolute top-2 right-2 bg-primary rounded-full p-1 shadow-sm">
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="p-2 bg-gray-50 border-t border-gray-100">
                      <p className="text-xs font-bold text-gray-900 line-clamp-1">{book.title}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {selectedBooks.length > 0 && (
          <div className="p-4 bg-gray-50 border-t border-gray-100">
            <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-3">Libros Seleccionados ({selectedBooks.length})</h4>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {selectedBooks.map(book => (
                <div key={book.id} className="flex-shrink-0 relative w-16 group animate-in slide-in-from-right-4 fade-in duration-300">
                  <img src={book.coverUrl} alt={book.title} className="w-16 h-24 object-cover rounded shadow-sm border border-gray-200" />
                  <button
                    onClick={() => toggleBook(book.id)}
                    className="absolute -top-2 -right-2 bg-white rounded-full p-0.5 shadow-md opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-red-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-xl">
          <Button variant="outline" onClick={onClose} className="font-semibold text-gray-600 bg-white">
            Cancelar
          </Button>
          <Button className="bg-primary text-white hover:bg-primary/80 font-semibold" onClick={() => {
            if (name.trim()) {
              onSave(name.trim(), Array.from(selectedBookIds));
              setName('');
              setSelectedBookIds(new Set());
            }
          }}>
            Aceptar
          </Button>
        </div>
      </div>
    </div>
  );
}

function GroupDetailView({
  group,
  type,
  library,
  onBack,
  onUpdateName,
  onRemoveBook,
  onDeleteGroup,
  onSelectBook,
  onReorderBooks
}: {
  group: Group,
  type: GroupType,
  library: Book[],
  onBack: () => void,
  onUpdateName: (id: string, newName: string) => void,
  onRemoveBook: (groupId: string, bookId: string) => void,
  onDeleteGroup: (id: string) => void,
  onSelectBook: (id: string) => void,
  onReorderBooks: (groupId: string, newBookIds: string[]) => void
}) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState(group.name);
  const [isReordering, setIsReordering] = useState(false);

  // Mantener el orden de los libros según bookIds del grupo
  const books = group.bookIds.map(id => library.find(b => b.id === id)).filter(Boolean) as Book[];

  const moveBook = (index: number, direction: 'up' | 'down') => {
    const newBookIds = [...group.bookIds];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newBookIds.length) return;
    [newBookIds[index], newBookIds[targetIndex]] = [newBookIds[targetIndex], newBookIds[index]];
    onReorderBooks(group.id, newBookIds);
  };

  return (
    <div className="w-full animate-in fade-in slide-in-from-right-4 duration-500">
      <button onClick={onBack} className="text-sm font-semibold text-gray-500 hover:text-gray-900 mb-6 flex items-center transition-colors">
        <ChevronDown className="w-4 h-4 mr-1 rotate-90" />
        Volver a {type === 'category' ? 'Categorías' : 'Colecciones'}
      </button>

      <div className="flex justify-between items-start mb-8">
        <div className="flex-1">
          {isEditingName ? (
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={editName}
                onChange={e => setEditName(e.target.value)}
                className="text-3xl font-heading tracking-tight font-bold text-gray-900 border-b-2 border-primary outline-none bg-transparent"
                autoFocus
                onKeyDown={e => {
                  if (e.key === 'Enter' && editName.trim()) {
                    onUpdateName(group.id, editName.trim());
                    setIsEditingName(false);
                  } else if (e.key === 'Escape') {
                    setIsEditingName(false);
                    setEditName(group.name);
                  }
                }}
              />
              <Button size="sm" className="bg-primary text-white hover:bg-primary/80" onClick={() => { if (editName.trim()) { onUpdateName(group.id, editName.trim()); setIsEditingName(false); } }}>Guardar</Button>
              <Button size="sm" variant="ghost" onClick={() => { setIsEditingName(false); setEditName(group.name); }}>Cancelar</Button>
            </div>
          ) : (
            <div className="flex items-center gap-3 group/title">
              <h2 className="text-3xl font-heading tracking-tight font-bold text-gray-900">{group.name}</h2>
              <button onClick={() => setIsEditingName(true)} className="opacity-0 group-hover/title:opacity-100 text-gray-400 hover:text-primary transition-opacity">
                <span className="text-[10px] font-bold uppercase tracking-wider">Editar Nombre</span>
              </button>
            </div>
          )}
          <p className="text-gray-500 mt-2">{books.length} libros en esta {type === 'category' ? 'categoría' : 'colección'}.</p>
        </div>

        <div className="flex gap-3">
          {books.length > 1 && (
            <Button
              variant={isReordering ? 'default' : 'outline'}
              className={isReordering ? 'bg-primary text-white hover:bg-primary/80' : 'bg-white text-gray-700 hover:bg-gray-50'}
              onClick={() => setIsReordering(!isReordering)}
            >
              <ArrowUpDown className="w-4 h-4 mr-2" />
              {isReordering ? 'Listo' : 'Reordenar'}
            </Button>
          )}
          <Button variant="outline" className="text-red-500 hover:bg-red-50 hover:text-red-600 border-red-200 bg-white" onClick={() => onDeleteGroup(group.id)}>
            Eliminar {type === 'category' ? 'Categoría' : 'Colección'}
          </Button>
        </div>
      </div>

      {isReordering ? (
        <div className="space-y-2">
          {books.map((book, index) => (
            <div
              key={book.id}
              className="flex items-center gap-4 bg-white border border-gray-100 rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => moveBook(index, 'up')}
                  disabled={index === 0}
                  className={`p-1 rounded-md transition-colors ${index === 0 ? 'text-gray-200 cursor-not-allowed' : 'text-gray-400 hover:text-primary hover:bg-primary/10'}`}
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => moveBook(index, 'down')}
                  disabled={index === books.length - 1}
                  className={`p-1 rounded-md transition-colors ${index === books.length - 1 ? 'text-gray-200 cursor-not-allowed' : 'text-gray-400 hover:text-primary hover:bg-primary/10'}`}
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              <GripVertical className="w-4 h-4 text-gray-300" />

              <span className="text-sm font-bold text-gray-400 w-6 text-center">{index + 1}</span>

              <div className="w-12 h-16 rounded-md overflow-hidden shadow-sm bg-gray-100 flex-shrink-0">
                <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-heading tracking-tight font-bold text-gray-900 text-sm line-clamp-1">{book.title}</h4>
                <p className="text-xs text-gray-500 line-clamp-1">{book.author}</p>
              </div>

              {book.status === 'reading' && (
                <Badge variant="secondary" className="bg-primary/10 text-primary/80 border-none text-[10px]">{book.progressPercent}%</Badge>
              )}
              {book.status === 'read' && (
                <Badge variant="secondary" className="bg-primary/10 text-primary/80 border-none text-[10px]">Leído</Badge>
              )}
              {book.status === 'unread' && (
                <Badge variant="secondary" className="bg-gray-100 text-gray-500 border-none text-[10px]">Por leer</Badge>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {books.map(book => (
            <Card key={book.id} onClick={() => onSelectBook(book.id)} className="border-none shadow-sm hover:shadow-md transition-shadow group cursor-pointer h-full relative">
              <button
                onClick={(e) => { e.stopPropagation(); onRemoveBook(group.id, book.id); }}
                className="absolute top-2 right-2 z-10 bg-white/90 rounded-full p-1.5 shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white text-gray-500"
                title="Quitar de la lista"
              >
                <X className="w-4 h-4" />
              </button>
              <CardContent className="p-6 flex flex-col gap-4 h-full">
                <div className="w-full aspect-[2/3] overflow-hidden rounded shadow-sm relative bg-gray-100">
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform absolute inset-0"
                  />
                </div>
                <div className="flex flex-col gap-1 mt-1 flex-1">
                  <div>
                    <h4 className="font-heading tracking-tight font-bold text-gray-900 line-clamp-1" title={book.title}>
                      {book.title}
                    </h4>
                    <p className="text-sm text-gray-500 line-clamp-1">
                      {book.author}
                    </p>
                  </div>

                  <div className="mt-auto pt-3 flex flex-col gap-2">
                    {book.status === 'unread' && (
                      <div className="flex justify-between text-xs text-gray-500 items-center">
                        <Badge variant="secondary" className="bg-gray-100 text-gray-600 border-none px-2 py-0.5 rounded text-[10px] uppercase">Por leer</Badge>
                        <span className="font-semibold">{book.pages} pág</span>
                      </div>
                    )}

                    {book.status === 'reading' && (
                      <>
                        <div className="flex justify-between text-xs text-gray-500 items-end">
                          <span className="font-semibold text-primary">{book.progressPercent}%</span>
                          <span className="text-[10px]">{book.readPages} / {book.pages}p</span>
                        </div>
                        <Progress value={book.progressPercent ?? null} className="h-1.5" indicatorClassName="bg-primary" />
                      </>
                    )}

                    {book.status === 'read' && (
                      <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between text-xs text-gray-500 items-center">
                          <Badge variant="secondary" className="bg-primary/10 text-primary/80 border-none px-2 py-0.5 rounded text-[10px] uppercase">Leído</Badge>
                          <span className="font-semibold">{book.pages} pág</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {books.length === 0 && (
            <div className="col-span-5 p-12 text-center border-2 border-dashed border-gray-200 rounded-xl">
              <p className="text-gray-500 font-medium">Aún no hay libros aquí.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function CategoriesView({ categories, onOpenNewModal, onSelect }: { categories: Group[], onOpenNewModal: (type: GroupType) => void, onSelect: (id: string) => void }) {
  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-heading tracking-tight font-bold text-gray-900 mb-2">Categorías</h2>
          <p className="text-gray-500">Organiza tus libros por géneros y temáticas.</p>
        </div>
        <Button onClick={() => onOpenNewModal('category')} className="bg-gray-900 text-white hover:bg-gray-800">Nueva Categoría</Button>
      </div>
      <div className="grid grid-cols-3 gap-6">
        {categories.map((cat) => (
          <Card key={cat.id} onClick={() => onSelect(cat.id)} className="border-none shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <h3 className="font-heading tracking-tight font-bold text-xl text-gray-900 mb-1">{cat.name}</h3>
              <p className="text-sm text-gray-500">{cat.bookIds.length} libros</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function CollectionsView({ collections, onOpenNewModal, onSelect }: { collections: Group[], onOpenNewModal: (type: GroupType) => void, onSelect: (id: string) => void }) {
  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-heading tracking-tight font-bold text-gray-900 mb-2">Colecciones</h2>
          <p className="text-gray-500">Agrupa tus libros por sagas, autores o tus propias listas personalizadas.</p>
        </div>
        <Button onClick={() => onOpenNewModal('collection')} className="bg-gray-900 text-white hover:bg-gray-800">Nueva Colección</Button>
      </div>
      <div className="grid grid-cols-3 gap-6">
        {collections.map((col) => (
          <Card key={col.id} onClick={() => onSelect(col.id)} className="border-none shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <h3 className="font-heading tracking-tight font-bold text-xl text-gray-900 mb-1">{col.name}</h3>
              <p className="text-sm text-gray-500">{col.bookIds.length} libros</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function GenreDetailView({ genre, library, onSelectBook, onBack }: { genre: string, library: Book[], onSelectBook: (id: string) => void, onBack: () => void }) {
  const books = library.filter(b => b.genres && b.genres.includes(genre));
  
  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center space-x-4 mb-8">
        <Button variant="ghost" onClick={onBack} className="text-gray-500 hover:text-gray-900 px-2">
          <ChevronUp className="h-5 w-5 -rotate-90 mr-1" /> Volver
        </Button>
      </div>
      <div className="mb-8">
        <h2 className="text-3xl font-heading tracking-tight font-bold text-gray-900 mb-2">Género: {genre}</h2>
        <p className="text-gray-500">{books.length} libros en esta categoría</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {books.map(book => (
          <Card key={book.id} onClick={() => onSelectBook(book.id)} className="border-none shadow-sm hover:shadow-md transition-shadow group cursor-pointer bg-white">
            <CardContent className="p-6 flex flex-col gap-4">
              <div className="w-full aspect-[2/3] overflow-hidden rounded shadow-sm relative bg-gray-100">
                {book.coverUrl ? (
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform absolute inset-0"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400 group-hover:scale-105 transition-transform absolute inset-0">
                    <BookOpen className="h-12 w-12 opacity-20" />
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-1 mt-1">
                <h4 className="font-heading tracking-tight font-bold text-gray-900 line-clamp-1" title={book.title}>{book.title}</h4>
                <p className="text-sm text-gray-500 line-clamp-1" title={book.author}>{book.author}</p>
                {book.status === 'reading' && book.progressPercent !== undefined && (
                  <div className="mt-2 space-y-1.5">
                    <div className="flex justify-between text-xs text-gray-500 font-medium">
                      <span>{book.progressPercent}%</span>
                      <span>{book.readPages} / {book.pages}p</span>
                    </div>
                    <Progress value={book.progressPercent ?? null} className="h-1.5" indicatorClassName="bg-primary" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        {books.length === 0 && (
          <div className="col-span-4 py-12 text-center">
            <p className="text-gray-500">No hay libros con este género todavía.</p>
          </div>
        )}
      </div>
    </div>
  )
}


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

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isNewGroupModalOpen, setIsNewGroupModalOpen] = useState(false);
  const [newGroupType, setNewGroupType] = useState<GroupType>('category');
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  const [library, setLibrary] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Group[]>([]);
  const [collections, setCollections] = useState<Group[]>([]);

  const [session, setSession] = useState<any>(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [focusSessions, setFocusSessions] = useState<any[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoadingSession(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return;

    async function loadData() {
      const { data: booksData } = await supabase.from('books').select('*').eq('user_id', session.user.id);
      if (booksData) {
        const mappedBooks: Book[] = booksData.map(b => ({
          id: b.id,
          title: b.title,
          author: b.author,
          status: b.status as BookStatus,
          pages: b.pages,
          readPages: b.read_pages,
          progressPercent: b.progress_percent,
          coverUrl: b.cover_url,
          addedAt: b.created_at,
          startDate: b.start_date,
          endDate: b.end_date,
          rating: b.rating,
          genres: b.genres,
        }));
        setLibrary(mappedBooks);
      }

      const { data: profileData } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
      if (profileData) {
        setUserProfile(profileData);
      }

      const { data: focusData } = await supabase.from('focus_sessions').select('*').eq('user_id', session.user.id);
      if (focusData) {
        setFocusSessions(focusData);
      }

      const { data: groupsData } = await supabase.from('groups').select(`
        id, name, type,
        group_books ( book_id )
      `).eq('user_id', session.user.id);
      if (groupsData) {
        const loadedCategories = groupsData.filter(g => g.type === 'category').map(g => ({
          id: g.id,
          name: g.name,
          bookIds: g.group_books.map((gb: any) => gb.book_id)
        }));
        const loadedCollections = groupsData.filter(g => g.type === 'collection').map(g => ({
          id: g.id,
          name: g.name,
          bookIds: g.group_books.map((gb: any) => gb.book_id)
        }));
        setCategories(loadedCategories);
        setCollections(loadedCollections);
      }
    }
    loadData();
  }, [session]);

  const handleSaveNewBook = async (bookData: Partial<Book>) => {
    const { data } = await supabase
      .from("books")
      .insert([{
        user_id: session.user.id,
        title: bookData.title,
        author: bookData.author,
        status: bookData.status || 'unread',
        pages: bookData.pages || 0,
        read_pages: bookData.readPages || 0,
        cover_url: bookData.coverUrl || '',
        rating: bookData.rating || 0,
        genres: bookData.genres || [],
        publish_date: bookData.publishDate || '',
        start_date: bookData.startDate || null,
        end_date: bookData.endDate || null,
        progress_percent: bookData.status === 'read' ? 100 : (bookData.pages ? Math.round(((bookData.readPages || 0) / bookData.pages) * 100) : 0)
      }])
      .select()
      .single();

    if (data) {
      const newBook: Book = {
        id: data.id,
        title: data.title,
        author: data.author,
        status: data.status as BookStatus,
        pages: data.pages,
        readPages: data.read_pages,
        coverUrl: data.cover_url,
        rating: data.rating,
        genres: data.genres,
        publishDate: data.publish_date,
        addedAt: data.created_at,
        progressPercent: data.progress_percent,
        startDate: data.start_date,
        endDate: data.end_date
      };
      if (data.read_pages > 0 && data.status !== 'unread') {
        await supabase.from('daily_logs').insert({
          book_id: data.id,
          user_id: session.user.id,
          date: new Date().toISOString().split('T')[0],
          previous_page: 0,
          current_page: data.read_pages,
          pages_read: data.read_pages
        });
      }

      setLibrary([...library, newBook]);
      setIsAddModalOpen(false);
    }
  };

  const handleOpenNewGroup = (type: GroupType) => {
    setNewGroupType(type);
    setIsNewGroupModalOpen(true);
  };

  const handleSaveGroup = async (name: string, bookIds: string[]) => {
    const { data: groupData } = await supabase.from('groups').insert({
      user_id: session.user.id,
      name,
      type: newGroupType
    }).select().single();

    if (groupData) {
      if (bookIds.length > 0) {
        const groupBooks = bookIds.map(bookId => ({
          group_id: groupData.id,
          book_id: bookId
        }));
        await supabase.from('group_books').insert(groupBooks);
      }

      const newGroup: Group = { id: groupData.id, name: groupData.name, bookIds };
      if (newGroupType === 'category') {
        setCategories([...categories, newGroup]);
      } else {
        setCollections([...collections, newGroup]);
      }
      setIsNewGroupModalOpen(false);
    }
  };

  const handleUpdateGroupName = async (id: string, newName: string) => {
    await supabase.from('groups').update({ name: newName }).eq('id', id);
    if (newGroupType === 'category') {
      setCategories(categories.map(c => c.id === id ? { ...c, name: newName } : c));
    } else {
      setCollections(collections.map(c => c.id === id ? { ...c, name: newName } : c));
    }
  };

  const handleRemoveBookFromGroup = async (groupId: string, bookId: string) => {
    await supabase.from('group_books').delete().match({ group_id: groupId, book_id: bookId });
    if (newGroupType === 'category') {
      setCategories(categories.map(c => c.id === groupId ? { ...c, bookIds: c.bookIds.filter(id => id !== bookId) } : c));
    } else {
      setCollections(collections.map(c => c.id === groupId ? { ...c, bookIds: c.bookIds.filter(id => id !== bookId) } : c));
    }
  };

  const handleDeleteGroup = async (id: string) => {
    await supabase.from('groups').delete().eq('id', id);
    if (newGroupType === 'category') {
      setCategories(categories.filter(c => c.id !== id));
      setCurrentView('categories');
    } else {
      setCollections(collections.filter(c => c.id !== id));
      setCurrentView('collections');
    }
    setSelectedGroupId(null);
  };

  const handleSelectGroup = (id: string, type: GroupType) => {
    setSelectedGroupId(id);
    setNewGroupType(type);
    setCurrentView('groupDetail');
  };

  const handleUpdateBook = async (id: string, updates: Partial<Book>) => {
    const dbUpdates: any = {};
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.author !== undefined) dbUpdates.author = updates.author;
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.pages !== undefined) dbUpdates.pages = updates.pages;
    if (updates.readPages !== undefined) dbUpdates.read_pages = updates.readPages;
    if (updates.progressPercent !== undefined) dbUpdates.progress_percent = updates.progressPercent;
    if (updates.coverUrl !== undefined) dbUpdates.cover_url = updates.coverUrl;
    if (updates.startDate !== undefined) dbUpdates.start_date = updates.startDate;
    if (updates.endDate !== undefined) dbUpdates.end_date = updates.endDate;
    if (updates.rating !== undefined) dbUpdates.rating = updates.rating;
    if (updates.genres !== undefined) dbUpdates.genres = updates.genres;

    await supabase.from('books').update(dbUpdates).eq('id', id);
    setLibrary(library.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const handleSelectBook = (id: string) => {
    setSelectedBookId(id);
    setCurrentView('bookDetail');
  };

  const handleSelectGenre = (genre: string) => {
    setSelectedGenre(genre);
    setCurrentView('genreDetail');
  };

  const handleAddBookToGroups = async (bookId: string, groupIds: string[]) => {
    await supabase.from('group_books').delete().eq('book_id', bookId);
    
    if (groupIds.length > 0) {
      const inserts = groupIds.map(gId => ({ group_id: gId, book_id: bookId }));
      await supabase.from('group_books').insert(inserts);
    }

    setCategories(categories.map(c => ({
      ...c,
      bookIds: groupIds.includes(c.id) 
        ? (c.bookIds.includes(bookId) ? c.bookIds : [...c.bookIds, bookId])
        : c.bookIds.filter(id => id !== bookId)
    })));
    setCollections(collections.map(c => ({
      ...c,
      bookIds: groupIds.includes(c.id) 
        ? (c.bookIds.includes(bookId) ? c.bookIds : [...c.bookIds, bookId])
        : c.bookIds.filter(id => id !== bookId)
    })));
  };

  const handleReorderBooks = async (groupId: string, newBookIds: string[]) => {
    // Actualizar estado local inmediatamente
    const updateFn = (groups: Group[]) => groups.map(g =>
      g.id === groupId ? { ...g, bookIds: newBookIds } : g
    );
    setCategories(prev => updateFn(prev));
    setCollections(prev => updateFn(prev));

    // Persistir en Supabase: eliminar y reinsertar en orden
    await supabase.from('group_books').delete().eq('group_id', groupId);
    if (newBookIds.length > 0) {
      const inserts = newBookIds.map((bookId) => ({
        group_id: groupId,
        book_id: bookId
      }));
      await supabase.from('group_books').insert(inserts);
    }
  };

  const handleDeleteBook = async (bookId: string) => {
    // Eliminar datos relacionados primero (FK constraints)
    await supabase.from('daily_logs').delete().eq('book_id', bookId);
    await supabase.from('book_comments').delete().eq('book_id', bookId);
    await supabase.from('group_books').delete().eq('book_id', bookId);
    // Eliminar el libro
    await supabase.from('books').delete().eq('id', bookId);

    // Actualizar estado local
    setLibrary(prev => prev.filter(b => b.id !== bookId));
    setCategories(prev => prev.map(c => ({ ...c, bookIds: c.bookIds.filter(id => id !== bookId) })));
    setCollections(prev => prev.map(c => ({ ...c, bookIds: c.bookIds.filter(id => id !== bookId) })));

    // Navegar de vuelta a la biblioteca
    setSelectedBookId(null);
    setCurrentView('library');
  };

  const handleSaveFocusSession = async (bookId: string, durationSeconds: number, previousPage: number, newPage: number) => {
    const pagesRead = newPage - previousPage;
    
    // Insert Focus Session
    const { data: sessionData } = await supabase.from('focus_sessions').insert({
      user_id: session.user.id,
      book_id: bookId,
      date: new Date().toISOString().split('T')[0],
      duration_seconds: durationSeconds,
      pages_read: pagesRead
    }).select().single();

    if (sessionData) {
      setFocusSessions([...focusSessions, sessionData]);
    }

    // Update Book
    const book = library.find(b => b.id === bookId);
    if (book) {
      const progressPercent = book.pages ? Math.round((newPage / book.pages) * 100) : 0;
      await handleUpdateBook(bookId, { readPages: newPage, progressPercent });
    }

    // Update Daily Log
    await supabase.from('daily_logs').insert({
      user_id: session.user.id,
      book_id: bookId,
      date: new Date().toISOString().split('T')[0],
      previous_page: previousPage,
      current_page: newPage,
      pages_read: pagesRead
    });
  };

  const activeGroup = (newGroupType === 'category' ? categories : collections).find(c => c.id === selectedGroupId);

  if (loadingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
        <div className="text-gray-500 font-medium">Cargando Bookworm...</div>
      </div>
    );
  }

  if (!session) {
    return <AuthPage />;
  }

  if (currentView === 'focusMode') {
    return (
      <FocusModeView 
        library={library} 
        onExit={() => setCurrentView('dashboard')} 
        onSaveSession={handleSaveFocusSession} 
      />
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-slate-50 text-gray-900 font-sans">
      <AddBookModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSave={handleSaveNewBook} />
      <NewGroupModal
        isOpen={isNewGroupModalOpen}
        onClose={() => setIsNewGroupModalOpen(false)}
        onSave={handleSaveGroup}
        type={newGroupType}
        library={library}
      />
      <Sidebar 
        currentView={currentView} 
        setCurrentView={(v) => { setCurrentView(v); setSelectedGroupId(null); setSelectedBookId(null); }} 
        userProfile={userProfile}
      />
      <BottomNav currentView={currentView} setCurrentView={setCurrentView} />

      <div className="flex-1 flex flex-col h-full overflow-y-auto bg-white rounded-t-[2.5rem] md:rounded-t-none md:rounded-tl-[2.5rem] border-l border-t border-gray-200/50 shadow-sm ml-0 mt-2">
        <main className="flex-1 flex justify-center p-4 pb-24 md:p-8 md:pb-12 md:pt-6">
          <div className="max-w-7xl w-full">
            <div className="flex items-center mb-8">
              <Button onClick={() => setIsAddModalOpen(true)} className="bg-primary text-white hover:bg-primary/80 font-semibold h-12 px-8 text-base rounded-full shadow-sm">
                <PlusCircle className="mr-2.5 h-5 w-5" />
                Añadir Libro
              </Button>
            </div>
            <div className="flex gap-10 w-full">

              {currentView === 'dashboard' && (
                <>
                  <div className="flex-1">
                    <div className="grid flex flex-col md:grid md:grid-cols-[1fr_320px] gap-6 mb-8">
                      <DailyTracker session={session} />
                      <FocusModeWidget focusSessions={focusSessions} onStart={() => setCurrentView('focusMode')} />
                    </div>

                    <h3 className="text-lg font-heading tracking-tight font-bold text-gray-900 mb-4">Leyendo Actualmente</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      {library.filter(b => b.status === 'reading').map((book) => (
                        <Card key={book.id} className="border-none shadow-sm hover:shadow-md transition-shadow group cursor-pointer" onClick={() => handleSelectBook(book.id)}>
                          <CardContent className="p-6 flex flex-col gap-4">
                            <div className="w-full aspect-[2/3] overflow-hidden rounded shadow-sm relative bg-gray-100">
                              {book.coverUrl ? (
                                <img
                                  src={book.coverUrl}
                                  alt={book.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform absolute inset-0"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 group-hover:scale-105 transition-transform absolute inset-0">
                                  <BookOpen className="w-10 h-10 opacity-20" />
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col gap-1 mt-1">
                              <div>
                                <h4 className="font-heading tracking-tight font-bold text-gray-900 line-clamp-1" title={book.title}>
                                  {book.title}
                                </h4>
                                <p className="text-sm text-gray-500 line-clamp-1">
                                  {book.author}
                                </p>
                              </div>
                              <div className="space-y-1 mt-2">
                                <div className="flex justify-between text-xs text-gray-500">
                                  <span>{book.progressPercent || 0}%</span>
                                  <span>{book.readPages || 0} / {book.pages}p</span>
                                </div>
                                <Progress value={book.progressPercent || 0} className="h-1.5" indicatorClassName="bg-primary" />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      {library.filter(b => b.status === 'reading').length === 0 && (
                        <div className="col-span-4 py-12 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                          <p className="text-gray-500 font-medium">No estás leyendo ningún libro actualmente.</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="w-80 space-y-6">
                    <ReadingGoalsWidget session={session} library={library} />

                    <StatisticsWidget library={library} />
                  </div>
                </>
              )}

              {currentView === 'statistics' && <StatisticsView library={library} />}
              {currentView === 'discovery' && <DiscoveryView library={library} onAddBook={handleSaveNewBook} />}
              {currentView === 'library' && <LibraryView library={library} onSelectBook={handleSelectBook} />}
              {currentView === 'categories' && <CategoriesView categories={categories} onOpenNewModal={handleOpenNewGroup} onSelect={(id) => handleSelectGroup(id, 'category')} />}
              {currentView === 'collections' && <CollectionsView collections={collections} onOpenNewModal={handleOpenNewGroup} onSelect={(id) => handleSelectGroup(id, 'collection')} />}
              {currentView === 'groupDetail' && activeGroup && (
                <GroupDetailView
                  group={activeGroup}
                  type={newGroupType}
                  library={library}
                  onBack={() => { setCurrentView(newGroupType === 'category' ? 'categories' : 'collections'); setSelectedGroupId(null); }}
                  onUpdateName={handleUpdateGroupName}
                  onRemoveBook={handleRemoveBookFromGroup}
                  onDeleteGroup={handleDeleteGroup}
                  onSelectBook={handleSelectBook}
                  onReorderBooks={handleReorderBooks}
                />
              )}
              {currentView === 'bookDetail' && selectedBookId && (
                <BookDetailView
                  bookId={selectedBookId}
                  library={library}
                  categories={categories}
                  collections={collections}
                  session={session}
                  onBack={() => { setCurrentView('library'); setSelectedBookId(null); }}
                  onUpdateBook={handleUpdateBook}
                  onSelectGroup={handleSelectGroup}
                  onSelectGenre={handleSelectGenre}
                  onAddBookToGroups={handleAddBookToGroups}
                  onDeleteBook={handleDeleteBook}
                />
              )}
              {currentView === 'genreDetail' && selectedGenre && (
                <GenreDetailView
                  genre={selectedGenre}
                  library={library}
                  onSelectBook={handleSelectBook}
                  onBack={() => setCurrentView('library')}
                />
              )}
              {['edit_profile', 'settings', 'preferences'].includes(currentView) && (
                <ProfileSettingsLayout 
                  currentTab={currentView as 'edit_profile' | 'settings' | 'preferences'} 
                  onTabChange={(tab) => setCurrentView(tab)} 
                  session={session} 
                  onProfileUpdate={setUserProfile}
                />
              )}
            </div>
          </div>
        </main>

      </div>
    </div>
  )
}
