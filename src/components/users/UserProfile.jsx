import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Container, Row, Col, Image, Button, Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTruck, faMoneyBill, faTruckRampBox, faTools, faUser, faBagShopping } from '@fortawesome/free-solid-svg-icons';
import { Modal } from 'react-bootstrap';
import axios from "axios";
const UserProfile = () => {
  const { booking_id } = useParams();
  const [loading, setLoading] = useState(true); 
  const [booking, setBooking] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Fetch booking data
  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        if (!booking_id) {
          console.error("Booking ID is missing!");
          throw new Error("Booking ID is required");
        }

        const token = localStorage.getItem("token"); // Get token from localStorage

        if (!token) {
          console.error("No token found. User might be logged out.");
          throw new Error("Authentication token is missing");
        }

        const url = `http://35.154.161.226:5000/api/bookings/${booking_id}`;
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Pass token in Authorization header
          },
        });

        const data = await response.json();
        if (!response.ok || !data.booking) {
          throw new Error(data.message || "Booking not found");
        }

        setBooking(data.booking);
      } catch (error) {
        console.error("Error fetching booking data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingData();
  }, [booking_id, newStatus]);

  // Change status function
const changeStatus = async () => {
  try {
    const token = localStorage.getItem("token");

    const url = `http://35.154.161.226:5000/api/booking/update-status/${booking_id}`;

    const response = await axios.put(
      url,
      { status: newStatus },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

      // Check if the API response is successful (status 200)
    if (response.status === 200) {
      // Update booking status and rejection statuses
      setBooking((prev) => ({
        ...prev,
        status: newStatus,
        adminRejected: true, // Set adminRejected to true after success
        artistRejected: response.data.artistRejected,
        userRejected: response.data.userRejected,
      }));

    // Close modal
    setShowModal(false);
    }
    console.log("✅ Status changed:", response.data.message);
  } catch (error) {
    console.error("❌ Error changing status:", error?.response?.data?.message || error.message);
  }
};



  // Show confirmation modal
  const handleStatusChange = (status) => {
    setNewStatus(status);
    setShowModal(true);
  };

  if (loading) {
    return <h2 className="text-center mt-5">Loading...</h2>;
  }

  if (!booking) {
    return <h2 className="text-center mt-5">Booking not found</h2>;
  }

  const cardStyle = {
    fontFamily: 'Roboto, sans-serif',
    fontWeight: 400,
  };

  const headerStyle = {
    fontFamily: 'Roboto, sans-serif',
    fontWeight: 700,
    color: '#333',
  };

  const iconStyle = {
    fontSize: '1.5rem',
    marginBottom: '0.5rem',
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'accepted':
        return 'bg-success';
      case 'completed':
        return 'bg-info';
      case 'rejected':
        return 'bg-danger';
      case 'pending':
        return 'bg-warning';
      default:
        return 'bg-secondary';
    }
  };
  
  return (
    <>
    <Container className="mt-4" style={cardStyle}>
      <h2 className="text-center mb-4 text-main" style={headerStyle}>
        Booking Details
      </h2>
      <Row className="align-items-center">
        <Col md={6}>
          <div className="text-center mb-4">
            <Image
              src="https://i.pinimg.com/474x/a9/15/77/a915773aa44f2d6d5f5de7a5b765bd2d.jpg"
              roundedCircle
              style={{
                width: '150px',
                height: '150px',
                marginBottom: '10px',
              }}
            />
            <div>
              <h5 className='text-main'>User: {booking.full_name}</h5>
              <p>{booking.phone_number}</p>
            </div>
          </div>
        </Col>

        <Col md={6}>
          <div className="text-center mb-4">
 {booking.artist_details && booking.artist_details.poster ? (
  <Image
    src={`http://35.154.161.226:5000/${booking.artist_details.poster}`}
    style={{
      width: '150px',
      height: '150px',
      marginBottom: '10px',
    }}
    alt="Artist Poster"
  />
) : (
  <div
    style={{
      height: '150px',
      marginBottom: '10px',
  
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    No Poster
  </div>
)}


            <div>
              <h5 className='text-main'>Artist: {booking.artist_details?.owner_name}</h5>
              <p>{booking.alternate_number}</p>
            </div>
          </div>
        </Col>
      </Row>
      <Row className="justify-content-center mb-4">
        <Col md={6}>
          <Card className="text-center shadow" style={{ ...cardStyle }}>
            <Card.Body>
              <FontAwesomeIcon icon={faBagShopping} style={iconStyle} />
              <Card.Title>Status Of Booking</Card.Title>
              {/* Line for Current Status */}
              <hr />
              <Card.Text>
                <strong>Current Status:</strong>
                <span className={`badge ${getStatusBadgeClass(booking.status)} ms-2`}>
                  {booking.status || 'Not Set'}
                </span>
              </Card.Text>
              <hr style={{ borderColor: '#007bff', margin: '10px 0' }} />
              <Card.Text>
                <strong>Artist Rejection Status:</strong>
                <span className={`badge ${booking.artistRejected ? 'bg-danger' : 'bg-success'} ms-2`}>
                  {booking.artistRejected ? 'Rejected' : 'Not Rejected'}
                </span>
                <br />
                <strong>Admin Rejection Status:</strong>
                <span className={`badge ${booking.adminRejected ? 'bg-danger' : 'bg-success'} ms-2`}>
                  {booking.adminRejected ? 'Rejected' : 'Not Rejected'}
                </span>
                <br />
                <strong>User Rejection Status:</strong>
                <span className={`badge ${booking.userRejected ? 'bg-danger' : 'bg-success'} ms-2`}>
                  {booking.userRejected ? 'Rejected' : 'Not Rejected'}
                </span>
              </Card.Text>
              {/* Dropdown for Status Change */}
              <Dropdown>
                <Dropdown.Toggle className="bg-main" id="dropdown-basic" style={{ borderRadius: '25px' }}>
                  Change Status
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => handleStatusChange('accepted')}>accepted</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleStatusChange('completed')}>completed</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleStatusChange('rejected')}>rejected</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4">
        {/* Existing Cards */}
        <Col md={3}>
          <Card className="text-center shadow" style={cardStyle}>
            <Card.Body>
              <FontAwesomeIcon icon={faTruck} style={iconStyle} />
              <Card.Title>Booking Date</Card.Title>
              <Card.Text>
               {new Date(booking.createdAt).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true, 
  })}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow" style={cardStyle}>
            <Card.Body>
              <FontAwesomeIcon icon={faMoneyBill} style={iconStyle} />
              <Card.Title>Schedule Date</Card.Title>
              <Card.Text>
  {new Date(booking.schedule_date_start).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })}{" "}
  to{" "}
  {new Date(booking.schedule_date_end).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })}
