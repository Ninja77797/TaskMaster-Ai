import { FaGithub } from 'react-icons/fa';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="fixed bottom-0 inset-x-0 z-30 border-t border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/85 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700 dark:text-slate-200">Kadoo</span>
        </div>

        <div className="flex items-center gap-4">
        <span className="text-[11px] sm:text-xs text-slate-400">
          © {year} Kadoo. Todos los derechos reservados.
        </span>
        </div>

        <div className="flex items-center gap-3 text-slate-400 dark:text-slate-500">
          <span className="hidden sm:inline text-[11px] sm:text-xs">
            Contribuye a mejorar el proyecto
          </span>
          <a
            href="https://github.com/Ninja77797/TaskMaster-Ai"
            target="_blank"
            rel="noreferrer"
            className="hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
            aria-label="GitHub"
          >
            <FaGithub className="text-base" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
