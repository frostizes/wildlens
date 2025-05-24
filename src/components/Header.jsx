import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { useAuth } from "../context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";

function Header() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const API_BASE_URL = import.meta.env.VITE_REACT_APP_WILD_LENS_BACKEND_BASE_URL;

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && searchQuery.trim().length > 0) {
      e.preventDefault(); // Prevent form submission
      navigate(`/search/${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Debounce logic: update `debouncedQuery` 500ms after typing stops
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Call API when debouncedQuery changes
  useEffect(() => {
    if (debouncedQuery.trim() === "") return;

    const fetchResults = async () => {
      try {
        const token = localStorage.getItem("authToken"); // or wherever you store it
        console.log("token " + token);
        const response = await axios.get(
          `${API_BASE_URL}/api/Search/${searchQuery}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );    
        // const data = await response.json();
        console.log("Search results:", response.data.animals);
        // Optionally update state or context with search results
      } catch (err) {
        console.error("Error during search:", err);
      }
    };

    fetchResults();
  }, [debouncedQuery]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="text-white d-flex align-items-center justify-content-between p-3">
      {isAuthenticated ? (
        <>
          <Link to="/catalog" className="text-white text-decoration-none">
            <h1 className="m-0" id="title">WildLens</h1>
          </Link>

          <form onSubmit={(e) => e.preventDefault()} className="d-flex mx-3" id="search-bar">
            <input
              type="text"
              className="form-control me-2"
              placeholder="Search for profiles or mammals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </form>

          <div className="d-flex">
            <Link to="/account">
              <button className="btn btn-light me-2">Profile</button>
            </Link>
            <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
          </div>
        </>
      ) : (
        <>
          <Link to="/" className="text-white text-decoration-none">
            <h1 className="m-0" id="title">WildLens</h1>
          </Link>
          <div className="d-flex">
            <Link to="/login">
              <button className="btn btn-light me-2">Login</button>
            </Link>
            <Link to="/register">
              <button className="btn btn-outline-light">Register</button>
            </Link>
          </div>
        </>
      )}
    </header>
  );
}

export default Header;
