import axios from "axios";

class RecipeService {
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

  createRecipe = (requestBody) => {
    return this.api.post("/api/recipes", requestBody);
  };

  uploadImage = (uploadData) => {
    return this.api.post("/api/upload", uploadData);
  };

  getAll = () => {
    return this.api.get("/api/recipes");
  };

  getOne = (id) => {
    return this.api.get(`/api/recipes/${id}`);
  };

  likeRecipe = (id) => {
    return this.api.post(`/api/recipes/${id}/like`);
  };

  unlikeRecipe = (id) => {
    return this.api.post(`/api/recipes/${id}/unlike`);
  };

  getRandomRecipe = () => {
    return this.api.get("/api/recipes/random");
  };

  getRecipesByAuthor = (authorId) => {
    return this.api.get(`/api/recipes/author/${authorId}`);
  };

  updateRecipe = (id, requestBody) => {
    return this.api.put(`/api/recipes/${id}`, requestBody);
  };

  deleteRecipe = (id) => {
    return this.api.delete(`/api/recipes/${id}`);
  }
}

const recipeService = new RecipeService();
export default recipeService;