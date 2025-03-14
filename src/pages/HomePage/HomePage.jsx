import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/auth.context";
import recipeService from "../../services/recipe.service";
import userService from "../../services/user.service";
import { Link } from "react-router-dom";

function HomePage() {
  const { user, isLoggedIn } = useContext(AuthContext);
  const [recipes, setRecipes] = useState([]);
  const [randomRecipe, setRandomRecipe] = useState(null);
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    
    // Obtener una receta aleatoria para "La receta del día"
    recipeService.getRandomRecipe()
      .then((response) => {
        setRandomRecipe(response.data);
      })
      .catch((error) => {
        console.log("Error fetching random recipe:", error);
      });
    
    // Obtener todas las recetas con paginación
    fetchRecipes(currentPage);
    
    if (isLoggedIn) {
      userService.getUsersToFollow()
        .then((response) => setUsers(response.data))
        .catch((error) => console.log(error));
    }
  }, [isLoggedIn, currentPage]);

  const fetchRecipes = (page) => {
    recipeService.getAll(page, 9)
      .then((response) => {
        setRecipes(response.data.recipes);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      })
      .catch((error) => {
        console.log("Error fetching recipes:", error);
        setError("Error loading recipes. Please try again.");
        setLoading(false);
      });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0); // Volver al inicio de la página al cambiar de página
  };

  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center py-8">
      {isLoggedIn ? (
        <div className="bg-white shadow-md rounded-lg p-6 max-w-6xl w-full mx-4 my-5">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Explora Recetas</h1>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">{error}</div>
          ) : (
            <>
              {/* Sección de Receta del Día */}
              {randomRecipe && (
                <div className="mb-10">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V5z" clipRule="evenodd" />
                    </svg>
                    La Receta del Día
                  </h2>
                  
                  <div className="bg-gradient-to-r from-green-100 to-green-50 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <div className="flex flex-col lg:flex-row gap-8">
                      <div className="lg:w-1/2 h-80 overflow-hidden rounded-xl">
                        <img 
                          src={randomRecipe.image || "https://via.placeholder.com/600x400?text=No+Image"} 
                          alt={randomRecipe.title} 
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      
                      <div className="lg:w-1/2 flex flex-col justify-between">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-4">
                            <Link to={`/recipes/${randomRecipe._id}`} className="hover:text-blue-600 transition-colors">
                              {randomRecipe.title}
                            </Link>
                          </h3>
                          
                          <div className="flex flex-wrap gap-2 mb-4">
                            {randomRecipe.vegan && (
                              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                Vegana
                              </span>
                            )}
                            {randomRecipe.vegetarian && (
                              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                Vegetariana
                              </span>
                            )}
                            {randomRecipe.glutenFree && (
                              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                                Sin Gluten
                              </span>
                            )}
                            {randomRecipe.lactoseFree && (
                              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                Sin Lactosa
                              </span>
                            )}
                            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                              {randomRecipe.difficulty}
                            </span>
                            <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                              {randomRecipe.time} min
                            </span>
                          </div>
                          
                          <p className="text-gray-600 line-clamp-3 mb-4">
                            {randomRecipe.ingredients && randomRecipe.ingredients.slice(0, 5).join(", ")}
                            {randomRecipe.ingredients && randomRecipe.ingredients.length > 5 ? "..." : ""}
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          {randomRecipe.author && (
                            <p className="text-gray-500">
                              Por: {randomRecipe.author.name}
                            </p>
                          )}
                          <Link 
                            to={`/recipes/${randomRecipe._id}`}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
                          >
                            Ver receta completa
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Todas las recetas</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {recipes.map((recipe) => (
                  <div key={recipe._id} className="bg-white p-4 rounded-lg shadow-md transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
                    <div className="relative pb-3/4 h-48 mb-4 overflow-hidden rounded-md">
                      <img 
                        src={recipe.image || "https://via.placeholder.com/300x200?text=No+Image"} 
                        alt={recipe.title} 
                        className="absolute h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600">
                      <Link to={`/recipes/${recipe._id}`}>
                        {recipe.title}
                      </Link>
                    </h3>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {recipe.vegan && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                          Vegana
                        </span>
                      )}
                      {recipe.vegetarian && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                          Vegetariana
                        </span>
                      )}
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
                    </div>
                    
                    {recipe.author && (
                      <p className="text-sm text-gray-500">
                        Por: {recipe.author.name}
                      </p>
                    )}
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
                          : 'bg-white text-blue-600 hover:bg-blue-50'
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
                            ? 'bg-blue-500 text-white'
                            : 'bg-white text-blue-600 hover:bg-blue-50'
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
                          : 'bg-white text-blue-600 hover:bg-blue-50'
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
      ) : (
        <div className="text-center max-w-lg mx-auto px-4">
          <img
            className="w-80 h-80 mx-auto mb-8"
            src="/LogoSlowFood-modified.png"
            alt="SlowFood Logo"
            //onError={(e) => {e.target.src = "https://via.placeholder.com/150?text=SlowFood"}}
          />
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Bienvenidos a SlowFood</h1>
          <p className="text-xl text-gray-600 mb-8">Bienvenido a SlowFood, la comunidad donde la pasión por la gastronomía cobra vida. Conecta con chefs, cocineros aficionados y foodies de todo el mundo para compartir recetas, técnicas y secretos culinarios. Descubre platos auténticos, aprende de expertos y encuentra inspiración en cada publicación.

Únete a SlowFood y disfruta del arte de cocinar con calma, dedicación y amor. 🍽️🔥</p>
          <div className="flex justify-center space-x-6">
            <Link to="/signup" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Sign Up
            </Link>
            <Link to="/login" className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors">
              Login
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;