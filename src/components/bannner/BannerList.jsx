import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Table, Spinner } from 'react-bootstrap';
import { useDrag, useDrop } from 'react-dnd';
import { useNavigate } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
const ITEM_TYPE = 'banner';
const BannerRow = ({ item, index, moveRow, onDelete }) => {
  const navigate = useNavigate();
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
    <tr ref={(node) => drag(drop(node))} style={{ cursor: 'move' }}>
      <td className="text-center align-middle" style={{ fontWeight: '500' }}>{item.category}</td>
      <td className="text-center">
        <img
         src={`http://15.206.194.89:5000/${item.photo}`}
          alt={item.category}
          className="rounded-circle shadow"
          style={{
            width: '60px',
            height: '60px',
            objectFit: 'cover',
            border: '2px solid #007bff',
          }}
        />
      </td>
      <td className="text-center align-middle" style={{ color: '#007bff', fontWeight: '600' }}>{item.type}</td>
      <td className="text-center align-middle" style={{ fontStyle: 'italic' }}>{item.description}</td>
      <td className="text-center align-middle" style={{ color: '#6c757d', fontWeight: '500' }}>{item.startTime ? new Date(item.startTime).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ''} to {item.endTime ? new Date(item.endTime).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ''}</td>
      <td>
        <div className='d-flex justify-content-center align-items-center align-middle mt-3'>
          {/* Delete Button */}
          <button 
            className='me-2 bg-danger border-0 ps-2 pe-2 pb-1 pt-1 rounded' 
            onClick={() => onDelete(item.banner_id)} // Call delete function
          >
            <FontAwesomeIcon icon={faTrash} className='text-light' />
          </button>
          
          {/* Edit Button */}
          <button className='me-2 bg-warning border-0 ps-2 pe-2 pb-1 pt-1 rounded' onClick={() => navigate(`/edit-banner/${item.banner_id}`)}>
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

  // Fetch banners from API
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

  // DELETE API Call
  const handleDelete = async (banner_id) => {
    
      try {
        await axios.delete(`http://15.206.194.89:5000/api/banners/${banner_id}`);
        setData(data.filter((banner) => banner.banner_id !== banner_id)); // Remove deleted banner from state
         toast.error(`Banner Deleted Successfully`, {
              position: "top-right",
              autoClose: 3000,
            });
      } catch (error) {
        console.error("Error deleting banner:", error);
      }
  
  };

  const moveRow = (fromIndex, toIndex) => {
    const updatedData = [...data];
    const [movedItem] = updatedData.splice(fromIndex, 1);
    updatedData.splice(toIndex, 0, movedItem);
    setData(updatedData);
  };

  return (
    <>
    <ToastContainer />
    <DndProvider backend={HTML5Backend}>
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
          <div className="table-responsive">
            <Table bordered hover className="shadow-sm table-striped">
              <thead className="bg-primary text-white text-center">
                <tr>
                  <th style={{ padding: '15px' }}>Category</th>
                  <th style={{ padding: '15px' }}>Photo</th>
                  <th style={{ padding: '15px' }}>Type</th>
                  <th style={{ padding: '15px' }}>Description</th>
                  <th style={{ padding: '15px' }}>Time Period</th>
                  <th style={{ padding: '15px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <BannerRow key={item.banner_id} index={index} item={item} moveRow={moveRow} onDelete={handleDelete} />
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </Container>
    </DndProvider>
    </>
  );
};

export default BannerList;
