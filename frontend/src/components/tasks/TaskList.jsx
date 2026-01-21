import { useTaskStore } from '../../store/taskStore';
import TaskCard from './TaskCard';
import TaskTable from './TaskTable';
import { FaInbox, FaSpinner, FaTasks, FaTh, FaList } from 'react-icons/fa';

const TaskList = ({ viewMode = 'cards', onViewModeChange }) => {
  const { tasks, loading } = useTaskStore();

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <FaSpinner className="text-4xl text-indigo-600 dark:text-indigo-400 animate-spin" />
        <p className="mt-4 text-sm font-medium text-slate-600 dark:text-slate-300">
          Cargando tareas...
        </p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-14">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
          <FaInbox className="text-xl text-slate-400 dark:text-slate-500" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-1">
          No hay tareas registradas
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Crea una nueva tarea para comenzar a organizar tu trabajo.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <FaTasks className="text-slate-600 dark:text-slate-300" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
            Tareas ({tasks.length})
          </h2>
        </div>
        
        {/* Toggle de vista */}
        <div className="flex gap-1.5 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-600">
          <button
            onClick={() => onViewModeChange('cards')}
            className={`p-2.5 rounded-lg text-sm ${
              viewMode === 'cards'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-50 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-700'
            }`}
            title="Vista de tarjetas"
          >
            <FaTh className="text-lg" />
          </button>
          <button
            onClick={() => onViewModeChange('table')}
            className={`p-2.5 rounded-lg text-sm ${
              viewMode === 'table'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-50 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-700'
            }`}
            title="Vista de tabla"
          >
            <FaList className="text-lg" />
          </button>
        </div>
      </div>
      
      {viewMode === 'table' ? (
        <TaskTable />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task, index) => (
            <div 
              key={task._id} 
              style={{ animationDelay: `${index * 0.05}s` }} 
              className="animate-slide-up"
            >
              <TaskCard task={task} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;
