import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

// Separate Modal Component
function AnimalModal({ show, handleClose }) {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Animal Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="flex">
          {/* Image Section */}
          <div className="w-1/2 pr-4">
            <img 
              src="/api/placeholder/500/400" 
              alt="Animal" 
              className="w-full h-auto object-cover rounded-lg"
            />
          </div>

          {/* Details Section */}
          <div className="w-1/2 pl-4">
            <h3>Lion</h3>
            <p>Majestic predator of the African savanna</p>
            
            {/* Comments */}
            <div className="mt-4">
              <h4>Comments</h4>
              <div className="bg-light p-2 mb-2">
                <strong>Wildlife Expert:</strong>
                <p>Incredible social structure within their pride.</p>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleClose}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AnimalModal;