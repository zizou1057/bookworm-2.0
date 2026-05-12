import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Settings, SlidersHorizontal, Lock, Mail, Bell, Moon, Globe, Share2, MapPin, Tag } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useEffect } from "react"

export function ProfileSettingsLayout({ 
  currentTab, 
  onTabChange, 
  session,
  onProfileUpdate
}: { 
  currentTab: 'edit_profile' | 'settings' | 'preferences',
  onTabChange: (tab: 'edit_profile' | 'settings' | 'preferences') => void,
  session: any,
  onProfileUpdate?: (profile: any) => void
}) {
  return (
    <div className="w-full max-w-5xl mx-auto flex gap-10 animate-in fade-in duration-500 pt-4">
      {/* Sidebar de Perfil */}
      <div className="w-64 shrink-0">
        <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">Mi Cuenta</h2>
        <nav className="space-y-1">
          <button
            onClick={() => onTabChange('edit_profile')}
            className={`w-full flex items-center px-4 py-3 rounded-xl transition-all text-sm font-semibold ${
              currentTab === 'edit_profile' 
                ? 'bg-white shadow-sm text-[#00BFB3]' 
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <User className={`mr-3 w-5 h-5 ${currentTab === 'edit_profile' ? 'text-[#00BFB3]' : 'text-gray-400'}`} />
            Editar Perfil
          </button>
          
          <button
            onClick={() => onTabChange('settings')}
            className={`w-full flex items-center px-4 py-3 rounded-xl transition-all text-sm font-semibold ${
              currentTab === 'settings' 
                ? 'bg-white shadow-sm text-[#00BFB3]' 
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <Settings className={`mr-3 w-5 h-5 ${currentTab === 'settings' ? 'text-[#00BFB3]' : 'text-gray-400'}`} />
            Configuración
          </button>
          
          <button
            onClick={() => onTabChange('preferences')}
            className={`w-full flex items-center px-4 py-3 rounded-xl transition-all text-sm font-semibold ${
              currentTab === 'preferences' 
                ? 'bg-white shadow-sm text-[#00BFB3]' 
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <SlidersHorizontal className={`mr-3 w-5 h-5 ${currentTab === 'preferences' ? 'text-[#00BFB3]' : 'text-gray-400'}`} />
            Preferencias
          </button>
        </nav>
      </div>

      {/* Área de Contenido */}
      <div className="flex-1 max-w-2xl">
        {currentTab === 'edit_profile' && <EditProfileView session={session} onProfileUpdate={onProfileUpdate} />}
        {currentTab === 'settings' && <SettingsView session={session} />}
        {currentTab === 'preferences' && <PreferencesView />}
      </div>
    </div>
  )
}

function EditProfileView({ session, onProfileUpdate }: { session: any, onProfileUpdate?: (profile: any) => void }) {
  const [username, setUsername] = useState("")
  const [bio, setBio] = useState("")
  const [country, setCountry] = useState("")
  const [favoriteGenres, setFavoriteGenres] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })

  useEffect(() => {
    async function loadProfile() {
      if (!session?.user?.id) return
      setIsLoading(true)
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
        
        if (error && error.code !== 'PGRST116') {
          console.error("Error loading profile:", error)
        } else if (data) {
          setUsername(data.username || "")
          setBio(data.bio || "")
          setCountry(data.country || "")
          setFavoriteGenres(data.favorite_genres || "")
        }
      } catch (error) {
        console.error("Error:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadProfile()
  }, [session])

  const handleSave = async () => {
    if (!session?.user?.id) return
    setIsSaving(true)
    setMessage({ type: "", text: "" })
    
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: session.user.id,
          username,
          bio,
          country,
          favorite_genres: favoriteGenres,
          updated_at: new Date().toISOString()
        })
        
      if (error) throw error
      setMessage({ type: "success", text: "Perfil guardado correctamente." })
      if (onProfileUpdate) {
        onProfileUpdate({
          username,
          bio,
          country,
          favorite_genres: favoriteGenres,
          // Add other profile fields if necessary
        });
      }
    } catch (error: any) {
      console.error("Error saving profile:", error)
      setMessage({ type: "error", text: "Hubo un error al guardar el perfil." })
    } finally {
      setIsSaving(false)
      // Ocultar mensaje después de 3 segundos
      setTimeout(() => setMessage({ type: "", text: "" }), 3000)
    }
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6">
        <h3 className="text-2xl font-serif font-bold text-gray-900">Editar Perfil</h3>
        <p className="text-gray-500 mt-1">Personaliza cómo te ven los demás en Bookworm.</p>
      </div>

      <Card className="border-none shadow-sm bg-white overflow-hidden">
        <CardContent className="p-8 space-y-8">
          <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
            <Avatar className="h-24 w-24 border-4 border-white shadow-md">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>AX</AvatarFallback>
            </Avatar>
            <div className="space-y-3 flex-1">
              <div>
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Foto de perfil</label>
                <p className="text-xs text-gray-500 mb-2">Recomendado: 256x256px, PNG o JPG.</p>
                <div className="flex gap-3">
                  <Button variant="outline" className="text-gray-700 font-semibold h-9">Cambiar foto</Button>
                  <Button variant="ghost" className="text-red-500 font-semibold h-9 hover:text-red-600 hover:bg-red-50">Eliminar</Button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 flex items-center">
                  <User className="w-4 h-4 mr-1.5 text-gray-400" />
                  Nombre mostrado
                </label>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-[#00BFB3] transition-colors"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 flex items-center">
                  <MapPin className="w-4 h-4 mr-1.5 text-gray-400" />
                  País
                </label>
                <input 
                  type="text" 
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="Ej. España, México..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-[#00BFB3] transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center">
                <Tag className="w-4 h-4 mr-1.5 text-gray-400" />
                Géneros Favoritos
              </label>
              <input 
                type="text" 
                value={favoriteGenres}
                onChange={(e) => setFavoriteGenres(e.target.value)}
                placeholder="Ej. Romance, Terror, Ensayo"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-[#00BFB3] transition-colors"
              />
              <p className="text-[11px] text-gray-500">Separados por comas para mostrarlos como etiquetas en tu perfil.</p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Biografía</label>
              <textarea 
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Cuéntanos un poco sobre tus gustos literarios..."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#00BFB3] transition-colors resize-none"
                disabled={isLoading || isSaving}
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
            <div>
              {message.text && (
                <p className={`text-sm font-semibold ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                  {message.text}
                </p>
              )}
            </div>
            <Button 
              onClick={handleSave} 
              disabled={isLoading || isSaving}
              className="bg-[#00BFB3] hover:bg-[#009F95] text-white font-semibold px-8 h-11 rounded-xl transition-all"
            >
              {isSaving ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function SettingsView({ session }: { session: any }) {
  const [copied, setCopied] = useState(false)
  const [isEditingEmail, setIsEditingEmail] = useState(false)
  const [newEmail, setNewEmail] = useState("")
  const [emailMessage, setEmailMessage] = useState("")
  
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [passwordMessage, setPasswordMessage] = useState({ type: "", text: "" })
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)

  const [isDeleting, setIsDeleting] = useState(false)

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/?ref=${session?.user?.id}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleUpdateEmail = async () => {
    if (!newEmail || newEmail === session?.user?.email) return
    const { error } = await supabase.auth.updateUser({ email: newEmail })
    if (error) {
      setEmailMessage("Error al actualizar el correo.")
    } else {
      setEmailMessage("Se ha enviado un correo de confirmación a ambas direcciones.")
      setTimeout(() => { setIsEditingEmail(false); setEmailMessage("") }, 4000)
    }
  }

  const handleUpdatePassword = async () => {
    if (!newPassword) return
    setIsUpdatingPassword(true)
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    setIsUpdatingPassword(false)
    if (error) {
      setPasswordMessage({ type: "error", text: "Error al actualizar la contraseña." })
    } else {
      setPasswordMessage({ type: "success", text: "Contraseña actualizada." })
      setCurrentPassword("")
      setNewPassword("")
      setTimeout(() => setPasswordMessage({ type: "", text: "" }), 3000)
    }
  }

  const handleDeleteAccount = async () => {
    if (window.confirm("¿Estás seguro de que deseas eliminar tu cuenta permanentemente? Esta acción borrará todos tus libros y no se puede deshacer.")) {
      setIsDeleting(true)
      const { error } = await supabase.rpc('delete_user')
      if (!error) {
        await supabase.auth.signOut()
      } else {
        alert("Error al intentar eliminar la cuenta.")
        setIsDeleting(false)
      }
    }
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6">
        <h3 className="text-2xl font-serif font-bold text-gray-900">Configuración</h3>
        <p className="text-gray-500 mt-1">Gestiona tu cuenta, correo, contraseña y seguridad.</p>
      </div>

      <div className="space-y-6">
        {/* Compartir Plataforma */}
        <Card className="border-none shadow-sm bg-gradient-to-r from-[#00BFB3]/10 to-[#009F95]/5">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="font-bold text-gray-900 flex items-center">
                <Share2 className="w-5 h-5 mr-2 text-[#00BFB3]" />
                Invita a un amigo
              </h4>
              <p className="text-sm text-gray-600">Comparte tu enlace único para que tus amigos se unan a Bookworm.</p>
            </div>
            <Button onClick={handleCopyLink} className="bg-white text-[#009F95] hover:bg-gray-50 font-bold border border-[#00BFB3]/20 transition-all w-32">
              {copied ? "¡Copiado!" : "Copiar Enlace"}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="pb-3 border-b border-gray-50">
            <CardTitle className="text-lg font-bold text-gray-900 flex items-center">
              <Mail className="w-5 h-5 mr-2 text-gray-400" />
              Correo Electrónico
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {!isEditingEmail ? (
              <>
                <p className="text-sm text-gray-600">Tu correo actual es <strong className="text-gray-900">{session?.user?.email || 'usuario@ejemplo.com'}</strong></p>
                <Button onClick={() => { setIsEditingEmail(true); setNewEmail(session?.user?.email || "") }} variant="outline" className="font-semibold">Cambiar correo</Button>
              </>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-gray-600">Ingresa tu nuevo correo electrónico:</p>
                <input 
                  type="email" 
                  value={newEmail} 
                  onChange={e => setNewEmail(e.target.value)} 
                  placeholder="nuevo@correo.com" 
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 outline-none focus:border-[#00BFB3]" 
                />
                <div className="flex gap-3">
                  <Button onClick={handleUpdateEmail} className="bg-[#00BFB3] hover:bg-[#009F95] text-white font-semibold">Guardar</Button>
                  <Button onClick={() => { setIsEditingEmail(false); setEmailMessage("") }} variant="ghost">Cancelar</Button>
                </div>
                {emailMessage && <p className="text-sm text-[#00BFB3] font-medium">{emailMessage}</p>}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="pb-3 border-b border-gray-50">
            <CardTitle className="text-lg font-bold text-gray-900 flex items-center">
              <Lock className="w-5 h-5 mr-2 text-gray-400" />
              Contraseña
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <p className="text-sm text-gray-600">Actualiza tu contraseña periódicamente para mantener tu cuenta segura.</p>
            <div className="space-y-3">
              <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} placeholder="Contraseña actual" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 outline-none focus:border-[#00BFB3]" />
              <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Nueva contraseña" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 outline-none focus:border-[#00BFB3]" />
              <Button onClick={handleUpdatePassword} disabled={isUpdatingPassword} className="bg-gray-900 hover:bg-gray-800 text-white font-semibold">
                {isUpdatingPassword ? "Actualizando..." : "Actualizar contraseña"}
              </Button>
              {passwordMessage.text && (
                <p className={`text-sm font-medium ${passwordMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                  {passwordMessage.text}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-red-100 shadow-sm bg-red-50/30">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <h4 className="font-bold text-red-700">Zona de peligro</h4>
              <p className="text-sm text-red-600/80">Eliminar tu cuenta borrará todos tus libros permanentemente.</p>
            </div>
            <Button onClick={handleDeleteAccount} disabled={isDeleting} variant="destructive" className="font-bold">
              {isDeleting ? "Eliminando..." : "Eliminar cuenta"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function PreferencesView() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6">
        <h3 className="text-2xl font-serif font-bold text-gray-900">Preferencias</h3>
        <p className="text-gray-500 mt-1">Ajusta la apariencia y comportamiento de Bookworm.</p>
      </div>

      <div className="space-y-6">
        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="pb-3 border-b border-gray-50">
            <CardTitle className="text-lg font-bold text-gray-900 flex items-center">
              <Moon className="w-5 h-5 mr-2 text-gray-400" />
              Apariencia
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">Modo Oscuro</p>
                <p className="text-sm text-gray-500">Cambia la interfaz a colores oscuros.</p>
              </div>
              <Button disabled variant="secondary" className="font-semibold">Próximamente</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="pb-3 border-b border-gray-50">
            <CardTitle className="text-lg font-bold text-gray-900 flex items-center">
              <Globe className="w-5 h-5 mr-2 text-gray-400" />
              Idioma y Región
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Idioma de la interfaz</label>
              <select className="w-full border border-gray-200 rounded-lg px-4 py-2.5 outline-none focus:border-[#00BFB3] bg-white text-gray-900 font-medium">
                <option value="es">Español (Latinoamérica)</option>
                <option value="en">English (US)</option>
              </select>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="pb-3 border-b border-gray-50">
            <CardTitle className="text-lg font-bold text-gray-900 flex items-center">
              <Bell className="w-5 h-5 mr-2 text-gray-400" />
              Notificaciones
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">Recordatorios de lectura</p>
                <p className="text-sm text-gray-500">Recibe alertas para mantener tu racha.</p>
              </div>
              <div className="w-11 h-6 bg-[#00BFB3] rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 bg-white w-4 h-4 rounded-full transition-all"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
