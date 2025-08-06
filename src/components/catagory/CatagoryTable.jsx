import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Table, Modal, Button } from 'react-bootstrap';
import { useDrag, useDrop } from 'react-dnd';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const ITEM_TYPE = 'ROW';

const CategoryTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://35.154.161.226:5000/api/category');
      setData(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleDeleteClick = (category_id) => {
    setSelectedCategoryId(category_id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (selectedCategoryId) {
      try {
        await axios.delete(`http://35.154.161.226:5000/api/category/${selectedCategoryId}`);
        setData(data.filter((item) => item.category_id !== selectedCategoryId));
        setShowDeleteModal(false);
        setSelectedCategoryId(null);
      } catch (err) {
        console.error('Error deleting category:', err);
      }
    }
  };

  const handleEditClick = (category_id) => {
    navigate(`/edit-category/${category_id}`);
  };

  const moveRow = (fromIndex, toIndex) => {
    const updatedData = [...data];
    const [movedRow] = updatedData.splice(fromIndex, 1);
    updatedData.splice(toIndex, 0, movedRow);
    setData(updatedData);
  };

  const DraggableRow = ({ item, index }) => {
    const [, drag] = useDrag(() => ({
      type: ITEM_TYPE,
      item: { index },
    }));

    const [, drop] = useDrop(() => ({
      accept: ITEM_TYPE,
      hover: (draggedItem) => {
        if (draggedItem.index !== index) {
          moveRow(draggedItem.index, index);
          draggedItem.index = index;
        }
      },
    }));

    return (
      <tr ref={(node) => drag(drop(node))} className="table-row">
        <td className="text-center align-middle" style={{ fontWeight: '600', fontSize: '16px' }}>
          {item.category}
        </td>
        <td className="text-center">
          <div className="image-container">
            <img
              src={`http://35.154.161.226:5000/${item.photo}`}
              alt={item.category}
              className="category-image"
              // style={{ width: '80px', height: '80px', objectFit: 'cover' }}
              onError={(e) => (e.target.style.display = 'none')}
            />
          </div>
        </td>
        <td className="text-center">
          <div className="action-buttons mt-3 d-flex justify-content-center align-items-center align-middle">
            <button className="btn btn-danger me-2" onClick={() => handleDeleteClick(item.category_id)}>
              <FontAwesomeIcon icon={faTrash} />
            </button>
            <button className="btn btn-warning text-light" onClick={() => handleEditClick(item.category_id)}>
              <FontAwesomeIcon icon={faEdit} />
            </button>
          </div>
        </td>
      </tr>
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Container className="mt-4">
        <h3 className="text-center text-main mb-4">Category List</h3>
        {loading ? (
          <p className="text-center text-muted">Loading categories...</p>
        ) : error ? (
          <p className="text-danger text-center">Error: {error}</p>
        ) : (
          <div className="table-responsive">
            <Table responsive className="shadow-sm category-table table-striped">
              <thead className="bg-main text-white">
                <tr>
                  <th className="text-center align-middle">Category Name</th>
                  <th className="text-center align-middle">Category Image</th>
                  <th className="text-center align-middle">Action</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <DraggableRow key={item._id} index={index} item={item} />
                ))}
              </tbody>
            </Table>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to delete this category?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </DndProvider>
  );
};

export default CategoryTable;
