import React, { useEffect, useState } from "react";
import axios from "axios";
import { Accordion, Button, Modal, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

const Help = () => {
  const [Helps, setHelps] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ question: "", answer: "" });
  const [editId, setEditId] = useState(null);

  const fetchHelps = async () => {
    try {
      const response = await axios.get("http://35.154.161.226:5000/api/help");
      setHelps(response.data);
    } catch (error) {
      console.error("Error fetching Helps", error);
    }
  };

  useEffect(() => {
    fetchHelps();
  }, []);

  const handleShowModal = (Help = null) => {
    if (Help) {
      setEditId(Help._id);
      setFormData({ question: Help.question, answer: Help.answer });
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
        await axios.put(`http://35.154.161.226:5000/api/help/${editId}`, formData);
      } else {
        await axios.post("http://35.154.161.226:5000/api/help", formData);
      }
      fetchHelps();
      handleCloseModal();
    } catch (error) {
      console.error("Error saving Help", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://35.154.161.226:5000/api/help/${id}`);
      fetchHelps();
    } catch (error) {
      console.error("Error deleting Help", error);
    }
  };

  return (
    <div className="container mt-4 text-center">
      <h2 className="mb-4">Help Center</h2>
      <div className="d-flex justify-content-end">
        <Button className="bg-main" onClick={() => handleShowModal()}>Add Question</Button>
      </div>
      <div className="d-flex justify-content-center">
        <Accordion defaultActiveKey="0" className="mt-3 w-75 p-4 shadow-lg rounded custom-accordion">
          {Helps.map((Help, index) => (
            <Accordion.Item eventKey={index.toString()} key={Help._id}>
              <Accordion.Header className="custom-accordion-header fw-medium">{Help.question}</Accordion.Header>
              <Accordion.Body> 
                <p className="text-start fw-medium">{Help.answer}</p>
                <div className="d-flex justify-content-end">
                <FontAwesomeIcon
                  icon={faEdit}
                  className="text-main mx-2"
                  onClick={() => handleShowModal(Help)}
                />
                <FontAwesomeIcon
                  icon={faTrash}
                  className="text-danger mx-2"
                  onClick={() => handleDelete(Help._id)}
                />
                </div>
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      </div>

      {/* Modal for adding/editing Help */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editId ? "Edit Help" : "Add Help"}</Modal.Title>
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
            <Button className="bg-main" type="submit">
              {editId ? "Update" : "Add"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Help;
