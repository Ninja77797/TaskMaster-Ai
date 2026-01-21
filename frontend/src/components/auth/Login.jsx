import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useTheme } from '../../context/ThemeContext';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowRight, FaRobot, FaMoon, FaSun, FaGoogle } from 'react-icons/fa';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, error, clearError, loginWithGoogle } = useAuthStore();
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useTheme();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData);
      navigate('/dashboard');
    } catch (err) {
      // Error manejado por el store
    }
  };

  const imageUrlLight =
    'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=1600';
  const imageUrlDark =
    'https://images.pexels.com/photos/1434608/pexels-photo-1434608.jpeg?auto=compress&cs=tinysrgb&w=1600';

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {/* Fondo de imagen ocupando todo */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#1e293b,_#020617)] dark:bg-[radial-gradient(circle_at_top,_#020617,_#020617)]" />
        {/* Imagen modo claro */}
        <div
          className={`absolute inset-0 bg-cover bg-center mix-blend-normal transition-opacity duration-700 ${darkMode ? 'opacity-0' : 'opacity-80'}`}
          style={{ backgroundImage: `url(${imageUrlLight})` }}
        />
        {/* Imagen modo oscuro */}
        <div
          className={`absolute inset-0 bg-cover bg-center mix-blend-normal transition-opacity duration-700 ${darkMode ? 'opacity-80' : 'opacity-0'}`}
          style={{ backgroundImage: `url(${imageUrlDark})` }}
        />
        {/* Degradado para mejor legibilidad del contenido (más suave en claro) */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent dark:from-slate-950/95 dark:via-slate-950/60 dark:to-transparent" />
      </div>

      {/* Toggle tema arriba a la derecha */}
      <button
        type="button"
        onClick={toggleDarkMode}
        aria-label="Cambiar tema"
        className="absolute top-4 right-4 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-slate-900/90 border border-slate-700 shadow-sm hover:bg-slate-800 transition-colors"
      >
        {darkMode ? (
          <FaSun className="text-amber-400 text-sm" />
        ) : (
          <FaMoon className="text-indigo-400 text-sm" />
        )}
      </button>

      {/* Contenido principal sobre el fondo (formulario en vidrio) */}
      <main className="relative z-10 w-full px-4 sm:px-6 flex justify-center">
        <div className="w-full max-w-lg animate-scale-in">
          {/* Header */}
          <div className="mb-6 sm:mb-8 text-slate-100">
            <p className="text-xs sm:text-sm font-medium text-slate-100/90 mb-2">
              Inicia sesión
            </p>
            <h1 className="text-3xl sm:text-4xl font-semibold leading-snug mb-2 text-white">
              Bienvenido de nuevo
            </h1>
            <p className="text-sm sm:text-base text-slate-100/80 max-w-md">
              Accede a tu panel de tareas inteligentes.
            </p>
          </div>

          <div className="relative">
            {/* Tarjeta efecto cristal / agua (muy intenso) */}
            <div className="rounded-3xl border border-slate-100/90 bg-white/8 text-slate-900 bg-clip-padding backdrop-blur-2xl shadow-[0_36px_110px_rgba(15,23,42,0.9)] px-5 sm:px-7 py-5 sm:py-7 space-y-4 dark:border-slate-200/70 dark:bg-slate-900/65 dark:text-slate-50 dark:backdrop-blur-2xl dark:shadow-[0_40px_120px_rgba(15,23,42,1)]">
              {error && (
                <div className="mb-1.5 p-3.5 bg-gradient-to-r from-rose-500/10 to-red-500/10 border border-rose-500/40 rounded-2xl text-rose-100 text-sm font-medium animate-slide-down">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-100 mb-1.5">
                    Email
                  </label>
                  <div className="relative group">
                    <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 dark:text-slate-400 group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-300 transition-colors duration-200" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full rounded-2xl border text-sm pl-11 pr-4 py-3 bg-white/80 border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-900/60 dark:border-slate-600/60 dark:text-slate-50 dark:placeholder-slate-400 dark:focus:ring-indigo-400 dark:focus:border-indigo-400"
                      placeholder="tu@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-100 mb-1.5">
                    Contraseña
                  </label>
                  <div className="relative group">
                    <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 dark:text-slate-400 group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-300 transition-colors duration-200" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="w-full rounded-2xl border text-sm pl-11 pr-11 py-3 bg-white/80 border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-900/60 dark:border-slate-600/60 dark:text-slate-50 dark:placeholder-slate-400 dark:focus:ring-indigo-400 dark:focus:border-indigo-400"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-all hover:scale-110 active:scale-95"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 group mt-3 px-5 py-3 rounded-2xl text-sm font-medium text-white bg-indigo-600/90 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Iniciando sesión...</span>
                    </>
                  ) : (
                    <>
                      <span>Iniciar sesión</span>
                      <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-3 flex items-center gap-3 text-[11px] text-slate-100/90 dark:text-slate-100/90">
                <div className="h-px flex-1 bg-slate-200/80 dark:bg-slate-500/80" />
                <span>o continúa con</span>
                <div className="h-px flex-1 bg-slate-200/80 dark:bg-slate-500/80" />
              </div>

              <button
                type="button"
                onClick={loginWithGoogle}
                className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white/90 text-slate-800 text-sm font-medium py-2.5 shadow-sm hover:bg-slate-50 hover:border-slate-400 transition-colors dark:border-slate-300/60 dark:bg-slate-900/70 dark:text-slate-50 dark:hover:bg-slate-900/90 dark:hover:border-slate-100/70"
              >
                <FaGoogle aria-hidden="true" className="w-5 h-5 text-[#4285F4]" />
                <span>Continuar con Google</span>
              </button>

              <div className="mt-4 pt-4 border-t border-slate-200/70 dark:border-slate-600/60">
                <p className="text-center text-xs text-slate-100/90 dark:text-slate-100/90">
                  ¿No tienes cuenta?{' '}
                  <Link
                    to="/register"
                    className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-300 dark:hover:text-indigo-200 transition-colors"
                  >
                    Regístrate gratis →
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
