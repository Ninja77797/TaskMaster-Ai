import { useEffect, useState } from 'react';
import { useTaskStore } from '../store/taskStore';
import { useAuthStore } from '../store/authStore';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import TaskList from '../components/tasks/TaskList';
import TaskForm from '../components/tasks/TaskForm';
import AIAssistant from '../components/ai/AIAssistant';
import { FaPlus, FaRobot, FaSearch, FaFilter, FaChartLine, FaCheckCircle, FaClock } from 'react-icons/fa';

const Dashboard = () => {
  const { user } = useAuthStore();
  const { fetchTasks, filters, setFilters, tasks } = useTaskStore();
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem('taskViewMode') || 'cards';
  });

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    localStorage.setItem('taskViewMode', mode);
  };

  useEffect(() => {
    fetchTasks();
  }, [filters]);

  const completedTasks = tasks.filter(t => t.completed).length;
  const pendingTasks = tasks.filter(t => !t.completed).length;
  const completionRate = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  return (
    <div className="min-h-screen flex flex-col pb-20">
      <Navbar />
      
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50 mb-1">
                Hola, {user?.name}
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Resumen de tu trabajo y tareas pendientes
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full lg:w-auto">
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
        <div className="card-static p-6 mb-8">
          <div className="flex flex-col gap-4">
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
            
            {/* Filtros y botones */}
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

              {/* Botones de acción */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowTaskForm(true)}
                  className="btn-primary flex items-center justify-center gap-2"
                >
                  <FaPlus /> 
                  <span className="hidden sm:inline">Nueva tarea</span>
                </button>
                
                <button
                  onClick={() => setShowAI(true)}
                  className="btn-secondary btn-ia-neon flex items-center justify-center gap-2"
                >
                  <FaRobot /> 
                  <span className="hidden sm:inline">Asistente IA</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de tareas */}
        <TaskList viewMode={viewMode} onViewModeChange={handleViewModeChange} />
      </div>

      {/* Modales */}
      {showTaskForm && <TaskForm onClose={() => setShowTaskForm(false)} />}
      {showAI && <AIAssistant onClose={() => setShowAI(false)} />}

      <Footer />
    </div>
  );
};

export default Dashboard;
