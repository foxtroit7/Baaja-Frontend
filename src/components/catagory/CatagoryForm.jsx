import { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CategoryForm = () => {
  const navigate = useNavigate();
  const { category_id } = useParams();
  const [category, setCategory] = useState('');
  const [photo, setPhoto] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (category_id) {
      // Fetch category data when editing
      axios.get(`http://35.154.161.226:5000/api/category/${category_id}`)
        .then(response => {
          setCategory(response.data.category);
        })
        .catch(error => {
          console.error('Error fetching category data:', error);
          setErrorMessage('Failed to load category data.');
        });
    }
  }, [category_id]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('category', category); 
    if (photo) {
      formData.append('photo', photo); 
    }

    try {
      let response;
      if (category_id) {
        // If there's an id, it's an edit, so use PUT
        response = await axios.put(`http://35.154.161.226:5000/api/category/${category_id}`, formData, {
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
        response = await axios.post('http://35.154.161.226:5000/api/category', formData, {
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
        <div className="p-4 rounded shadow-lg" style={{ width: '100%', maxWidth: '600px' }}>
          <h3 className="mb-4 text-center">
            {category_id ? 'Edit Category' : 'Add New Category'}
          </h3>

          {successMessage && <Alert className='bg-main'>{successMessage}</Alert>}
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formCategoryName">
              <Form.Label style={{ fontWeight: 500 }}>Category Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Category Name"
                value={category}
                className='custom-placeholder'
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
                required={!category_id} // Required only for new category creation
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
              {category_id ? 'Update Category' : 'Add Category'}
            </Button>
          </Form>
        </div>
      </Container>
    </>
  );
};

export default CategoryForm;
