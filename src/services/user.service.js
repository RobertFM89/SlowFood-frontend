import axios from "axios";

class UserService {
  constructor() {
    this.api = axios.create({
      baseURL: process.env.REACT_APP_SERVER_URL || "http://localhost:5005",
    });

    // Automatically set JWT token in the headers for every request
    this.api.interceptors.request.use((config) => {
      const storedToken = localStorage.getItem("authToken");
      if (storedToken) {
        config.headers = { Authorization: `Bearer ${storedToken}` };
      }
      return config;
    });
  }

  // Obtener todos los usuarios
  getAllUsers = () => {
    return this.api.get("/api/users");
  };

  // Obtener un usuario por su ID
  getUser = (userId) => {
    const timestamp = Date.now();
    return this.api.get(`/api/users/${userId}?t=${timestamp}`);
  };

  // Seguir a un usuario
  followUser = (userId) => {
    return this.api.post(`/api/users/${userId}/follow`);
  };

  // Dejar de seguir a un usuario
  unfollowUser = (userId) => {
    return this.api.post(`/api/users/${userId}/unfollow`);
  };

  

  // Obtener seguidores de un usuario
  getFollowers = (userId) => {
    return this.api.get(`/api/users/${userId}/followers`);
  };

  // Obtener a quién sigue un usuario
  getFollowing = (userId) => {
    return this.api.get(`/api/users/${userId}/following`);
  };
  getUsersToFollow = () => {
    return this.api.get("/api/users/discover");
  };

  // Actualizar perfil de usuario
  updateProfile = (userData) => {
    return this.api.put("/api/users/profile", userData, {
      headers: {
        // Agregar cabecera para evitar el caché
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  };

  uploadImage = (uploadData) => {
    return this.api.post("/api/upload", uploadData, {
      headers: {
        // Estas cabeceras son importantes para subir archivos con FormData
        'Content-Type': 'multipart/form-data',
        // Evitar caché
        'Cache-Control': 'no-cache'
      }
    });
  };
}

const userService = new UserService();
export default userService;