import * as aiService from '../services/aiService.js';
import Task from '../models/Task.js';

// @desc    Generar subtareas con IA
// @route   POST /api/ai/subtasks
// @access  Private
export const generateSubtasks = async (req, res) => {
  try {
    const { taskId, title, description } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'El título es requerido' });
    }

    const subtasks = await aiService.generateSubtasks(title, description);

    // Si se proporciona taskId, actualizar la tarea
    if (taskId) {
      const task = await Task.findById(taskId);
      
      if (!task) {
        return res.status(404).json({ message: 'Tarea no encontrada' });
      }
      
      if (task.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'No autorizado' });
      }

      task.subtasks = subtasks;
      await task.save();
      
      return res.json({ task });
    }

    res.json({ subtasks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Sugerir prioridad con IA
// @route   POST /api/ai/priority
// @access  Private
export const suggestPriority = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'El título es requerido' });
    }

    const priority = await aiService.suggestPriority(title, description);

    res.json({ priority });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Estimar tiempo con IA
// @route   POST /api/ai/estimate-time
// @access  Private
export const estimateTime = async (req, res) => {
  try {
    const { title, description, subtasks } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'El título es requerido' });
    }

    const estimatedTime = await aiService.estimateTime(title, description, subtasks);

    res.json({ estimatedTime });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auto-etiquetar con IA
// @route   POST /api/ai/tags
// @access  Private
export const autoTag = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'El título es requerido' });
    }

    const tags = await aiService.autoTag(title, description);

    res.json({ tags });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Crear tarea desde lenguaje natural
// @route   POST /api/ai/parse
// @access  Private
export const parseNaturalLanguage = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: 'El texto es requerido' });
    }

    const taskData = await aiService.parseNaturalLanguage(text);

    // Crear la tarea automáticamente
    const task = await Task.create({
      ...taskData,
      userId: req.user._id,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Chat con asistente IA
// @route   POST /api/ai/chat
// @access  Private
export const chatAssistant = async (req, res) => {
  try {
    const { message, taskId, history } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'El mensaje es requerido' });
    }

    let taskContext = null;

    // Si hay taskId, obtener contexto
    if (taskId) {
      const task = await Task.findById(taskId);
      if (task && task.userId.toString() === req.user._id.toString()) {
        taskContext = task;
      }
    }

    const response = await aiService.chatAssistant(message, history, taskContext, req.user);

    res.json({ response });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Análisis completo de tarea con IA
// @route   POST /api/ai/analyze
// @access  Private
export const analyzeTask = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'El título es requerido' });
    }

    // Ejecutar todos los análisis en paralelo
    const [subtasks, priority, estimatedTime, tags] = await Promise.all([
      aiService.generateSubtasks(title, description),
      aiService.suggestPriority(title, description),
      aiService.estimateTime(title, description),
      aiService.autoTag(title, description),
    ]);

    res.json({
      subtasks,
      priority,
      estimatedTime,
      tags,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
