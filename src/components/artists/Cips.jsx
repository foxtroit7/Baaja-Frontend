import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Button, Col, Card, Modal, Form, Alert } from 'react-bootstrap';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPencil, faXmark } from '@fortawesome/free-solid-svg-icons';

const Cips = ({ user_id }) => {
  const navigate = useNavigate();
  const [clips, setClips] = useState([]);
  const [selectedClip, setSelectedClip] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Fetch token from localStorage
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchClips = async () => {
      if (!token) {
        setErrorMessage("Unauthorized! Please log in.");
        return;
      }

      try {
        const response = await axios.get(
          `http://loclahost:5000/api/artist/clips/${user_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setClips(response.data);
      } catch (error) {
        setErrorMessage("Error fetching clips.");
      }
    };

    fetchClips();
  }, [user_id, token]);

  const handleAddClip = () => {
    navigate(`/add-clip/${user_id}`);
  };

  const handleShowModal = (clip) => {
    setSelectedClip(clip);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedClip(null);
  };

  const handleEdit = async () => {
    if (!token) {
      setErrorMessage("Unauthorized! Please log in.");
      return;
    }

    const updatedClip = { title: selectedClip.title };

    try {
      await axios.put(
        `http://15.206.194.89:5000/api/artist/clips/${user_id}/${selectedClip._id}`,
        updatedClip,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setClips(clips.map((clip) => (clip._id === selectedClip._id ? { ...clip, ...updatedClip } : clip)));
      handleCloseModal();
    } catch (error) {
      setErrorMessage("Error updating clip.");
    }
  };

  const handleDelete = async () => {
    if (!token) {
      setErrorMessage("Unauthorized! Please log in.");
      return;
    }

    try { 
      await axios.delete(
        `http://15.206.194.89:5000/api/artist/clips/${user_id}/${selectedClip._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setClips(clips.filter((clip) => clip._id !== selectedClip._id));
      handleCloseModal();
    } catch (error) {
      setErrorMessage("Error deleting clip.");
    }
  };

  return (
    <div style={{ fontFamily: "'Roboto', sans-serif", padding: "20px" }}>
      <h2 style={{ fontFamily: "'Sans Serif', sans-serif", fontWeight: "bold" }}>Clips</h2>
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
      <Row>
        <Col className="d-flex justify-content-end">
          <Button
            onClick={handleAddClip}
            style={{
              backgroundColor: "#007BFF",
              border: "none",
              fontWeight: "bold",
              borderRadius: "8px",
            }}
          >
            Add New Clip
          </Button>
        </Col>
      </Row>

      <Row className="mt-4">
        {clips.map((clip) => (
          <Col key={clip._id} md={3} className="mb-4">
            <Card
              className="shadow-sm"
              style={{
                transition: "transform 0.2s",
                fontFamily: "'Roboto', sans-serif",
                borderRadius: "6px",
                overflow: "hidden",
              }}
            >
              <Card.Body>
                <Card.Title
                  style={{
                    fontWeight: "bold",
                    fontSize: "1.2rem",
                    color: "#343a40",
                    textAlign: "center",
                  }}
                >
                  {clip.title}
                </Card.Title>
                <div className="ratio ratio-16x9 mt-3">
                  <video
                    src={`http://15.206.194.89:5000/${clip.video}`}
                    controls
                    style={{ borderRadius: "12px", width: "100%" }}
                    onClick={() => handleShowModal(clip)}
                  ></video>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Modal for viewing/editing/deleting clip */}
      {selectedClip && (
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Edit or Delete Clip</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h5>{selectedClip.title}</h5>
            <div className="ratio ratio-16x9 mb-3">
              <video
                src={selectedClip.video}
                controls
                style={{ borderRadius: "12px", width: "100%" }}
              ></video>
            </div>

            <Form>
              <Form.Group controlId="formTitle">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedClip.title}
                  onChange={(e) => setSelectedClip({ ...selectedClip, title: e.target.value })}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="warning" onClick={handleCloseModal}>
              <FontAwesomeIcon icon={faXmark} className="text-light" />
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              <FontAwesomeIcon icon={faTrash} />
            </Button>
            <Button variant="primary" onClick={handleEdit}>
              <FontAwesomeIcon icon={faPencil} />
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default Cips;
