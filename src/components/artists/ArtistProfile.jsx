import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Container, Row, Col, Button, Modal, Form, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTruck, faMoneyBill, faPen, faEdit } from '@fortawesome/free-solid-svg-icons';
import { toast, ToastContainer } from 'react-toastify';
import ApppointmentScheduler from './ApppointmentScheduler';
import Clips from './Cips';
import Reviews from './Reviews';
import Booking from './Booking';
import 'react-toastify/dist/ReactToastify.css';

const ArtistProfile = () => {
  const [showServiceModal, setShowServiceModal] = useState(false);
const [editedServices, setEditedServices] = useState([]);

  const { user_id } = useParams();
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDesModal, setDesShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState(null);
  const [variant, setVariant] = useState("success");

  const fetchArtist = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Unauthorized! Please log in again.");
        setLoading(false);
        return;
      }
      const response = await fetch(`http://35.154.161.226:5000/api/artists_details?artist_id=${user_id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        setArtist(data[0]);
      } else {
        setArtist(null);
      }
    } catch (error) {
      console.error("Error fetching artist:", error);
      toast.error("Failed to load artist details.");
      setArtist(null);
    } finally {
      setLoading(false);
    }
  };
    const handleDetailsSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://35.154.161.226:5000/api/artist/details/${user_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (response.ok) {
        toast.success(result.message);
        setDesShowModal(false);
        fetchArtist();
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error.");
    }
  }

  const fetchPaymentData = async () => {
    try {
      const response = await fetch(`http://35.154.161.226:5000/api/artist/payment/${user_id}`);
      const data = await response.json();
      if (response.ok) {
        setPaymentData(data.artistPayments);
      } else {
        setPaymentData(null);
        console.error("Error fetching payment data:", data.message);
      }
    } catch (err) {
      console.error("Error:", err);
      setPaymentData(null);
    }
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://35.154.161.226:5000/api/artist/payment/${user_id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        setVariant("success");
        setMessage(result.message);
        setShowModal(false);
        fetchPaymentData();
      } else {
        setVariant("danger");
        setMessage(result.message);
      }
    } catch (err) {
      console.error(err);
      setVariant("danger");
      setMessage("Server error.");
    }
  };

  useEffect(() => {
    fetchArtist();
    fetchPaymentData();
  }, [user_id]);

  if (loading) return <h2 className="text-center mt-5">Loading artist details...</h2>;
  if (!artist) return <h2 className="text-center mt-5">Artist not found</h2>;

  return (
    <Container className="mt-4">
      <ToastContainer />
      <div className="text-center mb-4 p-4 rounded shadow position-relative" >
        {/* ✏️ Edit Icon in top-right */}
        <FontAwesomeIcon
          icon={faEdit}
          className="position-absolute"
          style={{ top: '15px', right: '20px', cursor: 'pointer', color: '#D20A2E ' }}
        onClick={() => {
  setFormData({
    owner_name: artist.owner_name || '',
    experience: artist.experience || '',
    description: artist.description || ''
  });
  setDesShowModal(true);
}}

        />

        <img
          src={`http://35.154.161.226:5000/${artist.poster}`}
          alt={artist.owner_name}
          className="mb-3"
          width={120}
          height={140}
          style={{ objectFit: 'cover', border: '2px solid #007bff' }}
        />
        <h3 className="text-main fw-bold">Owner Name: {artist.owner_name}</h3>
        <h5 className="text-main">Category: {artist.category_type}</h5>
        <h6 className="text-main">{artist.location}</h6>
        <h5 className='text-main'>
          Rating: {Array.from({ length: 5 }, (_, i) => (i < artist.rating ? '⭐' : '☆')).join('')}
        </h5>
        <h5 className="text-main">Experience: {artist.experience}</h5>
        <h5 className="text-main fw-bold">About:</h5>
        <p className="text-main">{artist.description}</p>
      </div>

      {/* 🛠 Edit Modal */}
      <Modal show={showDesModal} onHide={() => setDesShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className='text-dark'>Edit Artist Info</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label  className='text-dark'>Owner Name</Form.Label>
            <Form.Control
              type="text"
              value={formData.owner_name}
            
              onChange={(e) => setFormData({ ...formData, owner_name: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className='text-dark'>Experience</Form.Label>
            <Form.Control
              type="text"
              value={formData.experience}
             
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label  className='text-dark'>About</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
            
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </Form.Group>
        </Modal.Body>
            <Modal.Footer>
          <Button className='bg-main' onClick={() => setDesShowModal(false)}>Cancel</Button>
          <Button className='bg-main' onClick={handleDetailsSubmit}>Save Changes</Button>
        </Modal.Footer>
      </Modal>

      <Row className="g-4 mt-4 mb-4">
        <Col md={6}>
          <Card className="text-center shadow-lg rounded-3" style={{ backgroundColor: '#f8f9fa', border: 'none' }}>
            <Card.Body>
              <FontAwesomeIcon icon={faTruck} className="fs-3 text-main mb-3" />
              <Card.Title>Total Bookings</Card.Title>
              <Card.Text style={{ fontWeight: '500', fontSize: '18px' }}>{artist.total_bookings}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="text-center shadow-lg rounded-3" style={{ backgroundColor: '#f8f9fa', border: 'none' }}>
            <Card.Body>
              <FontAwesomeIcon icon={faMoneyBill} className="fs-3 text-main mb-3" />
              <Card.Title>Total Revenue</Card.Title>
              <Card.Text style={{ fontWeight: '500', fontSize: '18px' }}>{artist.total_revenue}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Card className="text-center shadow-lg rounded-3 mb-3" style={{ backgroundColor: '#f8f9fa', border: 'none' }}  
  >
            <Card.Body>
              <FontAwesomeIcon icon={faTruck} className="fs-3 text-main mb-3" />
              <Card.Title>Required Services</Card.Title>
                <Button
              
                size="sm"
                className="position-absolute bg-main"
                style={{ top: '15px', right: '15px' }}
                       onClick={() => {
    setEditedServices([...artist.required_services]);
    setShowServiceModal(true);
  }}
              >
                <FontAwesomeIcon icon={faPen} />
              </Button>
              <div>
                {artist.required_services.map((service, index) => (
                  <span key={index} className="badge bg-main me-2 mb-2">{service}</span>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="text-center shadow-lg rounded-3 mb-3 position-relative" style={{ backgroundColor: '#f8f9fa', border: 'none' }}>
            <Card.Body>
              <FontAwesomeIcon icon={faMoneyBill} className="fs-3 text-main mb-3" />
              <Button
               
                size="sm"
                className="position-absolute bg-main"
                style={{ top: '15px', right: '15px' }}
                onClick={() => {
                  setFormData(paymentData || {});
                  setShowModal(true);
                  setMessage(null);
                }}
              >
                <FontAwesomeIcon icon={faPen} />
              </Button>
              <Card.Title>Booking Charges of Artist</Card.Title>
              {paymentData ? (
                <div className="text-start">
                  <p>First Day: ₹{paymentData.first_day_booking}</p>
                  <p>Second Day: ₹{paymentData.second_day_booking}</p>
                  <p>Third Day: ₹{paymentData.third_day_booking}</p>
                  <p>Fourth Day: ₹{paymentData.fourth_day_booking}</p>
                  <p>Fifth Day: ₹{paymentData.fifth_day_booking}</p>
                  <p>Sixth Day: ₹{paymentData.sixth_day_booking}</p>
                  <p>Seventh Day: ₹{paymentData.seventh_day_booking}</p>
                </div>
              ) : (
                <p className="text-muted">No booking charges available.</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title  className='text-dark'>Edit Booking Charges</Modal.Title>
        </Modal.Header>
      <Modal.Body>
  {message && <Alert variant={variant}>{message}</Alert>}
  <Row className='text-dark'>
    {["first", "second", "third", "fourth", "fifth", "sixth", "seventh"].map((day, index) => (
      <Col md={6} key={day} className="mb-3">
        <Form.Group>
          <Form.Label  className='text-dark'>{day.charAt(0).toUpperCase() + day.slice(1)} Day</Form.Label>
          <Form.Control
            type="number"
        
            value={formData[`${day}_day_booking`] || ""}
            onChange={(e) =>
              setFormData({ ...formData, [`${day}_day_booking`]: e.target.value })
            }
          />
        </Form.Group>
      </Col>
    ))}
  </Row>
</Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button className="bg-main" onClick={handleSubmit}>Save</Button>
        </Modal.Footer>
      </Modal>
<Modal show={showServiceModal} onHide={() => setShowServiceModal(false)} centered>
  <Modal.Header closeButton>
    <Modal.Title  className='text-dark'>Edit Required Services</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {editedServices.map((service, index) => (
      <Form.Group className="mb-2" key={index}>
        <Form.Control
          type="text"
          
          value={service}
          onChange={(e) => {
            const newServices = [...editedServices];
            newServices[index] = e.target.value;
            setEditedServices(newServices);
          }}
        />
      </Form.Group>
    ))}
    <Button
      size="sm"
      onClick={() => setEditedServices([...editedServices, ""])}
      className="me-2 bg-main"
    >
      + Add Service
    </Button>
    {editedServices.length > 0 && (
      <Button
        size="sm"
        onClick={() => setEditedServices(editedServices.slice(0, -1))}
        className='bg-main'
      >
        − Remove Last
      </Button>
    )}
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowServiceModal(false)}>Cancel</Button>
    <Button
     className="bg-main"
      onClick={async () => {
        const token = localStorage.getItem("token");
        try {
          const response = await fetch(`http://35.154.161.226:5000/api/artist/details/${user_id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ required_services: editedServices }),
          });
          const result = await response.json();
          if (response.ok) {
            toast.success(result.message || "Updated successfully");
            setShowServiceModal(false);
            fetchArtist();
          } else {
            toast.error(result.message || "Update failed");
          }
        } catch (err) {
          console.error("Error updating services:", err);
          toast.error("Server error.");
        }
      }}
    >
      Save Changes
    </Button>
  </Modal.Footer>
</Modal>


      <ApppointmentScheduler artist_id={user_id} />
      <Clips user_id={user_id} />
      <Booking artist_id={user_id} />
      <Reviews user_id={user_id} />
    </Container>
  );
};

export default ArtistProfile;
