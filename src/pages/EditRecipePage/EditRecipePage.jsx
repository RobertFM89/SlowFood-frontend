import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/auth.context";
import recipeService from "../../services/recipe.service";

function EditRecipePage() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [glutenFree, setGlutenFree] = useState(false);
  const [lactoseFree, setLactoseFree] = useState(false);
  const [time, setTime] = useState("");
  const [flavor, setFlavor] = useState("");
  const [beveragePairing, setBeveragePairing] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [imageMethod, setImageMethod] = useState("upload");
  const [loading, setLoading] = useState(true);

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Cargar los datos de la receta
  useEffect(() => {
    setLoading(true);
    recipeService.getOne(id)
      .then((response) => {
        const recipe = response.data;
        
        // Verificar si el usuario es el autor de la receta
        if (!user || user._id !== recipe.author._id) {
          navigate(`/recipes/${id}`);
          return;
        }
        
        setTitle(recipe.title || "");
        setIngredients(recipe.ingredients ? recipe.ingredients.join(", ") : "");
        setInstructions(recipe.instructions || "");
        setCuisine(recipe.cuisine || "");
        setGlutenFree(recipe.glutenFree || false);
        setLactoseFree(recipe.lactoseFree || false);
        setTime(recipe.time ? recipe.time.toString() : "");
        setFlavor(recipe.flavor || "");
        setBeveragePairing(recipe.beveragePairing || "");
        setDifficulty(recipe.difficulty || "");
        setImageUrl(recipe.image || "");
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        navigate(`/recipes/${id}`);
      });
  }, [id, user, navigate]);

  const handleFileUpload = (e) => {
    const uploadData = new FormData();
    uploadData.append("imageUrl", e.target.files[0]);

    setIsUploading(true);

    recipeService
      .uploadImage(uploadData)
      .then((response) => {
        setImageUrl(response.data.fileUrl);
        setIsUploading(false);
      })
      .catch((err) => {
        console.log("Error while uploading the image: ", err);
        setIsUploading(false);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    const updatedRecipe = {
      title,
      ingredients: ingredients.split(",").map(item => item.trim()),
      instructions,
      cuisine,
      glutenFree,
      lactoseFree,
      time: parseInt(time),
      flavor,
      beveragePairing,
      difficulty,
      image: imageUrl,
    };

    recipeService.updateRecipe(id, updatedRecipe)
      .then(() => {
        navigate(`/recipes/${id}`);
      })
      .catch((error) => {
        console.log(error);
        setErrorMessage("Hubo un error al actualizar la receta. Por favor, inténtelo de nuevo.");
        setIsSubmitting(false);
      });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        <div className="bg-blue-600 px-6 py-4">
          <h1 className="text-2xl font-bold text-white">Editar Receta</h1>
        </div>
        
        <div className="p-6">
          {errorMessage && (
            <div className="mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
              <p>{errorMessage}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Título <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                id="title"
                required
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ej: Paella Valenciana"
              />
            </div>

            {/* Sección de imagen con opciones */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imagen de la receta
              </label>
              
              <div className="flex space-x-4 mb-4">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="upload-option"
                    name="image-method"
                    value="upload"
                    checked={imageMethod === "upload"}
                    onChange={() => setImageMethod("upload")}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="upload-option" className="ml-2 block text-sm text-gray-700">
                    Subir archivo
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="url-option"
                    name="image-method"
                    value="url"
                    checked={imageMethod === "url"}
                    onChange={() => setImageMethod("url")}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="url-option" className="ml-2 block text-sm text-gray-700">
                    Añadir URL
                  </label>
                </div>
              </div>

              {imageUrl && (
                <div className="mb-4">
                  <div className="relative inline-block">
                    <img 
                      src={imageUrl} 
                      alt="Vista previa de la receta" 
                      className="h-40 w-40 object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => setImageUrl("")}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 shadow-md"
                      title="Eliminar imagen"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              {imageMethod === "upload" ? (
                <div className="mt-1">
                  <div className="flex justify-center items-center w-full">
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <span>{isUploading ? "Subiendo..." : "Seleccionar archivo"}</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={handleFileUpload}
                        disabled={isUploading}
                      />
                    </label>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    PNG, JPG, GIF hasta 5MB. Recomendado: Imagen cuadrada de 800x800 píxeles.
                  </p>
                </div>
              ) : (
                <div className="mt-1">
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://ejemplo.com/imagen.jpg"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    Ingrese la URL de una imagen existente en internet
                  </p>
                </div>
              )}
            </div>

           
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="cuisine" className="block text-sm font-medium text-gray-700">
                Tipo de Cocina <span className="text-red-500">*</span>
              </label>
              <select
                id="cuisine"
                required
                value={cuisine}
                onChange={(e) => setCuisine(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Seleccione una opción</option>
                <option value="vegetariana">Vegetariana</option>
                <option value="vegana">Vegana</option>
                <option value="carnivora">Carnívora</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                Tiempo (minutos) <span className="text-red-500">*</span>
              </label>
              <input 
                type="number" 
                id="time"
                required
                min="1"
                value={time} 
                onChange={(e) => setTime(e.target.value)} 
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ej: 30"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="flavor" className="block text-sm font-medium text-gray-700">
                Sabor <span className="text-red-500">*</span>
              </label>
              <select
                id="flavor"
                required
                value={flavor}
                onChange={(e) => setFlavor(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Seleccione una opción</option>
                <option value="dulce">Dulce</option>
                <option value="salado">Salado</option>
                <option value="agridulce">Agridulce</option>
                <option value="picante">Picante</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700">
                Dificultad <span className="text-red-500">*</span>
              </label>
              <select
                id="difficulty"
                required
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Seleccione una opción</option>
                <option value="facil">Fácil</option>
                <option value="media">Media</option>
                <option value="dificil">Difícil</option>
                <option value="masterchef">Masterchef</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="beveragePairing" className="block text-sm font-medium text-gray-700">
              Maridaje de Bebidas <span className="text-red-500">*</span>
            </label>
            <select
              id="beveragePairing"
              required
              value={beveragePairing}
              onChange={(e) => setBeveragePairing(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Seleccione una opción</option>
              <option value="vino blanco">Vino Blanco</option>
              <option value="vino rosado">Vino Rosado</option>
              <option value="vino tinto">Vino Tinto</option>
              <option value="cerveza">Cerveza</option>
              <option value="Clipper">Clipper</option>
              <option value="té">Té</option>
              <option value="cafe">Café</option>
              <option value="licor">Licor</option>
              <option value="cocktail">Cóctel</option>
            </select>
          </div>

          <div>
            <label htmlFor="ingredients" className="block text-sm font-medium text-gray-700">
              Ingredientes <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-500 mt-1">Separados por comas (ej: 2 huevos, 100g harina, 1 cucharada de sal)</p>
            <textarea 
              id="ingredients"
              required
              value={ingredients} 
              onChange={(e) => setIngredients(e.target.value)} 
              rows="3"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ingrediente 1, Ingrediente 2, Ingrediente 3..."
            />
          </div>

          <div>
            <label htmlFor="instructions" className="block text-sm font-medium text-gray-700">
              Instrucciones <span className="text-red-500">*</span>
            </label>
            <textarea 
              id="instructions"
              required
              value={instructions} 
              onChange={(e) => setInstructions(e.target.value)} 
              rows="6"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Descripción detallada de cómo preparar la receta..."
            />
          </div>

          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="glutenFree"
                checked={glutenFree} 
                onChange={(e) => setGlutenFree(e.target.checked)} 
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="glutenFree" className="ml-2 block text-sm text-gray-700">
                Sin Gluten
              </label>
            </div>

            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="lactoseFree"
                checked={lactoseFree} 
                onChange={(e) => setLactoseFree(e.target.checked)} 
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="lactoseFree" className="ml-2 block text-sm text-gray-700">
                Sin Lactosa
              </label>
            </div>
          </div>

          <div className="flex justify-end pt-5">
            <button
              type="button"
              onClick={() => navigate(`/recipes/${id}`)}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-4"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${(isSubmitting || isUploading) ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Actualizando...
                </>
              ) : 'Guardar Cambios'}
            </button>
          </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditRecipePage;