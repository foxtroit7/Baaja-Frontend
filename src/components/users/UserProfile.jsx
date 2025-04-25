import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Container, Row, Col, Image, Button, Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTruck, faMoneyBill, faTruckRampBox, faCheckCircle, faTools, faUser, faBagShopping } from '@fortawesome/free-solid-svg-icons';
import { Modal } from 'react-bootstrap';

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

        const url = `http://15.206.194.89:5000/api/bookings/${booking_id}`;
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
  }, [booking_id]);

  // Change status function
  const changeStatus = async () => {
    try {
      const token = localStorage.getItem("token");
  
      const url = `http://15.206.194.89:5000/api/booking/update-status/${booking_id}`;
  
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
  
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Error changing status");
      }
  
      // On success, update the booking data directly without refetching
      setBooking((prevBooking) => ({
        ...prevBooking,
        status: newStatus, // Update status in the state
      }));
  
      // Close the modal immediately after successful status update
      setShowModal(false);
  
    } catch (error) {
      console.error("Error changing status:", error);
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
    color: '#007bff',
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
    <Container className="mt-4" style={cardStyle}>
      <h2 className="text-center mb-4" style={headerStyle}>
        Booking Details
      </h2>
      <Row className="align-items-center">
        <Col md={6}>
          <div className="text-center mb-4">
            <Image
              src="https://img.freepik.com/free-photo/portrait-white-man-isolated_53876-40306.jpg"
              roundedCircle
              style={{
                width: '150px',
                height: '150px',
                marginBottom: '10px',
              }}
            />
            <div>
              <h5 style={headerStyle}>User: {booking.full_name}</h5>
              <p>{booking.phone_number}</p>
            </div>
          </div>
        </Col>

        <Col md={6}>
          <div className="text-center mb-4">
            <Image
              src="https://img.freepik.com/free-photo/portrait-white-man-isolated_53876-40306.jpg"
              roundedCircle
              style={{
                width: '150px',
                height: '150px',
                marginBottom: '10px',
              }}
            />
            <div>
              <h5 style={headerStyle}>Artist: {booking.organization}</h5>
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
                <Dropdown.Toggle variant="primary" id="dropdown-basic" style={{ borderRadius: '25px' }}>
                  Change Status
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => handleStatusChange('accepted')}>accepted</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleStatusChange('completed')}>completed</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleStatusChange('rejected')}>rejected</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleStatusChange('pending')}>pending</Dropdown.Item>
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
                {new Date(booking.booking_date).toLocaleDateString()} {new Date(booking.booking_date).toLocaleTimeString()}
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
                {new Date(booking.schedule_date_start).toLocaleDateString()}{" "}
                to{" "}
                {new Date(booking.schedule_date_end).toLocaleDateString()}
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
                {booking.required_services?.map((service, index) => (
                  <li key={index}>
                    <FontAwesomeIcon icon={faTools} style={iconStyle} />{" "}
                    {service}
                  </li>
                ))}
              </ul>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="shadow p-4" style={{ height: '30vh' }}>
              <Card.Body>
                <Card.Title className="text-center text-primary mb-4" style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
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
  
      {/* Modal for Status Change Confirmation */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Status Change</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to change the status to {newStatus}?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={changeStatus}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default UserProfile;
