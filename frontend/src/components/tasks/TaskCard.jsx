import { useState } from 'react';
import { useTaskStore } from '../../store/taskStore';
import { FaCheck, FaTrash, FaEdit, FaClock, FaChevronDown, FaEllipsisV, FaCheckCircle } from 'react-icons/fa';
import TaskForm from './TaskForm';

const TaskCard = ({ task }) => {
  const { toggleComplete, deleteTask, toggleSubtask } = useTaskStore();
  const [showSubtasks, setShowSubtasks] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const priorityConfig = {
    low: { 
      badge: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700',
      text: 'Baja',
      dot: 'bg-emerald-500'
    },
    medium: { 
      badge: 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-700',
      text: 'Media',
      dot: 'bg-amber-500'
    },
    high: { 
      badge: 'bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-700',
      text: 'Alta',
      dot: 'bg-rose-500'
    },
  };

  const priority = priorityConfig[task.priority];

  return (
    <>
      <div 
        className={`card p-5 ${task.completed ? 'opacity-60' : ''} group relative`}
      >
        {/* Header */}
        <div className="flex items-start gap-3 mb-5">
          <button
            className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
              task.subtasks && task.subtasks.length > 0 
                ? 'cursor-not-allowed opacity-50' 
                : 'hover:scale-110 active:scale-95'
            } ${
              task.completed
                ? 'bg-indigo-600 border-indigo-600 text-white'
                : 'border-slate-300 dark:border-slate-600 hover:border-indigo-500 dark:hover:border-indigo-400'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              if (!task.subtasks || task.subtasks.length === 0) {
                toggleComplete(task._id);
              }
            }}
            title={task.subtasks && task.subtasks.length > 0 ? 'Completa todas las subtareas para marcar esta tarea como completada' : ''}
          >
            {task.completed && <FaCheck className="text-white text-xs" />}
          </button>
          
          <div className="flex-1 min-w-0">
            <h3 className={`text-base font-semibold text-slate-900 dark:text-white mb-1 ${
              task.completed ? 'line-through opacity-60' : ''
            }`}>
              {task.title}
            </h3>
            {task.description && (
              <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                {task.description}
              </p>
            )}
          </div>

          {/* Menú de 3 puntos */}
          <div className="relative">
            <button
              className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors p-1.5 rounded-lg"
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
            >
              <FaEllipsisV className="text-sm" />
            </button>

            {/* Dropdown menu */}
            {showMenu && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowMenu(false)}
                />
                
                <div className="absolute right-0 top-10 z-20 bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-2 min-w-[180px] animate-slide-down">
                  <button
                    className="w-full px-4 py-2 text-left text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(false);
                      setShowEditForm(true);
                    }}
                  >
                    <FaEdit className="text-slate-500" />
                    <span>Editar tarea</span>
                  </button>

                  <div className="border-t border-slate-200 dark:border-slate-800 my-1" />

                  <button
                    className="w-full px-4 py-2 text-left text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 flex items-center gap-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(false);
                      if (window.confirm('¿Eliminar esta tarea?')) {
                        deleteTask(task._id);
                      }
                    }}
                  >
                    <FaTrash />
                    <span>Eliminar tarea</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Metadata */}
        <div className="flex flex-wrap gap-2 text-xs mb-4">
          <span className={`badge ${priority.badge} flex items-center gap-1`}>
            <span className={`w-1.5 h-1.5 rounded-full ${priority.dot}`} />
            <span>{priority.text}</span>
          </span>
          
          {task.category && (
            <span className="badge bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              {task.category}
            </span>
          )}
          
          {task.estimatedTime > 0 && (
            <span className="badge bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 flex items-center gap-1.5">
              <FaClock className="text-xs" /> 
              <span>{task.estimatedTime}m</span>
            </span>
          )}
        </div>

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {task.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600"
              >
                #{tag}
              </span>
            ))}
            {task.tags.length > 3 && (
              <span className="text-xs px-2.5 py-1 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 rounded-full border border-slate-200 dark:border-slate-700">
                +{task.tags.length - 3} más
              </span>
            )}
          </div>
        )}

        {/* Subtasks */}
        {task.subtasks && task.subtasks.length > 0 && (
          <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mt-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowSubtasks(!showSubtasks);
              }}
              className="flex items-center gap-3 text-sm font-medium text-slate-900 dark:text-white mb-3 w-full"
            >
              <div className={`transition-transform duration-300 ${showSubtasks ? 'rotate-180' : ''}`}>
                <FaChevronDown className="text-indigo-600 dark:text-indigo-400" />
              </div>
              <span>Subtareas</span>
              <span className="ml-auto px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-medium border border-indigo-200 dark:border-indigo-700">
                {task.subtasks.filter(st => st.completed).length}/{task.subtasks.length}
              </span>
            </button>
            
            {showSubtasks && (
              <div className="space-y-2.5 pl-1 animate-slide-down">
                {task.subtasks.map((subtask, index) => (
                  <div key={subtask._id} className="flex items-center gap-3 p-2.5 rounded-lg border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSubtask(task._id, subtask._id);
                      }}
                      className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                        subtask.completed
                          ? 'bg-indigo-600 border-indigo-600 text-white'
                          : 'border-slate-300 dark:border-slate-600 hover:border-indigo-500 dark:hover:border-indigo-500'
                      }`}
                    >
                      {subtask.completed && <FaCheck className="text-white text-xs" />}
                    </button>
                    <span
                      className={`text-sm flex-1 font-medium ${
                        subtask.completed
                          ? 'line-through text-slate-500 dark:text-slate-500 opacity-60'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {subtask.title}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="text-xs text-slate-500 dark:text-slate-400 mt-5 pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between font-medium">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
            {new Date(task.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
          {task.subtasks && task.subtasks.length > 0 && (
            <span className="flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full font-medium border border-emerald-300 dark:border-emerald-700">
              <FaCheckCircle className="text-xs" />
              {Math.round((task.subtasks.filter(st => st.completed).length / task.subtasks.length) * 100)}%
            </span>
          )}
        </div>
      </div>

      {/* Modal de edición */}
      {showEditForm && (
        <TaskForm 
          taskToEdit={task} 
          onClose={() => setShowEditForm(false)} 
        />
      )}
    </>
  );
};

export default TaskCard;

