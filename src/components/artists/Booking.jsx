import React, { useEffect, useState } from 'react';
import { Table, Button, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const Booking = ({ artist_id }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [status, setStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [search, setSearch] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [resetTriggered, setResetTriggered] = useState(false);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Unauthorized! Please log in again.");
        setLoading(false);
        return;
      }

      const params = new URLSearchParams();
      if (status) params.append("status", status);
      if (paymentStatus) params.append("paymentStatus", paymentStatus);
      if (search) params.append("search", search);
      if (from) params.append("from", from);
      if (to) params.append("to", to);

      const response = await fetch(
        `http://35.154.161.226:5000/api/artist-bookings/${artist_id}?${params.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch bookings");

      const data = await response.json();
      setBookings(data.bookings || []);
    } catch (error) {
      console.error("Error fetching artist bookings:", error);
      setError("Failed to fetch bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (artist_id) fetchBookings();
  }, [artist_id]);

  useEffect(() => {
    if (resetTriggered) {
      fetchBookings();
      setResetTriggered(false);
    }
  }, [status, paymentStatus, search, from, to, resetTriggered]);

  const handleResetFilters = () => {
    setStatus("");
    setPaymentStatus("");
    setSearch("");
    setFrom("");
    setTo("");
    setResetTriggered(true);
  };

  return (
    <div>
      <div style={{ fontFamily: "'Roboto', sans-serif", padding: '30px' }}>
        <h4
          className="mb-4 text-main"
         
        >
          Booking History
        </h4>

        {/* Filter Controls */}
        <div className="d-flex flex-wrap gap-3 mb-4">
          <input
            type="text"
            className="form-control text-main"
            placeholder="Search Booking ID"
          
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ maxWidth: 200 }}
          />
          <select
            className="form-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{ maxWidth: 180 }}
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
            <option value="completed">Completed</option>
          </select>
          <select
            className="form-select"
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value)}
            style={{ maxWidth: 180 }}
          >
            <option value="">All Payments</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
          </select>
          <input
            type="date"
            className="form-control"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
          <input
            type="date"
            className="form-control"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
          <Button onClick={fetchBookings} className='bg-main'>
            Filter
          </Button>
          <Button onClick={handleResetFilters} className='bg-main'>
            Reset
          </Button>
        </div>

        {/* Booking Table */}
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" className="bg-main" />
          </div>
        ) : error ? (
          <div className="text-center text-danger">{error}</div>
        ) : (
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            <Table
              responsive
              
              className="text-center table-striped rounded"
              style={{
               
                borderRadius: '10px',
                overflow: 'hidden',
                boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
              }}
            >
              <thead style={{ backgroundColor: '#007BFF', color: '#ffffff' }}>
                <tr className="text-center">
                  <th>Scheduled Date Start</th>
                  <th>Scheduled Date End</th>
                  <th>Shift</th>
                  <th>Purpose</th>
                  <th>Scheduled Time</th>
                  <th>Booking Date</th>
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
                            booking.status === "accepted"
                              ? "bg-success"
                              : booking.status === "pending"
                              ? "bg-warning"
                              : booking.status === "rejected"
                              ? "bg-danger"
                              : "bg-info"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </td>
                      <td>
                        <Link to={`/user-profile/${booking.booking_id}`}>
                          <Button size="md" className="me-2 bg-main">
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
        )}
      </div>
    </div>
  );
};

export default Booking;
