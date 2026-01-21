import { useState, useRef, useEffect } from 'react';
import { useTaskStore } from '../../store/taskStore';
import { FaCheck, FaTrash, FaEdit, FaClock, FaEllipsisV, FaChevronDown, FaChevronUp, FaCheckCircle } from 'react-icons/fa';
import TaskForm from './TaskForm';

const TaskTable = () => {
  const { tasks, toggleComplete, deleteTask, toggleSubtask } = useTaskStore();
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showMenu, setShowMenu] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  const menuButtonRefs = useRef({});

  const priorityConfig = {
    low: {
      text: 'Baja',
      badge: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700',
      dot: 'bg-emerald-500',
    },
    medium: {
      text: 'Media',
      badge: 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-700',
      dot: 'bg-amber-500',
    },
    high: {
      text: 'Alta',
      badge: 'bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-700',
      dot: 'bg-rose-500',
    },
  };

  const toggleRow = (taskId) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId);
    } else {
      newExpanded.add(taskId);
    }
    setExpandedRows(newExpanded);
  };

  const handleEdit = (task) => {
    setSelectedTask(task);
    setShowEditForm(true);
    setShowMenu(null);
  };

  const handleDelete = (taskId) => {
    if (window.confirm('¿Eliminar esta tarea?')) {
      deleteTask(taskId);
    }
    setShowMenu(null);
  };

  if (tasks.length === 0) {
    return null;
  }

  return (
    <>
      <div className="card-table p-0 overflow-hidden animate-slide-up">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full">
              <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-2 sm:px-3 md:px-4 lg:px-6 py-3 sm:py-3.5 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider whitespace-nowrap">
                    Estado
                  </th>
                  <th className="px-2 sm:px-3 md:px-4 lg:px-6 py-3 sm:py-3.5 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                    Título
                  </th>
                  <th className="px-2 sm:px-3 md:px-4 lg:px-6 py-3 sm:py-3.5 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider whitespace-nowrap">
                    Prioridad
                  </th>
                  <th className="px-2 sm:px-3 md:px-4 lg:px-6 py-3 sm:py-3.5 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider whitespace-nowrap">
                    Categoría
                  </th>
                  <th className="px-2 sm:px-3 md:px-4 lg:px-6 py-3 sm:py-3.5 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider whitespace-nowrap">
                    Tiempo
                  </th>
                  <th className="px-2 sm:px-3 md:px-4 lg:px-6 py-3 sm:py-3.5 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider whitespace-nowrap">
                    Progreso
                  </th>
                  <th className="px-2 sm:px-3 md:px-4 lg:px-6 py-3 sm:py-3.5 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider whitespace-nowrap">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-800">
              {tasks.map((task) => {
                const priority = priorityConfig[task.priority];
                const isExpanded = expandedRows.has(task._id);
                const hasSubtasks = task.subtasks && task.subtasks.length > 0;
                const completedSubtasks = hasSubtasks ? task.subtasks.filter(st => st.completed).length : 0;
                const totalSubtasks = task.subtasks?.length || 0;
                return (
                  <tr key={task._id} className={`hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${task.completed ? 'opacity-60' : ''}`}>
                    <td className="px-2 sm:px-3 md:px-4 lg:px-6 py-3 sm:py-4 md:py-5 whitespace-nowrap">
                      <button
                        className={`w-5 h-5 sm:w-6 sm:h-6 rounded-md border flex items-center justify-center transition-colors ${
                          task.subtasks && task.subtasks.length > 0 
                            ? 'cursor-not-allowed opacity-50' 
                            : 'hover:scale-110 active:scale-95'
                        } ${
                          task.completed
                            ? 'bg-indigo-600 border-indigo-600 text-white'
                            : 'border-slate-300 dark:border-slate-600 hover:border-indigo-500'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!task.subtasks || task.subtasks.length === 0) {
                            toggleComplete(task._id);
                          }
                        }}
                        title={task.subtasks && task.subtasks.length > 0 ? 'Completa todas las subtareas' : ''}
                      >
                        {task.completed && <FaCheck className="text-white text-xs" />}
                      </button>
                    </td>

                    <td className="px-2 sm:px-3 md:px-4 lg:px-6 py-3 sm:py-4 md:py-5">
                      <div className="flex items-center gap-3">
                        {hasSubtasks && (
                          <button
                            onClick={() => toggleRow(task._id)}
                            className="text-slate-500 dark:text-slate-300 hover:text-slate-700 dark:hover:text-slate-100 transition-colors"
                          >
                            {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                          </button>
                        )}
                        <div>
                          <p className={`text-sm sm:text-base font-semibold text-slate-900 dark:text-white ${task.completed ? 'line-through' : ''}`}>
                            {task.title}
                          </p>
                          {task.description && (
                            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 truncate max-w-[150px] sm:max-w-xs font-medium">
                              {task.description}
                            </p>
                          )}
                        </div>
                      </div>
                      {isExpanded && hasSubtasks && (
                        <div className="mt-3 sm:mt-4 ml-6 sm:ml-10 space-y-2.5">
                          {task.subtasks.map((subtask) => (
                            <div key={subtask._id} className="flex items-center gap-3 text-xs sm:text-sm">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleSubtask(task._id, subtask._id);
                                }}
                                className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                                  subtask.completed
                                    ? 'bg-indigo-600 border-indigo-600 text-white'
                                    : 'border-slate-300 dark:border-slate-600 hover:border-indigo-500'
                                }`}
                              >
                                {subtask.completed && <FaCheck className="text-white text-xs" />}
                              </button>
                              <span className={subtask.completed ? 'line-through text-slate-500 font-medium' : 'text-slate-700 dark:text-slate-300 font-medium'}>
                                {subtask.title}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </td>

                    <td className="px-2 sm:px-3 md:px-4 lg:px-6 py-3 sm:py-4 md:py-5 whitespace-nowrap">
                      <span className={`badge flex items-center gap-1 ${priority.badge}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${priority.dot}`} />
                        <span className="hidden sm:inline">{priority.text}</span>
                      </span>
                    </td>

                    <td className="px-2 sm:px-3 md:px-4 lg:px-6 py-3 sm:py-4 md:py-5 whitespace-nowrap">
                      {task.category && (
                        <span className="badge bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          <span className="max-w-[80px] sm:max-w-none truncate">{task.category}</span>
                        </span>
                      )}
                    </td>

                    <td className="px-2 sm:px-3 md:px-4 lg:px-6 py-3 sm:py-4 md:py-5 whitespace-nowrap">
                      {task.estimatedTime > 0 && (
                        <span className="badge bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 flex items-center gap-1.5">
                          <FaClock className="text-xs" />
                          {task.estimatedTime}m
                        </span>
                      )}
                    </td>

                    <td className="px-2 sm:px-3 md:px-4 lg:px-6 py-3 sm:py-4 md:py-5 whitespace-nowrap">
                      {hasSubtasks && (
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="w-16 sm:w-20 md:w-24 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-emerald-500 transition-all duration-300"
                              style={{ width: `${(completedSubtasks / totalSubtasks) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full border border-slate-300 dark:border-slate-600">
                            {completedSubtasks}/{totalSubtasks}
                          </span>
                        </div>
                      )}
                    </td>

                    <td className="px-2 sm:px-3 md:px-4 lg:px-6 py-3 sm:py-4 md:py-5 whitespace-nowrap relative">
                      <button
                        ref={el => menuButtonRefs.current[task._id] = el}
                        className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors p-1.5 sm:p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (showMenu === task._id) {
                            setShowMenu(null);
                          } else {
                            const button = e.currentTarget;
                            const rect = button.getBoundingClientRect();
                            setMenuPosition({
                              top: rect.top + window.scrollY,
                              left: rect.right + 10
                            });
                            setShowMenu(task._id);
                          }
                        }}
                      >
                        <FaEllipsisV className="text-sm" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Menú flotante - fuera de la tabla */}
      {showMenu && (
        <>
          <div 
            className="fixed inset-0 z-[100]" 
            onClick={() => setShowMenu(null)}
          />
          
          <div 
            className="fixed z-[101] bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-slate-200 dark:border-slate-600 py-2 w-[200px] animate-scale-in"
            style={{
              top: `${menuPosition.top}px`,
              left: `${menuPosition.left}px`
            }}
          >
            <button
              className="w-full px-4 py-2.5 text-left text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
              onClick={() => {
                const task = tasks.find(t => t._id === showMenu);
                if (task) handleEdit(task);
              }}
            >
              <FaEdit className="text-slate-500" />
              <span>Editar</span>
            </button>

            <div className="border-t border-slate-200 dark:border-slate-700 my-1" />

            <button
              className="w-full px-4 py-2.5 text-left text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 flex items-center gap-2"
              onClick={() => handleDelete(showMenu)}
            >
              <FaTrash />
              <span>Eliminar</span>
            </button>
          </div>
        </>
      )}

      {showEditForm && selectedTask && (
        <TaskForm 
          taskToEdit={selectedTask} 
          onClose={() => {
            setShowEditForm(false);
            setSelectedTask(null);
          }} 
        />
      )}
    </>
  );
};

export default TaskTable;


