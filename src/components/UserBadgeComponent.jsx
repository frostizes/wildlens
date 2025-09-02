import { useState, useEffect } from 'react';
import { Card, Badge } from 'react-bootstrap';
import { FaStar, FaEdit, FaUpload, FaTimes } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useParams } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useLocation } from "react-router-dom";


function UserBadgeComponent() {
  const location = useLocation();
  const { userName, animal } = useParams();
  const { user, isAuthenticated, logout, token } = useAuth();
  const [results, setResults] = useState([]); // single animal, not an array
  const API_BASE_URL = import.meta.env.VITE_REACT_APP_WILD_LENS_BACKEND_BASE_URL;

  useEffect(() => {
    fetchBadges();
  }, []);


  const fetchBadges = async () => {
    try {
      const requestParams = {
        username: userName, // You might also need lng
      };
      const response = await axios.get(
        `${API_BASE_URL}/Profile/getAllUserBadges`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: requestParams,
        }
      );
      console.log("Search results:", response.data[0].badgeImageUrl);
      setResults(response.data || []);
    } catch (err) {
      console.error("Failed to fetch images:", err);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row">
        {results.map((badge, index) => (
          <div key={index} className="col-sm-6 col-md-4 col-lg-3 mb-4">
            <Card className={`h-100 shadow-sm ${badge.isOwned ? '' : 'opacity-50'}`}>
              {badge.badgeImageUrl ? (
                <div className="p-2" style={{ height: "200px", display: "flex", justifyContent: "center", alignItems: "center", overflow: "hidden" }}>
                  <Card.Img
                  variant="top"
                  src={badge.badgeImageUrl}
                  alt={badge.title}
                  style={{ height: "100%", width: "auto" , objectFit: "contain" }}
                />
                </div>
              ) : (
                <div className="d-flex align-items-center justify-content-center bg-light" style={{ height: "150px" }}>
                  <span className="text-muted">No Image</span>
                </div>
              )}
              <Card.Body className="text-center">
                <Card.Title className="fw-bold">{badge.title}</Card.Title>
                <Card.Text className="small text-muted">{badge.description}</Card.Text>
                <Badge bg="info">{badge.category}</Badge>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserBadgeComponent;
