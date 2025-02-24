import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css"; // Make sure to import Bootstrap CSS

function Header() {
  const { user, logout } = useAuth(); // Add this line for authentication state
  console.log(user);  // Log the user to see what it's returning

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Search query:", searchQuery);
    // Here, you can navigate to a search results page or handle the search logic
  };

  return (
    <header className="text-white d-flex align-items-center justify-content-between p-3">
      <Link to="/" className="text-white text-decoration-none">
        <h1 className="m-0" id="title">WildLens</h1>
      </Link>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="d-flex mx-3" id="search-bar">
        <input
          type="text"
          className="form-control me-2"
          placeholder="Search for profiles ..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit" className="btn btn-light">Search</button>
      </form>

      {user ? (
          <>
            <div className="d-flex">
            <Link to="/profile">
                <button className="btn btn-light me-2">Profile</button>
            </Link>
            <Link to="/">
                <button className="btn btn-danger" onClick={logout}>Logout</button>
            </Link>
            </div>
          </>
        ) : (
          <>
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
