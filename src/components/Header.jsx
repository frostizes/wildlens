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
  const [showAnimals, setShowAnimals] = useState(true);
  const [showUsers, setShowUsers] = useState(true);
  const [searchResultsAnimals, setSearchResultsAnimals] = useState([]);
  const [searchResultsUsers, setSearchResultsUsers] = useState([]);
  const API_BASE_URL = import.meta.env.VITE_REACT_APP_WILD_LENS_BACKEND_BASE_URL;

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && searchQuery.trim().length > 1) {
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

    if (debouncedQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }

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
        setSearchResultsAnimals(response.data.animals);
        setSearchResultsUsers(response.data.users);
        // const data = await response.json();
        console.log("Search results:", response.data);
        // Optionally update state or context with search results
      } catch (err) {
        console.error("Error during search:", err);
        setSearchResults([]);

      }
    };

    fetchResults();
  }, [debouncedQuery]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
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

      {(searchResultsAnimals.length > 0 || searchResultsUsers.length > 0) && searchQuery.trim().length >= 2 && (
        <div
          className="position-absolute start-50 translate-middle-x p-3 bg-light rounded shadow overflow-auto"
          style={{
            maxHeight: "200px",
            width: "50%",
            top: "70px", // adjust based on your header height (50px + padding)
            zIndex: 1000, // ensure it sits on top of other content
          }}
        >
          <ul className="list-group">
            {showAnimals && searchResultsAnimals.length > 0 && (
              <>
                <li className="list-group-item p-1 bg-light text-center text-muted border-0">
                  <small>🐾 Animals</small>
                </li>
                {searchResultsAnimals.map((animal, index) => (
                  <Link
                    to={`/animalwiki/${encodeURIComponent(animal.scientificName)}`}
                    key={`animal-${index}`}
                    className="list-group-item text-dark text-decoration-none"
                    class="custom_link_class"
                    onClick={() => {
                      setSearchQuery("");
                      setSearchResultsAnimals([]);
                      setSearchResultsUsers([]);
                    }}
                  >
                    🐾 {animal.languageSpecificName ?? "Unnamed animal"}
                  </Link>
                ))}
              </>
            )}

            {showUsers && searchResultsUsers.length > 0 && (
              <>
                <li className="list-group-item p-1 bg-light text-center text-muted border-0">
                  <small>👤 Users</small>
                </li>
                {searchResultsUsers.map((user, index) => (
                  <li key={`user-${index}`} className="list-group-item">
                    👤 {user ?? "Unnamed user"}
                  </li>
                ))}
              </>
            )}
          </ul>
        </div>
      )}
    </>
  );
}

export default Header;
