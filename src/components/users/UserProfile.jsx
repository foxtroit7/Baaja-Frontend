import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Container, Row, Col, Image } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTruck, faMoneyBill, faTruckRampBox, faCheckCircle, faTools, faUser } from '@fortawesome/free-solid-svg-icons';

const UserProfile = () => {
  const { booking_id } = useParams();
  const [loading, setLoading] = useState(true); 
  const [booking, setBooking] = useState(null);
 console.log(booking_id);
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
      console.log("Fetching from URL:", url); // Debug URL

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Pass token in Authorization header
        },
      });

      const data = await response.json();
      console.log("API Response:", data); // Debug API response

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



  if (loading) {
    return <h2 className="text-center mt-5">Loading...</h2>;
  }

 
  if (!booking) {
    return <h2 className="text-center mt-5">Booking notyy found</h2>;
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

  return (
    <Container className="mt-4" style={cardStyle}>
      <h2 className="text-center mb-4" style={headerStyle}>
        Booking Details
      </h2>
      <Row className="align-items-center">
    
          <Col md={6}>
            <div className="text-center mb-4">
              <Image
                src="https://img.freepik.com/free-photo/portrait-white-man-isolated_53876-40306.jpg"     // fallback to default image if not present in API
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
                src="https://img.freepik.com/free-photo/portrait-white-man-isolated_53876-40306.jpg"     // fallback to default image if not present in API
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
        <Card.Title>Schedule Dtae</Card.Title>
        <Card.Text>
  {new Date(booking.schedule_date).toLocaleDateString()} {new Date(booking.schedule_date).toLocaleTimeString()}
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

  <Row className="g-4">
  {/* Card for Required Services */}
  <Col md={4}>
    <Card className="shadow p-4"  style={{height: '30vh'}}>
      <Card.Body>
        <Card.Title className="text-center text-primary mb-4" style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
          <FontAwesomeIcon icon={faTools} style={{ marginRight: '5px' }} /> Required Services
        </Card.Title>
        <Card.Text style={{ fontSize: '1rem' }}>
        {booking.required_items.map((item, index) => (
      <ul key={index}>
        <FontAwesomeIcon icon={faCheckCircle} className="text-primary" /> {item}
      </ul>
    ))}
        </Card.Text>
      </Card.Body>
    </Card>
  </Col>

  {/* Card for User Details */}
  <Col md={4}>
    <Card className="shadow p-4" style={{height: '30vh'}}>
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

  {/* Card for Add-on Services */}
  <Col md={4}>
    <Card className="shadow p-4" style={{height: '30vh'}}>
      <Card.Body>
        <Card.Title className="text-center text-primary mb-4" style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
          <FontAwesomeIcon icon={faCheckCircle} style={{ marginRight: '10px' }} /> Add-on Services
        </Card.Title>
        <Card.Text style={{ fontSize: '1rem' }}>
          <ul className="list-unstyled">
          {booking.required_items.map((item, index) => (
      <ul key={index}>
        <FontAwesomeIcon icon={faCheckCircle} className="text-primary" /> {item}
      </ul>
    ))}
          </ul>
        </Card.Text>
      </Card.Body>
    </Card>
  </Col>
</Row>


</Row>
    </Container>
  );
};

export default UserProfile;
