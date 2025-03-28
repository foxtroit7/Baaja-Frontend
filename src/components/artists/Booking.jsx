import React, { useEffect, useState } from 'react';
import { Table, Button, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon
 } from '@fortawesome/react-fontawesome';
 import { faEye, faEdit } from '@fortawesome/free-solid-svg-icons';
 import { Link } from 'react-router-dom';
const Booking = ({ artist_id }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token"); // Get token from localStorage
  
        if (!token) {
          console.error("No token found. User might be logged out.");
          setError("Unauthorized! Please log in again.");
          setLoading(false);
          return;
        }
  
        const response = await fetch(
          `http://15.206.194.89:5000/api/artist-bookings/${artist_id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // ✅ Pass token in Authorization header
            },
          }
        );
  
        if (!response.ok) {
          throw new Error("Failed to fetch bookings");
        }
  
        const data = await response.json();
        setBookings(data.bookings || []); // Ensure bookings array is set
      } catch (error) {
        console.error("Error fetching artist bookings:", error);
        setError("Failed to fetch bookings.");
      } finally {
        setLoading(false);
      }
    };
  
    if (artist_id) fetchBookings();
  }, [artist_id]);
  

  return (
    <div>
      <div style={{ fontFamily: "'Roboto', sans-serif", padding: '30px' }}>
        <h4
          className="mb-4"
          style={{
            fontFamily: "'Sans Serif', sans-serif",
            fontWeight: 'bold',
            textAlign: 'center',
            color: '#343a40',
            letterSpacing: '1px',
          }}
        >
          Booking History
        </h4>

        {loading ? (
          <div className="text-center">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : error ? (
          <div className="text-center text-danger">{error}</div>
        ) : (
          <Table
            responsive
            hover
            className="table-borderless"
            style={{
              backgroundColor: '#f8f9fa',
              borderRadius: '10px',
              overflow: 'hidden',
              boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
            }}
          >
            <thead style={{ backgroundColor: '#007BFF', color: '#ffffff' }}>
              <tr className="text-center">
                <th>Booking Date</th>
                <th>Scheduled Date</th>
                <th>Shift</th>
                <th>Purpose</th>
                <th>Scheduled Time</th>
                <th>Booking Time</th>
                <th>Price</th>
                <th>Artist Name</th>
                <th>Booking ID</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length > 0 ? (
                bookings.map((booking, index) => (
                  <tr
                    key={index}
                    className="align-middle text-center"
                    style={{
                      backgroundColor: index % 2 === 0 ? '#ffffff' : '#f1f3f5',
                      transition: 'background-color 0.3s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e9ecef')}
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#ffffff' : '#f1f3f5')
                    }
                  >
                    <td>{new Date(booking.booking_date).toLocaleDateString()}</td>
                    <td>{new Date(booking.schedule_date).toLocaleDateString()}</td>
                    <td>{booking.shift}</td>
                    <td>{booking.purpose}</td>
                    <td>
                     
                    {booking.scheduled_time}
                    </td>
                    <td>
                     
                     {booking.booking_time}
                     </td>
                    <td>
                      {booking.add_on && booking.add_on.length > 0
                        ? booking.add_on[0].is_legal_price
                        : 'N/A'}
                    </td>
                    <td>{booking.full_name}</td>
                    <td>{booking.booking_id}</td>
                    <td className="fw-bold text-success">Completed</td>
                    <td>
                <Link to="/bookings">
                  <Button variant="primary" size="md" className="me-2">
                    <FontAwesomeIcon icon={faEye} />
                  </Button>
                </Link>
                <Link >
                  <Button variant="warning" size="md">
                    <FontAwesomeIcon icon={faEdit} className='text-light' />
                  </Button>
                </Link>
              </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="text-center">
                    No bookings available
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default Booking;
