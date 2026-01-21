import { useAuthStore } from '../../store/authStore';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { FaRegCheckSquare, FaSignOutAlt, FaMoon, FaSun, FaUser } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();

  const getAvatarUrl = () => {
    const avatarPath = user?.avatar;
    if (!avatarPath) return '';
    if (avatarPath.startsWith('http://') || avatarPath.startsWith('https://')) {
      return avatarPath;
    }
    const base = (api.defaults.baseURL || '').replace(/\/api\/?$/, '');
    return `${base}${avatarPath}`;
  };

  return (
    <nav className="glass-effect sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 py-2.5">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-default">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/90 flex items-center justify-center shadow-sm">
              <FaRegCheckSquare className="text-white text-base" />
            </div>
            <div>
              <span className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                TaskMaster
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400">Panel de tareas</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center">
            <div className="flex items-center gap-1.5 sm:gap-2 px-1.5 py-1 rounded-full bg-slate-100/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
              {/* Dark mode toggle */}
              <button
                onClick={toggleDarkMode}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200/80 dark:hover:bg-slate-700/80 text-slate-600 dark:text-slate-200 transition-colors"
                aria-label="Cambiar tema"
              >
                {darkMode ? (
                  <FaSun className="text-sm" />
                ) : (
                  <FaMoon className="text-sm" />
                )}
              </button>

              {/* User info (link a perfil) */}
              <button
                type="button"
                onClick={() => navigate('/profile')}
                className="hidden sm:inline-flex items-center gap-2 px-2.5 py-1.5 rounded-full hover:bg-slate-200/80 dark:hover:bg-slate-700/80 transition-colors"
              >
                <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden border border-slate-300 dark:border-slate-600">
                  {getAvatarUrl() ? (
                    <img
                      src={getAvatarUrl()}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FaUser className="text-slate-600 dark:text-slate-200 text-sm" />
                  )}
                </div>
                <span className="text-xs font-medium text-slate-800 dark:text-slate-200 max-w-[120px] truncate">
                  {user?.name}
                </span>
              </button>

              {/* Logout button */}
              <button
                onClick={logout}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-500 dark:text-rose-300 transition-colors"
                aria-label="Cerrar sesión"
              >
                <FaSignOutAlt className="text-sm" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
