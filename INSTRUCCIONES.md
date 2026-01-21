# 🚀 INSTRUCCIONES DE INICIO - Kadoo

## ✅ LO QUE YA ESTÁ HECHO

El backend está **100% completo** con:
- ✅ Autenticación JWT (login/register)
- ✅ CRUD completo de tareas
- ✅ 7 endpoints de IA con Groq
- ✅ Modelos de MongoDB (User + Task)
- ✅ Middleware de autenticación
- ✅ Sistema de filtros y búsqueda

---

## 📋 PASOS PARA EMPEZAR

### 1️⃣ Instalar dependencias del backend

```bash
cd backend
npm install
```

### 2️⃣ Configurar MongoDB Atlas (5 minutos)

1. Ve a https://www.mongodb.com/cloud/atlas/register
2. Crea una cuenta gratuita
3. Crea un cluster (M0 Sandbox - Gratis)
4. Ve a "Database Access" → Crear usuario con contraseña
5. Ve a "Network Access" → Add IP Address → "Allow Access from Anywhere" (0.0.0.0/0)
6. Ve a "Database" → Connect → "Connect your application"
7. Copia la connection string (ejemplo: `mongodb+srv://user:pass@cluster.mongodb.net/`)

### 3️⃣ Configurar Groq API (2 minutos)

1. Ve a https://console.groq.com/
2. Crea una cuenta gratuita
3. Ve a "API Keys" → "Create API Key"
4. Copia tu API key

### 4️⃣ Configurar variables de entorno

Edita el archivo `backend/.env` y reemplaza:

```env
PORT=5000
MONGODB_URI=mongodb+srv://TU_USUARIO:TU_CONTRASEÑA@cluster.mongodb.net/taskmanager?retryWrites=true&w=majority
JWT_SECRET=cambia_esto_por_texto_aleatorio_largo_y_seguro
GROQ_API_KEY=tu_groq_api_key_real_aqui
NODE_ENV=development
```

**Ejemplo real:**
```env
PORT=5000
MONGODB_URI=mongodb+srv://admin:MiPass123@cluster0.abc123.mongodb.net/taskmanager?retryWrites=true&w=majority
JWT_SECRET=mi_clave_super_secreta_123456789
GROQ_API_KEY=gsk_abc123def456ghi789
NODE_ENV=development
```

### 5️⃣ Iniciar el backend

```bash
npm run dev
```

Deberías ver:
```
✅ MongoDB conectado: cluster0-shard-00-00.abc123.mongodb.net
🚀 Servidor corriendo en puerto 5000
📝 Ambiente: development
🔗 API: http://localhost:5000
```

### 6️⃣ Probar la API

Abre tu navegador en: http://localhost:5000

Deberías ver:
```json
{
  "message": "🚀 API Kadoo funcionando correctamente",
  "version": "1.0.0",
  "endpoints": {
    "auth": "/api/auth",
    "tasks": "/api/tasks",
    "ai": "/api/ai"
  }
}
```

---

## 🧪 PROBAR ENDPOINTS (Opcional)

### Con Thunder Client (extensión de VS Code):

1. Instala la extensión "Thunder Client" en VS Code
2. Crea una nueva request:

**Registrar usuario:**
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@test.com",
  "password": "123456"
}
```

**Login:**
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@test.com",
  "password": "123456"
}
```

Guarda el `token` que recibes.

**Crear tarea (usa el token):**
```
POST http://localhost:5000/api/tasks
Authorization: Bearer TU_TOKEN_AQUI
Content-Type: application/json

{
  "title": "Mi primera tarea",
  "description": "Descripción de prueba",
  "priority": "high"
}
```

**Generar subtareas con IA:**
```
POST http://localhost:5000/api/ai/subtasks
Authorization: Bearer TU_TOKEN_AQUI
Content-Type: application/json

{
  "title": "Crear aplicación web",
  "description": "Aplicación de tareas con React y Node"
}
```

---

## 🎯 SIGUIENTE PASO: FRONTEND

Una vez que el backend funcione, continúa con:

```bash
cd ..
cd frontend
# (seguir instrucciones del frontend cuando las cree)
```

---

## 🐛 Solución de Problemas

### Error: "MongoServerError: bad auth"
- Revisa usuario y contraseña en MONGODB_URI
- Verifica que el usuario tenga permisos en Database Access

### Error: "connect ETIMEDOUT"
- Agrega tu IP en Network Access de MongoDB Atlas
- Usa "Allow Access from Anywhere" para desarrollo

### Error: "GROQ_API_KEY is not defined"
- Verifica que copiaste bien la API key en .env
- Reinicia el servidor después de cambiar .env

### Error: puerto 5000 ocupado
- Cambia PORT en .env a 5001 o 3001

---

## 📁 Estructura del Backend

```
backend/
├── src/
│   ├── config/
│   │   ├── db.js          # Conexión MongoDB
│   │   └── groq.js        # Cliente Groq
│   ├── models/
│   │   ├── User.js        # Schema Usuario
│   │   └── Task.js        # Schema Tarea
│   ├── controllers/
│   │   ├── authController.js    # Login/Register
│   │   ├── taskController.js    # CRUD Tareas
│   │   └── aiController.js      # Endpoints IA
│   ├── middleware/
│   │   └── authMiddleware.js    # Verificar JWT
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── taskRoutes.js
│   │   └── aiRoutes.js
│   └── services/
│       └── aiService.js         # Lógica IA con Groq
├── .env
├── .gitignore
├── package.json
├── server.js              # Punto de entrada
└── README.md
```

---

## ✨ Funcionalidades IA Disponibles

1. **Generar subtareas** - `/api/ai/subtasks`
2. **Clasificar prioridad** - `/api/ai/priority`
3. **Estimar tiempo** - `/api/ai/estimate-time`
4. **Auto-etiquetar** - `/api/ai/tags`
5. **Lenguaje natural** - `/api/ai/parse` (crea tarea desde texto)
6. **Chat asistente** - `/api/ai/chat`
7. **Análisis completo** - `/api/ai/analyze` (ejecuta todo en paralelo)

---

¿Estás listo para continuar con el frontend? 🎨
