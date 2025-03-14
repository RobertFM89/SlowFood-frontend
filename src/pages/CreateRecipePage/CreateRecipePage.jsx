import { useNavigate } from "react-router-dom";
import recipeService from "../../services/recipe.service";
import RecipeForm from "../../components/RecipeForm/RecipeForm";

function CreateRecipePage() {
  const navigate = useNavigate(); // Corregir: agregar los paréntesis para invocar el hook

  const handleCreateRecipe = async (recipeData) => {
    // Eliminar async ya que vamos a usar promesas con then/catch para consistencia
    const response = await recipeService.createRecipe(recipeData);
    navigate(`/recipes/${response.data._id}`);
    return response;
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        <div className="bg-blue-600 px-6 py-4">
          <h1 className="text-2xl font-bold text-white">Crear Nueva Receta</h1>
        </div>
        
        <RecipeForm 
          onSubmit={handleCreateRecipe} 
          isEditing={false}
          cancelUrl="/"
        />
      </div>
    </div>
  );
}

export default CreateRecipePage;