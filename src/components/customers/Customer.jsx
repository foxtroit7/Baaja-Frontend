import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Container, Row, Col, Button, Table, Image, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTruck, faMoneyBill, faUserSlash, faTruckRampBox, faEye, faEdit } from '@fortawesome/free-solid-svg-icons';

const Customer = () => {
  const { user_id} = useParams(); 
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isSuspended, setIsSuspended] = useState(false); 
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch(`https://baaja-backend-2.onrender.com/api/user-bookings/${user_id}`);
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
        const response = await fetch(`https://baaja-backend-2.onrender.com/api/user/details/${user_id}`); // Use dynamic id
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


  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleSuspend = () => {
    console.log(`Account for ${user.name} suspended`);
    setIsSuspended(true); // Update the state to show that account is suspended
    setShowModal(false); // Close the modal
  };

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">User Profile</h2>
      <Row className="align-items-center justify-content-center mb-4">
        <div className="text-center">
          <Image src="https://img.freepik.com/free-photo/portrait-white-man-isolated_53876-40306.jpg"     // fallback to default image if not present in API
                roundedCircle
                style={{
                  width: '150px',
                  height: '150px',
                  marginBottom: '10px',
                }} />
          <h5>{user.name}</h5>
          <p>{user.phone}</p>
          <p>{user.description || "No bio available"}</p>
           {/* Suspend Account Button */}
      <Button
        variant={isSuspended ? "secondary" : "danger"} // Change button variant if account is suspended
        size="md"
        onClick={isSuspended ? null : handleShow} // Disable click if account is suspended
        disabled={isSuspended} // Disable the button if account is suspended
      >
        <FontAwesomeIcon icon={faUserSlash} className="pe-2" />
        {isSuspended ? "Account is Suspended" : "Suspend Account"}
      </Button>
        </div>
      </Row>

      {/* Modal for suspension confirmation */}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Suspension</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to suspend the account for {user.name}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleSuspend}>
            Suspend Account
          </Button>
        </Modal.Footer>
      </Modal>

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
              <Card.Text>{user.pendingBookings}</Card.Text>
            </Card.Body>
          </Card>
        </Col>

      </Row>

      <h3 className="mb-3 mt-4">Booking History</h3>
      <Table responsive hover bordered>
      <thead>
        <tr className="bg-primary text-white text-center">
          <th>User Id</th>
          <th>Date</th>
          <th>Time</th>
          <th>Event Area</th>
          <th>Category</th>
          <th>Category Photo</th>
          <th>Artist Id</th>
          <th>Booking ID</th>
          <th>Status</th>
          <th>Actions</th>
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
              <td>{booking.purpose}</td>
              <td>
                <Image src={booking.photo || "default.jpg"} alt="Category" rounded style={{ width: '50px', height: '50px' }} />
              </td>
              <td className='text-primary'>{booking.artist_id || "N/A"}</td>
              <td className='text-primary'>{booking.booking_id}</td>
              <td className="text-warning">Pending</td>
              <td>
                <Link to="/bookings">
                  <Button variant="primary" size="md" className="me-2">
                    <FontAwesomeIcon icon={faEye} />
                  </Button>
                </Link>
                <Link to={`/user-form/${user_id}/${booking.booking_id}`}>
                  <Button variant="warning" size="md">
                    <FontAwesomeIcon icon={faEdit} className='text-light' />
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
    </Container>
  );
};

export default Customer;
