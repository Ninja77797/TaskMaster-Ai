import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';
import Task from './src/models/Task.js';

dotenv.config();

const viewDatabase = async () => {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB\n');
    
    // Obtener usuarios
    console.log('👥 USUARIOS:');
    console.log('='.repeat(50));
    const users = await User.find().select('-password');
    
    if (users.length === 0) {
      console.log('   No hay usuarios registrados\n');
    } else {
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.name}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   ID: ${user._id}`);
        console.log(`   Creado: ${user.createdAt.toLocaleDateString('es-ES')}\n`);
      });
    }
    
    // Obtener tareas
    console.log('\n📋 TAREAS:');
    console.log('='.repeat(50));
    const tasks = await Task.find().populate('userId', 'name email');
    
    if (tasks.length === 0) {
      console.log('   No hay tareas creadas\n');
    } else {
      tasks.forEach((task, index) => {
        console.log(`${index + 1}. ${task.title}`);
        console.log(`   Descripción: ${task.description || 'Sin descripción'}`);
        console.log(`   Prioridad: ${task.priority}`);
        console.log(`   Categoría: ${task.category}`);
        console.log(`   Estado: ${task.completed ? '✅ Completada' : '⏳ Pendiente'}`);
        console.log(`   Usuario: ${task.userId?.name || 'Desconocido'}`);
        if (task.tags && task.tags.length > 0) {
          console.log(`   Tags: ${task.tags.join(', ')}`);
        }
        if (task.subtasks && task.subtasks.length > 0) {
          console.log(`   Subtareas: ${task.subtasks.length}`);
          task.subtasks.forEach((st, i) => {
            console.log(`      ${i + 1}. ${st.title} ${st.completed ? '✅' : '⏳'}`);
          });
        }
        console.log(`   Creada: ${task.createdAt.toLocaleDateString('es-ES')}\n`);
      });
    }
    
    console.log('\n📊 RESUMEN:');
    console.log('='.repeat(50));
    console.log(`Total usuarios: ${users.length}`);
    console.log(`Total tareas: ${tasks.length}`);
    console.log(`Tareas completadas: ${tasks.filter(t => t.completed).length}`);
    console.log(`Tareas pendientes: ${tasks.filter(t => !t.completed).length}`);
    
    mongoose.connection.close();
    console.log('\n✅ Desconectado de MongoDB');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

viewDatabase();
