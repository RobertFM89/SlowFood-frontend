import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/auth.context";
import recipeService from "../../services/recipe.service";
import { Link } from "react-router-dom";

function ProfilePage() {
  const { user } = useContext(AuthContext);
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    recipeService.getAll()
      .then((response) => setRecipes(response.data))
      .catch((error) => console.log(error));
  }, []);

  return (
    <div>
     <h1>Profile page</h1>
      <Link to="/recipes/create">
        <button>Create New Recipe</button>
      </Link>
      <div>
        {recipes.map((recipe) => (
          <div key={recipe._id}>
            <Link to={`/recipes/${recipe._id}`}>
              <h2>{recipe.title}</h2>
            </Link>
            <p>{recipe.ingredients.join(", ")}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProfilePage;
