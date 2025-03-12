
import "../../App.css";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/auth.context";

function Navbar() {
  // Subscribe to the AuthContext to gain access to
  // the values from AuthContext.Provider's `value` prop
  const { isLoggedIn, user, logOutUser } = useContext(AuthContext);

  return (
    <nav className = "bg-gray-800 p-4" >
      <div className = "container mx-auto flex justify-between items-center" >
      <Link to="/" className="text-white text-lg font-semibold">
        <button>Home</button>
      </Link>
      </div>

      {isLoggedIn && (
        <>
          <button onClick={logOutUser} className="bg-red-500 text-white px-4 py-2 rounded mr-2">Logout</button>

          <Link to="/profile" className="text-white text-lg font-semibold mr-2">
          Profile
          </Link>

          <span className="text-white" >{user && user.name}</span>
        </>
      )}

      {!isLoggedIn && (
        <>
          <Link to="/signup" className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
          Sign Up
          </Link>
          <Link to="/login" className="bg-green-500 text-white px-4 py-2 rounded">
          Login
          </Link>
        </>
      )}

<Link 
  to="/users" 
  className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
>
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
  <span>Comunidad</span>
</Link>
    </nav>
  );
}

export default Navbar;
