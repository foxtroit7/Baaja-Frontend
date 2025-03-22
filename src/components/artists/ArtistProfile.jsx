import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Container, Row, Col, Button, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTruck, faMoneyBill, faTruckFast, faUserSlash, faEdit } from '@fortawesome/free-solid-svg-icons';
import { toast, ToastContainer } from 'react-toastify';
import ApppointmentScheduler from './ApppointmentScheduler';
import Clips from './Cips'
import 'react-toastify/dist/ReactToastify.css';
import Reviews from './Reviews';
import Booking from './Booking';
const ArtistProfile = () => {
  const navigate = useNavigate();
  const { user_id } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isApproved, setIsApproved] = useState(false);
  const fetchArtist = async (user_id, setArtist, setLoading) => {
    setLoading(true);

    try {
        const token = localStorage.getItem("token"); // Get token from localStorage

        if (!token) {
            toast.error("Unauthorized! Please log in again.");
            setLoading(false); // Ensure loading state updates even when token is missing
            return;
        }

        const response = await fetch(
            `https://baaja-backend-2.onrender.com/api/artist-id/details/${user_id}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, // ✅ Pass token in Authorization header
                },
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to fetch artist details");
        }

        const data = await response.json();
        setArtist(data);
    } catch (error) {
        console.error("Error fetching artist:", error);
        toast.error(error.message || "Failed to load artist details.");
    } finally {
        setLoading(false); // ✅ Ensure loading state resets after fetch
    }
};

  
  useEffect(() => {
    setLoading(true);
    fetchArtist(user_id, setArtist, setLoading);
  }, [user_id]);
  if (loading) {
    return <h2 className="text-center mt-5">Loading artist details...</h2>;
  }

  if (!artist) {
    return <h2 className="text-center mt-5">Artist not found</h2>;
  }
  const changeDesc = () => {
    if (isApproved) {
      toast.success('Access granted! You can now change the description.', {
        position: "top-center",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      navigate('/change-desc');
    } else {
      toast.error('Access denied! You cannot change the description.', {
        position: "top-center",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };
  const handleAcceptRequest = () => {
    setIsApproved(true);
    setShowModal(false);
    toast.success('Request approved! You can change the description.', {
      position: "top-center",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const handleCancelRequest = () => {
    setIsApproved(false);
    setShowModal(false);
    toast.warn('Request canceled! Access denied.', {
      position: "top-center",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };
  return (
    <Container className="mt-4">
      <ToastContainer />
      
      {/* Profile Section */}
      <div className="text-center mb-4 p-4 rounded shadow" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="d-flex justify-content-end mt-2">
          <Button
            variant="outline-primary"
            style={{ padding: '5px 10px', borderRadius: '50%', fontSize: '1.2rem' }}
            onClick={() => setShowModal(true)}
          >
            <FontAwesomeIcon icon={faEdit} />
          </Button>
        </div>
        
        <img
        src="https://img.freepik.com/free-photo/portrait-white-man-isolated_53876-40306.jpg"
          alt={artist.name}
          className="rounded-circle mb-3"
          style={{ width: '120px', height: '120px', objectFit: 'cover', border: '3px solid #007bff' }}
        />

        <h3 className="fw-bold">Owner Name: {artist.name}</h3>
        <h5 className="text-primary">Category: {artist.category_type}</h5>
        <h6 className="text-muted">{artist.location}</h6>
        <h5>
  Rating: {
    artist.rating >= 1 ? '⭐' : '☆'}
    {artist.rating >= 2 ? '⭐' : '☆'}
    {artist.rating >= 3 ? '⭐' : '☆'}
    {artist.rating >= 4 ? '⭐' : '☆'}
    {artist.rating >= 4.5 ? '⭐' : artist.rating >= 4 ? '⯪' : '☆'}
</h5>

        <h5 className="text-dark">Experience: {artist.experience}</h5>
        <h5 className="text-secondary fw-bold">About:</h5>
        <p className="text-muted">{artist.description}</p>

        <Button variant="danger" size="md" className="mb-2">
          <FontAwesomeIcon icon={faUserSlash} className="pe-2" />
          Suspend Account
        </Button>
       <div>
       <Button
          className="btn btn-primary btn-sm mt-3"
          style={{
            padding: '8px 16px',
            fontWeight: 500,
            fontSize: '0.9rem',
          }}
          onClick={changeDesc}
        >
          Change Description
        </Button>
       </div>

      </div>

      {/* Statistics Cards */}
      <Row className="g-4 mt-4 mb-4">
        <Col md={4}>
          <Card className="text-center shadow-lg rounded-3" style={{ backgroundColor: '#f8f9fa', border: 'none' }}>
            <Card.Body>
              <FontAwesomeIcon icon={faTruck} className="fs-3 text-primary mb-3" />
              <Card.Title>Total Bookings</Card.Title>
              <Card.Text style={{ fontWeight: '500', fontSize: '18px' }}>{artist.total_bookings}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center shadow-lg rounded-3" style={{ backgroundColor: '#f8f9fa', border: 'none' }}>
            <Card.Body>
              <FontAwesomeIcon icon={faMoneyBill} className="fs-3 text-success mb-3" />
              <Card.Title>Total Money Earned</Card.Title>
              <Card.Text style={{ fontWeight: '500', fontSize: '18px' }}>${artist.total_money}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center shadow-lg rounded-3" style={{ backgroundColor: '#f8f9fa', border: 'none' }}>
            <Card.Body>
              <FontAwesomeIcon icon={faTruckFast} className="fs-3 text-warning mb-3" />
              <Card.Title>Recent Order</Card.Title>
              <Card.Text style={{ fontWeight: '500', fontSize: '18px' }}>{artist.recent_order}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
   
      <ApppointmentScheduler />
      <Clips user_id={user_id}/>
      <Booking artist_id={user_id} />
      <Reviews user_id={user_id} />
      <Modal
          show={showModal}
          onHide={() => setShowModal(false)}
          centered
          className="modal-dialog-centered"
          style={{
            fontFamily: "'Roboto', sans-serif",
            borderRadius: '4px',
            boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
          }}
        >
          <Modal.Header
            closeButton
            style={{

              color: '#007bff',

              borderRadius: '10px 10px 0 0',
            }}
          >
            <Modal.Title
              style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
              }}
              className='text-center'
            >
              Request to Change Description
            </Modal.Title>
          </Modal.Header>
          <Modal.Body
            style={{
              padding: '20px',
              fontSize: '1.1rem',
              color: '#495057',
              textAlign: 'center',
              backgroundColor: '#f8f9fa',
            }}
          >
            <p>Do you want to approve this request to change the description?</p>
          </Modal.Body>
          <Modal.Footer
            style={{
              backgroundColor: '#f8f9fa',
              borderTop: '2px solid #dee2e6',
              justifyContent: 'center',
            }}
          >
            <Button
              variant="light"
              onClick={handleCancelRequest}
              style={{
                backgroundColor: '#dc3545',
                color: '#fff',
                fontWeight: 'bold',
                borderRadius: '30px',
                padding: '10px 20px',
                fontSize: '1rem',
                boxShadow: '0rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
                border: 'none',
              }}
            >
              Cancel
            </Button>
            <Button
              variant="success"
              onClick={handleAcceptRequest}
              style={{
                backgroundColor: '#28a745',
                color: '#fff',
                fontWeight: 'bold',
                borderRadius: '30px',
                padding: '10px 20px',
                fontSize: '1rem',
                boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
                border: 'none',
                marginLeft: '10px',
              }}
            >
              Accept
            </Button>
          </Modal.Footer>
        </Modal>
    </Container>
  );
};

export default ArtistProfile;
