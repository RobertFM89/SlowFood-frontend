import "./App.css";
import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage/HomePage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import SignupPage from "./pages/SignupPage/SignupPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import RecipePage from "./pages/RecipePage/RecipePage";
import CreateRecipePage from "./pages/CreateRecipePage/CreateRecipePage";
import EditRecipePage from "./pages/EditRecipePage/EditRecipePage";
import Navbar from "./components/Navbar/Navbar";
import IsPrivate from "./components/IsPrivate/IsPrivate";
import IsAnon from "./components/IsAnon/IsAnon";

function App() {
  return (
    <div className="App">
      <Navbar />

      <Routes>
  {/* Rutas generales */}
  <Route path="/" element={<HomePage />} />
  <Route path="/profile" element={<IsPrivate><ProfilePage /></IsPrivate>} />
  <Route path="/signup" element={<IsAnon><SignupPage /></IsAnon>} />
  <Route path="/login" element={<IsAnon><LoginPage /></IsAnon>} />
  
  {/* Rutas específicas de recetas - orden importante */}
  <Route path="/recipes/create" element={<IsPrivate><CreateRecipePage /></IsPrivate>} />
  <Route path="/recipes/edit/:id" element={<IsPrivate><EditRecipePage /></IsPrivate>} />
  <Route path="/recipes/:id" element={<IsPrivate><RecipePage /></IsPrivate>} />
</Routes>
    </div>
  );
}

export default App;