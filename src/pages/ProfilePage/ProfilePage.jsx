import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/auth.context";
import recipeService from "../../services/recipe.service";
import { Link } from "react-router-dom";

function ProfilePage() {
  const { user, isLoggedIn } = useContext(AuthContext);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("myRecipes"); // "myRecipes" o "saved"

  useEffect(() => {
    if (!isLoggedIn || !user) {
      setLoading(false);
      return;
    }

    setLoading(true);

    recipeService.getRecipesByAuthor(user._id)
      .then((response) => {
        setRecipes(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log("Error fetching user recipes:", error);
        setLoading(false);
      });
  }, [user, isLoggedIn]);

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Sección de cabecera del perfil */}
        <div className="bg-white shadow rounded-lg mb-6 overflow-hidden">
          <div className="bg-blue-600 h-32 w-full"></div>
          <div className="relative px-6 pb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-16 sm:-mt-12 mb-4 sm:mb-0">
              <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-full border-4 border-white bg-gray-200 overflow-hidden shadow-md">
                <img
                  src={user?.profileImage || "https://via.placeholder.com/150?text=Chef"}
                  alt={user?.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left">
                <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
                <p className="text-gray-600">{user?.email}</p>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Editar perfil
              </button>
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white shadow rounded-lg p-6 flex flex-col items-center">
            <span className="text-3xl font-bold text-blue-600">{recipes.length}</span>
            <span className="text-gray-600">Recetas creadas</span>
          </div>
          <div className="bg-white shadow rounded-lg p-6 flex flex-col items-center">
            <span className="text-3xl font-bold text-blue-600">0</span>
            <span className="text-gray-600">Seguidores</span>
          </div>
          <div className="bg-white shadow rounded-lg p-6 flex flex-col items-center">
            <span className="text-3xl font-bold text-blue-600">0</span>
            <span className="text-gray-600">Siguiendo</span>
          </div>
        </div>

        {/* Pestañas */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab("myRecipes")}
              className={`flex-1 py-4 px-6 text-center font-medium ${
                activeTab === "myRecipes"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Mis recetas
            </button>
            <button
              onClick={() => setActiveTab("saved")}
              className={`flex-1 py-4 px-6 text-center font-medium ${
                activeTab === "saved"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Recetas guardadas
            </button>
          </div>
          
          {/* Contenido de las pestañas */}
          <div className="p-6">
            {activeTab === "myRecipes" ? (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Mis recetas</h2>
                  <Link
                    to="/recipes/create"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Crear nueva receta
                  </Link>
                </div>

                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : recipes.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recipes.map((recipe) => (
                      <div key={recipe._id} className="bg-gray-50 rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow">
                        <div className="h-40 bg-gray-200 overflow-hidden">
                          <img
                            src={recipe.image || "https://via.placeholder.com/300x200?text=Food"}
                            alt={recipe.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <Link to={`/recipes/${recipe._id}`}>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600">{recipe.title}</h3>
                          </Link>
                          <div className="flex flex-wrap gap-2 mb-3">
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">{recipe.cuisine}</span>
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">{recipe.difficulty}</span>
                            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">{recipe.time} min</span>
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {recipe.ingredients.slice(0, 3).join(", ")}
                            {recipe.ingredients.length > 3 ? "..." : ""}
                          </p>
                          <div className="mt-3 flex justify-between items-center">
                            <div className="flex items-center text-sm text-gray-500">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                              </svg>
                              {recipe.likes ? recipe.likes.length : 0}
                            </div>
                            <div className="flex space-x-2">
                              <Link
                                to={`/recipes/edit/${recipe._id}`}
                                className="text-sm text-blue-600 hover:text-blue-800"
                              >
                                Editar
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p className="mt-4 text-lg text-gray-600">Aún no has creado ninguna receta</p>
                    <Link
                      to="/recipes/create"
                      className="mt-4 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Crear mi primera receta
                    </Link>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                <p className="mt-4 text-lg text-gray-600">No tienes recetas guardadas</p>
                <Link
                  to="/"
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Explorar recetas
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
