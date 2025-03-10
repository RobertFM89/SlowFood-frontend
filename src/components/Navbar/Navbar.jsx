
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
    </nav>
  );
}

export default Navbar;
