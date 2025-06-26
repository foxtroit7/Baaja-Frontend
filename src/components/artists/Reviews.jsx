import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal, Col, Card, Row, Button, Form } from "react-bootstrap";
import { faPencil, faTrash, faSave } from "@fortawesome/free-solid-svg-icons";

const Reviews = ({ user_id }) => {
  const [showModals, setShowModals] = useState(false);
  const [showAddReviewModal, setShowAddReviewModal] = useState(false);
  const [currentReview, setCurrentReview] = useState(null);
  const [editedReview, setEditedReview] = useState("");
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [newName, setNewName] = useState("");
  const [newRating, setNewRating] = useState("");


  const fetchReviews = () => {
    if (user_id) {
      fetch(`http://35.154.161.226:5000/api/artist/reviews/${user_id}`)
        .then((res) => res.json())
        .then((data) => {
      
          setReviews(data);
        })
        .catch((error) => console.error("Error fetching reviews:", error));
    }
  };
    // Fetch reviews when the component mounts
    useEffect(() => {
      if (user_id) {
        fetchReviews();
      }
    }, [user_id]);

  const handleCardClick = (review) => {
    setCurrentReview(review);
    setEditedReview(review.review);
    setShowModals(true);
  };

  const handleEditChange = (e) => setEditedReview(e.target.value);

  const saveEdit = async () => {
    if (!currentReview) return;
    try {
      const response = await fetch(
        `http://35.154.161.226:5000/api/artist/reviews/${user_id}/${currentReview._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ review: editedReview }),
        }
      );
      if (response.ok) {
        setReviews((prev) =>
          prev.map((r) =>
            r._id === currentReview._id ? { ...r, review: editedReview } : r
          )
        );
      }
    } catch (error) {
      console.error("Error updating review:", error);
    }
    setShowModals(false);
  };

  const deleteReview = async () => {
    if (!currentReview) return;
    try {
      const response = await fetch(
        `http://35.154.161.226:5000/api/artist/reviews/${user_id}/${currentReview._id}`,
        { method: "DELETE" }
      );
      if (response.ok) {
        setReviews((prev) => prev.filter((r) => r._id !== currentReview._id));
      }
    } catch (error) {
      console.error("Error deleting review:", error);
    }
    setShowModals(false);
  };

  // Add new review API call
  const addReview = async () => {
    if (!newReview || !newName || !newRating) return;

    const newReviewData = { review: newReview, name: newName, rating: newRating };

    try {
      const response = await fetch(
        `http://35.154.161.226:5000/api/artist/reviews/${user_id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newReviewData),
        }
      );
      if (response.ok) {
        const addedReview = await response.json();
        // console.log("Added review:", addedReview); // Log the added review

        // Force a re-fetch to ensure reviews are updated
        fetchReviews();

        setNewReview("");
        setNewName("");
        setNewRating("");
        setShowAddReviewModal(false);
      }
    } catch (error) {
      console.error("Error adding review:", error);
    }
  };

  return (
    <div style={{ fontFamily: "'Roboto', sans-serif", padding: "30px", backgroundColor: "#f0f4f8" }}>
      <h2 className="mb-4" style={{ fontWeight: "bold", textAlign: "center", color: "#3c4048" }}>
        User Reviews
      </h2>

      {/* Add Review Button */}
      <div className="d-flex justify-content-end mb-3">
        <Button
          onClick={() => setShowAddReviewModal(true)}
          style={{
            border: "none",
            borderRadius: "4px",
          }}
          variant="primary"
        >
          Add Review
        </Button>
      </div>

      {/* Reviews Grid */}
      <Row>
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <Col key={index} md={6} lg={3} className="mb-4">
              <Card
                className="h-100 shadow-lg"
                style={{ borderRadius: "15px", transition: "transform 0.3s, box-shadow 0.3s" }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                onClick={() => handleCardClick(review)}
              >
                <Card.Body>
                  <div className="d-flex align-items-center mb-4">
                    <div className="">
                      <Card.Title style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#007BFF" }}>
                        {review.name}
                      </Card.Title>
                    </div>
                  </div>
                  <Card.Text
                    style={{
                      fontSize: "1rem",
                      color: "#6c757d",
                      lineHeight: "1.6",
                      fontStyle: "italic",
                    }}
                  >
                    "{review.review}"
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p className="text-center w-100">No reviews available.</p>
        )}
      </Row>

      {/* Modal for Edit/Delete */}
      <Modal show={showModals} onHide={() => setShowModals(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit/Delete Review</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentReview && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Edit Review</Form.Label>
                <Form.Control as="textarea" rows={3} value={editedReview} onChange={handleEditChange} />
              </Form.Group>
              <div className="text-center text-light">
                <Button variant="warning" onClick={saveEdit} className="me-2">
                  <FontAwesomeIcon icon={faPencil} />
                </Button>
                <Button variant="danger" onClick={deleteReview}>
                  <FontAwesomeIcon icon={faTrash} />
                </Button>
              </div>
            </>
          )}
        </Modal.Body>
      </Modal>

      {/* Modal for Adding Review */}
      <Modal show={showAddReviewModal} onHide={() => setShowAddReviewModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Review</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Review</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter your review"
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Rating</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your rating"
              value={newRating}
              onChange={(e) => setNewRating(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddReviewModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={addReview}>
            <FontAwesomeIcon icon={faSave} /> Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Reviews;
