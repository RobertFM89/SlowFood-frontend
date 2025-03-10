import axios from "axios";

class CommentService {
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

  createComment = (requestBody) => {
    return this.api.post("/api/comments", requestBody);
  };

  getCommentsByRecipe = (recipeId) => {
    return this.api.get(`/api/comments/${recipeId}`);
  };

  updateComment = (commentId, content) => {
    return this.api.put(`/api/comments/${commentId}`, { content });
  };

  deleteComment = (commentId) => {
    return this.api.delete(`/api/comments/${commentId}`);
  };
}

const commentService = new CommentService();
export default commentService;