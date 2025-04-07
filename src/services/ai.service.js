import axios from "axios";

class AIService {
  constructor() {
    this.api = axios.create({
      baseURL: process.env.REACT_APP_SERVER_URL || "http://localhost:5005",
    });

    // Automáticamente añadir token JWT en los headers para cada petición
    this.api.interceptors.request.use((config) => {
      const storedToken = localStorage.getItem("authToken");
      if (storedToken) {
        config.headers = { Authorization: `Bearer ${storedToken}` };
      }
      return config;
    });
  }

  // Chatbot de recetas
  chat = (message, history = []) => {
    console.log("Enviando mensaje:", message);
    console.log("Historial:", history);
    return this.api.post("/api/ai/chat", { message, history });
  };

  // Información sobre ingredientes
  getIngredientInfo = (ingredient) => {
    return this.api.post("/api/ai/ingredient-info", { ingredient });
  };

  // Sugerir recetas basadas en ingredientes disponibles
  suggestRecipes = (ingredients, preferences = {}) => {
    return this.api.post("/api/ai/suggest-recipes", { ingredients, preferences });
  };
}

const aiService = new AIService();
export default aiService;