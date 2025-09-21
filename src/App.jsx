import { Routes, Route, useLocation, Navigate  } from "react-router-dom";
import Header from "./components/Header";
import LandingPage from "./components/LandingPage";
import Footer from "./components/Footer";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AccountPage from "./pages/AccountPage";
import FeedPage from "./pages/FeedPage";
import SearchPage from "./pages/SearchPage";
import MapPage from "./pages/MapPage";
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
  const state = location.state;

  return (
    <>
      {/* Main routes */}
      <Routes location={state?.backgroundLocation || location}>
        <Route
          path="/"
          element={
            <>
              {isAuthenticated ? <FeedPage /> : (
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
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/search/:query" element={<SearchPage />} />
        <Route path="/animalwiki/:animal" element={<AnimalWikiPage />} />
        <Route path="/catalog/:user/:animal" element={<AnimalPicturesPage />} />
        <Route path="/profile/:userName" element={<ProfilePage />}>
          <Route index element={<Navigate to="pictures" replace />} />
          <Route path="pictures" element={<UserPictureComponent />} />
          <Route path="taxonomy" element={<TaxonomyComponent />} />
          <Route path="badges" element={<BadgesComponent />} />
        </Route>
      </Routes>

      {/* Modal routes */}
      {state?.backgroundLocation && (
        <Routes>
          <Route
            path="/profile/:userName/:animal/:imgPath"
            element={<AnimalPictureModal />}
          />
        </Routes>
      )}
    </>
  );
}

export default App;
