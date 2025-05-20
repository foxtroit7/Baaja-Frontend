import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Container, Row, Col, Button, Table, Image, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTruck, faMoneyBill, faTruckRampBox, faEye} from '@fortawesome/free-solid-svg-icons';

const Customer = () => {
  const { user_id} = useParams(); 
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token"); // or sessionStorage, depending on your app

      const response = await fetch(`http://localhost:5000/api/user-bookings/${user_id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch bookings");

      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  if (user_id) fetchBookings();
}, [user_id]);


console.log("user_id",user_id)
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/user/details/${user_id}`); // Use dynamic id
        if (!response.ok) throw new Error('User not found');
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setUser(null);
      } finally {
     
      }
    };

    if (user_id) fetchUserData(); // Fetch only if ID exists
  }, [user_id]);
  if (!user) {
    return <h2 className="text-center mt-5">User not found {user_id}</h2>;
  }

  const handleClose = () => setShowModal(false);

  const handleSuspend = () => {
    console.log(`Account for ${user.name} suspended`)
    setShowModal(false); // Close the modal
  };

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-2">User Profile</h2>
      <Row className="align-items-center justify-content-center mb-2">
        <div className="text-center">
          <Image src={`http://localhost:5000/${user.photo}`}   // fallback to default image if not present in API
                roundedCircle
                style={{
                  width: '150px',
                  height: '150px',
                  marginBottom: '7px',
                }} />
          <h5>{user.name}</h5>
          <p>{user.phone_number}</p>
          <p>{user.email}</p>
          <p className='fw-bold'>{user.user_id}</p>
        </div>
      </Row>

    

      <Row className="g-4">
        <Col md={4}>
          <Card className="text-center shadow">
            <Card.Body>
              <FontAwesomeIcon icon={faTruck} size="2x" className="text-primary" />
              <Card.Title>Location</Card.Title>
              <Card.Text>{user.location || "Not available"}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center shadow">
            <Card.Body>
              <FontAwesomeIcon icon={faMoneyBill} size="2x" className="text-primary" />
              <Card.Title>Total Bookings</Card.Title>
              <Card.Text>{user.total_bookings}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center shadow">
            <Card.Body>
              <FontAwesomeIcon icon={faTruckRampBox} size="2x" className="text-primary" />
              <Card.Title>Pending Bookings</Card.Title>
              <Card.Text>{user.pending_bookings}</Card.Text>
            </Card.Body>
          </Card>
        </Col>

      </Row>

      <h3 className="mb-3 mt-4">Booking History</h3>
    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
  <Table responsive hover bordered>
    <thead>
      <tr className="bg-primary text-white text-center">
        <th>User Id</th>
        <th>Date</th>
        <th>Time</th>
        <th>Place</th>
        <th>Booking ID</th>
        <th>Status</th>
        <th>View</th>
      </tr>
    </thead>
    <tbody>
      {loading ? (
        <tr>
          <td colSpan="9" className="text-center">Loading...</td>
        </tr>
      ) : bookings.length > 0 ? (
        bookings.map((booking, index) => (
          <tr key={index} className="text-center">
            <td className='text-primary'>{booking.user_id}</td>
            <td>{new Date(booking.booking_date).toLocaleDateString()}</td>
            <td>{booking.booking_time}</td>
            <td>{booking.address}</td>
            <td className='text-primary'>{booking.booking_id}</td>
            <td className="text-warning">Pending</td>
            <td>
              <Link to={`/user-profile/${booking.booking_id}`}>
                                <Button variant="primary" size="md" className="me-2">
                                  <FontAwesomeIcon icon={faEye} />
                                </Button>
                              </Link>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="9" className="text-center">No bookings available</td>
        </tr>
      )}
    </tbody>
  </Table>
</div>

    </Container>
  );
};

export default Customer;
