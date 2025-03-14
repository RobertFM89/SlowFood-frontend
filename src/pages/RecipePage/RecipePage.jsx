import { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/auth.context";
import recipeService from "../../services/recipe.service";
import commentService from "../../services/comment.service";

function RecipePage() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const { isLoggedIn, user } = useContext(AuthContext);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    recipeService
      .getOne(id)
      .then((response) => {
        setRecipe(response.data);
        // Verificar si el usuario actual ha dado like a la receta
        if (isLoggedIn && user && response.data.likes) {
          setIsLiked(response.data.likes.includes(user._id));
          setLikesCount(response.data.likes.length);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });

    commentService
      .getCommentsByRecipe(id)
      .then((response) => setComments(response.data))
      .catch((error) => console.log(error));
  }, [id, isLoggedIn, user]);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    commentService
      .createComment({ content: newComment, recipeId: id })
      .then((response) => {
        setComments([response.data, ...comments]);
        setNewComment("");
      })
      .catch((error) => console.log(error));
  };

  const handleDeleteComment = (commentId) => {
    commentService
      .deleteComment(commentId)
      .then(() => {
        setComments(comments.filter((comment) => comment._id !== commentId));
      })
      .catch((error) => console.log(error));
  };

  const handleLike = () => {
    if (!isLoggedIn) return;

    recipeService
      .likeRecipe(id)
      .then((response) => {
        setIsLiked(true);
        setLikesCount(response.data.likes.length);
      })
      .catch((error) => console.log(error));
  };

  const handleUnlike = () => {
    if (!isLoggedIn) return;

    recipeService
      .unlikeRecipe(id)
      .then((response) => {
        setIsLiked(false);
        setLikesCount(response.data.likes.length);
      })
      .catch((error) => console.log(error));
  };

  const handleEditRecipe = () => {
    navigate(`/recipes/edit/${id}`);
  };

  const handleDeleteRecipe = () => {
    if (
      window.confirm(
        "¿Estás seguro de que quieres eliminar esta receta? Esta acción no se puede deshacer."
      )
    ) {
      setIsDeleting(true);
      recipeService
        .deleteRecipe(id)
        .then(() => {
          navigate("/"); // Redireccionar a la página principal después de eliminar
        })
        .catch((error) => {
          console.log(error);
          setIsDeleting(false);
        });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  // Verificar si el usuario actual es el autor de la receta
  const isAuthor =
    user && recipe && recipe.author && user._id === recipe.author._id;

  return (
    <div className="min-h-screen bg-green-50 py-6 flex flex-col items-center my-7">
      {recipe && (
        <div className="bg-white shadow-md rounded-lg p-6 max-w-2xl w-full">
          {/* Botones de acciones para el autor */}
          {isAuthor && (
            <div className="flex justify-end space-x-2 mb-4">
              <button
                onClick={handleEditRecipe}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 flex items-center"
                disabled={isDeleting}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Editar
              </button>
              <button
                onClick={handleDeleteRecipe}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex items-center"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Eliminando...
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Eliminar
                  </>
                )}
              </button>
            </div>
          )}

          {/* Título y autor */}
          <div className="mb-6">
            <h1 className="text-3xl font-semibold text-gray-900">
              {recipe.title}
            </h1>
            {recipe.author && (
              <div className="mt-2 flex items-center">
                <span className="text-gray-600">By: </span>
                <Link
                  to={`/profile/${recipe.author._id}`}
                  className="ml-1 text-blue-600 hover:underline"
                >
                  {recipe.author.name}
                </Link>
              </div>
            )}
          </div>

          {/* Imagen de la receta */}
          {recipe.image && (
            <div className="mb-6">
              <img
                src={recipe.image}
                alt={recipe.title}
                className="w-full h-96 object-cover rounded-lg shadow-md"
              />
            </div>
          )}

          {/* Información principal */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Tiempo
              </h3>
              <p className="text-gray-700">{recipe.time} minutos</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Dificultad
              </h3>
              <p className="text-gray-700">{recipe.difficulty}</p>
            </div>
          </div>

          {/* Detalles adicionales */}

          <div className="mb-6 flex flex-wrap gap-2">
            {recipe.vegetarian && (
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                Vegetariana
              </span>
            )}

            {recipe.vegan && (
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                Vegana
              </span>
            )}

            {recipe.glutenFree && (
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                Sin gluten
              </span>
            )}

            {recipe.lactoseFree && (
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                Sin lactosa
              </span>
            )}

            {recipe.flavor && (
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                Sabor: {recipe.flavor}
              </span>
            )}
          </div>

          {/* Ingredientes */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Ingredientes
            </h2>
            <div className="bg-gray-50 p-4 rounded-lg shadow">
              <ul className="list-disc pl-5 space-y-2">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="text-gray-700">
                    {ingredient}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Instrucciones */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Instrucciones
            </h2>
            <div className="bg-gray-50 p-4 rounded-lg shadow">
              <p className="text-gray-700 whitespace-pre-line">
                {recipe.instructions}
              </p>
            </div>
          </div>

          {/* Maridaje de bebidas */}
          {recipe.beveragePairing && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Maridaje de bebidas
              </h2>
              <div className="bg-gray-50 p-4 rounded-lg shadow">
                <p className="text-gray-700">{recipe.beveragePairing}</p>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-4 mb-6">
            {isLoggedIn ? (
              <>
                {!isLiked ? (
                  <button
                    onClick={handleLike}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                    </svg>
                    Like ({likesCount})
                  </button>
                ) : (
                  <button
                    onClick={handleUnlike}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
                    </svg>
                    Unlike ({likesCount})
                  </button>
                )}
              </>
            ) : (
              <p className="text-gray-500">
                Please{" "}
                <a href="/login" className="text-blue-500 hover:underline">
                  login
                </a>{" "}
                to like this recipe.
              </p>
            )}
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Comments
            </h2>

            {comments.length > 0 ? (
              <div className="space-y-4 mb-6">
                {comments.map((comment) => (
                  <div
                    key={comment._id}
                    className="bg-gray-50 p-4 rounded-lg shadow"
                  >
                    <p className="text-gray-700">{comment.content}</p>
                    <div className="mt-2 flex justify-between items-center">
                      <p className="text-sm text-gray-500">
                        By: {comment.author.name}
                      </p>
                      {user && user._id === comment.author._id && (
                        <button
                          onClick={() => handleDeleteComment(comment._id)}
                          className="text-red-500 text-sm hover:underline"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 mb-6">
                No comments yet. Be the first to comment!
              </p>
            )}

            {isLoggedIn ? (
              <form onSubmit={handleCommentSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="comment"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Add a comment
                  </label>
                  <textarea
                    id="comment"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    rows="3"
                    placeholder="Share your thoughts about this recipe..."
                  />
                </div>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Post Comment
                </button>
              </form>
            ) : (
              <p className="text-gray-500">
                Please{" "}
                <a href="/login" className="text-blue-500 hover:underline">
                  login
                </a>{" "}
                to leave a comment.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default RecipePage;
