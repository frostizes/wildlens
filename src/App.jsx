import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import BackgroundImage from "./components/BackgroundImage";
import Body from "./components/Body";
import Footer from "./components/Footer";
import Taxonomy from "./components/Taxonomy";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import AnimalPage from "./pages/AnimalPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Main Page (Accessible to Everyone) */}
        <Route 
          path="/" 
          element={
            <>
              <Header />
              <BackgroundImage />
              <Body />
              <Footer />
            </>
          } 
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<ProfilePage/>} />
        <Route path="/AnimalPage" element={<AnimalPage/>} />
      </Routes>
    </Router>
  );
}

export default App;
