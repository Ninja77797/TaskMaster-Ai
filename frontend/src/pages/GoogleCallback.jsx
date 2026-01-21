import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginWithToken, error } = useAuthStore();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    (async () => {
      try {
        await loginWithToken(token);
        navigate('/dashboard', { replace: true });
      } catch {
        navigate('/login', { replace: true });
      }
    })();
  }, [location.search, loginWithToken, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-slate-700 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-slate-400">
          Finalizando inicio de sesión con Google...
        </p>
        {error && (
          <p className="mt-2 text-xs text-rose-400">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default GoogleCallback;
