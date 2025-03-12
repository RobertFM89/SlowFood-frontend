import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/auth.context";
import recipeService from "../../services/recipe.service";
import RecipeForm from "../../components/RecipeForm/RecipeForm";

function EditRecipePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // Cargar los datos de la receta
  useEffect(() => {
    setLoading(true);
    recipeService.getOne(id)
      .then((response) => {
        const recipeData = response.data;
        
        // Verificar si el usuario es el autor de la receta
        if (!user || user._id !== recipeData.author._id) {
          navigate(`/recipes/${id}`);
          return;
        }
        
        setRecipe(recipeData);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setErrorMessage("No se pudo cargar la receta");
        setLoading(false);
        navigate(`/recipes/${id}`);
      });
  }, [id, user, navigate]);

  const handleUpdateRecipe = (recipeData) => {
    return recipeService.updateRecipe(id, recipeData)
      .then(() => {
        navigate(`/recipes/${id}`);
      });
  };

  // Si hay un error o está cargando, mostrar un mensaje apropiado
  if (errorMessage) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-red-600">{errorMessage}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        <div className="bg-blue-600 px-6 py-4">
          <h1 className="text-2xl font-bold text-white">Editar Receta</h1>
        </div>
        
        <RecipeForm 
          initialData={recipe}
          onSubmit={handleUpdateRecipe} 
          isEditing={true}
          isLoading={loading}
          cancelUrl={`/recipes/${id}`}
        />
      </div>
    </div>
  );
}

export default EditRecipePage;