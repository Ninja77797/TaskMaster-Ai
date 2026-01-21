import groq from '../config/groq.js';

// Generar subtareas usando IA
export const generateSubtasks = async (taskTitle, taskDescription) => {
  try {
    const prompt = `Genera una lista de 3-5 subtareas específicas y accionables para la siguiente tarea:

Título: ${taskTitle}
Descripción: ${taskDescription || 'Sin descripción'}

Responde SOLO con un array JSON de objetos con la estructura: [{"title": "subtarea", "completed": false}]
No incluyas explicaciones adicionales, solo el JSON.`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'Eres un asistente experto en gestión de tareas. Respondes únicamente con JSON válido sin texto adicional.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 500,
    });

    const response = completion.choices[0]?.message?.content || '[]';
    
    // Limpiar la respuesta y parsear JSON
    const cleanedResponse = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const subtasks = JSON.parse(cleanedResponse);
    
    return subtasks;
  } catch (error) {
    console.error('Error generando subtareas:', error);
    throw new Error('No se pudieron generar las subtareas');
  }
};

// Sugerir prioridad basada en el contenido
export const suggestPriority = async (taskTitle, taskDescription) => {
  try {
    const prompt = `Analiza la siguiente tarea y determina su prioridad (low, medium, high):

Título: ${taskTitle}
Descripción: ${taskDescription || 'Sin descripción'}

Responde SOLO con una palabra: low, medium o high.`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'Eres un experto en gestión de tareas. Analiza la urgencia e importancia de las tareas.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3,
      max_tokens: 10,
    });

    const priority = completion.choices[0]?.message?.content.trim().toLowerCase();
    
    // Validar que sea una prioridad válida
    if (!['low', 'medium', 'high'].includes(priority)) {
      return 'medium';
    }
    
    return priority;
  } catch (error) {
    console.error('Error sugiriendo prioridad:', error);
    return 'medium';
  }
};

// Estimar tiempo de completado
export const estimateTime = async (taskTitle, taskDescription, subtasks = []) => {
  try {
    const subtasksText = subtasks.length > 0 
      ? `\nSubtareas: ${subtasks.map(st => st.title).join(', ')}`
      : '';

    const prompt = `Estima el tiempo necesario para completar esta tarea en minutos:

Título: ${taskTitle}
Descripción: ${taskDescription || 'Sin descripción'}${subtasksText}

Responde SOLO con un número (minutos estimados). Sin texto adicional.`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'Eres un experto en estimación de tiempo para tareas. Sé realista y considera la complejidad.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3,
      max_tokens: 10,
    });

    const timeStr = completion.choices[0]?.message?.content.trim();
    const time = parseInt(timeStr);
    
    // Validar que sea un número válido
    if (isNaN(time) || time < 0) {
      return 30; // valor por defecto
    }
    
    return time;
  } catch (error) {
    console.error('Error estimando tiempo:', error);
    return 30;
  }
};

// Auto-etiquetar tarea
export const autoTag = async (taskTitle, taskDescription) => {
  try {
    const prompt = `Genera 2-3 etiquetas relevantes para categorizar esta tarea:

Título: ${taskTitle}
Descripción: ${taskDescription || 'Sin descripción'}

Responde SOLO con un array JSON de strings: ["etiqueta1", "etiqueta2"]
Sin texto adicional.`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'Eres un experto en categorización de tareas. Responde solo con JSON válido.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.5,
      max_tokens: 100,
    });

    const response = completion.choices[0]?.message?.content || '[]';
    const cleanedResponse = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const tags = JSON.parse(cleanedResponse);
    
    return tags;
  } catch (error) {
    console.error('Error generando tags:', error);
    return [];
  }
};

// Parsear lenguaje natural y crear tarea
export const parseNaturalLanguage = async (naturalText) => {
  try {
    const prompt = `Convierte el siguiente texto en una tarea estructurada, incluyendo subtareas claras y accionables:

"${naturalText}"

Responde SOLO con un objeto JSON con esta estructura exacta:
{
  "title": "título de la tarea",
  "description": "descripción detallada",
  "priority": "low|medium|high",
  "category": "categoría apropiada",
  "tags": ["tag1", "tag2"],
  "estimatedTime": numero_en_minutos,
  "subtasks": [
    { "title": "subtarea 1", "completed": false },
    { "title": "subtarea 2", "completed": false }
  ]
}

Reglas importantes:
- Genera entre 3 y 6 subtareas concretas en "subtasks".
- Usa solo una de estas prioridades: low, medium o high.
- "estimatedTime" debe ser un número entero en minutos.
- No incluyas texto adicional fuera del JSON.`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'Eres un experto en procesamiento de lenguaje natural para tareas. Responde solo con JSON válido.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.5,
      max_tokens: 500,
    });

    const response = completion.choices[0]?.message?.content || '{}';
    const cleanedResponse = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const taskData = JSON.parse(cleanedResponse);
    
    return taskData;
  } catch (error) {
    console.error('Error parseando lenguaje natural:', error);
    throw new Error('No se pudo procesar el texto');
  }
};

// Asistente de chat general con contexto y personalización por usuario
export const chatAssistant = async (userMessage, history = [], taskContext = null, user = null) => {
  try {
    const userName = user?.name || user?.email || 'usuario';

    const baseSystemContent = `Eres un asistente de productividad experto llamado TaskMaster AI.
Respondes SIEMPRE en español, con un tono cercano y profesional.
El usuario se llama ${userName}; puedes mencionarlo por su nombre de forma natural algunas veces (no en cada frase).
Ayudas a organizar tareas, priorizar, planificar y mejorar la productividad. Sé claro, directo y práctico.`;

    const messages = [
      {
        role: 'system',
        content: baseSystemContent,
      },
    ];

    // Añadir historial previo de conversación si existe
    if (Array.isArray(history)) {
      history.forEach((msg) => {
        if (!msg || typeof msg.content !== 'string') return;
        const role = msg.role === 'assistant' ? 'assistant' : 'user';
        messages.push({ role, content: msg.content });
      });
    }

    // Añadir mensaje actual del usuario, con posible contexto de tarea
    const contextText = taskContext
      ? `\n\nContexto de la tarea actual:\nTítulo: ${taskContext.title}\nDescripción: ${taskContext.description || 'Sin descripción'}`
      : '';

    messages.push({
      role: 'user',
      content: `${userMessage}${contextText}`,
    });

    const completion = await groq.chat.completions.create({
      messages,
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 500,
    });

    const response = completion.choices[0]?.message?.content;
    
    return response;
  } catch (error) {
    console.error('Error en chat assistant:', error);
    throw new Error('No se pudo obtener respuesta del asistente');
  }
};
