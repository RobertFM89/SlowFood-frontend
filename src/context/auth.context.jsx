import React, { useState, useEffect } from "react";
import authService from "../services/auth.service";

const AuthContext = React.createContext();

function AuthProviderWrapper(props) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  /**
   * Almacena el token de autenticación en localStorage
   * @param {string} token - Token JWT de autenticación
   */
  const storeToken = (token) => {
    localStorage.setItem("authToken", token);
  };

  /**
   * Elimina el token de autenticación de localStorage
   */
  const removeToken = () => {
    localStorage.removeItem("authToken");
  };

  /**
   * Verifica la autenticación del usuario usando el token almacenado
   * y actualiza el estado del contexto en consecuencia
   */
  const authenticateUser = () => {
    // Obtener el token de localStorage
    const storedToken = localStorage.getItem("authToken");

    // Si el token existe en localStorage
    if (storedToken) {
      // Establecer estado de carga
      setIsLoading(true);
      
      // Enviar una solicitud al servidor para verificar el token
      authService
        .verify()
        .then((response) => {
          // Si el servidor verifica que el token JWT es válido ✅
          const user = response.data;
          
          // Actualizar variables de estado
          setIsLoggedIn(true);
          setUser(user);
        })
        .catch((error) => {
          // Si el servidor envía una respuesta de error (token no válido) ❌
          console.log("Error de autenticación:", error);
          
          // Eliminar el token inválido
          removeToken();
          
          // Actualizar variables de estado
          setIsLoggedIn(false);
          setUser(null);
        })
        .finally(() => {
          // Independientemente del resultado, terminar la carga
          setIsLoading(false);
        });
    } else {
      // Si el token no está disponible
      setIsLoggedIn(false);
      setIsLoading(false);
      setUser(null);
    }
  };

  /**
   * Cierra la sesión del usuario eliminando el token
   * y actualizando el estado del contexto
   */
  const logOutUser = () => {
    // Al cerrar sesión, eliminar el token de localStorage
    removeToken();
    
    // Actualizar variables de estado
    setIsLoggedIn(false);
    setUser(null);
  };

  /**
   * Actualiza los datos del usuario sin afectar el estado de autenticación
   * Útil para actualizar información del perfil sin requerir nuevo inicio de sesión
   * @param {Object} userData - Nuevos datos del usuario para actualizar
   */
  const updateUserData = (userData) => {
    if (user && userData) {
      setUser({
        ...user,
        ...userData
      });
    }
  };

  /**
   * Fuerza una actualización completa de los datos del usuario desde el servidor
   * Útil después de actualizaciones de perfil
   * @returns {Promise<Object|null>} - Datos del usuario o null si no está autenticado
   */
  const refreshUserData = async () => {
    try {
      if (isLoggedIn) {
        const response = await authService.verify();
        setUser(response.data);
        return response.data;
      }
      return null;
    } catch (error) {
      console.log("Error al refrescar datos del usuario:", error);
      return null;
    }
  };

  // Efecto para autenticar al usuario al cargar la aplicación
  useEffect(() => {
    // Ejecutar este código una vez que el componente AuthProviderWrapper
    // en la aplicación se carga por primera vez.
    authenticateUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isLoading,
        user,
        storeToken,
        authenticateUser,
        logOutUser,
        updateUserData,
        refreshUserData
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

export { AuthProviderWrapper, AuthContext };
