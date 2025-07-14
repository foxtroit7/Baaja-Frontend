import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Modal, Form, Table, Container } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
const Purpose = () => {
  const [purposes, setPurposes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPurpose, setSelectedPurpose] = useState(null);
  const [formData, setFormData] = useState({ purpose: '' });
  const [isEditMode, setIsEditMode] = useState(false);

  // Fetch all purposes
  const fetchPurposes = async () => {
    try {
      const res = await axios.get('http://35.154.161.226:5000/api/purpose');
      setPurposes(res.data || []);
    } catch (error) {
      console.error('Error fetching purposes:', error);
    }
  };

  useEffect(() => {
    fetchPurposes();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Open modal for adding new
  const openAddModal = () => {
    setIsEditMode(false);
    setFormData({ purpose: '' });
    setShowModal(true);
  };

  // Open modal for editing
  const openEditModal = (purpose) => {
    setIsEditMode(true);
    setSelectedPurpose(purpose);
    setFormData({ purpose: purpose.purpose });
    setShowModal(true);
  };

  // Open modal for delete
  const openDeleteModal = (purpose) => {
    setSelectedPurpose(purpose);
    setShowDeleteModal(true);
  };

  // Add or update purpose
  const handleSave = async () => {
    try {
      if (isEditMode) {
        await axios.put(`http://35.154.161.226:5000/api/purpose/${selectedPurpose._id}`, formData);
        toast.success('Purpose updated successfully');
      } else {
        await axios.post('http://35.154.161.226:5000/api/purpose', formData);
        toast.success('Purpose added successfully');
      }
      fetchPurposes();
      setShowModal(false);
      setFormData({ purpose: '' });
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  // Delete purpose
  const handleDelete = async () => {
    try {
      await axios.delete(`http://35.154.161.226:5000/api/purpose/${selectedPurpose._id}`);
      toast.success('Deleted successfully');
      setShowDeleteModal(false);
      fetchPurposes();
    } catch (error) {
      toast.error('Deletion failed');
    }
  };

  return (
    <Container className="py-4">
      <ToastContainer />
      <h3 className="mb-4">Manage Purpose</h3>

      <div className="d-flex justify-content-end mb-3">
  <Button  onClick={openAddModal} className='bg-main'>
    Add Purpose
  </Button>
</div>

      <Table responsive className='table-striped'>
        <thead>
          <tr>
            <th className='text-center'>#</th>
            <th className='text-center'>Purpose</th>
            <th className='text-center'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {purposes.map((data, index) => (
            <tr key={data._id}>
              <td className='text-center'>{index + 1}</td>
              <td className='text-center'>{data.purpose}</td>
              <td className='d-flex justify-content-center'>
                <Button  size="sm" onClick={() => openEditModal(data)} className="me-2 bg-main">
                  <FontAwesomeIcon icon={faEdit} className='text-light' />
                </Button>
                <Button className='bg-main' size="sm" onClick={() => openDeleteModal(data)}>
                  <FontAwesomeIcon icon={faTrash} className='text-light' />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal for Add/Edit */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className='text-dark'>{isEditMode ? 'Edit Purpose' : 'Add Purpose'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label className='text-dark'>Title</Form.Label>
            <Form.Control
              type="text"
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              placeholder="Enter purpose purpose"
              className='custom-placeholder'
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button className='bg-main' onClick={handleSave}>
            {isEditMode ? 'Update' : 'Add'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for Delete Confirmation */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete <strong>{selectedPurpose?.purpose}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Purpose;
