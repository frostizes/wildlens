import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import LandingPage from "./components/LandingPage";
import Footer from "./components/Footer";
import Taxonomy from "./components/Taxonomy";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AccountPage from "./pages/AccountPage";
import CatalogPage from "./pages/CatalogPage";
import SearchPage from "./pages/SearchPage";
import { useAuth } from "./context/AuthContext";


function App() {
  const { isAuthenticated, token, logout } = useAuth(); // Add this line for authentication state
  return (
    <Router>
      <Routes>
        {/* Public Main Page (Accessible to Everyone) */}
        <Route
          path="/"
          element={
            <>
              {isAuthenticated ? (
                <>
                  <CatalogPage />
                </>
              ) : (
                <>
                  <Header />
                  <LandingPage />
                </>
              )}
              <Footer />
            </>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/search/:query" element={<SearchPage />} />
      </Routes>
    </Router>
  );
}

export default App;
