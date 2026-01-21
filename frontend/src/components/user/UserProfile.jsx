import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import { FaUser, FaEnvelope, FaTrashAlt, FaSave, FaCamera, FaArrowLeft } from 'react-icons/fa';

const UserProfile = () => {
  const navigate = useNavigate();
  const { user, updateProfile, deleteAccount, uploadAvatar, loading } = useAuthStore();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    avatar: user?.avatar || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      toast.success('Perfil actualizado correctamente');
    } catch (error) {
      const msg = error.response?.data?.message || 'Error al actualizar el perfil';
      toast.error(msg);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Esta acción eliminará tu cuenta y todas tus tareas. ¿Continuar?')) return;

    try {
      await deleteAccount();
      toast.success('Cuenta eliminada correctamente');
    } catch (error) {
      const msg = error.response?.data?.message || 'Error al eliminar la cuenta';
      toast.error(msg);
    }
  };

  const initials = (user?.name || '').split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  const getAvatarUrl = () => {
    const avatarPath = user?.avatar || formData.avatar;
    if (!avatarPath) return '';
    if (avatarPath.startsWith('http://') || avatarPath.startsWith('https://')) {
      return avatarPath;
    }
    // api.defaults.baseURL incluye /api, lo quitamos para apuntar al host raíz
    const base = (api.defaults.baseURL || '').replace(/\/api\/?$/, '');
    return `${base}${avatarPath}`;
  };

  const handleAvatarFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('El archivo debe ser una imagen');
      return;
    }

    try {
      await uploadAvatar(file);
      toast.success('Foto de perfil actualizada');
    } catch (error) {
      const msg = error.response?.data?.message || 'Error al subir la foto de perfil';
      toast.error(msg);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Encabezado */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="text-left">
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-slate-50 mb-1">
            Perfil de usuario
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Personaliza cómo te ves en TaskMaster y actualiza tus datos.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="hidden sm:inline-flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg bg-slate-100/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          <FaArrowLeft className="text-xs" />
          <span>Volver</span>
        </button>
      </div>
  {/* Card principal */}
  <div className="card-static p-5 sm:p-6 mb-4 space-y-5">
        {/* Sección avatar + resumen */}
        <div className="flex flex-col items-center gap-4 pb-5 border-b border-slate-100 dark:border-slate-800 text-center">
          <label className="relative block w-32 h-32 sm:w-40 sm:h-40 cursor-pointer group">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarFile}
            />
            {getAvatarUrl() ? (
              <img
                src={getAvatarUrl()}
                alt="Avatar"
                className="w-full h-full rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow-md group-hover:border-indigo-400 group-hover:shadow-lg transition-all"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-indigo-600 text-white flex items-center justify-center text-4xl font-bold border border-indigo-400/60 shadow-md group-hover:border-indigo-300 group-hover:shadow-lg transition-all">
                {initials || <FaUser />}
              </div>
            )}
          </label>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500 mb-1">
              Mi cuenta
            </p>
            <p className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-50">
              {user?.name}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {user?.email}
            </p>
          </div>
        </div>

        {/* Datos básicos (formulario) */}
        <form className="space-y-4" onSubmit={handleSave}>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Nombre de usuario
            </label>
            <div className="relative group">
              <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="input-field pl-12"
                placeholder="Tu nombre"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Email
            </label>
            <div className="relative group">
              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="input-field pl-12"
                placeholder="tu@email.com"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 mt-1">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <FaSave />
              <span>Guardar cambios</span>
            </button>
          </div>
        </form>
        {/* Zona de peligro dentro de la misma tarjeta */}
        <div className="mt-3 pt-3 border-t border-rose-200/60 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20 rounded-xl px-3 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-rose-700 dark:text-rose-300 mb-1">
              Zona peligrosa
            </h2>
            <p className="text-xs text-rose-600 dark:text-rose-300 max-w-md">
              Eliminar tu cuenta borrará también todas tus tareas y datos asociados. Esta acción no se puede deshacer.
            </p>
          </div>
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-rose-600 hover:bg-rose-700 text-white disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <FaTrashAlt className="text-sm" />
            <span>Eliminar cuenta</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
