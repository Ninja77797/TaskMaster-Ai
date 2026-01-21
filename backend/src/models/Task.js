import mongoose from 'mongoose';

const subtaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'El título es requerido'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    default: '',
  },
  completed: {
    type: Boolean,
    default: false,
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
  category: {
    type: String,
    trim: true,
    default: 'General',
  },
  tags: [{
    type: String,
    trim: true,
  }],
  estimatedTime: {
    type: Number, // en minutos
    default: 0,
  },
  dueDate: {
    type: Date,
  },
  subtasks: [subtaskSchema],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true, // Agrega createdAt y updatedAt automáticamente
});

// Índices para búsqueda más rápida
taskSchema.index({ userId: 1, completed: 1 });
taskSchema.index({ userId: 1, priority: 1 });
taskSchema.index({ userId: 1, category: 1 });

const Task = mongoose.model('Task', taskSchema);

export default Task;
