import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/auth.context";
import recipeService from "../../services/recipe.service";
import userService from "../../services/user.service";

import { Link } from "react-router-dom";

function HomePage() {
  const { user, isLoggedIn } = useContext(AuthContext);
  const [recipes, setRecipes] = useState([]);
  const [users, setUsers] = useState([]);
  

  useEffect(() => {
    if (isLoggedIn) {
      recipeService.getAll()
        .then((response) => setRecipes(response.data))
        .catch((error) => console.log(error));

      userService.getUsersToFollow()
        .then((response) => setUsers(response.data))
        .catch((error) => console.log(error));  

      recipeService.getRandomRecipe()
        .then((response) => setRecipes(response.data))
        .catch((error) => console.log(error));  
    }
  }, [isLoggedIn]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      {isLoggedIn ? (
        <div className="bg-white shadow-md rounded-lg p-6 max-w-4xl w-full mt-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">Home Page</h1>
          
          <div className="flex items-center space-x-4 mb-6">
            <img
              className="w-16 h-16 rounded-full"
              src="https://via.placeholder.com/150"
              alt="Profile"
            />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{user?.name}</h2>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recipes</h2>
            <Link to="/recipes/create" className="bg-blue-500 text-white px-4 py-2 rounded">
              Create New Recipe
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <div key={recipe._id} className="bg-gray-50 p-4 rounded-lg shadow">
                <Link to={`/recipes/${recipe._id}`} className="text-lg font-semibold text-gray-900 hover:underline">
                  {recipe.title}
                </Link>
                <p className="text-gray-600">{recipe.ingredients.join(", ")}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center">
          <img
            className="w-32 h-32 mx-auto mb-6"
            src="https://via.placeholder.com/150"
            alt="Logo"
          />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to SlowFood</h1>
          <p className="text-gray-600 mb-6">Join us to share and discover amazing recipes!</p>
          <div className="flex justify-center space-x-4">
            <Link to="/signup" className="bg-blue-500 text-white px-4 py-2 rounded">
              Sign Up
            </Link>
            <Link to="/login" className="bg-green-500 text-white px-4 py-2 rounded">
              Login
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;