import "./App.css";
import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage/HomePage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import EditProfilePage from "./pages/EditProfilePage/EditProfilePage";
import SignupPage from "./pages/SignupPage/SignupPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import RecipePage from "./pages/RecipePage/RecipePage";
import CreateRecipePage from "./pages/CreateRecipePage/CreateRecipePage";
import EditRecipePage from "./pages/EditRecipePage/EditRecipePage";
import Navbar from "./components/Navbar/Navbar";
import IsPrivate from "./components/IsPrivate/IsPrivate";
import IsAnon from "./components/IsAnon/IsAnon";
import UsersPage from "./pages/UsersPage/UsersPage";
import UserProfilePage from "./pages/UserProfilePage/UserProfilePage";
import RecipesPage from "./pages/RecipesPage/RecipesPage";
import AICookingAssistantPage from "./pages/AICookingAssistantPage/AICookingAssistantPage";
import Chatbot from "./components/Chatbot/Chatbot";



function App() {
  return (
    <div className="App">
      <Navbar />

      <Routes>
  {/* Rutas generales */}
  <Route path="/" element={<HomePage />} />
  <Route path="/profile" element={<IsPrivate><ProfilePage /></IsPrivate>} />
  <Route path="/profile/edit" element={<IsPrivate><EditProfilePage /></IsPrivate>} />
  <Route path="/signup" element={<IsAnon><SignupPage /></IsAnon>} />
  <Route path="/login" element={<IsAnon><LoginPage /></IsAnon>} />
  <Route path="/users" element={<IsPrivate><UsersPage /></IsPrivate>} />
<Route path="/users/:userId" element={<IsPrivate><UserProfilePage /></IsPrivate>} />


  
  {/* Rutas específicas de recetas - orden importante */}
  <Route path="/recipes" element={<RecipesPage />} />
  <Route path="/recipes/create" element={<IsPrivate><CreateRecipePage /></IsPrivate>} />
  <Route path="/recipes/edit/:id" element={<IsPrivate><EditRecipePage /></IsPrivate>} />
  <Route path="/recipes/:id" element={<IsPrivate><RecipePage /></IsPrivate>} />

{/* Nueva ruta para el asistente de cocina */}
<Route path="/ai-cooking-assistant" element={<IsPrivate><AICookingAssistantPage /></IsPrivate>} />
  
  
</Routes>
      {/* Componente del chatbot */}
      <Chatbot />

      {/* Footer (si es necesario) */}
      <footer>
        <p>&copy; 2023 SlowFood. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

export default App;