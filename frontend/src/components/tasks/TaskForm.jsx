import { useState } from 'react';
import { useTaskStore } from '../../store/taskStore';
import { aiService } from '../../services/aiService';
import { FaTimes, FaMagic, FaSave, FaBan, FaPlus, FaTrash, FaListUl } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const TaskForm = ({ onClose, taskToEdit = null }) => {
  const { createTask, updateTask } = useTaskStore();
  const [formData, setFormData] = useState({
    title: taskToEdit?.title || '',
    description: taskToEdit?.description || '',
    priority: taskToEdit?.priority || 'medium',
    category: taskToEdit?.category || '',
    tags: taskToEdit?.tags?.join(', ') || '',
    estimatedTime: taskToEdit?.estimatedTime || '',
  });
  const [subtasks, setSubtasks] = useState(taskToEdit?.subtasks || []);
  const [newSubtask, setNewSubtask] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddSubtask = () => {
    if (!newSubtask.trim()) return;
    
    setSubtasks([...subtasks, { title: newSubtask.trim(), completed: false }]);
    setNewSubtask('');
  };

  const handleRemoveSubtask = (index) => {
    setSubtasks(subtasks.filter((_, i) => i !== index));
  };

  const handleAIAnalyze = async () => {
    if (!formData.title) {
      toast.error('Ingresa un título primero.');
      return;
    }

    setAiLoading(true);
    try {
      const analysis = await aiService.analyzeTask({
        title: formData.title,
        description: formData.description,
      });

      setFormData({
        ...formData,
        priority: analysis.priority,
        estimatedTime: analysis.estimatedTime,
        tags: analysis.tags.join(', '),
      });

      // Agregar subtareas generadas por IA
      if (analysis.subtasks && analysis.subtasks.length > 0) {
        setSubtasks([...subtasks, ...analysis.subtasks.map(st => ({ title: st.title, completed: false }))]);
      }

      toast.success('La IA ha analizado tu tarea y ha sugerido subtareas y tiempos.');
    } catch (error) {
      toast.error('Error al analizar la tarea con IA.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const taskData = {
        ...formData,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : [],
        estimatedTime: formData.estimatedTime ? parseInt(formData.estimatedTime) : 0,
        subtasks: subtasks,
      };

      if (taskToEdit) {
        await updateTask(taskToEdit._id, taskData);
        toast.success('Tarea actualizada correctamente.');
      } else {
        await createTask(taskData);
        toast.success('Tarea creada correctamente.');
      }

      onClose();
    } catch (error) {
      toast.error('Error al guardar la tarea.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-2 sm:p-4 z-50 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-700 animate-scale-in">
        {/* Header */}
        <div className="flex justify-between items-center p-5 sm:p-6 border-b border-slate-200 dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-900 z-10">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <FaMagic className="text-base sm:text-lg" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-50">
                {taskToEdit ? 'Editar tarea' : 'Nueva tarea'}
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Define los detalles principales de la tarea
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors p-2 rounded-lg"
          >
            <FaTimes className="text-lg sm:text-xl" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Título */}
            <div>
              <label className="block text-sm font-medium text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
                Título *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="input-field font-medium"
                placeholder="¿Qué necesitas hacer?"
              />
            </div>

            {/* Categoría */}
            <div>
              <label className="block text-sm font-medium text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-purple-600 rounded-full"></span>
                Categoría *
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="input-field font-medium"
                placeholder="Trabajo, Personal, etc."
              />
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-pink-600 rounded-full"></span>
              Descripción *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={3}
              className="input-field font-medium"
              placeholder="Detalles adicionales..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Prioridad */}
            <div>
              <label className="block text-sm font-medium text-slate-800 dark:text-slate-200 mb-2">
                Prioridad *
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                required
                className="input-field font-medium"
              >
                <option value="low">Baja</option>
                <option value="medium">Media</option>
                <option value="high">Alta</option>
              </select>
            </div>

            {/* Tiempo estimado */}
            <div>
              <label className="block text-sm font-medium text-slate-800 dark:text-slate-200 mb-2">
                Tiempo (min) *
              </label>
              <input
                type="number"
                name="estimatedTime"
                value={formData.estimatedTime}
                onChange={handleChange}
                required
                min="1"
                className="input-field font-bold"
                placeholder="30"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-slate-800 dark:text-slate-200 mb-2">
                Etiquetas *
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                required
                className="input-field font-medium"
                placeholder="urgente, importante"
              />
            </div>
          </div>

          {/* Subtareas */}
          <div className="p-5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-600">
            <label className="block text-sm font-medium text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <FaListUl className="text-slate-500 dark:text-slate-300" />
              Subtareas ({subtasks.length})
            </label>
            
            {/* Lista de subtareas */}
            {subtasks.length > 0 && (
              <div className="space-y-3 mb-4">
                {subtasks.map((subtask, index) => (
                  <div key={index} className="flex items-center gap-3 bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-600 group">
                    <span className="flex-1 text-sm font-medium text-slate-800 dark:text-slate-200">
                      {subtask.title}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubtask(index)}
                      className="text-rose-500 hover:text-rose-700 dark:hover:text-rose-400 transition-colors p-1.5 rounded-lg"
                    >
                      <FaTrash className="text-sm" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Input para nueva subtarea */}
            <div className="flex gap-3">
              <input
                type="text"
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSubtask())}
                className="input-field flex-1 font-medium"
                placeholder="Escribe una subtarea y presiona Enter..."
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 rounded-lg transition-colors"
              >
                <FaPlus />
              </button>
            </div>
          </div>

          {/* Botón IA Analizar */}
          <button
            type="button"
            onClick={handleAIAnalyze}
            disabled={aiLoading}
            className="w-full btn-secondary btn-ia-neon disabled:opacity-60 flex items-center justify-center gap-2"
          >
            <FaMagic className={aiLoading ? 'animate-spin' : ''} /> 
            {aiLoading ? 'Analizando con IA...' : 'Analizar con IA'}
          </button>

          {/* Botones */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-primary disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <FaSave />
              {loading ? 'Guardando...' : taskToEdit ? 'Actualizar' : 'Crear tarea'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-secondary flex items-center justify-center gap-2"
            >
              <FaBan />
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;

