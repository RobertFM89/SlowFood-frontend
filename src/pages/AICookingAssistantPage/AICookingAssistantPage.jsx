import { useState } from "react";
import { Link } from "react-router-dom";
import aiService from "../../services/ai.service";

function AICookingAssistantPage() {
  const [ingredients, setIngredients] = useState("");
  const [preferences, setPreferences] = useState({
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    lactoseFree: false
  });
  const [ingredient, setIngredient] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("recipes"); // "recipes" o "ingredients"
  
  const handlePreferenceChange = (e) => {
    const { name, checked } = e.target;
    setPreferences(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  const handleSuggestRecipes = async (e) => {
    e.preventDefault();
    if (!ingredients.trim()) return;
    
    setLoading(true);
    setError("");
    setResult(null);
    
    // Convertir string a array
    const ingredientsList = ingredients.split(',')
      .map(i => i.trim())
      .filter(i => i);
    
    try {
      const response = await aiService.suggestRecipes(ingredientsList, preferences);
      
      if (response.data.success) {
        setResult({
          type: "recipes",
          data: response.data.data
        });
      } else {
        throw new Error(response.data.message || "Error al sugerir recetas");
      }
    } catch (error) {
      console.error("Error al sugerir recetas:", error);
      setError("No se pudieron sugerir recetas. Por favor, intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleGetIngredientInfo = async (e) => {
    e.preventDefault();
    if (!ingredient.trim()) return;
    
    setLoading(true);
    setError("");
    setResult(null);
    
    try {
      const response = await aiService.getIngredientInfo(ingredient);
      
      if (response.data.success) {
        setResult({
          type: "ingredient",
          data: response.data.data
        });
      } else {
        throw new Error(response.data.message || "Error al obtener información del ingrediente");
      }
    } catch (error) {
      console.error("Error al obtener información:", error);
      setError("No se pudo obtener información. Por favor, intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-green-50 py-10 pt-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800">Asistente Culinario IA</h1>
          <p className="mt-3 text-gray-600">
            Explora recetas, descubre información sobre ingredientes y mejora tus habilidades culinarias con ayuda de IA.
          </p>
        </div>
        
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="flex border-b">
            <button
              className={`flex-1 py-3 font-medium text-sm ${
                activeTab === "recipes" 
                  ? "text-green-600 border-b-2 border-green-500" 
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("recipes")}
            >
              Sugerencias de Recetas
            </button>
            <button
              className={`flex-1 py-3 font-medium text-sm ${
                activeTab === "ingredients" 
                  ? "text-green-600 border-b-2 border-green-500" 
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("ingredients")}
            >
              Información de Ingredientes
            </button>
          </div>
          
          <div className="p-6">
            {activeTab === "recipes" ? (
              <form onSubmit={handleSuggestRecipes}>
                <div className="mb-4">
                  <label htmlFor="ingredients" className="block text-sm font-medium text-gray-700 mb-2">
                    ¿Qué ingredientes tienes disponibles?
                  </label>
                  <textarea
                    id="ingredients"
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    rows="3"
                    placeholder="Ej: pollo, arroz, cebolla, pimiento (separados por comas)"
                    disabled={loading}
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <span className="block text-sm font-medium text-gray-700 mb-2">
                    Preferencias dietéticas (opcional)
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="vegetarian"
                        name="vegetarian"
                        checked={preferences.vegetarian}
                        onChange={handlePreferenceChange}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        disabled={loading}
                      />
                      <label htmlFor="vegetarian" className="ml-2 block text-sm text-gray-700">
                        Vegetariano
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="vegan"
                        name="vegan"
                        checked={preferences.vegan}
                        onChange={handlePreferenceChange}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        disabled={loading}
                      />
                      <label htmlFor="vegan" className="ml-2 block text-sm text-gray-700">
                        Vegano
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="glutenFree"
                        name="glutenFree"
                        checked={preferences.glutenFree}
                        onChange={handlePreferenceChange}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        disabled={loading}
                      />
                      <label htmlFor="glutenFree" className="ml-2 block text-sm text-gray-700">
                        Sin gluten
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="lactoseFree"
                        name="lactoseFree"
                        checked={preferences.lactoseFree}
                        onChange={handlePreferenceChange}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        disabled={loading}
                      />
                      <label htmlFor="lactoseFree" className="ml-2 block text-sm text-gray-700">
                        Sin lactosa
                      </label>
                    </div>
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={loading || !ingredients.trim()}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Generando sugerencias..." : "Sugerir Recetas"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleGetIngredientInfo}>
                <div className="mb-4">
                  <label htmlFor="ingredient" className="block text-sm font-medium text-gray-700 mb-2">
                    ¿Sobre qué ingrediente quieres información?
                  </label>
                  <input
                    type="text"
                    id="ingredient"
                    value={ingredient}
                    onChange={(e) => setIngredient(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    placeholder="Ej: tomates, quinoa, miel"
                    disabled={loading}
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={loading || !ingredient.trim()}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Buscando información..." : "Obtener Información"}
                </button>
              </form>
            )}
            
            {/* Mostrar error si existe */}
            {error && (
              <div className="mt-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700">
                <p>{error}</p>
              </div>
            )}
            
            {/* Mostrar resultados */}
            {result && (
              <div className="mt-6 border-t pt-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  {result.type === "recipes" ? "Sugerencias de Recetas" : "Información del Ingrediente"}
                </h2>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700">{result.data}</pre>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <Link to="/" className="text-green-600 hover:text-green-700">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AICookingAssistantPage;