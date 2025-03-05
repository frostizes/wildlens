import { useState } from 'react';
import { Modal, Button, Carousel } from 'react-bootstrap';
import panda from '../assets/panda.jpg';
import lion from '../assets/panda2.jpg';
import tiger from '../assets/reptile.jpg';

function AnimalModal({ show, handleClose, selectedNode }) {
  const images = [panda, lion, tiger]; // Array of images for the carousel

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      dialogClassName="custom-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>{selectedNode}</Modal.Title>
      </Modal.Header>
      <Modal.Body id='test'>
        <div id='container-picture'>
          <div className="d-flex flex-column align-items-center" id='picture-carousel'>
            {/* Carousel for Images */}
            <Carousel interval={null} id='carousel'>
              {images.map((image, index) => (
                <Carousel.Item key={index}>
                  <img
                    src={image}
                    alt={`Animal ${index + 1}`}
                    className="img-fluid rounded-lg"
                  />
                </Carousel.Item>
              ))}
            </Carousel>

            {/* Details Section */}
          </div>
          
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default AnimalModal;
