import { FaExclamationTriangle } from 'react-icons/fa';

const ConfirmModal = ({
  open,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel,
  loading = false,
  variant = 'danger', // 'danger' | 'default'
}) => {
  if (!open) return null;

  const confirmClasses =
    variant === 'danger'
      ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-200/40'
      : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200/40';

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={loading ? undefined : onCancel}
    >
      <div
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-y-auto scrollbar-hide border border-slate-200 dark:border-slate-700 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 sm:p-7 flex items-start gap-4">
          <div className="mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-rose-50 dark:bg-rose-900/20">
            <FaExclamationTriangle className="h-5 w-5 text-rose-500" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold leading-6 text-slate-900 dark:text-slate-50">
              {title}
            </h3>
            {message && (
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                {message}
              </p>
            )}
          </div>
        </div>
        <div className="px-6 sm:px-7 pb-5 sm:pb-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3">
          <button
            type="button"
            onClick={loading ? undefined : onCancel}
            disabled={loading}
            className="inline-flex justify-center rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={loading ? undefined : onConfirm}
            disabled={loading}
            className={`inline-flex justify-center rounded-xl px-4 py-2.5 text-sm font-semibold shadow-md ${confirmClasses} disabled:opacity-60 disabled:cursor-not-allowed`}
          >
            {loading ? 'Procesando...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
