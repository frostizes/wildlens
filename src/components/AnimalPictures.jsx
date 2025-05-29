import { useState, useEffect } from 'react';
import { Modal, Button, Carousel, Form } from 'react-bootstrap';
import { FaStar, FaEdit, FaUpload, FaTimes } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

function AnimalModal({ show, handleClose, selectedNode }) {
  const { user } = useAuth(); // Get user from AuthContext
  const [images, setImages] = useState([]); // State for images
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);
  const [showDeleteIcons, setShowDeleteIcons] = useState(false);
  const API_BASE_URL = import.meta.env.VITE_REACT_APP_WILD_LENS_BACKEND_BASE_URL;


  useEffect(() => {
    if (show) {
      fetchImages();
    }
  }, [show]); // Fetch images when modal is shown

  const fetchImages = async () => {
    console.log("token " + user);
    try {
      const response = await fetch(API_BASE_URL + "/Catalog/GetUserImagesPaths", {
        method: 'GET',
        headers: {
          'Accept': '*/*',
          "Authorization": `Bearer ${user}`, // ✅ Use JWT Token
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch images');
      }

      const data = await response.json();
      setImages(data); // Assuming API returns an array of image URLs
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  const handleCommentSubmit = () => {
    if (newComment.trim() !== '') {
      setComments([...comments, newComment]);
      setNewComment('');
    }
  };
  const handleEditClick = () => {
    setShowDeleteIcons(!showDeleteIcons);
  };

  const handleDeleteImage = (index) => {
    console.log("image to delete " + images.filter((_, i) => i !== index));
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <Modal show={show} onHide={handleClose} centered dialogClassName="custom-modal" id="animal-modal">
      <Modal.Header className="d-flex justify-content-between align-items-center">
        <Modal.Title>{selectedNode}</Modal.Title>
        <div className="d-flex align-items-center">
          <FaUpload size={20} className="me-3" style={{ cursor: 'pointer' }} />
          <FaEdit size={20} className="me-3" style={{ cursor: 'pointer' }} onClick={handleEditClick} />
          <Button variant="close" onClick={handleClose} />
        </div>
      </Modal.Header>
      <Modal.Body>
        <div id='container-picture' className="d-flex">
          <div className="d-flex flex-column align-items-center flex-grow-1">
            <Carousel interval={null} id='carousel'>
              {images.length > 0 ? (
                images.map((image, index) => (
                  <Carousel.Item key={index}>
                    <img src={image} alt={`Animal ${index + 1}`} className="img-fluid rounded-lg" />
                    {showDeleteIcons && (
                      <FaTimes
                        size={24}
                        color="red"
                        className="position-absolute"
                        style={{ top: 10, right: 10, cursor: 'pointer' }}
                        onClick={() => handleDeleteImage(index)}
                      />
                    )}
                  </Carousel.Item>
                ))
              ) : (
                <p>No images available.</p>
              )}
            </Carousel>
          </div>

          <div id="comment-section" className="border rounded p-3" style={{ width: '400px' }}>
            <h5>Comments</h5>
            <div className="comment-list" style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {comments.length > 0 ? (
                comments.map((comment, index) => (
                  <p key={index} className="border-bottom pb-2">{comment}</p>
                ))
              ) : (
                <p>No comments yet.</p>
              )}
            </div>
            <Form.Group className="mt-3">
              <Form.Control
                as="textarea"
                rows={2}
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <Button className="mt-2 w-100" variant="primary" onClick={handleCommentSubmit}>
                Post Comment
              </Button>
            </Form.Group>

            {/* Star Rating System */}
            <div className="mt-4 text-center">
              <h6>Rate this picture</h6>
              {[...Array(5)].map((star, index) => {
                const ratingValue = index + 1;
                return (
                  <FaStar
                    key={index}
                    size={24}
                    className="me-1"
                    color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                    onClick={() => setRating(ratingValue)}
                    onMouseEnter={() => setHover(ratingValue)}
                    onMouseLeave={() => setHover(null)}
                    style={{ cursor: 'pointer' }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default AnimalModal;
