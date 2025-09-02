import { useState, useEffect } from 'react';
import { Modal, Button, Carousel, Form } from 'react-bootstrap';
import { FaStar, FaEdit, FaUpload, FaTimes } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useParams, NavLink } from "react-router-dom";
import axios from "axios";
import profilePic from "../assets/profilePic.png"; // Ajoute ton logo ici
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useLocation } from "react-router-dom";


function ProfileCommonComponent() {


  const { userName } = useParams();
  const [profilePicture, setProfilePicture] = useState("");
  const { user, isAuthenticated, logout, token } = useAuth();
  const [followers, setFollowers] = useState(0);
  const [wildScore, setWildScore] = useState(0);
  const [capturedAnimalsCount, setCapturedAnimalsCount] = useState(0);
  const [pictureCount, setPictureCount] = useState('');
  const API_BASE_URL = import.meta.env.VITE_REACT_APP_WILD_LENS_BACKEND_BASE_URL;
  const isUserProfile = userName === user;
  const [isFollowingBool, setIsFollowingBool] = useState(false);
  const [followLoading, setFollowLoading] = useState(true);



  useEffect(() => {
    RetrieveUserDetails();
    if (!isUserProfile) isFollowing();
  }, [token, userName]); // Fetch images when modal is shown

  const isFollowing = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Profile/getFollowingState`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        params: {
          userName: userName
        }
      });
      if (response.status === 200) {
        setIsFollowingBool(response.data);
      }
    } catch (error) {
      console.error('Error retrieving follow state', error);
    }
    finally {
      setFollowLoading(false);
      console.log("isFollowingBool", isFollowingBool);
    }
  }


  const switchFollowingState = async () => {
    try {
      // Prepare the request object

      const response = await axios.post(
        `${API_BASE_URL}/Profile/switchFollowingState`,
        JSON.stringify(userName), // <-- this is the request body
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );


      setIsFollowingBool(!isFollowingBool);
      RetrieveUserDetails();
    } catch (err) {
      console.error("Search failed:", err);
    }
  };


  const RetrieveUserDetails = async () => {
    try {
      const requestParams = {
        userName: userName
      };
      const response = await axios.get(`${API_BASE_URL}/Profile/GetUserProfileDetails`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        params: requestParams
      });
      if (response.status === 200) {
        setFollowers(response.data.numberOfFollowers);
        setWildScore(response.data.wildScore);
        setCapturedAnimalsCount(response.data.capturedAnimalsCount);
        setPictureCount(response.data.pictureCount);
      }
    } catch (error) {
      console.error('Error retrieving likes:', error);
    }
  };

  return (
    <div className="card text-center p-4 mb-3">
      <div className="d-flex flex-column align-items-center">
        <img
          src={profilePicture || profilePic} // Replace with actual image URL
          alt="Profile"
          className="rounded-circle mb-3"
          style={{ width: "120px", height: "120px", objectFit: "cover", border: "3px solid #555" }}
        />
        <h4>{userName}</h4>
        {!isUserProfile && !followLoading && (
          isFollowingBool ? (
            <Button variant="info" onClick={switchFollowingState} className="mt-2">
              Unfollow
            </Button>
          ) : (
            <Button variant="primary" onClick={switchFollowingState} className="mt-2">
              Follow
            </Button>
          )
        )}
        <div className="d-flex justify-content-center gap-3">
          <div><strong>Followers:</strong> {followers}</div>
          <div><strong>Captured animals:</strong> {capturedAnimalsCount}</div>
          <div><strong>Pictures:</strong> {pictureCount}</div>
          <div><strong>Wild Score:</strong> {wildScore}</div>
        </div>
      </div>

      <div className="d-flex justify-content-center mt-4">
        <ul className="nav nav-pills gap-3">
          <li className="nav-item">
            <NavLink
              to="pictures"
              className={({ isActive }) => "nav-link"}
              style={({ isActive }) => ({
                borderRadius: "50px",
                padding: "0.5rem 1.2rem",
                fontWeight: isActive ? "600" : "500",
                color: isActive ? "white" : "#555",
                backgroundColor: isActive ? "#0d6efd" : "#f8f9fa",
                boxShadow: isActive ? "0 2px 8px rgba(13, 110, 253, 0.3)" : "none",
                transition: "all 0.2s ease-in-out",
              })}
            >
              📷 Pictures
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="taxonomy"
              className={({ isActive }) => "nav-link"}
              style={({ isActive }) => ({
                borderRadius: "50px",
                padding: "0.5rem 1.2rem",
                fontWeight: isActive ? "600" : "500",
                color: isActive ? "white" : "#555",
                backgroundColor: isActive ? "#0d6efd" : "#f8f9fa",
                boxShadow: isActive ? "0 2px 8px rgba(13, 110, 253, 0.3)" : "none",
                transition: "all 0.2s ease-in-out",
              })}
            >
              🌱 Taxonomy
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="badges"
              className={({ isActive }) => "nav-link"}
              style={({ isActive }) => ({
                borderRadius: "50px",
                padding: "0.5rem 1.2rem",
                fontWeight: isActive ? "600" : "500",
                color: isActive ? "white" : "#555",
                backgroundColor: isActive ? "#0d6efd" : "#f8f9fa",
                boxShadow: isActive ? "0 2px 8px rgba(13, 110, 253, 0.3)" : "none",
                transition: "all 0.2s ease-in-out",
              })}
            >
              🏅 Badges
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default ProfileCommonComponent;
