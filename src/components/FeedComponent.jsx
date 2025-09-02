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
  const [posts, setPosts] = useState([]);
  const [userName, setSetUserName] = useState("");
  const { user, isAuthenticated, logout, token } = useAuth();

  const API_BASE_URL = import.meta.env.VITE_REACT_APP_WILD_LENS_BACKEND_BASE_URL;
  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const requestParams = {
          limit: 20, // You might also need lng
        };
        const response = await axios.get(
          `${API_BASE_URL}/Profile/getFeed`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: requestParams,
          }
        );
        console.log("Search results:", response.data[0]);
        setPosts(response.data || []);
      } catch (err) {
        console.error("Failed to fetch images:", err);
      }
    };
    setSetUserName(localStorage.getItem("userName"));
    fetchSearchResults(); // Always fetch on mount or when query changes
  }, [animal, location]);

  return (
    <div className="d-flex flex-column align-items-center">
      {posts.map((post, index) => (
        <div
          key={index}
          className="m-3"
          style={{
            width: '800px',       // fixed width
            height: '700px',      // fixed height
          }}
        >
          <div
            className="card shadow-sm"
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#f8f9fa',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Username at top-left */}
            <div className="p-2">
              <small className="text-muted">{post.userName || userName}</small>
            </div>

            {/* Image */}
            <div style={{ cursor: 'pointer', width: '100%', height: '90%',}}>
              <Link
                to={`/profile/${post.userName}/${post.animalName}/${encodeURIComponent(post.mediaUrl)}`}
                state={{ background: location }}>
              <img
                src={post.mediaUrl}
                alt={post.animalName}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover', // fills container & crops excess
                  overflow : 'hidden'
                }}
              />
              </Link>
            </div>

            {/* Post title */}
            <div className="card-body p-2">
              <h6 className="text-center mb-0">{post.animalName}</h6>
            </div>
          </div>
        </div>
      ))}
    </div>



  );
}

export default AnimalDetailsPanel;
