import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import { FaUpload, FaEdit, FaTimes } from 'react-icons/fa';
import { Button } from 'react-bootstrap';
import { Link, useLocation } from "react-router-dom";


function AnimalGallery() {
  const { animal } = useParams();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const fileInputRef = useRef();
  const [userName, SetUserName] = useState("");
  const [showDeleteIcons, setShowDeleteIcons] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_REACT_APP_WILD_LENS_BACKEND_BASE_URL;
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    SetUserName(localStorage.getItem("userName"));
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/Catalog/GetUserImagesPaths/${animal}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setImages(data);
    } catch (err) {
      console.error('Failed to fetch images', err);
    }
  };

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file || !file.type.startsWith('image/')) return;

    const formData = new FormData();
    formData.append('picture', file, file.name);
    formData.append('animalName', animal);

    const response = await fetch(`${API_BASE_URL}/Catalog/UploadPicture`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (response.ok) fetchImages();
  };

  const handleDeleteImage = async (imagePath) => {
    const formData = new FormData();
    formData.append('imagePath', imagePath);

    const response = await fetch(`${API_BASE_URL}/Catalog/DeletePicture`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (response.ok) fetchImages();
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3">
        <h2>{animal} Gallery</h2>
        <div>
          <FaUpload size={20} className="me-3" onClick={handleUploadClick} style={{ cursor: 'pointer' }} />
          <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} />
          <FaEdit size={20} onClick={() => setShowDeleteIcons(!showDeleteIcons)} style={{ cursor: 'pointer' }} />
        </div>
      </div>

      <div className="row">
        {images.map((img, idx) => (
          <div className="col-6 col-md-3 mb-3 position-relative" key={idx}>
            <Link
              to={`/catalog/${userName}/${animal}/${encodeURIComponent(img)}`}
              state={{ background: location }}>
              <img
                src={img}
                alt={`Animal ${idx}`}
                className="img-fluid rounded"
                style={{ cursor: 'pointer' }}
              />
            </Link>
            {showDeleteIcons && (
              <FaTimes
                size={20}
                color="red"
                className="position-absolute"
                style={{ top: 10, right: 10, cursor: 'pointer' }}
                onClick={() => handleDeleteImage(img)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AnimalGallery;
