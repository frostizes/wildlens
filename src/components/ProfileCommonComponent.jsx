import { useState, useEffect } from 'react';
import { Modal, Button, Carousel, Form } from 'react-bootstrap';
import { FaStar, FaEdit, FaUpload, FaTimes } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useParams, NavLink } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useLocation } from "react-router-dom";


function ProfileCommonComponent() {
  const { userName } = useParams();

  return (
    <div className="card text-center p-4 mb-3">
      <div className="d-flex flex-column align-items-center">
        <img
          src="/path/to/profile.jpg" // Replace with actual image URL
          alt="Profile"
          className="rounded-circle mb-3"
          style={{ width: "120px", height: "120px", objectFit: "cover", border: "3px solid #555" }}
        />
        <h4>{userName}</h4>
        <div className="d-flex justify-content-center gap-3">
          <div><strong>Followers:</strong> 123</div>
          <div><strong>Captured animals:</strong> 42</div>
          <div><strong>Pictures:</strong> 68</div>
          <div><strong>Wild Score:</strong> 99</div>
        </div>
      </div>

      <div className="d-flex justify-content-center mt-4 gap-4">
        <NavLink
          to="pictures"
          className={({ isActive }) => isActive ? "tab-link active" : "tab-link"}
        >
          Pictures
        </NavLink>
        <NavLink
          to="taxonomy"
          className={({ isActive }) => isActive ? "tab-link active" : "tab-link"}
        >
          Taxonomy
        </NavLink>
        <NavLink
          to="badges"
          className={({ isActive }) => isActive ? "tab-link active" : "tab-link"}
        >
          Badges
        </NavLink>
      </div>
    </div>
  );
}

export default ProfileCommonComponent;
