import { FaGithub, FaLinkedin, FaGlobeAmericas } from 'react-icons/fa';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="fixed bottom-0 inset-x-0 z-30 border-t border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/85 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700 dark:text-slate-200">TaskMaster AI</span>
          <span className="hidden sm:inline text-slate-400">·</span>
          <span>Panel profesional de gestión de tareas con IA</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-[11px] sm:text-xs text-slate-400">
            © {year} TaskMaster AI. Todos los derechos reservados.
          </span>
        </div>

        <div className="flex items-center gap-3 text-slate-400 dark:text-slate-500">
          <a
            href="#"
            className="hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
            aria-label="Sitio web"
          >
            <FaGlobeAmericas className="text-base" />
          </a>
          <a
            href="#"
            className="hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
            aria-label="GitHub"
          >
            <FaGithub className="text-base" />
          </a>
          <a
            href="#"
            className="hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
            aria-label="LinkedIn"
          >
            <FaLinkedin className="text-base" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
