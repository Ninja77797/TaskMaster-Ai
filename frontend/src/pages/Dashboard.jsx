import { useEffect, useState } from 'react';
import { useTaskStore } from '../store/taskStore';
import { useAuthStore } from '../store/authStore';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import TaskList from '../components/tasks/TaskList';
import TaskForm from '../components/tasks/TaskForm';
import AIAssistant from '../components/ai/AIAssistant';
import { FaPlus, FaRobot, FaSearch, FaFilter, FaChartLine, FaCheckCircle, FaClock } from 'react-icons/fa';
import Joyride, { STATUS } from 'react-joyride';

const Dashboard = () => {
  const { user } = useAuthStore();
  const { fetchTasks, filters, setFilters, tasks } = useTaskStore();
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem('taskViewMode') || 'cards';
  });
  const [runTour, setRunTour] = useState(false);

  const tourSteps = [
    {
      target: '[data-tour="navbar"]',
      title: 'Kadoo',
      content: 'Controla el tema, tu perfil y cierra sesión desde aquí.',
      disableBeacon: true,
    },
    {
      target: '[data-tour="stats"]',
      title: 'Resumen rápido',
      content: 'Mira cuántas tareas llevas completadas, pendientes y tu porcentaje de progreso.',
    },
    {
      target: '[data-tour="filters"]',
      title: 'Encuentra todo rápido',
      content: 'Usa la búsqueda y los filtros para ver justo las tareas que necesitas.',
    },
    {
      target: '[data-tour="new-task"]',
      title: 'Crear tarea al instante',
      content: 'Crea una nueva tarea en segundos desde este botón.',
    },
    {
      target: '[data-tour="ai-assistant"]',
      title: 'Asistente IA',
      content: 'Genera tareas y subtareas automáticamente con la ayuda de la IA.',
    },
    {
      target: '[data-tour="task-list"]',
      title: 'Tu panel de trabajo',
      content: 'Gestiona todas tus tareas desde aquí, en vista de tarjetas o tabla.',
    },
  ];

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    localStorage.setItem('taskViewMode', mode);
  };

  useEffect(() => {
    fetchTasks();
  }, [filters]);

  useEffect(() => {
    if (!user || !user._id) return;

    const storageKey = `taskmaster_seen_tour_${user._id}`;
    const hasSeenTour = localStorage.getItem(storageKey);

    if (!hasSeenTour) {
      setRunTour(true);
    }
  }, [user]);

  const handleTourCallback = (data) => {
    const { status } = data;
    const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setRunTour(false);
      const userId = user && user._id ? user._id : 'anonymous';
      const storageKey = `taskmaster_seen_tour_${userId}`;
      localStorage.setItem(storageKey, 'true');
    }
  };

  const completedTasks = tasks.filter(t => t.completed).length;
  const pendingTasks = tasks.filter(t => !t.completed).length;
  const completionRate = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  return (
    <div className="min-h-screen flex flex-col pb-20">
      <Navbar />
      <Joyride
        steps={tourSteps}
        run={runTour}
        continuous
        showProgress
        showSkipButton
        scrollToFirstStep
        styles={{
          options: {
            primaryColor: '#4f46e5',
            zIndex: 9999,
            arrowColor: 'transparent',
            backgroundColor: '#020617',
            textColor: '#e5e7eb',
          },
          overlay: {
            backgroundColor: 'rgba(15,23,42,0.65)',
          },
          tooltip: {
            borderRadius: 16,
            boxShadow: '0 22px 50px rgba(15,23,42,0.75)',
            padding: '16px 18px 14px',
            maxWidth: 360,
            border: '1px solid rgba(148,163,184,0.35)',
          },
          tooltipContainer: {
            textAlign: 'left',
          },
          tooltipTitle: {
            fontSize: '13px',
            fontWeight: 600,
            letterSpacing: '0.03em',
            textTransform: 'uppercase',
            marginBottom: 6,
            color: '#c7d2fe',
          },
          tooltipContent: {
            fontSize: '12px',
            lineHeight: 1.6,
            color: '#e5e7eb',
          },
          buttonNext: {
            background: 'linear-gradient(135deg,#4f46e5,#6366f1)',
            borderRadius: 9999,
            padding: '6px 14px',
            fontSize: '11px',
            fontWeight: 500,
            boxShadow: '0 10px 25px rgba(79,70,229,0.55)',
          },
          buttonBack: {
            marginRight: 8,
            borderRadius: 9999,
            fontSize: '11px',
            color: '#9ca3af',
          },
          buttonSkip: {
            fontSize: '10px',
            opacity: 0.65,
          },
          spotlight: {
            borderRadius: 18,
            boxShadow: '0 0 0 2px rgba(79,70,229,0.95)',
          },
        }}
        callback={handleTourCallback}
      />
      
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50 mb-1">
                Hola,
                {user?.name && (
                  <span className="ml-1 font-bold text-indigo-600 dark:text-indigo-400">
                    {user.name}
                  </span>
                )}
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Resumen de tu trabajo y tareas pendientes
              </p>
            </div>

            {/* Stats */}
            <div
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full lg:w-auto"
              data-tour="stats"
            >
              <div className="card px-5 py-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                  <FaCheckCircle className="text-emerald-600 dark:text-emerald-300" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Completadas</p>
                  <p className="text-xl font-semibold text-slate-900 dark:text-slate-50">{completedTasks}</p>
                </div>
              </div>

              <div className="card px-5 py-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
                  <FaClock className="text-amber-600 dark:text-amber-300" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Pendientes</p>
                  <p className="text-xl font-semibold text-slate-900 dark:text-slate-50">{pendingTasks}</p>
                </div>
              </div>

              <div className="card px-5 py-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
                  <FaChartLine className="text-indigo-600 dark:text-indigo-300" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Progreso</p>
                  <p className="text-xl font-semibold text-slate-900 dark:text-slate-50">{completionRate}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros y acciones */}
        <div className="card-static p-6 mb-8" data-tour="filters">
          <div className="flex flex-col gap-4">
            {/* Botones de acción */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowTaskForm(true)}
                className="btn-primary flex items-center justify-center gap-2"
                data-tour="new-task"
              >
                <FaPlus />
                <span>Nueva tarea</span>
              </button>

              <button
                onClick={() => setShowAI(true)}
                className="btn-secondary btn-ia-neon flex items-center justify-center gap-2"
                data-tour="ai-assistant"
              >
                <FaRobot />
                <span>Asistente IA</span>
              </button>
            </div>

            {/* Búsqueda */}
            <div className="relative group">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 z-10" />
              <input
                type="text"
                placeholder="Buscar tareas..."
                value={filters.search}
                onChange={(e) => setFilters({ search: e.target.value })}
                className="relative input-field pl-12 font-medium"
              />
            </div>
            
            {/* Filtros */}
            <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
                  <FaFilter className="text-slate-500 dark:text-slate-300 text-sm" />
                </div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Filtros</span>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 flex-1">
                <select
                  value={filters.completed !== null ? filters.completed : ''}
                  onChange={(e) => setFilters({ completed: e.target.value === '' ? null : e.target.value === 'true' })}
                  className="input-field flex-1 font-bold"
                >
                  <option value="">Todas las tareas</option>
                  <option value="false">Pendientes</option>
                  <option value="true">Completadas</option>
                </select>

                <select
                  value={filters.priority || ''}
                  onChange={(e) => setFilters({ priority: e.target.value || null })}
                  className="input-field flex-1 font-bold"
                >
                  <option value="">Todas las prioridades</option>
                  <option value="low">Prioridad baja</option>
                  <option value="medium">Prioridad media</option>
                  <option value="high">Prioridad alta</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de tareas */}
        <div data-tour="task-list">
          <TaskList viewMode={viewMode} onViewModeChange={handleViewModeChange} />
        </div>
      </div>

      {/* Modales */}
      {showTaskForm && <TaskForm onClose={() => setShowTaskForm(false)} />}
      {showAI && <AIAssistant onClose={() => setShowAI(false)} />}

      <Footer />
    </div>
  );
};

export default Dashboard;
