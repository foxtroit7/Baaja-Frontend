import React, { useState, useEffect } from "react";
import {
  Container,
  Table,
  Form,
  Row,
  Col,
  Button,
  InputGroup,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faBroom, faEye, faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const UserList = () => {
  const [bookings, setBookings] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    paymentStatus: "",
    dateRange: { from: "", to: "" },
  });

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token"); // Use "token" instead of "verifyToken"
  
        if (!token) {
          console.error("No token found in localStorage");
          return;
        }
  
        const response = await axios.get(
          "https://baaja-backend-2.onrender.com/api/all-bookings",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        setBookings(response.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };
  
    fetchBookings();
  }, []);
  
  const [data, setData] = useState([
    { id: 1, status: "Confirmed" },
    { id: 2, status: "Pending" },
    { id: 3, status: "Rejected" },
  ]);
  const handleStatusChange = (id, newStatus) => {
    const updatedData = data.map((item) =>
      item.id === id ? { ...item, status: newStatus } : item
    );
    setData(updatedData);
  };
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateRangeChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      dateRange: { ...prev.dateRange, [name]: value },
    }));
  };

  const handleDeleteBooking = async (booking_id) => {
    try {
      const token = localStorage.getItem("token"); // Fetch the token
  
      if (!token) {
        console.error("No token found. User might be logged out.");
        return;
      }
  
      await axios.delete(
        `https://baaja-backend-2.onrender.com/api/bookings/delete/${booking_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token here
          },
        }
      );
  
      setBookings(bookings.filter((booking) => booking.booking_id !== booking_id));
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  };
  

  const getFilteredData = () => {
    if (!bookings || !Array.isArray(bookings.bookings)) {
      console.error("bookings.bookings is not an array:", bookings);
      return [];
    }
  
    return bookings.bookings
      .filter((item) =>
        filters.status ? item.status === filters.status : true
      )
      .filter((item) =>
        filters.paymentStatus
          ? item.paymentStatus.toLowerCase() === filters.paymentStatus.toLowerCase()
          : true
      )
      .filter((item) =>
        filters.search
          ? item.user_name.toLowerCase().includes(filters.search.toLowerCase()) ||
            item.artist_name.toLowerCase().includes(filters.search.toLowerCase())
          : true
      )
      .filter((item) => {
        if (filters.dateRange.from && filters.dateRange.to) {
          const bookingDate = new Date(item.booking_date);
          return (
            bookingDate >= new Date(filters.dateRange.from) &&
            bookingDate <= new Date(filters.dateRange.to)
          );
        }
        return true;
      });
  };
  

  const renderTableRows = (filteredData) => {
    return filteredData?.map((item) => (
      <tr
        style={{  
          paddingTop: "12px",
          paddingBottom: "12px",
        }}
      >
        <td style={{ padding: "15px" }}>{item.booking_id}</td>
        <td style={{ padding: "15px" }}>{item.full_name}</td>
        <td style={{ padding: "15px" }}>{item.organization}</td>
        <td style={{ padding: "15px" }}>
      <Form.Select
        style={{
          backgroundColor:
            item.status === "Confirmed"
              ? "green"
              : item.status === "Pending"
              ? "orange"
              : "red",
          color: "white",
          fontWeight: "bold",
          border: "none",
          borderRadius: "7px" 
        }}
        handleStatusChange={handleStatusChange}
        value={item.status}
        
      >
        <option className="bg-light text-dark"  value="Confirmed">
          Confirmed
        </option>
        <option  className="bg-light text-dark"  value="Pending">
          Pending
        </option>
        <option  className="bg-light text-dark"  value="Rejected">
          Rejected
        </option>
      </Form.Select>
    </td>
    <td style={{ padding: "15px" }}> {new Date(item.booking_date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })}, {item.booking_time}</td>
    <td style={{ padding: "15px" }}>
  <Form.Select
    value={item.payment_status}
    
    style={{
      backgroundColor:
        item.status === "Paid"
          ? "green"
          : item.status === "Not Paid"
          ? "orange"
          : "red",
      color: "white",
      fontWeight: "bold",
      border: "none",
      borderRadius: "7px" 
    }}
  >
    <option lassName="bg-light text-dark" value="Paid">Paid</option>
    <option lassName="bg-light text-dark" value="Not Paid">Not Paid</option>
  </Form.Select>
</td>

        <td>
          <div className="text-center text-light">
            <Link to={`/user-profile/${item.booking_id}`}>
              <Button variant="primary" className="me-2 text-light">
                <FontAwesomeIcon icon={faEye} />
              </Button>
            </Link>
            <Button
              variant="danger"
              onClick={() => handleDeleteBooking(item.booking_id)}
            >
              <FontAwesomeIcon icon={faTrash} />
            </Button>
          </div>
        </td>
      </tr>
    ));
  };

  return (
    <Container style={{ fontFamily: "'Roboto', sans-serif", padding: "30px" }}>
      <h2
        className="mb-4"
        style={{
          fontFamily: "'Sans Serif', sans-serif",
          fontWeight: "bold",
          textAlign: "center",
          color: "#343a40",
          letterSpacing: "1px",
        }}
      >
        Booking List
      </h2>

      {/* Filters Section */}
      <Form className="mb-4">
        <Row className="align-items-center">
          <Col md={3}>
            <InputGroup>
              <InputGroup.Text>
                <FontAwesomeIcon icon={faSearch} className="text-primary" />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search by User or Artist"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
              />
            </InputGroup>
          </Col>
          <Col md={2}>
            <Form.Select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option value="Confirmed">Confirmed</option>
              <option value="Pending">Pending</option>
              <option value="Cancelled">Cancelled</option>
            </Form.Select>
          </Col>
          <Col md={2}>
            <Form.Select
              name="paymentStatus"
              value={filters.paymentStatus}
              onChange={handleFilterChange}
            >
              <option value="">All Payment Status</option>
              <option value="Mark As Complete">Mark As Complete</option>
              <option value="Cancel">Cancel</option>
              <option value="Refund">Refund</option>
            </Form.Select>
          </Col>
          <Col md={2}>
            <Form.Control
              type="date"
              name="from"
              placeholder="From"
              value={filters.dateRange.from}
              onChange={handleDateRangeChange}
            />
          </Col>
          <Col md={2}>
            <Form.Control
              type="date"
              name="to"
              placeholder="To"
              value={filters.dateRange.to}
              onChange={handleDateRangeChange}
            />
          </Col>
          <Col md={1}>
            <Button
              variant="outline-danger"
              onClick={() =>
                setFilters({
                  search: "",
                  status: "",
                  paymentStatus: "",
                  dateRange: { from: "", to: "" },
                })
              }
            >
              <FontAwesomeIcon icon={faBroom} />
            </Button>
          </Col>
        </Row>
      </Form>

      <div className="table-responsive">
        <Table
          bordered
          hover
          className="text-center"
          style={{
            backgroundColor: "#f8f9fa",
            borderRadius: "10px",
            overflow: "hidden", // Ensures border-radius applies
            boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
          }}
        >
          <thead className="bg-primary text-white">
            <tr className=" mt-4 mb-4">
              <th style={{ padding: "15px" }}>Booking ID</th>
              <th style={{ padding: "15px" }}>User Name</th>
              <th style={{ padding: "15px" }}>Artist Name</th>
              <th style={{ padding: "15px" }}>Status</th>
              <th style={{ padding: "15px" }}>Booking Time</th>
              <th style={{ padding: "15px" }}>Payment Status</th>
              <th style={{ padding: "15px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>{renderTableRows(getFilteredData())}</tbody>
        </Table>
      </div>
    </Container>
  );
};

export default UserList;
