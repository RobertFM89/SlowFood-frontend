import { useContext, useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/auth.context";


function Navbar() {
  const { isLoggedIn, user, logOutUser } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Efecto para cerrar el menú cuando cambia la ruta
  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileMenuOpen(false);
  }, [location]);

  // Efecto para detectar scroll y cambiar estilo de navbar
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isProfileMenuOpen) setIsProfileMenuOpen(false);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
    if (isMenuOpen) setIsMenuOpen(false);
  };

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white shadow-md py-2' 
          : 'bg-white/90 backdrop-blur-md py-3'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center">
              <img 
                src="/LogoSlowFood-modified.png" 
                alt="SlowFood" 
                className="h-10 w-auto"
                //onError={(e) => {e.target.src = "https://via.placeholder.com/40x40?text=SF"}}
              />
              <span className="ml-2 text-xl font-bold text-emerald-600">SlowFood</span>
            </Link>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-1">
            {/* Inicio siempre visible */}
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive 
                    ? 'text-emerald-700 bg-emerald-50' 
                    : 'text-gray-700 hover:text-emerald-700 hover:bg-emerald-50'
                }`
              }
            >
              Inicio
            </NavLink>
            
            {/* Recetas y Comunidad solo visibles cuando usuario está logueado */}
            {isLoggedIn && (
              <>
                <NavLink 
                  to="/profile" 
                  className={({ isActive }) => 
                    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive 
                        ? 'text-emerald-700 bg-emerald-50' 
                        : 'text-gray-700 hover:text-emerald-700 hover:bg-emerald-50'
                    }`
                  }
                >
                  Mi cocina
                </NavLink>
                <NavLink 
                  to="/users" 
                  className={({ isActive }) => 
                    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive 
                        ? 'text-emerald-700 bg-emerald-50' 
                        : 'text-gray-700 hover:text-emerald-700 hover:bg-emerald-50'
                    }`
                  }
                >
                  Comunidad
                </NavLink>
              </>
            )}
          </div>

          {/* Auth Buttons or Profile - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {!isLoggedIn && (
              <>
                <Link 
                  to="/signup" 
                  className="px-4 py-2 text-sm font-medium text-emerald-600 border border-emerald-600 rounded-md hover:bg-emerald-50 transition-colors"
                >
                  Registro
                </Link>
                <Link 
                  to="/login" 
                  className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700 transition-colors"
                >
                  Iniciar Sesión
                </Link>
              </>
            )}
            
            {isLoggedIn && (
              <div className="relative ml-3">
                <div>
                  <button
                    onClick={toggleProfileMenu}
                    className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full overflow-hidden border-2 border-emerald-200">
                        <img 
                          src={user?.profileImage || "/images.png"} 
                          alt={user?.name || "Usuario"} 
                          className="h-full w-full object-cover" 
                        />
                      </div>
                      <span className="ml-2 text-gray-700 font-medium flex items-center">
                        {user?.name || "Usuario"}
                        <svg className={`ml-1 h-4 w-4 transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </span>
                    </div>
                  </button>
                </div>
                
                {/* Dropdown Menu */}
                {isProfileMenuOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-50">
                    <Link 
                      to="/profile" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Mi Perfil
                    </Link>
                    <Link 
                      to="/recipes/create" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Crear Receta
                    </Link>
                   
                    <div className="border-t border-gray-100"></div>
                    <button 
                      onClick={logOutUser} 
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            {isLoggedIn && (
              <div className="relative mr-3">
                <button
                  onClick={toggleProfileMenu}
                  className="flex items-center focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-full"
                >
                  <div className="h-8 w-8 rounded-full overflow-hidden border-2 border-emerald-200">
                    <img 
                      src={user?.profileImage || "/images.png"} 
                      alt={user?.name || "Usuario"} 
                      className="h-full w-full object-cover" 
                    />
                  </div>
                </button>
                
                {isProfileMenuOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-50">
                    <Link 
                      to="/profile" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Mi Perfil
                    </Link>
                    <Link 
                      to="/recipes/create" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Crear Receta
                    </Link>
                    
                    <div className="border-t border-gray-100"></div>
                    <button 
                      onClick={logOutUser} 
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            )}
            
            <button onClick={toggleMenu} className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
              <span className="sr-only">Abrir menu</span>
              {isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {/* Inicio siempre visible en móvil */}
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `block px-3 py-2 rounded-md text-base font-medium ${
                  isActive 
                    ? 'bg-emerald-50 text-emerald-700' 
                    : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-700'
                }`
              }
            >
              Inicio
            </NavLink>
            
            {/* Recetas y Comunidad solo visibles cuando usuario está logueado */}
            {isLoggedIn && (
              <>
                <NavLink 
                  to="/profile" 
                  className={({ isActive }) => 
                    `block px-3 py-2 rounded-md text-base font-medium ${
                      isActive 
                        ? 'bg-emerald-50 text-emerald-700' 
                        : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-700'
                    }`
                  }
                >
                  Mi cocina
                </NavLink>
                <NavLink 
                  to="/users" 
                  className={({ isActive }) => 
                    `block px-3 py-2 rounded-md text-base font-medium ${
                      isActive 
                        ? 'bg-emerald-50 text-emerald-700' 
                        : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-700'
                    }`
                  }
                >
                  Comunidad
                </NavLink>
              </>
            )}
            
            {/* Botones de autenticación solo visibles cuando no está logueado */}
            {!isLoggedIn && (
              <>
                <div className="border-t border-gray-200 my-3"></div>
                <Link 
                  to="/signup" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-emerald-600 hover:bg-emerald-50"
                >
                  Registro
                </Link>
                <Link 
                  to="/login" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-emerald-600 hover:bg-emerald-50"
                >
                  Iniciar Sesión
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;