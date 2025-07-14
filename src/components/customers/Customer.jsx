import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Card,
  Container,
  Row,
  Col,
  Button,
  Table,
  Image,
  Form,
  InputGroup,
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTruck,
  faMoneyBill,
  faTruckRampBox,
  faEye,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';

const Customer = () => {
  const { user_id } = useParams();
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    search: '',
    status: '',
  });

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://35.154.161.226:5000/api/user-bookings/${user_id}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error('Failed to fetch bookings');
        const data = await response.json();
        setBookings(data);
        setFilteredBookings(data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user_id) fetchBookings();
  }, [user_id]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://35.154.161.226:5000/api/user/details/${user_id}`);
        if (!response.ok) throw new Error('User not found');
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setUser(null);
      }
    };

    if (user_id) fetchUserData();
  }, [user_id]);

  const applyFilters = () => {
    const searchTerm = filters.search.toLowerCase();
    const statusTerm = filters.status;

    const filtered = bookings.filter((booking) => {
      const matchesSearch = booking.booking_id.toLowerCase().includes(searchTerm);
      const matchesStatus = statusTerm ? booking.status === statusTerm : true;
      return matchesSearch && matchesStatus;
    });

    setFilteredBookings(filtered);
  };

  const resetFilters = () => {
    setFilters({ search: '', status: '' });
    setFilteredBookings(bookings);
  };

  if (!user) return <h2 className="text-center mt-5">User not found: {user_id}</h2>;
  if (loading) return <p className="text-center mt-5">Loading...</p>;

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-2">User Profile</h2>

      <Row className="justify-content-center mb-3">
        <div className="text-center">
          <Image
            src={`http://35.154.161.226:5000/${user.photo}`}
            roundedCircle
            style={{ width: '150px', height: '150px', marginBottom: '7px' }}
          />
          <h5>{user.name}</h5>
          <p>{user.phone_number}</p>
          <p>{user.email}</p>
          <p className="fw-bold">{user.user_id}</p>
        </div>
      </Row>

      <Row className="g-4">
        <Col md={4}>
          <Card className="text-center shadow">
            <Card.Body>
              <FontAwesomeIcon icon={faTruck} size="2x" className="text-main" />
              <Card.Title>Location</Card.Title>
              <Card.Text>{user.location || 'Not available'}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center shadow">
            <Card.Body>
              <FontAwesomeIcon icon={faMoneyBill} size="2x" className="text-main" />
              <Card.Title>Total Bookings</Card.Title>
              <Card.Text>{user.total_bookings}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center shadow">
            <Card.Body>
              <FontAwesomeIcon icon={faTruckRampBox} size="2x" className="text-main" />
              <Card.Title>Pending Bookings</Card.Title>
              <Card.Text>{user.pending_bookings}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <h3 className="mb-3 mt-4">Booking History</h3>

      {/* Filters */}
      <Row className="mb-3 align-items-end">
        <Col md={5} className='mb-1'>
          <InputGroup>
            <InputGroup.Text>
              <FontAwesomeIcon icon={faSearch} />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search by Booking ID"
              value={filters.search}
              className='custom-placeholder'
              onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
            />
          </InputGroup>
        </Col>
        <Col md={3} className='mb-1'>
          <Form.Select
            value={filters.status}
            onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
            <option value="completed">Completed</option>
          </Form.Select>
        </Col>
        <Col md={2} className='mb-1'>
          <Button  onClick={applyFilters} className="w-100 bg-main">
            Filter
          </Button>
        </Col>
        <Col md={2} className='mb-1'>
          <Button variant="secondary" onClick={resetFilters} className="w-100">
            Reset
          </Button>
        </Col>
      </Row>

      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        <Table responsive className='table-striped'>
          <thead className="text-center">
            <tr>
              <th>Scheduled Start</th>
              <th>Scheduled End</th>
              <th>Shift</th>
              <th>Purpose</th>
              <th>Time</th>
              <th>Booking Date</th>
              <th>Price</th>
              <th>Artist</th>
              <th>Booking ID</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.length > 0 ? (
              filteredBookings.map((booking, index) => (
                <tr
                  key={index}
                  className="align-middle text-center"
                  style={{
                    backgroundColor: index % 2 === 0 ? '#ffffff' : '#f1f3f5',
                    transition: 'background-color 0.3s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e9ecef')}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      index % 2 === 0 ? '#ffffff' : '#f1f3f5')
                  }
                >
                  <td>{new Date(booking.schedule_date_start).toLocaleDateString()}</td>
                  <td>{new Date(booking.schedule_date_end).toLocaleDateString()}</td>
                  <td>{booking.shift}</td>
                  <td>{booking.purpose}</td>
                  <td>{booking.scheduled_time}</td>
                  <td>
                    {new Date(booking.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </td>
                  <td>
                    {booking.add_on && booking.add_on.length > 0
                      ? booking.add_on[0].is_legal_price
                      : 'N/A'}
                  </td>
                  <td>{booking.full_name}</td>
                  <td>{booking.booking_id}</td>
                  <td>
                    <span
                      className={`badge ${
                        booking.status === 'accepted'
                          ? 'bg-success'
                          : booking.status === 'pending'
                          ? 'bg-warning'
                          : booking.status === 'rejected'
                          ? 'bg-danger'
                          : 'bg-info'
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td>
                    <Link to={`/user-profile/${booking.booking_id}`}>
                      <Button  size="md" className="me-2 bg-main">
                        <FontAwesomeIcon icon={faEye} />
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="11" className="text-center">
                  No bookings available
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </Container>
  );
};

export default Customer;
