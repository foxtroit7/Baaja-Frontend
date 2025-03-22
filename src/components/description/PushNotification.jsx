import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartSimple } from "@fortawesome/free-solid-svg-icons";
import Tennis from "../../assets/poster.jpg";
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';

const PushNotifications = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Huge Offer in this weeding Season",
      content: "celebrate your day with us",
      image: Tennis,
      timeAgo: "1 min",
    },
    {
      id: 2,
      title: "Huge Offer in this weeding Season",
      content: "celebrate your day with us",
      image: Tennis,
      timeAgo: "2 min",
    },
    {
      id: 3,
      title: "Huge Offer in this weeding Season",
      content: "celebrate your day with us",
      image: Tennis,
      timeAgo: "3 min",
    },
    {
      id: 4,
      title: "Huge Offer in this weeding Season",
      content: "celebrate your day with us",
      image: Tennis,
      timeAgo: "4 min",
    },
    {
      id: 5,
      title: "Huge Offer in this weeding Season",
      content: "celebrate your day with us",
      image: Tennis,
      timeAgo: "5 min",
    },
  ]);

  return (
    <div className="container py-5">
      {/* Top Section with Add Button */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="h4">Notifications</h2>
        <Button
          onClick={() => setModalOpen(true)}
          variant="primary"
        >
          Add New Notification
        </Button>
      </div>

      {/* Notification Cards (Mapped) */}
      {notifications.map((notif) => (
        <div key={notif.id} className="card mb-4 shadow-sm">
          {/* Header Section */}
          <div className="card-body">
            <div className="d-flex justify-content-between">
              <div className="d-flex">
                <h5 className="card-title">Baaja</h5>
                <p className="ms-4 text-muted">{notif.timeAgo}</p>
              </div>
            </div>

            {/* Content Section */}
            <div className="d-flex justify-content-between align-items-center mt-3">
              {/* Left: Title & Icon */}
              <div>
                <h5 className="card-title">
                  {notif.title}{" "}
                 
                </h5>
                <p>{notif.content}</p>
              </div>

              {/* Right: Image */}
              <img src={notif.image} alt="Offer" className="img-thumbnail" style={{ width: "80px", height: "80px" }} />
            </div>
          </div>
        </div>
      ))}

      {/* Modal */}
      <Modal show={modalOpen} onHide={() => setModalOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Notification</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {/* Form Inputs in Grid Layout */}
          <Form>
            <Row className="mb-3">
              <Col>
                <Form.Label>Offer Type</Form.Label>
                <Form.Control type="text" placeholder="e.g., Discount, Cashback" />
              </Col>
              <Col>
                <Form.Label>Offer Content</Form.Label>
                <Form.Control type="text" placeholder="Enter offer details" />
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Offer Start Time</Form.Label>
              <Form.Control type="datetime-local" />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Offer End Time</Form.Label>
              <Form.Control type="datetime-local" />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Target Audience</Form.Label>
              <Form.Control as="select">
                <option value="active">Active Users</option>
                <option value="banned">Banned Users</option>
                <option value="suspended">Suspended Users</option>
              </Form.Control>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Notification Method</Form.Label>
              <Form.Control as="select">
                <option value="phone">Phone</option>
                <option value="email">Email</option>
              </Form.Control>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Upload Offer Image</Form.Label>
              <Form.Control type="file" />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="success" onClick={() => setModalOpen(false)}>
            Save Notification
          </Button>
          <Button variant="secondary" onClick={() => setModalOpen(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PushNotifications;
