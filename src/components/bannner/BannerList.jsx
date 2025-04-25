import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Table,
  Spinner,
  Tabs,
  Tab
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BannerRow = ({ item, onDelete }) => {
  const navigate = useNavigate();

  return (
    <tr>
      <td className="text-center align-middle">{item.section}</td>
      <td className="text-center align-middle">{item.page}</td>
      <td className="text-center align-middle">
        <a href={item.link} target="_blank" rel="noopener noreferrer">{item.link}</a>
      </td>
      <td className="text-center">
        <img
          src={`http://15.206.194.89:5000/${item.photo}`}
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
        <div className='d-flex justify-content-center align-items-center mt-2'>
          <button
            className='me-2 bg-danger border-0 ps-2 pe-2 pb-1 pt-1 rounded'
            onClick={() => onDelete(item.banner_id)}
          >
            <FontAwesomeIcon icon={faTrash} className='text-light' />
          </button>

          <button
            className='bg-warning border-0 ps-2 pe-2 pb-1 pt-1 rounded'
            onClick={() => navigate(`/edit-banner/${item.banner_id}`)}
          >
            <FontAwesomeIcon icon={faEdit} className='text-light' />
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

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = () => {
    axios.get('http://15.206.194.89:5000/api/banners')
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  };

  const handleDelete = async (banner_id) => {
    try {
      await axios.delete(`http://15.206.194.89:5000/api/banners/${banner_id}`);
      setData(data.filter((banner) => banner.banner_id !== banner_id));
      toast.error(`Banner Deleted Successfully`, {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Error deleting banner:", error);
    }
  };

  const renderTable = (filteredData) => (
    <div className="table-responsive">
      <Table bordered hover className="shadow-sm table-striped">
        <thead className="bg-primary text-white text-center">
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
            <BannerRow key={item.banner_id} item={item} onDelete={handleDelete} />
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
        <h2 className="text-center my-4" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 'bold', color: '#333' }}>
          Banners List
        </h2>

        {loading ? (
          <div className="text-center my-4">
            <Spinner animation="border" variant="primary" />
            <p>Loading banners...</p>
          </div>
        ) : error ? (
          <div className="text-center my-4 text-danger">
            <p>Error: {error}</p>
          </div>
        ) : (
          <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '10px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
          <Tabs defaultActiveKey="top" id="banner-tabs" className="mb-3 justify-content-center fw-bold">
            <Tab eventKey="top" title="Top Section">
              {renderTable(topBanners)}
            </Tab>
            <Tab eventKey="bottom" title="Bottom Section">
              {renderTable(bottomBanners)}
            </Tab>
          </Tabs>
        </div>
        
        )}
      </Container>
    </>
  );
};

export default BannerList;
