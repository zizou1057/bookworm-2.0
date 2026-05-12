import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

export function AuthPage() {
  const [view, setView] = useState<'login' | 'register'>('register');
  
  // Formularios
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Campos extra para registro
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptMarketing, setAcceptMarketing] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        }
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'Error al conectar con Google.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (view === 'register') {
        if (password !== confirmPassword) {
          throw new Error("Las contraseñas no coinciden.");
        }
        if (!acceptTerms) {
          throw new Error("Debes aceptar los términos y condiciones.");
        }
        if (!name.trim()) {
          throw new Error("El nombre es obligatorio.");
        }

        const { error, data } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
              marketing_consent: acceptMarketing
            }
          }
        });

        if (error) throw error;
        if (data?.user?.identities?.length === 0) {
          throw new Error("Este correo ya está registrado.");
        }
        setMessage("¡Registro exitoso! Revisa tu correo para confirmar tu cuenta.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            throw new Error("Correo o contraseña incorrectos.");
          }
          throw error;
        }
      }
    } catch (err: any) {
      setError(err.message || "Ocurrió un error. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Por favor ingresa tu correo para recuperar la contraseña.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
      });
      if (error) throw error;
      setMessage("Se ha enviado un enlace a tu correo para restablecer tu contraseña.");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#F0F4F4] items-center justify-center p-4 lg:p-8 font-sans">
      <div className="w-full max-w-6xl bg-white rounded-[2.5rem] shadow-2xl flex overflow-hidden min-h-[700px] relative">
        
        {/* LEFT COLUMN - FORM */}
        <div className="w-full lg:w-[45%] p-8 lg:p-14 flex flex-col relative z-10 overflow-y-auto">
          <div className="flex items-center mb-10">
            <img src="/logo.png" alt="Bookworm Logo" className="h-10 w-auto" />
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-3 transition-all duration-500">
              {view === 'register' ? 'Crear una cuenta' : 'Bienvenido de nuevo'}
            </h2>
            <p className="text-sm text-gray-500 transition-all duration-500">
              {view === 'register' 
                ? 'Empieza a explorar y utilizar todas las herramientas para organizar tus lecturas.'
                : 'Ingresa tus credenciales para continuar tu progreso de lectura.'}
            </p>
          </div>

          <div className="relative w-full mb-8">
            <div className="w-full h-auto" key={view}>
              <form 
                onSubmit={handleEmailAuth} 
                className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-700 ease-out fill-mode-both"
              >
                {error && (
                  <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium">
                    {error}
                  </div>
                )}
                {message && (
                  <div className="p-3 bg-[#00BFB3]/10 border border-[#00BFB3]/20 text-[#009F95] rounded-xl text-sm font-medium">
                    {message}
                  </div>
                )}

                {view === 'register' && (
                  <div className="space-y-1.5 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-100">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Nombre</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Tu nombre"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#00BFB3] focus:ring-2 focus:ring-[#00BFB3]/20 outline-none transition-all text-sm font-medium text-gray-900 bg-gray-50/50"
                      required={view === 'register'}
                    />
                  </div>
                )}

                <div className="space-y-1.5 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-150">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Correo electrónico</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@correo.com"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#00BFB3] focus:ring-2 focus:ring-[#00BFB3]/20 outline-none transition-all text-sm font-medium text-gray-900 bg-gray-50/50"
                    required
                  />
                </div>

                <div className="space-y-1.5 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-200">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Contraseña</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#00BFB3] focus:ring-2 focus:ring-[#00BFB3]/20 outline-none transition-all text-sm font-medium text-gray-900 bg-gray-50/50"
                    required
                  />
                </div>

                {view === 'register' && (
                  <div className="space-y-1.5 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-300">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Confirmar Contraseña</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#00BFB3] focus:ring-2 focus:ring-[#00BFB3]/20 outline-none transition-all text-sm font-medium text-gray-900 bg-gray-50/50"
                      required={view === 'register'}
                    />
                  </div>
                )}

                {view === 'login' && (
                  <div className="flex justify-end pt-1 animate-in fade-in duration-500 delay-300">
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-[12px] font-bold text-gray-500 hover:text-[#00BFB3] transition-colors"
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>
                )}

                {view === 'register' && (
                  <div className="space-y-3 pt-2 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-500">
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <div className="relative flex items-center justify-center pt-0.5">
                        <input
                          type="checkbox"
                          checked={acceptTerms}
                          onChange={(e) => setAcceptTerms(e.target.checked)}
                          className="peer appearance-none w-4 h-4 border-2 border-gray-300 rounded-sm checked:bg-[#00BFB3] checked:border-[#00BFB3] transition-all cursor-pointer"
                        />
                        <svg className="absolute w-2.5 h-2.5 text-white pointer-events-none opacity-0 peer-checked:opacity-100" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <span className="text-xs text-gray-500 font-medium group-hover:text-gray-900 transition-colors">Acepto los términos y condiciones</span>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer group">
                      <div className="relative flex items-center justify-center pt-0.5">
                        <input
                          type="checkbox"
                          checked={acceptMarketing}
                          onChange={(e) => setAcceptMarketing(e.target.checked)}
                          className="peer appearance-none w-4 h-4 border-2 border-gray-300 rounded-sm checked:bg-[#00BFB3] checked:border-[#00BFB3] transition-all cursor-pointer"
                        />
                        <svg className="absolute w-2.5 h-2.5 text-white pointer-events-none opacity-0 peer-checked:opacity-100" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <span className="text-xs text-gray-500 font-medium group-hover:text-gray-900 transition-colors">Recibir ofertas y comunicación de marketing</span>
                    </label>
                  </div>
                )}

                <div className="pt-4 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-[600ms]">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#00BFB3] hover:bg-[#009F95] text-white py-6 rounded-xl font-bold text-sm shadow-md shadow-[#00BFB3]/20 transition-colors"
                  >
                    {loading ? 'Cargando...' : view === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
                  </Button>
                </div>
              </form>
            </div>
          </div>

          <div className="mt-auto pt-6 animate-in fade-in duration-1000 delay-[700ms]">
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-white text-gray-400 font-medium">O continúa con</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full border-gray-200 hover:bg-gray-50 hover:text-gray-900 text-gray-600 font-semibold py-6 rounded-xl transition-all shadow-sm"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </Button>
            
            <p className="text-center text-sm font-medium text-gray-500 mt-6">
              {view === 'register' ? '¿Ya tienes una cuenta? ' : '¿No tienes una cuenta? '}
              <button 
                onClick={() => setView(view === 'register' ? 'login' : 'register')}
                className="text-[#00BFB3] hover:text-[#009F95] font-bold ml-1 hover:underline underline-offset-2 transition-colors"
              >
                {view === 'register' ? 'Iniciar Sesión' : 'Regístrate'}
              </button>
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN - IMAGE */}
        <div className="hidden lg:block w-[55%] p-4 relative">
          <div className="w-full h-full rounded-[2rem] overflow-hidden relative shadow-inner">
            <img 
              src="/auth-bg.png" 
              alt="Bookworm abstract background" 
              className="absolute inset-0 w-full h-full object-cover"
            />
            
            {/* Glassmorphism Testimonial Card */}
            <div className="absolute bottom-8 left-8 right-8 z-20">
              <div className="bg-white/20 backdrop-blur-xl border border-white/30 p-8 rounded-3xl shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50"></div>
                
                <h3 className="relative z-10 text-2xl lg:text-3xl font-serif font-bold text-white mb-6 leading-tight drop-shadow-md">
                  "Logré reducir el tiempo perdido entre lecturas y ahora leo el doble, manteniendo mi biblioteca organizada."
                </h3>
                
                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <p className="text-white font-bold text-base drop-shadow-md">Axel M.</p>
                    <p className="text-white/80 font-medium text-xs uppercase tracking-wide">Lector Ávido</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-colors border border-white/20">
                      &larr;
                    </button>
                    <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-colors border border-white/20">
                      &rarr;
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Tags Floating */}
            <div className="absolute top-1/2 left-8 transform -translate-y-12 flex gap-3 z-10">
              <span className="bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg">Comunidad de Lectores</span>
              <span className="bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg">Gestión de Biblioteca</span>
            </div>

            {/* Gradient Overlay for better contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent"></div>
          </div>
        </div>

      </div>
    </div>
  );
}
