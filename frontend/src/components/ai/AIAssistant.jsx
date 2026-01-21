import { useState, useEffect } from 'react';
import { aiService } from '../../services/aiService';
import { useTaskStore } from '../../store/taskStore';
import { useAuthStore } from '../../store/authStore';
import { FaTimes, FaRobot, FaPaperPlane, FaMagic, FaLightbulb, FaComments, FaStar } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const AIAssistant = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('chat');
  const [naturalText, setNaturalText] = useState('');
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const { fetchTasks } = useTaskStore();
  const { user } = useAuthStore();

  // Bloquear scroll del body mientras el modal está abierto
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Función para formatear el texto con markdown básico
  const formatMessage = (text) => {
    if (!text) return '';
    
    // Dividir en líneas
    const lines = text.split('\n');
    const formatted = [];
    let inList = false;

    lines.forEach((line) => {
      const trimmedLine = line.trim();
      
      // Listas numeradas (1. 2. 3.)
      if (/^\d+\.\s+/.test(trimmedLine)) {
        if (inList !== 'ol') {
          if (inList) formatted.push(inList === 'ul' ? '</ul>' : '</ol>');
          formatted.push('<ol class="list-decimal ml-4 space-y-2 my-2">');
          inList = 'ol';
        }
        const content = trimmedLine.replace(/^\d+\.\s+/, '');
        const formattedContent = formatInlineStyles(content);
        formatted.push(`<li class="leading-relaxed">${formattedContent}</li>`);
      }
      // Listas con viñetas (- o • o *)
      else if (/^[\-\•\*]\s+/.test(trimmedLine)) {
        if (inList !== 'ul') {
          if (inList) formatted.push(inList === 'ol' ? '</ol>' : '</ul>');
          formatted.push('<ul class="list-disc ml-4 space-y-2 my-2">');
          inList = 'ul';
        }
        const content = trimmedLine.replace(/^[\-\•\*]\s+/, '');
        const formattedContent = formatInlineStyles(content);
        formatted.push(`<li class="leading-relaxed">${formattedContent}</li>`);
      }
      // Línea normal
      else {
        if (inList) {
          formatted.push(inList === 'ol' ? '</ol>' : '</ul>');
          inList = false;
        }
        if (trimmedLine) {
          const formattedContent = formatInlineStyles(trimmedLine);
          formatted.push(`<p class="leading-relaxed mb-2">${formattedContent}</p>`);
        } else if (formatted.length > 0) {
          formatted.push('<div class="h-2"></div>');
        }
      }
    });

    // Cerrar lista si quedó abierta
    if (inList) {
      formatted.push(inList === 'ol' ? '</ol>' : '</ul>');
    }

    return formatted.join('');
  };

  // Función auxiliar para formatear estilos inline (negritas, cursivas, etc.)
  const formatInlineStyles = (text) => {
    let result = text;
    // Negritas **texto**
    result = result.replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold text-purple-600 dark:text-purple-400">$1</strong>');
    // Código `texto`
    result = result.replace(/`(.+?)`/g, '<code class="bg-gray-200 dark:bg-slate-600 px-1.5 py-0.5 rounded text-xs font-mono">$1</code>');
    return result;
  };

  const handleNaturalLanguage = async () => {
    if (!naturalText.trim()) return;

    setLoading(true);
    try {
      await aiService.parseNaturalLanguage(naturalText);
      toast.success('Tarea creada correctamente con IA.');
      setNaturalText('');
      fetchTasks();
      // Cerrar el modal al crear la tarea correctamente
      onClose();
    } catch (error) {
      toast.error('Error al crear la tarea con IA.');
    } finally {
      setLoading(false);
    }
  };

  const handleChat = async () => {
    if (!chatMessage.trim()) return;

    const userMessage = chatMessage;
    setChatMessage('');
    const previousHistory = chatHistory;
    setChatHistory([...previousHistory, { role: 'user', content: userMessage }]);

    setLoading(true);
    try {
      // Enviamos el historial previo (sin el último mensaje) para que el backend mantenga contexto
      const response = await aiService.chat(userMessage, null, previousHistory);
      setChatHistory((prev) => [...prev, { role: 'assistant', content: response.response }]);
    } catch (error) {
      setChatHistory((prev) => [
        ...prev,
        { role: 'assistant', content: 'Lo siento, hubo un error. Intenta de nuevo.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-lg max-w-3xl w-full h-[680px] flex flex-col border border-slate-200 dark:border-slate-700 animate-scale-in">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <FaRobot className="text-base" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                Asistente IA
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <FaStar className="text-[10px] text-amber-500" />
                Sugerencias para tus tareas
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors p-2 rounded-lg"
          >
            <FaTimes className="text-lg" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
          <button
            onClick={() => setActiveTab('natural')}
            className={`flex-1 px-4 py-2.5 text-sm font-medium flex items-center justify-center gap-2 border-b-2 ${
              activeTab === 'natural'
                ? 'border-indigo-600 text-slate-900 dark:text-slate-50 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <FaMagic className="text-xs" /> Lenguaje natural
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 px-4 py-2.5 text-sm font-medium flex items-center justify-center gap-2 border-b-2 ${
              activeTab === 'chat'
                ? 'border-indigo-600 text-slate-900 dark:text-slate-50 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <FaComments className="text-xs" /> Chat
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          {activeTab === 'natural' && (
            <div className="space-y-5">
              <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2 text-sm">
                  <FaMagic className="text-indigo-500" /> ¿Cómo funciona?
                </h3>
                <p className="text-sm text-slate-700 dark:text-slate-300 mb-3 leading-relaxed">
                  Escribe lo que necesitas hacer en lenguaje natural y la IA lo convertirá en una tarea estructurada automáticamente.
                </p>
                <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                  <p className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2">
                    <FaLightbulb className="text-amber-500" />
                    <span>Ejemplo: "Necesito hacer una reunión mañana a las 3pm con el equipo de desarrollo"</span>
                  </p>
                </div>
              </div>

              <textarea
                value={naturalText}
                onChange={(e) => setNaturalText(e.target.value)}
                rows={6}
                className="input-field font-medium"
                placeholder="Escribe tu tarea en lenguaje natural..."
              />

              <button
                onClick={handleNaturalLanguage}
                disabled={loading || !naturalText.trim()}
                className="w-full btn-primary disabled:opacity-60 flex items-center justify-center gap-2 group"
              >
                <FaMagic className={loading ? 'animate-spin' : 'group-hover:scale-110 transition-transform'} />
                {loading ? 'Creando tarea...' : 'Crear tarea con IA'}
              </button>
            </div>
          )}

          {activeTab === 'chat' && (
            <div className="flex flex-col h-full">
              {/* Chat history */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-5 scrollbar-hide">
                {chatHistory.length === 0 && (
                  <div className="text-center text-slate-500 dark:text-slate-400 mt-16">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
                      <FaRobot className="text-xl text-slate-600 dark:text-slate-200" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-1">
                      Asistente de tareas
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Pregúntame sobre productividad, organización o tus tareas actuales.
                    </p>
                  </div>
                )}
                
                {chatHistory.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}
                  >
                    <div
                      className={`max-w-[85%] p-4 rounded-2xl shadow-lg ${
                        msg.role === 'user'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100'
                      }`}
                    >
                      {msg.role === 'user' ? (
                        <p className="leading-relaxed whitespace-pre-wrap text-sm font-medium">{msg.content}</p>
                      ) : (
                        <div 
                          className="formatted-message text-sm font-medium"
                          dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
                        />
                      )}
                    </div>
                  </div>
                ))}
                
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-2xl text-xs text-slate-600 dark:text-slate-300">
                      La IA está escribiendo...
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="flex gap-3">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleChat()}
                  className="input-field flex-1 font-medium"
                  placeholder="Escribe tu pregunta..."
                />
                <button
                  onClick={handleChat}
                  disabled={loading || !chatMessage.trim()}
                  className="btn-primary flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed px-4 py-3"
                >
                  <FaPaperPlane />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;


