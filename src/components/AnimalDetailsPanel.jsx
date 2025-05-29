import { useState, useEffect } from 'react';
import { Modal, Button, Carousel, Form } from 'react-bootstrap';
import { FaStar, FaEdit, FaUpload, FaTimes } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';


function AnimalDetailsPanel() {
  return (
    <div className="card">
      <img
        src="https://via.placeholder.com/300x200.png?text=Animal+Image"
        className="card-img-top"
        alt="Animal"
      />
      <div className="card-body">
        <h5 className="card-title">Animal Name</h5>
        <p className="card-text">Short description of the animal.</p>
        <a href="/gallery/animal-id" className="btn btn-primary">
          View All Pictures
        </a>
      </div>
    </div>
  );
}

export default AnimalDetailsPanel;