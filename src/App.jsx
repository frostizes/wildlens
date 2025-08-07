import { Routes, Route, useLocation, Navigate  } from "react-router-dom";
import Header from "./components/Header";
import LandingPage from "./components/LandingPage";
import Footer from "./components/Footer";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AccountPage from "./pages/AccountPage";
import CatalogPage from "./pages/CatalogPage";
import SearchPage from "./pages/SearchPage";
import AnimalWikiPage from "./pages/AnimalWikiPage";
import AnimalPicturesPage from "./pages/AnimalPicturePage"; // You'll create this
import AnimalPictureModal from "./components/AnimalPictureModal"; // You'll create this
import ProfilePage from "./pages/ProfilePage";
import UserPictureComponent from "./components/UserPictureComponent";
import TaxonomyComponent from "./components/UserTaxonomyComponent";
import BadgesComponent from "./components/UserBadgeComponent";

import { useAuth } from "./context/AuthContext";

function App() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // 👇 If this is a modal navigation, `backgroundLocation` holds the page underneath
  const state = location.state;

  return (
    <>
      {/* 👇 Main routes (underneath modal if present) */}
      <Routes location={state?.backgroundLocation || location}>
        <Route
          path="/"
          element={
            <>
              {isAuthenticated ? (
                <CatalogPage />
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
        <Route path="/animalwiki/:animal" element={<AnimalWikiPage />} />
        <Route path="/catalog/:user/:animal" element={<AnimalPicturesPage />} />
        <Route path="/profile/:userName/:animal/:imgPath" element={<AnimalPictureModal />} />
        <Route path="/profile/:userName" element={<ProfilePage />}>  
            <Route index element={<Navigate to="pictures" replace />} />
            <Route path="pictures" element={<UserPictureComponent />} />
            <Route path="taxonomy" element={<TaxonomyComponent />} />
            <Route path="badges" element={<BadgesComponent />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
