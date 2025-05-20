import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Form, Button, Container } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BannerForm = () => {
  const navigate = useNavigate();
  const { banner_id } = useParams();

  const [formData, setFormData] = useState({
    section: "",
    page: "",
    link: "",
    connection: "",
    background_color: "",
  });

  const [existingPhoto, setExistingPhoto] = useState("");
  const [newPhoto, setNewPhoto] = useState(null);

  useEffect(() => {
    if (banner_id) {
      fetchBannerData();
    }
  }, [banner_id]);

  const fetchBannerData = async () => {
    try {
      const response = await axios.get(`http://15.206.194.89:5000/api/banner/${banner_id}`);
      const data = response.data;

      setFormData({
        section: data.section || "",
        page: data.page || "",
        link: data.link || "",
        connection: data.connection || "",
        background_color: data.background_color || "",
      });

      setExistingPhoto(data.photo || "");
    } catch (error) {
      console.error("Error fetching banner:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setNewPhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();

    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    if (newPhoto) {
      formDataToSend.append("photo", newPhoto);
    } else if (existingPhoto) {
      formDataToSend.append("existingPhoto", existingPhoto); // Optional: handle on backend
    }

    try {
      if (banner_id) {
        await axios.put(`http://15.206.194.89:5000/api/banners/${banner_id}`, formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Banner Updated Successfully", { autoClose: 3000 });
      } else {
        await axios.post("http://15.206.194.89:5000/api/banners", formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Banner Created Successfully", { autoClose: 3000 });
      }

      setTimeout(() => {
        navigate("/banner");
      }, 2000);
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      toast.error("Something went wrong. Please try again.", { autoClose: 3000 });
    }
  };

  return (
    <>
      <ToastContainer />
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <div className="p-4 rounded shadow" style={{ width: "100%", maxWidth: "600px", backgroundColor: "#f9f9f9" }}>
          <h3 className="text-center mb-4">{banner_id ? "Edit Banner" : "Add New Banner"}</h3>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Section</Form.Label>
              <Form.Select name="section" value={formData.section} onChange={handleChange}>
                <option value="">-- Select Section --</option>
                <option value="top">top</option>
                <option value="bottom">bottom</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Page</Form.Label>
              <Form.Select name="page" value={formData.page} onChange={handleChange}>
                <option value="">-- Select Page --</option>
                <option value="category">category</option>
                <option value="landing">landing</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Banner Link</Form.Label>
              <Form.Control type="text" name="link" value={formData.link} onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Upload Banner Photo</Form.Label>
              <Form.Control type="file" accept="image/*" onChange={handleFileChange} />
              {existingPhoto && !newPhoto && (
                <img
                  src={`http://15.206.194.89:5000/${existingPhoto}`}
                  alt="banner"
                  style={{ width: "100%", marginTop: "10px" }}
                />
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Connection</Form.Label>
              <Form.Select name="connection" value={formData.connection} onChange={handleChange}>
                <option value="">-- Select Connection --</option>
                <option value="booking">booking</option>
                <option value="artist">artist</option>
                <option value="category">category</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Background Color</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g., #FF5D5D"
                name="background_color"
                value={formData.background_color}
                onChange={handleChange}
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              {banner_id ? "Update Banner" : "Add Banner"}
            </Button>
          </Form>
        </div>
      </Container>
    </>
  );
};

export default BannerForm;
