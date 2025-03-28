import React, { useState } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

const AddClip = () => {
  const navigate = useNavigate();
  const { user_id } = useParams();
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState(null);

const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };
console.log(user_id,'uuuuser_id add')
const handleSubmit = async (event) => {
  event.preventDefault();

  const token = localStorage.getItem("token"); // Get token from localStorage

  if (!token) {
    console.error("No token found. User might be logged out.");
    setMessage({ type: "danger", text: "Authentication token is missing" });
    return;
  }

  const formData = new FormData();
  formData.append("title", title);
  formData.append("video", file);

  try {
    const response = await fetch(
      `http://15.206.194.89:5000/api/artist/clips/${user_id}`,
      {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Pass token in the headers
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to upload clip");
    }

    setMessage({ type: "success", text: "Clip uploaded successfully!" });
    navigate(`/artist-profile/${user_id}`);
    console.log("Upload success:", data);
  } catch (error) {
    console.error("Upload error:", error);
    setMessage({ type: "danger", text: error.message });
  }
};


  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: '100vh', fontFamily: 'Roboto, sans-serif' }}
    >
      <div
        className="p-4 rounded shadow-lg"
        style={{ width: '100%', maxWidth: '600px', backgroundColor: '#f8f9fa' }}
      >
        <h2 className="mb-4 text-center" style={{ fontWeight: 600, color: '#343a40' }}>Add New Clip</h2>

        {message && <Alert variant={message.type}>{message.text}</Alert>}

        <Form onSubmit={handleSubmit}>
          {/* Clip Title */}
          <Form.Group className="mb-3" controlId="formClipTitle">
            <Form.Label style={{ fontWeight: 500 }}>Clip Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Clip Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{ fontWeight: 400, fontSize: '1rem', borderRadius: '0.375rem' }}
            />
          </Form.Group>

          {/* Video Upload */}
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label style={{ fontWeight: 500 }}>Upload Video</Form.Label>
            <Form.Control
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              required
              style={{ fontWeight: 400, fontSize: '1rem', borderRadius: '0.375rem' }}
            />
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            style={{ width: '100%', padding: '10px', fontWeight: 600, fontSize: '1rem' }}
          >
            Add
          </Button>
        </Form>
      </div>
    </Container>
  );
};

export default AddClip;
