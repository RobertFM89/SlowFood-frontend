import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/auth.context";
import userService from "../../services/user.service";

function EditProfilePage() {
  const { user, authenticateUser } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // Estados para los campos del formulario
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [imageMethod, setImageMethod] = useState("current");
  
  // Estados para las operaciones
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  
  // Cargar los datos actuales del usuario
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    
    setName(user.name);
    setBio(user.bio);
    setProfileImage(user.profileImage || "");
    setIsLoading(false);
  }, [user, navigate]);
  
  // Manejar la carga de imágenes
  const handleFileUpload = (e) => {
    const uploadData = new FormData();
    uploadData.append("imageUrl", e.target.files[0]);
    
    setIsUploading(true);
    
    userService.uploadImage(uploadData)
      .then((response) => {
        console.log("Respuesta de subida:", response.data);
        setProfileImage(response.data.fileUrl);
        setIsUploading(false);
      })
      .catch((error) => {
        console.log("Error al subir la imagen:", error);
        setErrorMessage("Error al subir la imagen. Por favor, inténtelo de nuevo.");
        setIsUploading(false);
      });
  };
  
  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    
    // Validación básica del formulario
    if (!name.trim()) {
      setErrorMessage("El nombre es obligatorio");
      return;
    }
    
    // Preparar los datos para actualizar
    const userData = {
      name,
      bio,
      profileImage
    };
    
    setIsSubmitting(true);
    
    try {
      await userService.updateProfile(userData);
      setSuccessMessage("Perfil actualizado correctamente");

      // Forzar actualización almacenando el token nuevamente
      const token = localStorage.getItem("authToken");
      if (token) {
        localStorage.setItem("authToken", token);
      }
      
      // Actualizar el contexto de autenticación para reflejar los cambios
      authenticateUser();
      
      // Redireccionar después de un breve retraso para mostrar el mensaje de éxito
      setTimeout(() => {
        navigate("/profile");
      }, 1500);
    } catch (error) {
      console.log("Error al actualizar el perfil:", error);
      setErrorMessage(error.response?.data?.message || "Error al actualizar el perfil. Por favor, inténtelo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg mx-auto">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="bg-blue-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">Editar Perfil</h1>
          </div>
          
          <div className="p-6">
            {errorMessage && (
              <div className="mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
                <p>{errorMessage}</p>
              </div>
            )}
            
            {successMessage && (
              <div className="mb-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4" role="alert">
                <p>{successMessage}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Imagen de perfil */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Imagen de perfil
                </label>
                
                {profileImage && (
                  <div className="mb-4">
                    <div className="relative inline-block">
                      <img 
                        src={profileImage} 
                        alt="Vista previa de perfil" 
                        className="h-32 w-32 object-cover rounded-full"
                      />
                    </div>
                  </div>
                )}
                
                <div className="flex space-x-4 mb-4">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="current-image"
                      name="image-method"
                      value="current"
                      checked={imageMethod === "current"}
                      onChange={() => setImageMethod("current")}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor="current-image" className="ml-2 block text-sm text-gray-700">
                      Mantener imagen actual
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="upload-option"
                      name="image-method"
                      value="upload"
                      checked={imageMethod === "upload"}
                      onChange={() => setImageMethod("upload")}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor="upload-option" className="ml-2 block text-sm text-gray-700">
                      Subir nueva imagen
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="url-option"
                      name="image-method"
                      value="url"
                      checked={imageMethod === "url"}
                      onChange={() => setImageMethod("url")}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor="url-option" className="ml-2 block text-sm text-gray-700">
                      Usar URL
                    </label>
                  </div>
                </div>
                
                {imageMethod === "upload" && (
                  <div className="mt-1">
                    <div className="flex justify-center items-center w-full">
                      <label
                        htmlFor="file-upload"
                        className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <span>{isUploading ? "Subiendo..." : "Seleccionar archivo"}</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={handleFileUpload}
                          disabled={isUploading}
                        />
                      </label>
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                      PNG, JPG, GIF hasta 5MB. Recomendado: Imagen cuadrada de 500x500 píxeles.
                    </p>
                  </div>
                )}
                
                {imageMethod === "url" && (
                  <div className="mt-1">
                    <input
                      type="url"
                      value={profileImage}
                      onChange={(e) => setProfileImage(e.target.value)}
                      placeholder="https://ejemplo.com/imagen.jpg"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    <p className="mt-2 text-xs text-gray-500">
                      Ingrese la URL de una imagen existente en internet
                    </p>
                  </div>
                )}
              </div>
              
              {/* Nombre */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Nombre <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              {/* Biografía */}
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                  Biografía
                </label>
                <textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows="4"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Cuéntanos algo sobre ti..."
                ></textarea>
              </div>
              
              {/* Botones de acción */}
              <div className="flex justify-end pt-5">
                <button
                  type="button"
                  onClick={() => navigate("/profile")}
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-4"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || isUploading}
                  className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${(isSubmitting || isUploading) ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Guardando...
                    </>
                  ) : 'Guardar cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditProfilePage;