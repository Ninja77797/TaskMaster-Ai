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
    <div className="min-h-screen flex bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 relative">
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

      {/* Panel izquierdo: solo formulario */}
      <div className="flex-1 md:w-[55%] flex flex-col px-6 sm:px-12 lg:pl-20 lg:pr-10 py-8">
        <main className="flex-1 flex items-center">
          <div className="w-full max-w-lg mx-auto animate-scale-in">
            {/* Header formulario */}
            <div className="mb-8">
              <p className="text-xs sm:text-sm font-medium text-slate-500 mb-2">
                Inicia sesión
              </p>
              <h1 className="text-3xl sm:text-4xl font-semibold leading-snug mb-2 text-slate-50">
                Bienvenido de nuevo
              </h1>
              <p className="text-sm sm:text-base text-slate-400 max-w-md">
                Accede a tu panel de tareas inteligentes.
              </p>
            </div>

            {/* Contenido del formulario (flotando, sin carta) */}
            <div className="space-y-4">
          {error && (
            <div className="mb-2 p-4 bg-gradient-to-r from-rose-50/5 to-red-50/5 border-l-4 border-rose-500/80 rounded-xl text-rose-300 font-medium animate-slide-down">
              {error}
            </div>
          )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Email
                </label>
                <div className="relative group">
                  <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors duration-200" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-2xl border text-sm pl-11 pr-4 py-3 bg-slate-50/90 border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-900/80 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Contraseña
                </label>
                <div className="relative group">
                  <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors duration-200" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full rounded-2xl border text-sm pl-11 pr-11 py-3 bg-slate-50/90 border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-900/80 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-indigo-400 transition-all hover:scale-110 active:scale-95"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 group mt-3 px-5 py-3 rounded-2xl text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_12px_30px_rgba(79,70,229,0.45)] transition-all"
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

              <div className="mt-4 flex items-center gap-3 text-[11px] text-slate-500">
                <div className="h-px flex-1 bg-slate-800/60" />
                <span>o continúa con</span>
                <div className="h-px flex-1 bg-slate-800/60" />
              </div>

              <button
                type="button"
                onClick={loginWithGoogle}
                className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300/80 bg-white text-slate-800 text-sm font-medium py-2.5 shadow-sm hover:bg-slate-50 hover:border-slate-400 transition-colors dark:bg-slate-900/90 dark:text-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
              >
                <FaGoogle aria-hidden="true" className="w-5 h-5 text-[#4285F4]" />
                <span>Continuar con Google</span>
              </button>

              <div className="mt-5 pt-4 border-t border-slate-800/80">
                <p className="text-center text-xs text-slate-500">
                  ¿No tienes cuenta?{' '}
                  <Link
                    to="/register"
                    className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    Regístrate gratis →
                  </Link>
                </p>
              </div>
              </div>
          </div>
        </main>
      </div>

      {/* Panel derecho: fondo con imagen/gradiente suave, división recta y imagen distinta por tema */}
      <div className="hidden md:block w-[45%] lg:w-[48%] relative overflow-hidden rounded-l-3xl shadow-[0_0_60px_rgba(15,23,42,0.9)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#1e293b,_#020617)] dark:bg-[radial-gradient(circle_at_top,_#020617,_#020617)]" />
        {/* Capa imagen modo claro */}
        <div
          className={`absolute inset-0 bg-cover bg-center mix-blend-normal transition-opacity duration-700 ${darkMode ? 'opacity-0' : 'opacity-80'}`}
          style={{ backgroundImage: `url(${imageUrlLight})` }}
        />
        {/* Capa imagen modo oscuro */}
        <div
          className={`absolute inset-0 bg-cover bg-center mix-blend-normal transition-opacity duration-700 ${darkMode ? 'opacity-80' : 'opacity-0'}`}
          style={{ backgroundImage: `url(${imageUrlDark})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
      </div>
    </div>
  );
};

export default Login;
