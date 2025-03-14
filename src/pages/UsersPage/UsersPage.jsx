import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/auth.context";
import userService from "../../services/user.service";

function UsersPage() {
  const { user, isLoggedIn } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [followActionInProgress, setFollowActionInProgress] = useState(false);

  useEffect(() => {
    setLoading(true);
    
    // Cargar todos los usuarios
    userService.getAllUsers()
      .then((response) => {
        // Filtrar para no mostrar el usuario actual
        const filteredUsers = response.data.filter(u => 
          u._id !== (user ? user._id : null)
        );
        setUsers(filteredUsers);
        
        // Si el usuario está autenticado, cargar a quién sigue
        if (isLoggedIn && user) {
          return userService.getFollowing(user._id);
        }
        return { data: [] };
      })
      .then((followingResponse) => {
        if (followingResponse.data) {
          // Crear un conjunto de IDs de usuarios que el usuario actual sigue
          const followingIds = new Set(followingResponse.data.map(u => u._id));
          setFollowing(followingIds);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.log("Error cargando usuarios:", error);
        setLoading(false);
      });
  }, [isLoggedIn, user]);
  
  // Manejar seguir/dejar de seguir a un usuario
  const handleFollowToggle = async (targetUserId) => {
    try {
      if (!isLoggedIn || followActionInProgress) return;
      
      setFollowActionInProgress(true);
      
      if (following.has(targetUserId)) {
        // Dejar de seguir
        await userService.unfollowUser(targetUserId);
        setFollowing(prev => {
          const updated = new Set(prev);
          updated.delete(targetUserId);
          return updated;
        });
      } else {
        // Seguir
        await userService.followUser(targetUserId);
        setFollowing(prev => {
          const updated = new Set(prev);
          updated.add(targetUserId);
          return updated;
        });
      }
      setFollowActionInProgress(false);
    } catch (error) {
      console.log("Error al actualizar la relación de seguimiento:", error);
      setFollowActionInProgress(false);
    }
  };

  // Filtrar usuarios por término de búsqueda
  const filteredUsers = searchTerm 
    ? users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : users;

  return (
    <div className="min-h-screen bg-green-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="bg-green-600 px-10 py-4 my-7">
            <h1 className="text-3xl font-bold text-white">Explorar Usuarios</h1>
          </div>
          
          {/* Barra de búsqueda */}
          <div className="p-4 border-b">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre o email..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <svg 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path 
                  fillRule="evenodd" 
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" 
                  clipRule="evenodd" 
                />
              </svg>
            </div>
          </div>
          
          {/* Lista de usuarios */}
          <div className="p-6">
            {loading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : filteredUsers.length > 0 ? (
              <div className="space-y-4">
                {filteredUsers.map((userItem) => (
                  <div key={userItem._id} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                    <Link to={`/users/${userItem._id}`} className="flex items-center">
                      <div className="h-12 w-12 rounded-full bg-gray-200 overflow-hidden mr-4">
                        <img 
                          src={userItem.profileImage || "/images.png"} 
                          alt={userItem.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{userItem.name}</h3>
                        <p className="text-sm text-gray-500">{userItem.email}</p>
                      </div>
                    </Link>
                    <div className="flex space-x-2">
                      <Link 
                        to={`/users/${userItem._id}`} 
                        className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Ver perfil
                      </Link>
                      {isLoggedIn && (
                        <button
                          onClick={() => handleFollowToggle(userItem._id)}
                          disabled={followActionInProgress}
                          className={`px-3 py-1 rounded text-sm ${
                            followActionInProgress 
                              ? 'opacity-50 cursor-not-allowed'
                              : following.has(userItem._id)
                                ? "bg-red-100 border border-red-200 text-red-600 hover:bg-red-200"
                                : "bg-blue-100 border border-blue-200 text-blue-600 hover:bg-blue-200"
                          }`}
                        >
                          {followActionInProgress ? 'Procesando...' : following.has(userItem._id) ? "Dejar de seguir" : "Seguir"}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 13a3 3 0 100-6 3 3 0 000 6z" />
                </svg>
                <p className="mt-4 text-lg text-gray-600">
                  {searchTerm ? "No se encontraron usuarios con ese criterio" : "No hay usuarios disponibles"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UsersPage;