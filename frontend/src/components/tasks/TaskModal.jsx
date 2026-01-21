import { useState, useEffect } from 'react';
import { taskService } from '../../services/taskService';
import { aiService } from '../../services/aiService';
import { FaTimes, FaMagic, FaGripVertical, FaCheck, FaTrash, FaPlus, FaClock, FaTag, FaListUl, FaRegCalendarAlt } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const TaskModal = ({ task, onClose, onUpdate }) => {
  const priorityFromBackend = {
    'low': 'baja',
    'medium': 'media',
    'high': 'alta',
  };

  const [formData, setFormData] = useState({
    title: task.title,
    description: task.description || '',
    priority: priorityFromBackend[task.priority] || 'media',
    category: task.category || '',
    estimatedTime: task.estimatedTime || '',
    tags: task.tags || [],
  });
  
  const [availableSubtasks, setAvailableSubtasks] = useState([]);
  const [selectedSubtasks, setSelectedSubtasks] = useState(task.subtasks || []);
  const [generatingSubtasks, setGeneratingSubtasks] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragSource, setDragSource] = useState(null);
  const [newTag, setNewTag] = useState('');
  const [customSubtask, setCustomSubtask] = useState('');

  // Priority Styles - Modern & Minimal
  const priorityConfig = {
    baja: { label: 'Baja', color: 'text-emerald-700 bg-emerald-50 border-emerald-200 ring-emerald-200' },
    media: { label: 'Media', color: 'text-amber-700 bg-amber-50 border-amber-200 ring-amber-200' },
    alta: { label: 'Alta', color: 'text-rose-700 bg-rose-50 border-rose-200 ring-rose-200' },
  };

  const handleGenerateSubtasks = async () => {
    setGeneratingSubtasks(true);
    try {
      const response = await aiService.generateSubtasks({
        title: formData.title,
        description: formData.description,
      });
      
      const newSubtasks = (Array.isArray(response.subtasks) ? response.subtasks : []).map((item, index) => ({
        _id: Date.now() + index + Math.random(),
        title: typeof item === 'string' ? item : item.title || 'Subtarea',
        completed: false,
      }));
      
      setAvailableSubtasks([...availableSubtasks, ...newSubtasks]);
    } catch (error) {
      console.error('Error generando subtareas:', error);
    } finally {
      setGeneratingSubtasks(false);
    }
  };

  const handleDragStart = (e, index, source) => {
    setDraggedItem(index);
    setDragSource(source);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDropToSelected = (e) => {
    e.preventDefault();
    if (draggedItem === null || dragSource !== 'available') return;
    const item = availableSubtasks[draggedItem];
    setSelectedSubtasks([...selectedSubtasks, item]);
    setAvailableSubtasks(availableSubtasks.filter((_, i) => i !== draggedItem));
    setDraggedItem(null);
    setDragSource(null);
  };

  const handleDropToAvailable = (e) => {
    e.preventDefault();
    if (draggedItem === null || dragSource !== 'selected') return;
    const item = selectedSubtasks[draggedItem];
    setAvailableSubtasks([...availableSubtasks, { ...item, completed: false }]);
    setSelectedSubtasks(selectedSubtasks.filter((_, i) => i !== draggedItem));
    setDraggedItem(null);
    setDragSource(null);
  };
  
  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragSource(null);
  };

  const toggleSubtaskComplete = (index) => {
    const updated = [...selectedSubtasks];
    updated[index].completed = !updated[index].completed;
    setSelectedSubtasks(updated);
  };

  const addCustomSubtask = () => {
    if (customSubtask.trim()) {
      setSelectedSubtasks([
        ...selectedSubtasks,
        {
          _id: Date.now() + Math.random(),
          title: customSubtask,
          completed: false,
        },
      ]);
      setCustomSubtask('');
    }
  };

  const handleSave = async () => {
    try {
      const priorityMap = { 'baja': 'low', 'media': 'medium', 'alta': 'high' };
      const dataToSend = {
        ...formData,
        priority: priorityMap[formData.priority] || 'medium',
        estimatedTime: parseInt(formData.estimatedTime) || 0,
        subtasks: selectedSubtasks.map(st => ({ title: st.title, completed: st.completed || false })),
      };

      await taskService.updateTask(task._id, dataToSend);
      if (onUpdate) onUpdate();
      toast.success('Tarea actualizada correctamente.');
      onClose();
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Error al guardar los cambios de la tarea.');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('¿Eliminar esta tarea irreversiblemente?')) {
      try {
        await taskService.deleteTask(task._id);
        if (onUpdate) onUpdate();
        onClose();
      } catch (error) {
        console.error('Error deleting task:', error);
        toast.error('Error al eliminar la tarea.');
      }
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, newTag.trim()] });
      setNewTag('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div 
        className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-6xl h-[85vh] shadow-2xl flex overflow-hidden ring-1 ring-black/5 animate-scale-in"
        onClick={e => e.stopPropagation()}
      >
        
        {/* LEFT COLUMN: Task Details (60%) */}
        <div className="w-full lg:w-3/5 p-8 lg:p-12 overflow-y-auto flex flex-col relative scrollbar-hide">
          
          {/* Close Button Mobile */}
          <button onClick={onClose} className="lg:hidden absolute top-4 right-4 p-2 text-gray-400">
             <FaTimes />
          </button>

          {/* Header Area */}
          <div className="space-y-6 mb-8">
            <input 
              type="text" 
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})}
              className="text-4xl font-bold text-gray-900 dark:text-white bg-transparent border-none p-0 focus:ring-0 w-full placeholder-gray-300 dark:placeholder-gray-700"
              placeholder="Nombre de la tarea"
            />
            
            <div className="flex items-center flex-wrap gap-4">
              <div className="relative group">
                <select 
                  value={formData.priority} 
                  onChange={e => setFormData({...formData, priority: e.target.value})}
                  className={`appearance-none pl-4 pr-8 py-1.5 rounded-full text-sm font-semibold border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 ${priorityConfig[formData.priority].color}`}
                >
                  <option value="baja">Baja</option>
                  <option value="media">Media</option>
                  <option value="alta">Alta</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">▼</div>
              </div>
              
              <div className="h-6 w-px bg-gray-200 dark:bg-slate-700"></div>

              <span className="text-gray-400 text-sm font-medium flex items-center gap-2">
                 <FaRegCalendarAlt className="text-gray-300" /> 
                 {new Date(task.createdAt).toLocaleDateString('es-ES', { month: 'long', day: 'numeric' })}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="flex-1 mb-10 group">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 pl-1">Descripción</label>
            <textarea
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              className="w-full min-h-[160px] bg-gray-50/50 dark:bg-slate-800/30 rounded-2xl p-6 text-gray-700 dark:text-gray-300 leading-relaxed border border-transparent focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-100 dark:focus:border-slate-700 focus:ring-4 focus:ring-indigo-50/50 dark:focus:ring-slate-800 transition-all resize-none text-lg placeholder-gray-300"
              placeholder="Escribe los detalles de la tarea..."
            />
          </div>

          {/* Meta Data Grid */}
          <div className="grid grid-cols-2 gap-x-12 gap-y-8 mb-10">
             
             {/* Category */}
             <div className="group">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 pl-1 group-focus-within:text-indigo-500 transition-colors">Categoría</label>
                <input 
                  type="text" 
                  value={formData.category} 
                  onChange={e => setFormData({...formData, category: e.target.value})}
                  className="w-full bg-transparent border-b-2 border-gray-100 dark:border-slate-800 py-2 text-gray-900 dark:text-white font-medium focus:border-indigo-500 focus:outline-none transition-all placeholder-gray-300"
                  placeholder="Sin categoría"
                />
             </div>

             {/* Time */}
             <div className="group">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 pl-1 group-focus-within:text-indigo-500 transition-colors">Tiempo (min)</label>
                <div className="flex items-center gap-3">
                  <FaClock className="text-gray-300 dark:text-slate-600 group-focus-within:text-indigo-500 transition-colors" />
                  <input 
                    type="number" 
                    value={formData.estimatedTime} 
                    onChange={e => setFormData({...formData, estimatedTime: e.target.value})}
                    className="w-full bg-transparent border-b-2 border-gray-100 dark:border-slate-800 py-2 text-gray-900 dark:text-white font-medium focus:border-indigo-500 focus:outline-none transition-all placeholder-gray-300"
                    placeholder="0"
                  />
                </div>
             </div>

             {/* Tags */}
             <div className="col-span-2">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 pl-1">Etiquetas</label>
                <div className="flex flex-wrap items-center gap-2">
                  {formData.tags.map(tag => (
                     <span key={tag} className="group inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-400 transition-colors cursor-default">
                       <FaTag className="text-[10px] opacity-40" /> {tag}
                       <button onClick={() => setFormData({...formData, tags: formData.tags.filter(t => t !== tag)})} className="ml-1 text-gray-400 hover:text-red-500 focus:outline-none">×</button>
                     </span>
                  ))}
                  <input 
                    type="text" 
                    value={newTag}
                    onChange={e => setNewTag(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addTag()}
                    className="ml-2 text-sm text-gray-600 dark:text-gray-400 placeholder-gray-400 bg-transparent focus:outline-none min-w-[120px]"
                    placeholder="+ Añadir etiqueta"
                  />
                </div>
             </div>
          </div>

          {/* Footer Actions (Left Side) */}
          <div className="mt-auto pt-6 border-t border-gray-100 dark:border-slate-800 flex justify-between items-center text-sm">
             <button onClick={handleDelete} className="text-gray-400 hover:text-red-500 font-medium px-2 py-2 transition-colors flex items-center gap-2">
               <FaTrash className="text-xs" /> Eliminar
             </button>
             <div className="flex gap-4">
                <button onClick={onClose} className="px-6 py-3 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors font-medium">
                  Cancelar
                </button>
                <button onClick={handleSave} className="px-8 py-3 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-black hover:scale-105 active:scale-95 transition-all font-bold shadow-xl shadow-gray-200/50 dark:shadow-none">
                  Guardar Cambios
                </button>
             </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Action Plan / Subtasks (40%) */}
        <div className="w-full lg:w-2/5 bg-gray-50/80 dark:bg-slate-950/50 border-l border-gray-100 dark:border-slate-800 p-8 flex flex-col backdrop-blur-sm relative">
          
          <button onClick={onClose} className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors hidden lg:block">
             <FaTimes className="text-xl" />
          </button>

          <div className="mt-8 mb-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3 mb-2">
              <span className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-sm">
                 <FaListUl />
              </span>
              Plan de Acción
            </h3>
            <p className="text-sm text-gray-500 ml-11">
               Gestiona los pasos para completar esta tarea.
            </p>
          </div>

          {/* AI Generation Button */}
          <div className="mb-8">
            <button 
              onClick={handleGenerateSubtasks} 
              disabled={generatingSubtasks}
              className="w-full group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 p-1 shadow-sm hover:shadow-md transition-all active:scale-[0.99]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative rounded-xl py-3 flex items-center justify-center gap-2 group-hover:gap-3 transition-all">
                 {generatingSubtasks ? (
                   <span className="flex items-center gap-2 text-indigo-600 font-bold">
                     <FaMagic className="animate-spin" /> Creando plan...
                   </span>
                 ) : (
                   <>
                     <FaMagic className="text-indigo-500 group-hover:rotate-12 transition-transform" /> 
                     <span className="font-bold text-gray-700 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                       Generar con AI
                     </span>
                   </>
                 )}
              </div>
            </button>
          </div>

          {/* SCROLLABLE LIST AREA */}
          <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-8 scrollbar-hide">
            
            {/* MY PLAN (Selected) */}
            <div 
               onDragOver={handleDragOver} 
               onDrop={handleDropToSelected}  
               className={`space-y-3 min-h-[150px] transition-all rounded-2xl ${dragSource === 'available' ? 'bg-indigo-50/50 dark:bg-indigo-900/10 ring-2 ring-dashed ring-indigo-200 dark:ring-indigo-800 p-4' : 'px-1'}`}
            > 
              <div className="flex items-center justify-between mb-2">
                 <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-2">Mi Lista</h4>
                 <span className="text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded-md">
                   {selectedSubtasks.filter(t => t.completed).length}/{selectedSubtasks.length}
                 </span>
              </div>
              
              {selectedSubtasks.map((task, idx) => (
                <div 
                  key={task._id} 
                  draggable
                  onDragStart={(e) => handleDragStart(e, idx, 'selected')}
                  onDragEnd={handleDragEnd}
                  className="group flex items-start gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-800 hover:shadow-md transition-all cursor-move"
                >
                  <FaGripVertical className="text-gray-300 mt-1 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <button 
                     onClick={() => toggleSubtaskComplete(idx)}
                     className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                        task.completed ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-gray-300 dark:border-slate-600 hover:border-indigo-400 text-transparent'
                     }`}
                  >
                    <FaCheck className="text-[10px]" />
                  </button>

                  <span className={`flex-1 text-sm leading-snug font-medium transition-colors ${task.completed ? 'text-gray-400 line-through' : 'text-gray-700 dark:text-gray-200'}`}>
                    {task.title}
                  </span>
                </div>
              ))}

              {selectedSubtasks.length === 0 && (
                <div className="text-center py-10 px-4 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50/50 dark:bg-slate-900/50">
                  <p className="text-sm text-gray-400 font-medium">No hay subtareas. <br/>Genera con IA o añade una.</p>
                </div>
              )}
              
              {/* Custom Add Input */}
              <div className="flex items-center gap-3 mt-4 pl-3 opacity-60 hover:opacity-100 transition-opacity">
                <FaPlus className="text-gray-400 text-sm" />
                <input 
                  type="text" 
                  value={customSubtask}
                  onChange={e => setCustomSubtask(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addCustomSubtask()}
                  placeholder="Añadir paso manualmente..."
                  className="bg-transparent text-sm w-full py-2 focus:outline-none placeholder-gray-400 text-gray-700 dark:text-gray-200"
                />
              </div>
            </div>

            {/* SUGGESTIONS (Available) */}
            {availableSubtasks.length > 0 && (
              <div 
                onDragOver={handleDragOver} 
                onDrop={handleDropToAvailable}
                className={`space-y-2 transition-all rounded-2xl ${dragSource === 'selected' ? 'bg-gray-100 dark:bg-slate-800 ring-2 ring-dashed ring-gray-300 dark:ring-slate-600 p-4' : 'pt-6 border-t border-gray-200 dark:border-slate-800'}`}
              >
                 <div className="flex justify-between items-center mb-4 px-1">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Sugerencias</h4>
                    <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded text-[10px] font-bold">
                       DRAG TO ADD
                    </span>
                 </div>

                 <div className="grid grid-cols-1 gap-2">
                   {availableSubtasks.map((task, idx) => (
                     <div 
                       key={task._id} 
                       draggable
                       onDragStart={(e) => handleDragStart(e, idx, 'available')}
                       onDragEnd={handleDragEnd}
                       className="group flex items-center gap-3 bg-white dark:bg-slate-900 p-3 rounded-lg border border-gray-100 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-sm transition-all cursor-move items-start"
                     >
                       <FaGripVertical className="text-gray-300 mt-1" />
                       <span className="text-sm text-gray-600 dark:text-gray-400 flex-1 leading-snug">{task.title}</span>
                       <FaPlus className="text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity text-xs mt-1" />
                     </div>
                   ))}
                 </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default TaskModal;