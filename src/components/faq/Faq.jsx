import React, { useEffect, useState } from "react";
import axios from "axios";
import { Accordion, Button, Modal, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

const Faq = () => {
  const [faqs, setFaqs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ question: "", answer: "" });
  const [editId, setEditId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchFaqs = async () => {
    try {
      const response = await axios.get("http://35.154.161.226:5000/api/faq");
      setFaqs(response.data);
    } catch (error) {
      console.error("Error fetching FAQs", error);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleShowModal = (faq = null) => {
    if (faq) {
      setEditId(faq._id);
      setFormData({ question: faq.question, answer: faq.answer });
    } else {
      setEditId(null);
      setFormData({ question: "", answer: "" });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`http://35.154.161.226:5000/api/faq/${editId}`, formData);
      } else {
        await axios.post("http://35.154.161.226:5000/api/faq", formData);
      }
      fetchFaqs();
      handleCloseModal();
    } catch (error) {
      console.error("Error saving FAQ", error);
    }
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://35.154.161.226:5000/api/faq/${deleteId}`);
      fetchFaqs();
    } catch (error) {
      console.error("Error deleting FAQ", error);
    } finally {
      setShowDeleteModal(false);
      setDeleteId(null);
    }
  };

  return (
    <div className="container mt-4 text-center">
      <h2 className="mb-4">Frequently Asked Questions</h2>
      <div className="d-flex justify-content-end">
        <Button variant="primary" onClick={() => handleShowModal()}>Add Question</Button>
      </div>
      <div className="d-flex justify-content-center">
        <Accordion defaultActiveKey="0" className="mt-3 w-75 p-4 shadow-lg rounded custom-accordion">
          {faqs.map((faq, index) => (
            <Accordion.Item eventKey={index.toString()} key={faq._id}>
              <Accordion.Header className="custom-accordion-header fw-medium">{faq.question}</Accordion.Header>
              <Accordion.Body> 
                <p className="text-start fw-medium">{faq.answer}</p>
                <div className="d-flex justify-content-end">
                  <FontAwesomeIcon
                    icon={faEdit}
                    className="text-primary mx-2"
                    onClick={() => handleShowModal(faq)}
                    style={{ cursor: "pointer" }}
                  />
                  <FontAwesomeIcon
                    icon={faTrash}
                    className="text-danger mx-2"
                    onClick={() => {
                      setDeleteId(faq._id);
                      setShowDeleteModal(true);
                    }}
                    style={{ cursor: "pointer" }}
                  />
                </div>
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      </div>

      {/* Modal for adding/editing FAQ */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editId ? "Edit FAQ" : "Add FAQ"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Question</Form.Label>
              <Form.Control
                type="text"
                name="question"
                value={formData.question}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Answer</Form.Label>
              <Form.Control
                as="textarea"
                name="answer"
                value={formData.answer}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              {editId ? "Update" : "Add"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this FAQ? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Faq;