</Card.Text>

            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow" style={cardStyle}>
            <Card.Body>
              <FontAwesomeIcon icon={faMoneyBill} style={iconStyle} />
              <Card.Title>Booking Purpose</Card.Title>
              <Card.Text>{booking.purpose}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow" style={cardStyle}>
            <Card.Body>
              <FontAwesomeIcon icon={faTruckRampBox} style={iconStyle} />
              <Card.Title>Shift</Card.Title>
              <Card.Text>{booking.shift}</Card.Text>
            </Card.Body>
          </Card>
        </Col>

        {/* Required Services */}
        <Row className="g-4">
          <Col md={6}>
            <Card className="shadow p-4" style={{ height: '30vh' }}>
              <h5 className="text-center">Required Services</h5>
              <hr />
              <ul className="list-unstyled">
                {booking.required_items?.map((service, index) => (
                  <li key={index}>
                
                    {service}
                  </li>
                ))}
              </ul>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="shadow p-4" style={{ height: '30vh' }}>
              <Card.Body>
                <Card.Title className="text-center text-main mb-4" style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
                  <FontAwesomeIcon icon={faUser} style={{ marginRight: '10px' }} /> User Details
                </Card.Title>
                <Card.Text style={{ fontSize: '1rem' }}>
                  <div><strong>Name:</strong>{booking.full_name}</div>
                  <div><strong>Address:</strong>{booking.address}, {booking.district}, {booking.district}, {booking.pincode}</div>
                  <div><strong>Aadhar Number:</strong> {booking.adhaar_number}</div>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Row>
    </Container>
    {/* Modal for confirmation */}
<Modal show={showModal} onHide={() => setShowModal(false)} centered>
  <Modal.Header closeButton>
    <Modal.Title className='text-dark'>Confirm Status Change</Modal.Title>
  </Modal.Header>
  <Modal.Body className='text-dark'>
    Are you sure you want to change the booking status to <strong>{newStatus}</strong>?
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowModal(false)}>
      Cancel
    </Button>
    <Button className='bg-main' onClick={changeStatus}>
      Confirm
    </Button>
  </Modal.Footer>
</Modal>
    </>
  );
};

export default UserProfile;
