import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CategoryForm = () => {
  const navigate = useNavigate();
  const { categoryId } = useParams(); // Get the category ID from the URL
  const [category, setCategory] = useState('');
  const [photo, setPhoto] = useState(null); // File input
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (categoryId) {
      // Fetch category data when editing
      axios.get(`https://baaja-backend-2.onrender.com/api/category/${categoryId}`)
        .then(response => {
          setCategory(response.data.category);
        })
        .catch(error => {
          console.error('Error fetching category data:', error);
          setErrorMessage('Failed to load category data.');
        });
    }
  }, [categoryId]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('category', category); // Add category name
    if (photo) {
      formData.append('photo', photo); // Add photo file
    }

    try {
      let response;
      if (categoryId) {
        // If there's an id, it's an edit, so use PUT
        response = await axios.put(`https://baaja-backend-2.onrender.com/api/category/${categoryId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        toast.success(`Category Updated Successfully`, {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        // If no id, it's an add, so use POST
        response = await axios.post('https://baaja-backend-2.onrender.com/api/category', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        toast.success(`Category Created Successfully`, {
          position: "top-right",
          autoClose: 3000,
        });
      }
      setSuccessMessage(response.data.message);
      setErrorMessage('');
      setCategory('');
      setPhoto(null);
      setTimeout(() => {
        navigate("/category");
      }, 2000);
    } catch (error) {
      setErrorMessage('Failed to save category. Please try again.');
      setSuccessMessage('');
      console.error('Error saving category:', error);
    }
  };

  return (
    <>
      <ToastContainer />
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', fontFamily: 'Roboto, sans-serif' }}>
        <div className="p-4 rounded shadow-lg" style={{ width: '100%', maxWidth: '600px', backgroundColor: '#f8f9fa' }}>
          <h2 className="mb-4 text-center" style={{ fontWeight: 600, color: '#343a40' }}>
            {categoryId ? 'Edit Category' : 'Add New Category'}
          </h2>

          {successMessage && <Alert variant="success">{successMessage}</Alert>}
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formCategoryName">
              <Form.Label style={{ fontWeight: 500 }}>Category Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Category Name"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                style={{
                  fontWeight: 400,
                  fontSize: '1rem',
                  borderRadius: '0.375rem',
                }}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formCategoryImage">
              <Form.Label style={{ fontWeight: 500 }}>Category Image</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => setPhoto(e.target.files[0])} // Update photo state with the selected file
                required={!categoryId} // Required only for new category creation
                style={{
                  fontWeight: 400,
                  fontSize: '1rem',
                  borderRadius: '0.375rem',
                }}
              />
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              style={{
                width: '100%',
                padding: '10px',
                fontWeight: 600,
                fontSize: '1rem',
              }}
            >
              {categoryId ? 'Update Category' : 'Add Category'}
            </Button>
          </Form>
        </div>
      </Container>
    </>
  );
};

export default CategoryForm;
