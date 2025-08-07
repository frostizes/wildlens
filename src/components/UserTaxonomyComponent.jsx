import { useState, useEffect } from 'react';
import { Modal, Button, Carousel, Form } from 'react-bootstrap';
import { FaStar, FaEdit, FaUpload, FaTimes } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useParams } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useLocation } from "react-router-dom";


function UserTaxonomyComponent() {
  const location = useLocation();
  const { animal } = useParams();
  const [results, setResults] = useState(null); // single animal, not an array
  const [categories, setCategories] = useState([]);
  const [userName, setSetUserName] = useState("");
  const API_BASE_URL = import.meta.env.VITE_REACT_APP_WILD_LENS_BACKEND_BASE_URL;

  return (
    <div className="card">
      <p>This is the taxonomy</p>
    </div>
  );
}

export default UserTaxonomyComponent;
