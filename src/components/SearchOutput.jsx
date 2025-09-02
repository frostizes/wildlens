import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from "../context/AuthContext";


function DisplaySearchOutput() {
  const { query } = useParams();
    const { user, isAuthenticated, logout, token } = useAuth();
  
  const [results, setResults] = useState([]);
  const [categories, setCategories] = useState([]);
  const API_BASE_URL = import.meta.env.VITE_REACT_APP_WILD_LENS_BACKEND_BASE_URL;

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`${API_BASE_URL}/api/Search/${query}`, {
                    headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        setResults(response.data.animals || []);
        setCategories(["Users", "Animals","Category"]); // Replace with real data if needed
      } catch (err) {
        console.error("Search failed:", err);
      }
    };

    if (query) fetchSearchResults();
  }, [query]);

  return (
    <div className="container-fluid mt-4">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3 border-end">
          <h5>Categories</h5>
          <ul className="list-group">
            {categories.map((cat, idx) => (
              <li className="list-group-item" key={idx}>
                {cat}
              </li>
            ))}
          </ul>
        </div>

        {/* Results */}
        <div className="col-md-9">
          <h4>Search Results for "{query}"</h4>
          {results.length > 0 ? (
            <div className="row w-80 mt-5">
              {results.map((item, index) => (
                <div key={index} className="col-md-10 mb-4 mx-auto">
                  <div className="card">
                    <img src={item.imageUrl} className="card-img-top" alt={item.name} />
                    <div className="card-body">
                      <h5 className="card-title">{item}</h5>
                      <p className="card-text">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No results found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default DisplaySearchOutput;
