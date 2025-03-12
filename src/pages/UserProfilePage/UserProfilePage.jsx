import { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { AuthContext } from "../../context/auth.context";
import userService from "../../services/user.service";
import recipeService from "../../services/recipe.service";

function UserProfilePage() {
  const { userId } = useParams();
  const { user: currentUser, isLoggedIn } = useContext(AuthContext);
  
  const [userProfile, setUserProfile] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [followActionInProgress, setFollowActionInProgress] = useState(false);
  const [activeTab, setActiveTab] = useState("recipes");
  
  // Cargar datos del perfil, recetas y relaciones de seguimiento
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Obtener datos del perfil y recetas
        const [userResponse, recipesResponse] = await Promise.all([
          userService.getUser(userId),
          recipeService.getRecipesByAuthor(userId)
        ]);
        
        setUserProfile(userResponse.data);
        setRecipes(recipesResponse.data);
        
        // Obtener datos de seguidores y seguidos
        const [followersResponse, followingResponse] = await Promise.all([
          userService.getFollowers(userId),
          userService.getFollowing(userId)
        ]);
        
        setFollowers(followersResponse.data);
        setFollowing(followingResponse.data);
        
        // Verificar si el usuario actual sigue a este usuario
        if (isLoggedIn && currentUser) {
          const isAlreadyFollowing = followersResponse.data.some(
            follower => follower._id === currentUser._id
          );
          setIsFollowing(isAlreadyFollowing);
        }
        
        setLoading(false);
      } catch (error) {
        console.log("Error cargando el perfil:", error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, [userId, isLoggedIn, currentUser]);
  
  // Manejar seguir/dejar de seguir
  const handleFollowToggle = async () => {
    if (!isLoggedIn || followActionInProgress) return;
    
    try {
      setFollowActionInProgress(true);
      
      if (isFollowing) {
        // Dejar de seguir
        await userService.unfollowUser(userId);
        setFollowers(followers.filter(f => f._id !== currentUser._id));
      } else {
        // Seguir
        await userService.followUser(userId);
        setFollowers([...followers, currentUser]);
      }
      
      setIsFollowing(!isFollowing);
      setFollowActionInProgress(false);
    } catch (error) {
      console.log("Error al actualizar la relación de seguimiento:", error);
      setFollowActionInProgress(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-red-600">Usuario no encontrado</div>
      </div>
    );
  }

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
                  src={userProfile.profileImage || "https://via.placeholder.com/150?text=Chef"}
                  alt={userProfile.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left">
                <h1 className="text-2xl font-bold text-gray-900">{userProfile.name}</h1>
                <p className="text-gray-600">{userProfile.email}</p>
              </div>
            </div>
            
            {/* Botón de seguir/dejar de seguir */}
            {isLoggedIn && currentUser && currentUser._id !== userId && (
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleFollowToggle}
                  disabled={followActionInProgress}
                  className={`py-2 px-4 rounded-md font-medium flex items-center ${
                    followActionInProgress
                      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                      : isFollowing 
                        ? "bg-gray-200 text-gray-700 hover:bg-gray-300" 
                        : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  {followActionInProgress ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Procesando...
                    </>
                  ) : isFollowing ? "Dejar de seguir" : "Seguir"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white shadow rounded-lg p-6 flex flex-col items-center">
            <span className="text-3xl font-bold text-blue-600">{recipes.length}</span>
            <span className="text-gray-600">Recetas</span>
          </div>
          <div 
            className="bg-white shadow rounded-lg p-6 flex flex-col items-center cursor-pointer hover:bg-gray-50"
            onClick={() => setActiveTab("followers")}
          >
            <span className="text-3xl font-bold text-blue-600">{followers.length}</span>
            <span className="text-gray-600">Seguidores</span>
          </div>
          <div 
            className="bg-white shadow rounded-lg p-6 flex flex-col items-center cursor-pointer hover:bg-gray-50"
            onClick={() => setActiveTab("following")}
          >
            <span className="text-3xl font-bold text-blue-600">{following.length}</span>
            <span className="text-gray-600">Siguiendo</span>
          </div>
        </div>

        {/* Pestañas */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab("recipes")}
              className={`flex-1 py-4 px-6 text-center font-medium ${
                activeTab === "recipes"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Recetas
            </button>
            <button
              onClick={() => setActiveTab("followers")}
              className={`flex-1 py-4 px-6 text-center font-medium ${
                activeTab === "followers"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Seguidores
            </button>
            <button
              onClick={() => setActiveTab("following")}
              className={`flex-1 py-4 px-6 text-center font-medium ${
                activeTab === "following"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Siguiendo
            </button>
          </div>
          
          <div className="p-6">
            {activeTab === "recipes" && (
              <>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Recetas de {userProfile.name}</h2>
                
                {recipes.length > 0 ? (
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
                          <div className="mt-3 flex items-center text-sm text-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            {recipe.likes ? recipe.likes.length : 0}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-lg text-gray-600">Este usuario aún no ha publicado recetas</p>
                  </div>
                )}
              </>
            )}
            
            {activeTab === "followers" && (
              <>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Seguidores de {userProfile.name}</h2>
                
                {followers.length > 0 ? (
                  <ul className="divide-y divide-gray-200">
                    {followers.map((follower) => (
                      <li key={follower._id} className="py-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <img 
                              className="h-10 w-10 rounded-full object-cover"
                              src={follower.profileImage || "https://via.placeholder.com/150?text=Chef"}
                              alt={follower.name}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <Link to={`/users/${follower._id}`} className="text-sm font-medium text-blue-600 hover:text-blue-800 truncate">
                              {follower.name}
                            </Link>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-lg text-gray-600">Este usuario aún no tiene seguidores</p>
                  </div>
                )}
              </>
            )}
            
            {activeTab === "following" && (
              <>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Usuarios que sigue {userProfile.name}</h2>
                
                {following.length > 0 ? (
                  <ul className="divide-y divide-gray-200">
                    {following.map((followedUser) => (
                      <li key={followedUser._id} className="py-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <img 
                              className="h-10 w-10 rounded-full object-cover"
                              src={followedUser.profileImage || "https://via.placeholder.com/150?text=Chef"}
                              alt={followedUser.name}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <Link to={`/users/${followedUser._id}`} className="text-sm font-medium text-blue-600 hover:text-blue-800 truncate">
                              {followedUser.name}
                            </Link>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-lg text-gray-600">Este usuario aún no sigue a nadie</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfilePage;