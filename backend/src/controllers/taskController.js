import Task from '../models/Task.js';

// @desc    Obtener todas las tareas del usuario
// @route   GET /api/tasks
// @access  Private
export const getTasks = async (req, res) => {
  try {
    const { completed, priority, category, search } = req.query;
    
    // Construir filtro
    const filter = { userId: req.user._id };
    
    if (completed !== undefined) {
      filter.completed = completed === 'true';
    }
    
    if (priority) {
      filter.priority = priority;
    }
    
    if (category) {
      filter.category = category;
    }
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    
    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener tareas', error: error.message });
  }
};

// @desc    Obtener una tarea por ID
// @route   GET /api/tasks/:id
// @access  Private
export const getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }
    
    // Verificar que la tarea pertenece al usuario
    if (task.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'No autorizado' });
    }
    
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener tarea', error: error.message });
  }
};

// @desc    Crear nueva tarea
// @route   POST /api/tasks
// @access  Private
export const createTask = async (req, res) => {
  try {
    const { title, description, priority, category, tags, estimatedTime, dueDate, subtasks } = req.body;
    
    const task = await Task.create({
      title,
      description,
      priority,
      category,
      tags,
      estimatedTime,
      dueDate,
      subtasks,
      userId: req.user._id,
    });
    
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear tarea', error: error.message });
  }
};

// @desc    Actualizar tarea
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }
    
    // Verificar que la tarea pertenece al usuario
    if (task.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'No autorizado' });
    }
    
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar tarea', error: error.message });
  }
};

// @desc    Eliminar tarea
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }
    
    // Verificar que la tarea pertenece al usuario
    if (task.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'No autorizado' });
    }
    
    await Task.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Tarea eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar tarea', error: error.message });
  }
};

// @desc    Marcar tarea como completada/incompleta
// @route   PATCH /api/tasks/:id/toggle
// @access  Private
export const toggleComplete = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }
    
    // Verificar que la tarea pertenece al usuario
    if (task.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'No autorizado' });
    }
    
    // No permitir toggle manual si hay subtareas
    if (task.subtasks && task.subtasks.length > 0) {
      return res.status(400).json({ 
        message: 'No se puede marcar como completa manualmente. Completa todas las subtareas primero.',
        task 
      });
    }
    
    task.completed = !task.completed;
    await task.save();
    
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar tarea', error: error.message });
  }
};

// @desc    Actualizar subtarea
// @route   PATCH /api/tasks/:id/subtasks/:subtaskId
// @access  Private
export const toggleSubtask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }
    
    // Verificar que la tarea pertenece al usuario
    if (task.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'No autorizado' });
    }
    
    const subtask = task.subtasks.id(req.params.subtaskId);
    
    if (!subtask) {
      return res.status(404).json({ message: 'Subtarea no encontrada' });
    }
    
    subtask.completed = !subtask.completed;
    
    // Auto-completar tarea si todas las subtareas están completas
    if (task.subtasks.length > 0) {
      const allSubtasksCompleted = task.subtasks.every(st => st.completed);
      task.completed = allSubtasksCompleted;
    }
    
    await task.save();
    
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar subtarea', error: error.message });
  }
};
