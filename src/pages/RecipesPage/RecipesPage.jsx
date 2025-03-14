import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/auth.context";
import recipeService from "../../services/recipe.service";

function RecipesPage() {
  const { isLoggedIn } = useContext(AuthContext);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Filtros
  const [filters, setFilters] = useState({
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    lactoseFree: false
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchRecipes(currentPage);
  }, [currentPage, filters]);

  const fetchRecipes = (page) => {
    setLoading(true);
    
    // Construir parámetros de consulta para los filtros
    const queryParams = new URLSearchParams();
    queryParams.append('page', page);
    queryParams.append('limit', 9);
    
    // Añadir filtros si están activados
    if (filters.vegetarian) queryParams.append('vegetarian', 'true');
    if (filters.vegan) queryParams.append('vegan', 'true');
    if (filters.glutenFree) queryParams.append('glutenFree', 'true');
    if (filters.lactoseFree) queryParams.append('lactoseFree', 'true');
    
    recipeService.getAllWithFilters(queryParams.toString())
      .then((response) => {
        setRecipes(response.data.recipes);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching recipes:", error);
        setError("Error al cargar las recetas. Por favor, inténtalo de nuevo.");
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
          setRecipes(recipes.filter(recipe => recipe._id !== recipeId));
          
          if (recipes.length === 1 && currentPage > 1) {
            setCurrentPage(currentPage - 1);
          } else {
            fetchRecipes(currentPage);
          }
        })
        .catch((error) => {
          console.error("Error al eliminar la receta:", error);
          alert("Ocurrió un error al eliminar la receta. Por favor, inténtalo de nuevo.");
        });
    }
  };
  
  const handleFilterChange = (filterName) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterName]: !prevFilters[filterName]
    }));
    setCurrentPage(1); // Volver a la primera página cuando se cambia un filtro
  };
  
  const clearFilters = () => {
    setFilters({
      vegetarian: false,
      vegan: false,
      glutenFree: false,
      lactoseFree: false
    });
    setCurrentPage(1);
  };
  
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  const anyFilterActive = Object.values(filters).some(value => value);

  return (
    <div className="min-h-screen bg-green-50 py-8 px-4 sm:px-6 lg:px-8 pt-20">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Recetario</h1>
          <div className="flex space-x-2">
            <button
              onClick={toggleFilters}
              className="flex items-center bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
              </svg>
              Filtros
              {anyFilterActive && (
                <span className="ml-2 bg-emerald-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {Object.values(filters).filter(Boolean).length}
                </span>
              )}
            </button>
            
            <Link 
              to="/recipes/create"
              className="flex items-center bg-emerald-600 text-white px-5 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Crear Receta
            </Link>
          </div>
        </div>
        
        {/* Panel de filtros */}
        {showFilters && (
          <div className="bg-white p-4 mb-6 rounded-lg shadow animate-fadeIn">
            <div className="flex flex-wrap items-center gap-4">
              <div className="font-medium text-gray-700">Filtrar por:</div>
              
              <label className="inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox"
                  checked={filters.vegetarian}
                  onChange={() => handleFilterChange('vegetarian')}
                  className="form-checkbox h-5 w-5 text-emerald-600 rounded"
                />
                <span className="ml-2 text-gray-700">Vegetarianas</span>
              </label>
              
              <label className="inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox"
                  checked={filters.vegan}
                  onChange={() => handleFilterChange('vegan')}
                  className="form-checkbox h-5 w-5 text-emerald-600 rounded"
                />
                <span className="ml-2 text-gray-700">Veganas</span>
              </label>
              
              <label className="inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox"
                  checked={filters.glutenFree}
                  onChange={() => handleFilterChange('glutenFree')}
                  className="form-checkbox h-5 w-5 text-emerald-600 rounded"
                />
                <span className="ml-2 text-gray-700">Sin Gluten</span>
              </label>
              
              <label className="inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox"
                  checked={filters.lactoseFree}
                  onChange={() => handleFilterChange('lactoseFree')}
                  className="form-checkbox h-5 w-5 text-emerald-600 rounded"
                />
                <span className="ml-2 text-gray-700">Sin Lactosa</span>
              </label>
              
              {anyFilterActive && (
                <button 
                  onClick={clearFilters}
                  className="ml-auto text-sm text-red-600 hover:text-red-800 transition-colors"
                >
                  Limpiar filtros
                </button>
              )}
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md">
            <p>{error}</p>
          </div>
        ) : recipes.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="mt-4 text-xl font-semibold text-gray-900">No se encontraron recetas</h2>
            <p className="mt-2 text-gray-600">
              {anyFilterActive 
                ? "No hay recetas que coincidan con los filtros seleccionados." 
                : "Aún no has creado ninguna receta."}
            </p>
            <Link 
              to="/recipes/create"
              className="mt-6 inline-block bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
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

            {totalPages > 1 && (
              <div className="flex justify-center mt-10">
                <nav className="inline-flex rounded-md shadow">
                  <button
                    onClick={() => handlePageChange(currentPage > 1 ? currentPage - 1 : 1)}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-4 py-2 rounded-l-md border ${
                      currentPage === 1
                        ? 'bg-gray-100 text-gray-400'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Anterior
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => handlePageChange(i + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border-t border-b ${
                        currentPage === i + 1
                          ? 'bg-emerald-500 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(currentPage < totalPages ? currentPage + 1 : totalPages)}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-4 py-2 rounded-r-md border ${
                      currentPage === totalPages
                        ? 'bg-gray-100 text-gray-400'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
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