import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BannerForm = () => {
  const navigate = useNavigate();
  const { bannerId } = useParams(); 
  const [formData, setFormData] = useState({
    type: "",
    category: "",
    description: "",
    photo: "",
    socialMediaLink: "",
    startTime: "",
    endTime: "",
  });

  useEffect(() => {
    if (bannerId) {
      fetchBannerData();
    }
  }, [bannerId]);

  const fetchBannerData = async () => {
    try {
      const response = await axios.get(`https://baaja-backend-2.onrender.com/api/banners/${bannerId}`);
      setFormData(response.data); 
    } catch (error) {
      console.error("Error fetching banner:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (event) => {
    setFormData({ ...formData, photo: event.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (bannerId) {
        const formDataToSend = new FormData();
        for (const key in formData) {
          formDataToSend.append(key, formData[key]);
        }

        await axios.put(`https://baaja-backend-2.onrender.com/api/banners/${bannerId}`, formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Banner Updated Successfully", { autoClose: 3000 });
      } else {
        // Create new banner
        const formDataToSend = new FormData();
        for (const key in formData) {
          formDataToSend.append(key, formData[key]);
        }

        await axios.post("https://baaja-backend-2.onrender.com/api/banners", formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Banner Created Successfully", { autoClose: 3000 });
      }

      setTimeout(() => {
        navigate("/banner");
      }, 2000);
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      toast.error("Something went wrong. Please try again later.", { autoClose: 3000 });
    }
  };

  return (
    <>
      <ToastContainer />
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <div className="p-4 rounded shadow-lg" style={{ width: "100%", maxWidth: "700px", backgroundColor: "#f8f9fa" }}>
          <h2 className="mb-4 text-center">{bannerId ? "Edit Banner" : "Add New Banner"}</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Banner Type</Form.Label>
              <Form.Control type="text" name="type" value={formData.type} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Select Category</Form.Label>
              <Form.Select name="category" value={formData.category} onChange={handleChange}>
                <option value="">-- Choose a Banner Category --</option>
                <option value='Gitar'>Gitar</option>
                <option value='Sitar'>Sitar</option>
                <option value='Band'>Band</option>
                <option value= 'Tabla'>Tabla</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={3} name="description" value={formData.description} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Upload Banner Photo</Form.Label>
              <Form.Control type="file" accept="image/*" alt={formData.photo} onChange={handleFileChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Link for the Banner</Form.Label>
              <Form.Control type="text" name="socialMediaLink" value={formData.socialMediaLink} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Time Period</Form.Label>
              <Row>
                <Col>
                  <Form.Control type="date" name="startTime" value={formData.startTime} onChange={handleChange} />
                </Col>
                <Col>
                  <Form.Control type="date" name="endTime" value={formData.endTime} onChange={handleChange} />
                </Col>
              </Row>
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">
              {bannerId ? "Update Banner" : "Add Banner"}
            </Button>
          </Form>
        </div>
      </Container>
    </>
  );
};

export default BannerForm;
