import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/auth.context";
import recipeService from "../../services/recipe.service";

function RecipesPage() {
  const { isLoggedIn, user } = useContext(AuthContext);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (isLoggedIn) {
      fetchRecipes(currentPage);
    }
  }, [isLoggedIn, currentPage]);

  const fetchRecipes = (page) => {
    setLoading(true);
    recipeService.getMyRecipes(page)
      .then((response) => {
        setRecipes(response.data.recipes);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al cargar recetas:", error);
        setError("No se pudieron cargar tus recetas. Por favor, inténtalo de nuevo.");
        setLoading(false);
      });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleDeleteRecipe = (recipeId) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta receta? Esta acción no se puede deshacer.")) {
      recipeService.deleteRecipe(recipeId)
        .then(() => {
          // Actualizar la lista de recetas después de eliminar
          setRecipes(recipes.filter(recipe => recipe._id !== recipeId));
          
          // Si la página actual está vacía después de eliminar y hay más páginas, ir a la página anterior
          if (recipes.length === 1 && currentPage > 1) {
            setCurrentPage(currentPage - 1);
          } else {
            // De lo contrario, volver a cargar la página actual
            fetchRecipes(currentPage);
          }
        })
        .catch((error) => {
          console.error("Error al eliminar la receta:", error);
          alert("Ocurrió un error al eliminar la receta. Por favor, inténtalo de nuevo.");
        });
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center pt-16 px-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Acceso restringido</h2>
          <p className="text-gray-600 mb-6">Necesitas iniciar sesión para ver tus recetas.</p>
          <Link 
            to="/login" 
            className="inline-block bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
          >
            Iniciar Sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mt-8">
          <h1 className="text-3xl font-bold text-gray-900">Mis Recetas</h1>
          <Link 
            to="/recipes/create"
            className="flex items-center bg-emerald-600 text-white px-5 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Crear Nueva Receta
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
            {error}
          </div>
        ) : recipes.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">No tienes recetas todavía</h2>
            <p className="text-gray-600 mb-6">¡Comparte tu primera receta con la comunidad!</p>
            <Link 
              to="/recipes/create"
              className="inline-block bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
            >
              Crear mi primera receta
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((recipe) => (
                <div 
                  key={recipe._id} 
                  className="bg-white rounded-lg overflow-hidden shadow-md transition-all duration-200 hover:shadow-lg"
                >
                  <Link to={`/recipes/${recipe._id}`} className="block relative h-48 overflow-hidden">
                    <img 
                      src={recipe.image || "https://via.placeholder.com/600x400?text=No+Image"} 
                      alt={recipe.title} 
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    {recipe.vegetarian && (
                      <span className="absolute top-2 left-2 bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                        Vegetariana
                      </span>
                    )}
                    {recipe.vegan && (
                      <span className="absolute top-2 left-[110px] bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                        Vegana
                      </span>
                    )}
                  </Link>
                  <div className="p-5">
                    <Link to={`/recipes/${recipe._id}`}>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-emerald-600 transition-colors">
                        {recipe.title}
                      </h3>
                    </Link>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {recipe.glutenFree && (
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                          Sin Gluten
                        </span>
                      )}
                      {recipe.lactoseFree && (
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                          Sin Lactosa
                        </span>
                      )}
                      <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                        {recipe.difficulty}
                      </span>
                      <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
                        {recipe.time} min
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                        <span className="ml-1 text-gray-500">{recipe.likes?.length || 0}</span>
                      </div>
                      <div className="flex space-x-2">
                        <Link 
                          to={`/recipes/edit/${recipe._id}`}
                          className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </Link>
                        <button 
                          onClick={() => handleDeleteRecipe(recipe._id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-10">
                <nav className="inline-flex rounded-md shadow-sm">
                  <button
                    onClick={() => handlePageChange(currentPage > 1 ? currentPage - 1 : 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-2 rounded-l-md border ${
                      currentPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-emerald-600 hover:bg-emerald-50'
                    }`}
                  >
                    Anterior
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, index) => (
                    <button
                      key={index}
                      onClick={() => handlePageChange(index + 1)}
                      className={`px-4 py-2 border-t border-b ${
                        currentPage === index + 1
                          ? 'bg-emerald-500 text-white'
                          : 'bg-white text-emerald-600 hover:bg-emerald-50'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => handlePageChange(currentPage < totalPages ? currentPage + 1 : totalPages)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-2 rounded-r-md border ${
                      currentPage === totalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-emerald-600 hover:bg-emerald-50'
                    }`}
                  >
                    Siguiente
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default RecipesPage;