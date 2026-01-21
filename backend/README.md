# TaskMaster AI - Backend

Sistema de gestión de tareas con inteligencia artificial.

## 🚀 Instalación

```bash
npm install
```

## ⚙️ Configuración

1. Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
PORT=5000
MONGODB_URI=tu_mongodb_uri
JWT_SECRET=tu_jwt_secret
GROQ_API_KEY=tu_groq_api_key
NODE_ENV=development
```

### Obtener credenciales:

- **MongoDB**: Crea una cuenta gratuita en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **Groq API**: Obtén tu API key en [Groq Console](https://console.groq.com/)

## 🏃‍♂️ Ejecutar

```bash
# Modo desarrollo (con nodemon)
npm run dev

# Modo producción
npm start
```

## 📚 Endpoints

### Autenticación

- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Obtener perfil (requiere auth)

### Tareas

- `GET /api/tasks` - Obtener todas las tareas
- `GET /api/tasks/:id` - Obtener una tarea
- `POST /api/tasks` - Crear tarea
- `PUT /api/tasks/:id` - Actualizar tarea
- `DELETE /api/tasks/:id` - Eliminar tarea
- `PATCH /api/tasks/:id/toggle` - Marcar como completada
- `PATCH /api/tasks/:id/subtasks/:subtaskId` - Toggle subtarea

### IA

- `POST /api/ai/subtasks` - Generar subtareas
- `POST /api/ai/priority` - Sugerir prioridad
- `POST /api/ai/estimate-time` - Estimar tiempo
- `POST /api/ai/tags` - Auto-etiquetar
- `POST /api/ai/parse` - Crear tarea desde texto natural
- `POST /api/ai/chat` - Chat con asistente
- `POST /api/ai/analyze` - Análisis completo de tarea

## 🛠️ Stack

- Node.js + Express
- MongoDB + Mongoose
- JWT para autenticación
- Groq SDK para IA
