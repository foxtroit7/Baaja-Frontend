import React, { useState, useEffect } from "react";
import Tennis from "../../assets/poster.jpg"; // fallback image
import { Modal, Button, Form } from "react-bootstrap";
import { getFirebaseToken, onMessageListener } from "../../firebaseClient"; // Import the Firebase methods

const PushNotifications = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: "", body: "" }); // Removed sub_body
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Request permission to send notifications
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        console.log("Notification permission granted.");
        getFirebaseToken(); // Get the Firebase token after permission is granted
      } else {
        console.log("Notification permission denied.");
      }
    });

   
    onMessageListener()
      .then((payload) => {
        console.log('Foreground Message: ', payload);
        alert(`New Notification: ${payload.notification.title}`);  // Alert the user with the notification title
      })
      .catch((err) => console.log("Failed to receive message: ", err));

    const fetchNotifications = async () => {
      try {
        const res = await fetch("http://15.206.194.89:5000/api/push-notifications");
        const data = await res.json();

        if (res.ok) {
          setNotifications(data.notifications || []);
        } else {
          alert("Failed to load notifications");
        }
      } catch (err) {
        console.error("GET error:", err);
        alert("Error loading notifications");
      }
    };

    fetchNotifications();
  }, []);

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://15.206.194.89:5000/api/push-notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Notification sent successfully!");

        // Add new notification at the top
        setNotifications((prev) => [
          {
            _id: Date.now(),
            title: formData.title,
            body: formData.body,
            createdAt: new Date().toISOString(),
          },
          ...prev,
        ]);

        // Reset form & close modal
        setFormData({ title: "", body: "" }); // Reset form data without sub_body
        setModalOpen(false);
      } else {
        alert("Failed to send notification: " + result.error);
      }
    } catch (error) {
      console.error("POST error:", error);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="container py-5">
      {/* Top Bar */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="h4">Notifications</h2>
        <Button onClick={() => setModalOpen(true)} variant="primary">
          Add New Notification
        </Button>
      </div>

      {/* Notification Cards */}
      {notifications.map((notif) => (
        <div key={notif._id || notif.id} className="card mb-4 shadow-sm">
          <div className="card-body">
            <div className="d-flex justify-content-between">
              <div className="d-flex">
                <h5 className="card-title">Baaja</h5>
                <p className="ms-4 text-muted">
                  {new Date(notif.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="d-flex justify-content-between align-items-center mt-3">
              <div>
                <h5 className="card-title">{notif.title}</h5>
                <p>{notif.body}</p> {/* Removed sub_body */}
              </div>
              <img
                src={Tennis}
                alt="Offer"
                className="img-thumbnail"
                style={{ width: "80px", height: "80px" }}
              />
            </div>
          </div>
        </div>
      ))}

      {/* Modal */}
      <Modal show={modalOpen} onHide={() => setModalOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Send Notification</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter title"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Body</Form.Label>
              <Form.Control
                type="text"
                name="body"
                value={formData.body}
                onChange={handleInputChange}
                placeholder="Enter body"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handleSubmit}>
            Send Notification
          </Button>
          <Button variant="secondary" onClick={() => setModalOpen(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PushNotifications;
