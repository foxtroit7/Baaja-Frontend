import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Table,
  Spinner,
  Tabs,
  Tab,
  Modal,
  Button,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BannerRow = ({ item, onDeleteClick }) => {
  const navigate = useNavigate();

  return (
    <tr>
      <td className="text-center align-middle">{item.section}</td>
      <td className="text-center align-middle">{item.page}</td>
      <td className="text-center align-middle ">
        <a href={item.link} target="_blank" className='text-main text-decoration-none' rel="noopener noreferrer">
          {item.link}
        </a>
      </td>
      <td className="text-center">
        <img
          src={`http://35.154.161.226:5000/${item.photo}`}
          alt="Banner"
          className="rounded shadow"
          style={{
            width: '120px',
            height: '60px',
            objectFit: 'cover',
            border: '2px solid #007bff',
          }}
        />
      </td>
      <td className="text-center align-middle">{item.connection}</td>
      <td className="text-center align-middle">
        {item.section.toLowerCase() === 'top' ? (
          <span
            style={{
              backgroundColor: item.background_color,
              padding: '5px 5px',
              borderRadius: '5px',
              color: '#fff',
              display: 'inline-block',
            }}
          >
            {item.background_color}
          </span>
        ) : (
          'No Color'
        )}
      </td>
      <td>
        <div className="d-flex justify-content-center align-items-center mt-2">
          <button
            className="me-2 bg-danger border-0 ps-2 pe-2 pb-1 pt-1 rounded"
            onClick={() => onDeleteClick(item.banner_id)}
          >
            <FontAwesomeIcon icon={faTrash} className="text-light" />
          </button>

          <button
            className="bg-warning border-0 ps-2 pe-2 pb-1 pt-1 rounded"
            onClick={() => navigate(`/edit-banner/${item.banner_id}`)}
          >
            <FontAwesomeIcon icon={faEdit} className="text-light" />
          </button>
        </div>
      </td>
    </tr>
  );
};

const BannerList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedBannerId, setSelectedBannerId] = useState(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = () => {
    axios
      .get('http://35.154.161.226:5000/api/banners')
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  };

  const confirmDelete = (banner_id) => {
    setSelectedBannerId(banner_id);
    setShowModal(true);
  };

  const handleDeleteConfirmed = async () => {
    try {
      await axios.delete(`http://35.154.161.226:5000/api/banners/${selectedBannerId}`);
      setData(data.filter((banner) => banner.banner_id !== selectedBannerId));
      toast.error('Banner Deleted Successfully', {
        position: 'top-right',
        autoClose: 3000,
      });
    } catch (error) {
      console.error('Error deleting banner:', error);
    } finally {
      setShowModal(false);
      setSelectedBannerId(null);
    }
  };

  const renderTable = (filteredData) => (
    <div className="table-responsive">
      <Table responsive className="shadow-sm table-striped">
        <thead className="bg-main text-white text-center">
          <tr>
            <th>Section</th>
            <th>Page</th>
            <th>Link</th>
            <th>Photo</th>
            <th>Connection</th>
            <th>Background Color</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item) => (
            <BannerRow key={item.banner_id} item={item} onDeleteClick={confirmDelete} />
          ))}
        </tbody>
      </Table>
    </div>
  );

  const topBanners = data.filter((item) => item.section.toLowerCase() === 'top');
  const bottomBanners = data.filter((item) => item.section.toLowerCase() === 'bottom');

  return (
    <>
      <ToastContainer />
      <Container>
        <h2 className="text-center text-main my-4">
          Banner List
        </h2>

        {loading ? (
          <div className="text-center my-4">
            <Spinner animation="border" className="bg-main" />
            <p>Loading banners...</p>
          </div>
        ) : error ? (
          <div className="text-center my-4 text-danger">
            <p>Error: {error}</p>
          </div>
        ) : (
          <div style={{ padding: '20px', borderRadius: '10px'}}>
            <Tabs defaultActiveKey="top" id="banner-tabs" className="mb-3 justify-content-center text-main fw-bold">
              <Tab eventKey="top" title="Top Section" className='text-main'>
                {renderTable(topBanners)}
              </Tab>
              <Tab eventKey="bottom" title="Bottom Section" className='text-main'>
                {renderTable(bottomBanners)}
              </Tab>
            </Tabs>
          </div>
        )}
      </Container>

      {/* Delete Confirmation Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className='text-dark'>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body className='text-dark'>
          Are you sure you want to delete this banner? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirmed}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default BannerList;
