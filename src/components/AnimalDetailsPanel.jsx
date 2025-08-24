import { useState, useEffect } from 'react';
import { Modal, Button, Carousel, Form } from 'react-bootstrap';
import { FaStar, FaEdit, FaUpload, FaTimes } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useParams } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useLocation } from "react-router-dom";


function AnimalDetailsPanel() {
  const location = useLocation();
  const { animal } = useParams();
  const [results, setResults] = useState(null); // single animal, not an array
  const [categories, setCategories] = useState([]);
  const [userName, setSetUserName] = useState("");
  const API_BASE_URL = import.meta.env.VITE_REACT_APP_WILD_LENS_BACKEND_BASE_URL;
  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        console.log("Fetching animal details for:", animal);
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`${API_BASE_URL}/Catalog/GetAnimalDetails/${animal}`, {
          withCredentials: true
        });
        console.log("Search results:", response.data);
        setResults(response.data || null);
        setCategories(["Users", "Animals", "Category"]);
      } catch (err) {
        console.error("Search failed:", err);
        setResults(null); // clear state on error
      }
    };
    setSetUserName(localStorage.getItem("userName"));
    fetchSearchResults(); // Always fetch on mount or when query changes
  }, [animal, location]);

  return (
    <div className="card">
      <img
        src={results?.templateImagePath || "https://via.placeholder.com/150x150"}
        className="card-img-top"
        alt="Animal"
      />
      <div className="card-body">
        <h5 className="card-title">{results?.englishName || "Animal Name"}</h5>
        <p className="card-text">{results?.description || "Short description of the animal."}</p>
        <Link 
        to={`/catalog/${userName}/${results?.englishName}/`}
        state={{ background: location }}
        >
          <button className="btn me-2 btn-primary" >View pictures</button>
        </Link>
      </div>
    </div>
  );
}

export default AnimalDetailsPanel;
