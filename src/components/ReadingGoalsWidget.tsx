import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Settings, Check, X } from "lucide-react";
import { supabase } from "@/lib/supabase";

export function ReadingGoalsWidget({ session, library }: { session: any, library: any[] }) {
  const [goal, setGoal] = useState<{ id?: string, type: 'books' | 'pages', value: number, period: 'month' | 'year' } | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [editType, setEditType] = useState<'books' | 'pages'>('books');
  const [editValue, setEditValue] = useState<number>(0);
  const [editPeriod, setEditPeriod] = useState<'month' | 'year'>('month');

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; 

  useEffect(() => {
    async function loadGoal() {
      const { data } = await supabase
        .from('reading_goals')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
        
      if (data) {
        setGoal({ id: data.id, type: data.goal_type, value: data.target_value, period: data.period });
      }
      setLoading(false);
    }
    loadGoal();
  }, [session.user.id]);

  const [pagesRead, setPagesRead] = useState(0);

  useEffect(() => {
    if (goal?.type === 'pages') {
       async function getPages() {
         let query = supabase.from('daily_logs').select('pages_read').eq('user_id', session.user.id);
         if (goal?.period === 'year') {
           query = query.gte('date', `${currentYear}-01-01`).lte('date', `${currentYear}-12-31`);
         } else {
           const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
           const nextYear = currentMonth === 12 ? currentYear + 1 : currentYear;
           query = query.gte('date', `${currentYear}-${String(currentMonth).padStart(2, '0')}-01`)
                        .lt('date', `${nextYear}-${String(nextMonth).padStart(2, '0')}-01`);
         }
         const { data } = await query;
         if (data) {
           const sum = data.reduce((acc, curr) => acc + (curr.pages_read || 0), 0);
           setPagesRead(sum);
         }
       }
       getPages();
    }
  }, [goal, session.user.id, currentYear, currentMonth]);

  const handleEditClick = () => {
    if (goal) {
      setEditType(goal.type);
      setEditValue(goal.value);
      setEditPeriod(goal.period);
    } else {
      setEditType('books');
      setEditValue(1);
      setEditPeriod('month');
    }
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (editValue <= 0) return;
    setLoading(true);
    
    const payload = {
      user_id: session.user.id,
      goal_type: editType,
      target_value: editValue,
      period: editPeriod,
      year: currentYear,
      month: editPeriod === 'month' ? currentMonth : null
    };

    if (goal?.id) {
       await supabase.from('reading_goals').update(payload).eq('id', goal.id);
       setGoal({ ...goal, type: editType, value: editValue, period: editPeriod });
    } else {
       const { data } = await supabase.from('reading_goals').insert(payload).select().single();
       if (data) setGoal({ id: data.id, type: data.goal_type, value: data.target_value, period: data.period });
    }
    
    setIsEditing(false);
    setLoading(false);
  };

  if (loading) {
    return (
      <Card className="border-none shadow-sm bg-white">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold text-gray-500 uppercase tracking-wider">Reading Goals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
             <div className="h-6 bg-gray-200 rounded w-1/2"></div>
             <div className="h-4 bg-gray-200 rounded w-1/3"></div>
             <div className="h-3 bg-gray-200 rounded w-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isEditing) {
    return (
      <Card className="border-none shadow-sm bg-white border border-[#00BFB3]/20">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-bold text-[#00BFB3] uppercase tracking-wider">Editar Reto</CardTitle>
          <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-gray-900" onClick={() => setIsEditing(false)}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <select className="flex-1 border border-gray-200 rounded-lg p-2 text-sm outline-none" value={editType} onChange={e => setEditType(e.target.value as any)}>
              <option value="books">Libros</option>
              <option value="pages">Páginas</option>
            </select>
            <select className="flex-1 border border-gray-200 rounded-lg p-2 text-sm outline-none" value={editPeriod} onChange={e => setEditPeriod(e.target.value as any)}>
              <option value="month">Al mes</option>
              <option value="year">Al año</option>
            </select>
          </div>
          <div className="space-y-1">
             <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Cantidad</label>
             <input type="number" value={editValue} onChange={e => setEditValue(parseInt(e.target.value)||0)} className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none focus:border-[#00BFB3]" />
          </div>
          <Button onClick={handleSave} className="w-full bg-[#00BFB3] hover:bg-[#009F95] text-white font-semibold h-9">
             <Check className="w-4 h-4 mr-2" /> Guardar
          </Button>
        </CardContent>
      </Card>
    );
  }

  let progress = 0;
  let max = goal?.value || 1;
  let label = 'Configura tu primer reto';
  
  if (goal) {
    if (goal.type === 'books') {
      progress = library.filter(b => {
        if (b.status !== 'read' || !b.endDate) return false;
        const d = new Date(b.endDate);
        if (goal.period === 'year') return d.getFullYear() === currentYear;
        return d.getFullYear() === currentYear && d.getMonth() + 1 === currentMonth;
      }).length;
      label = `${progress} de ${goal.value} libros`;
    } else {
      progress = pagesRead;
      label = `${progress} de ${goal.value} páginas`;
    }
  }

  const percent = Math.min(100, Math.round((progress / max) * 100)) || 0;
  const title = goal?.period === 'year' ? `Reto ${currentYear}` : `Reto del mes`;

  return (
    <Card className="border-none shadow-sm bg-white group">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-bold text-gray-500 uppercase tracking-wider">Reading Goals</CardTitle>
        <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity hover:text-[#00BFB3]" onClick={handleEditClick}>
          <Settings className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {goal ? (
          <>
            <h4 className="font-serif font-bold text-xl text-gray-900 mb-2">{title}</h4>
            <p className="text-sm text-gray-500 mb-4">{label}</p>
            <Progress value={percent} className="h-3 rounded-full" indicatorClassName="bg-[#00BFB3]" />
          </>
        ) : (
          <div className="text-center py-4 space-y-3">
             <p className="text-sm text-gray-500">Aún no tienes un reto establecido.</p>
             <Button variant="outline" onClick={handleEditClick} className="text-[#00BFB3] border-[#00BFB3] hover:bg-[#00BFB3]/10 h-8 text-xs font-semibold">
               Establecer reto
             </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
