import { useState, useEffect, useRef, useContext } from "react";
import { Link } from "react-router-dom";
import aiService from "../../services/ai.service";
import { AuthContext } from "../../context/auth.context";

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      role: "assistant", 
      content: "¡Hola! Soy tu asistente culinario. Puedo ayudarte con recetas, ingredientes, técnicas de cocina y más. ¿En qué puedo ayudarte hoy?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);
  const { isLoggedIn } = useContext(AuthContext);
  
  // Auto-scroll al fondo del chat cuando hay nuevos mensajes
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);
  
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    if (!isLoggedIn) {
      setError("Por favor, inicia sesión para usar el chatbot");
      return;
    }
    
    // Añadir el mensaje del usuario al chat
    const userMessage = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    
    // Limpiar input y preparar para la respuesta
    setInput("");
    setIsLoading(true);
    setError("");
    
    try {
      // Crear un historial compatible con la API
      // Extraemos solo los mensajes que son relevantes (omitiendo el mensaje de bienvenida)
      // Y convertimos los roles para que sean compatibles con la API
      const apiHistory = [];
      
      // Para asegurarnos que solo enviamos pares completos de mensajes
      const relevantMessages = messages.length > 1 ? messages.slice(1) : [];
      
      // Añadir el mensaje actual al final
      const allMessages = [...relevantMessages, userMessage];
      
      // Solo enviamos mensajes del usuario (la API de Gemini require que empiece con un mensaje de usuario)
      // Limitamos a los últimos 3 mensajes del usuario para no sobrecargar el contexto
      for (let i = 0; i < allMessages.length; i++) {
        if (allMessages[i].role === "user") {
          apiHistory.push({
            role: "user",
            content: allMessages[i].content
          });
          
          // Si hay una respuesta del asistente después de este mensaje, la incluimos
          if (i+1 < allMessages.length && allMessages[i+1].role === "assistant") {
            apiHistory.push({
              role: "model",  // Importante: para la API de Gemini debe ser "model", no "assistant"
              content: allMessages[i+1].content
            });
          }
        }
      }
      
      // Limitamos a los últimos 6 mensajes (3 intercambios)
      const recentApiHistory = apiHistory.slice(-6);
      
      // Enviar solo el mensaje actual, sin historial, si el historial está vacío o es inválido
      const response = await aiService.chat(input, recentApiHistory.length >= 2 ? recentApiHistory : []);
      
      if (response.data.success) {
        // Añadir respuesta del asistente al chat
        const assistantMessage = { 
          role: "assistant", 
          content: response.data.data 
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error(response.data.message || "Error en la respuesta del asistente");
      }
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
      setError("No se pudo conectar con el asistente. Por favor, intenta de nuevo más tarde.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleChatbot = () => {
    setIsOpen(prev => !prev);
  };
  
  const handleIngredientInfo = async (ingredient) => {
    if (!isLoggedIn) {
      setError("Por favor, inicia sesión para usar esta función");
      return;
    }
    
    // Añadir mensaje del usuario
    const userMessage = { 
      role: "user", 
      content: `Información sobre el ingrediente: ${ingredient}` 
    };
    setMessages(prev => [...prev, userMessage]);
    
    setIsLoading(true);
    setError("");
    
    try {
      const response = await aiService.getIngredientInfo(ingredient);
      
      if (response.data.success) {
        // Añadir respuesta del asistente al chat
        const assistantMessage = { 
          role: "assistant", 
          content: response.data.data 
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error(response.data.message || "Error al obtener información del ingrediente");
      }
    } catch (error) {
      console.error("Error al obtener información:", error);
      setError("No se pudo obtener información. Por favor, intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSuggestRecipes = async (ingredients) => {
    if (!isLoggedIn) {
      setError("Por favor, inicia sesión para usar esta función");
      return;
    }
    
    // Convertir string a array si es necesario
    const ingredientsList = typeof ingredients === 'string' 
      ? ingredients.split(',').map(i => i.trim()) 
      : ingredients;
    
    // Añadir mensaje del usuario
    const userMessage = { 
      role: "user", 
      content: `Sugerir recetas con: ${ingredientsList.join(', ')}` 
    };
    setMessages(prev => [...prev, userMessage]);
    
    setIsLoading(true);
    setError("");
    
    try {
      const response = await aiService.suggestRecipes(ingredientsList);
      
      if (response.data.success) {
        // Añadir respuesta del asistente al chat
        const assistantMessage = { 
          role: "assistant", 
          content: response.data.data 
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error(response.data.message || "Error al sugerir recetas");
      }
    } catch (error) {
      console.error("Error al sugerir recetas:", error);
      setError("No se pudieron sugerir recetas. Por favor, intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const quickQuestions = [
    "¿Qué puedo cocinar con pollo y arroz?",
    "¿Cómo puedo sustituir la mantequilla?",
    "Consejos para cortar cebollas sin llorar",
    "¿Cuál es la temperatura ideal para cocinar pescado?"
  ];
  
  return (
    <>
      {/* Botón flotante para abrir el chatbot */}
      <button 
        onClick={toggleChatbot}
        className="fixed bottom-6 right-6 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition-all duration-300 z-50 flex items-center justify-center"
        aria-label="Abrir asistente culinario"
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>
      
      {/* Ventana del chatbot */}
      <div 
        className={`fixed bottom-20 right-6 w-96 bg-white rounded-lg shadow-xl z-50 transition-all duration-300 transform ${
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
        } flex flex-col max-h-[80vh]`}
      >
        {/* Cabecera del chatbot */}
        <div className="bg-green-600 text-white px-4 py-3 rounded-t-lg flex justify-between items-center">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <h3 className="font-medium">Asistente Culinario</h3>
          </div>
          <button 
            onClick={toggleChatbot}
            className="text-white hover:text-gray-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Contenido del chat */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[50vh]">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div 
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === "user" 
                    ? "bg-green-100 text-gray-800" 
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                <p className="whitespace-pre-wrap text-sm">{message.content}</p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg p-3 bg-gray-100">
                <div className="flex space-x-1">
                  <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: "0.2s"}}></div>
                  <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: "0.4s"}}></div>
                </div>
              </div>
            </div>
          )}
          
          {error && (
            <div className="flex justify-center">
              <div className="max-w-[90%] rounded-lg p-3 bg-red-100 text-red-700 text-sm">
                {error}
                {!isLoggedIn && (
                  <div className="mt-2">
                    <Link to="/login" className="text-blue-600 hover:underline">
                      Iniciar sesión
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Sugerencias rápidas */}
        {messages.length <= 2 && (
          <div className="px-4 py-2 bg-gray-50">
            <p className="text-xs text-gray-500 mb-2">Prueba estas preguntas:</p>
            <div className="flex flex-wrap gap-2 mb-2">
              {quickQuestions.map((question, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInput(question);
                    // No enviamos automáticamente para que el usuario pueda modificar si quiere
                  }}
                  className="text-xs bg-gray-200 hover:bg-gray-300 rounded-full px-2 py-1 text-gray-700"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Entrada de texto */}
        <form onSubmit={handleSendMessage} className="border-t p-3 flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu pregunta sobre cocina..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-green-500 text-sm"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-green-600 text-white px-4 py-2 rounded-r-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
      </div>
    </>
  );
}

export default Chatbot;