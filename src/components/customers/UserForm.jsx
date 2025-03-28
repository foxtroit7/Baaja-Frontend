import React, { useState, useEffect } from "react";
import { Form, Button, Container, Col } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";

const UserForm = () => {
  const navigate = useNavigate();
  const { booking_id, uuid } = useParams();
  console.log("booking", booking_id);
  console.log("uuid", uuid);

  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    area: "",
    category: "",
    photo: "",
    artist_name: "",
    booking_id: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookingData = async () => {
      if (booking_id && uuid) {
        try {
          const response = await fetch(`http://15.206.194.89:4000/api/users/${uuid}/bookings/${booking_id}`);
          if (!response.ok) throw new Error("Booking not found");
          const data = await response.json();
          setFormData({
            date: data.date || "",
            time: data.time || "",
            area: data.area || "",
            category: data.category || "",
            photo: data.photo || "",
            artist_name: data.artist_name || "",
            booking_id: data.booking_id || "",
          });
        } catch (error) {
          console.error("Error fetching booking data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchBookingData();
  }, [booking_id, uuid]);

  // Handle file change
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  // Handle form submission for editing
  const handleSubmit = async (event) => {
    event.preventDefault();

    const updatedData = { ...formData, photo: file ? file.name : formData.photo };

    try {
      const response = await fetch(
        `http://15.206.194.89:4000/api/users/${uuid}/bookings/${booking_id}`, // Edit mode
        {
          method: "PUT", // We are updating an existing booking
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        }
      );
      if (!response.ok) throw new Error("Error submitting data");
      alert("Booking updated successfully!");
      navigate("/user-profile");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error saving booking. Please try again.");
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <div>Loading...</div>
      </Container>
    );
  }

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh", fontFamily: "Roboto, sans-serif" }}
    >
      <div
        className="p-4 rounded shadow-lg"
        style={{ width: "100%", maxWidth: "700px", backgroundColor: "#f8f9fa" }}
      >
        <h2 className="mb-4 text-center" style={{ fontWeight: 600, color: "#343a40" }}>
          Edit Event Details
        </h2>
        <Form onSubmit={handleSubmit}>
        <div className="d-flex">       
      <Col md="6">
      <Form.Group className="mb-3 me-2" controlId="formArtistName">
            <Form.Label style={{ fontWeight: 500 }}>Artist Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Artist Name"
              value={formData.artist_name}
              onChange={(e) => setFormData({ ...formData, artist_name: e.target.value })}
              required
              style={{ fontWeight: 400, fontSize: "1rem", borderRadius: "0.375rem" }}
            />
          </Form.Group>
      </Col>

          {/* Booking ID */}
         <Col md="6"> 
          <Form.Group className="mb-3" controlId="formbooking_id">
            <Form.Label style={{ fontWeight: 500 }}>Booking ID</Form.Label>
            <Form.Control
              type="text"
              value={formData.booking_id}
              onChange={(e) => setFormData({ ...formData, booking_id: e.target.value })}
              disabled={true} // Disable the field since we're editing
              required
              style={{ fontWeight: 400, fontSize: "1rem", borderRadius: "0.375rem" }}
            />
          </Form.Group></Col></div>
          <div className="d-flex">
           {/* Event Area */}
           <Col md={6}>  <Form.Group className="mb-3 me-2" controlId="formEventArea">
            <Form.Label style={{ fontWeight: 500 }}>Event Area</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Event Area"
              value={formData.area}
              onChange={(e) => setFormData({ ...formData, area: e.target.value })}
              required
              style={{ fontWeight: 400, fontSize: "1rem", borderRadius: "0.375rem" }}
            />
          </Form.Group></Col>

          {/* Category Name */}
         <Col md={6}> <Form.Group className="mb-3" controlId="formCategoryName">
            <Form.Label style={{ fontWeight: 500 }}>Category Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Category Name"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
              style={{ fontWeight: 400, fontSize: "1rem", borderRadius: "0.375rem" }}
            />
          </Form.Group></Col>
     </div>
     <div className="d-flex">
     <Col md={6}>   {/* Date */}
          <Form.Group className="mb-3 me-2" controlId="formDate">
            <Form.Label style={{ fontWeight: 500 }}>Date</Form.Label>
            <Form.Control
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
              style={{ fontWeight: 400, fontSize: "1rem", borderRadius: "0.375rem" }}
            />
          </Form.Group></Col>

          {/* Time */}
         <Col md="6"> <Form.Group className="mb-3" controlId="formTime">
            <Form.Label style={{ fontWeight: 500 }}>Time</Form.Label>
            <Form.Control
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              required
              style={{ fontWeight: 400, fontSize: "1rem", borderRadius: "0.375rem" }}
            />
          </Form.Group></Col>
     </div>

    

          {/* Category Photo */}
          <Form.Group controlId="formCategoryPhoto" className="mb-3">
            <Form.Label style={{ fontWeight: 500 }}>Upload Category Photo</Form.Label>
            <Form.Control
              type="file"
              onChange={handleFileChange}
              style={{ fontWeight: 400, fontSize: "1rem", borderRadius: "0.375rem" }}
            />
          </Form.Group>

  

          {/* Submit Button */}
          <Button
            variant="primary"
            type="submit"
            style={{ width: "100%", padding: "10px", fontWeight: 600, fontSize: "1rem" }}
          >
            Save Changes
          </Button>
        </Form>
      </div>
    </Container>
  );
};

export default UserForm;
