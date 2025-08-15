import { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function UserPictureComponent() {
  const { animal } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [results, setResults] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null); // image to show in modal
  const API_BASE_URL = import.meta.env.VITE_REACT_APP_WILD_LENS_BACKEND_BASE_URL;
  const userName = localStorage.getItem("userName");

  useEffect(() => {
    const fetchPictures = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`${API_BASE_URL}/Catalog/GetAllAnimalsPicturesForUser`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setResults(response.data || []);
      } catch (err) {
        console.error("Failed to fetch images:", err);
      }
    };

    fetchPictures();
  }, []);

  return (
    <div className="container">
      <div className="row">
        {results.map((img, index) => (
          <div key={index} className="col-sm-6 col-md-4 col-lg-3 mb-4">
            <div className="card h-100 shadow-sm" style={{ cursor: 'pointer' }}>
              <Link
                to={`/profile/${userName}/${img.animalName}/${encodeURIComponent(img.imagePath)}`}
                state={{ background: location }}>
                <img
                  src={img.imagePath}
                  alt={img.animalName}
                  className="card-img-top"
                  style={{ height: '200px', objectFit: 'cover' }}
                />
              </Link>
              <div className="card-body p-2">
                <h6 className="text-center mb-0">{img.AnimalName}</h6>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserPictureComponent;
