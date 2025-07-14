import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';

const ChangeDesc = () => {
  const [formData, setFormData] = useState({
    ownerName: '',
    category: '',
    phone: '',
    experience: '',
    about: '',
    description: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data Submitted:', formData);
  };

  return (
    <Container 
      className="d-flex justify-content-center align-items-center" 
      style={{
        minHeight: '100vh',
        fontFamily: 'Roboto, sans-serif',
      }}
    >
      <div 
        className="p-4 rounded shadow-lg" 
        style={{
          width: '100%',
          maxWidth: '600px',
          backgroundColor: '#f8f9fa',
        }}
      >
        <h2 className="mb-4 text-center" style={{ fontWeight: 600, color: '#343a40' }}>Artist Description Form</h2>
        <Form onSubmit={handleSubmit}>
          {/* Owner Name */}
          <Form.Group className="mb-3" controlId="formOwnerName">
            <Form.Label style={{ fontWeight: 500 }}>Owner Name</Form.Label>
            <Form.Control
              type="text"
              name="ownerName"
              placeholder="Enter owner's name"
              value={formData.ownerName}
              onChange={handleChange}
              required
              style={{
                fontWeight: 400,
                fontSize: '1rem',
                borderRadius: '0.375rem',
              }}
            />
          </Form.Group>

          {/* Category of Artist */}
          <Form.Group className="mb-3" controlId="formCategory">
            <Form.Label style={{ fontWeight: 500 }}>Category of Artist</Form.Label>
            <Form.Select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              style={{
                fontWeight: 400,
                fontSize: '1rem',
                borderRadius: '0.375rem',
              }}
            >
              <option value="">Select Category</option>
              <option value="Painter">Painter</option>
              <option value="Musician">Musician</option>
              <option value="Dancer">Dancer</option>
              <option value="Photographer">Photographer</option>
            </Form.Select>
          </Form.Group>

          {/* Phone Number */}
          <Form.Group className="mb-3" controlId="formPhone">
            <Form.Label style={{ fontWeight: 500 }}>Phone Number</Form.Label>
            <Form.Control
              type="tel"
              name="phone"
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={handleChange}
              required
              style={{
                fontWeight: 400,
                fontSize: '1rem',
                borderRadius: '0.375rem',
              }}
            />
          </Form.Group>

          {/* Experience */}
          <Form.Group className="mb-3" controlId="formExperience">
            <Form.Label style={{ fontWeight: 500 }}>Experience (in years)</Form.Label>
            <Form.Control
              type="number"
              name="experience"
              placeholder="Enter years of experience"
              value={formData.experience}
              onChange={handleChange}
              required
              style={{
                fontWeight: 400,
                fontSize: '1rem',
                borderRadius: '0.375rem',
              }}
            />
          </Form.Group>

          {/* About */}
          <Form.Group className="mb-3" controlId="formAbout">
            <Form.Label style={{ fontWeight: 500 }}>About</Form.Label>
            <Form.Control
              as="textarea"
              name="about"
              placeholder="Write something about yourself"
              value={formData.about}
              onChange={handleChange}
              rows={3}
              required
              style={{
                fontWeight: 400,
                fontSize: '1rem',
                borderRadius: '0.375rem',
              }}
            />
          </Form.Group>

          {/* Description */}
          <Form.Group className="mb-3" controlId="formDescription">
            <Form.Label style={{ fontWeight: 500 }}>Description</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              placeholder="Provide a detailed description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              required
              style={{
                fontWeight: 400,
                fontSize: '1rem',
                borderRadius: '0.375rem',
              }}
            />
          </Form.Group>

          <Button
          className="bg-main"
            type="submit"
            style={{
              width: '100%',
              padding: '10px',
              fontWeight: 600,
              fontSize: '1rem',
            }}
          >
            Submit
          </Button>
        </Form>
      </div>
    </Container>
  );
};

export default ChangeDesc;
