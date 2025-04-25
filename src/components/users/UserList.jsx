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
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faBroom,
  faEye,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const UserList = () => {
  const [bookings, setBookings] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    paymentStatus: "",
    dateRange: { from: "", to: "" },
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found in localStorage");
          return;
        }

        const response = await axios.get(
          "http://15.206.194.89:5000/api/all-bookings",
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
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found. User might be logged out.");
        return;
      }

      await axios.delete(
        `http://15.206.194.89:5000/api/bookings/delete/${booking_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
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
      return [];
    }

    return bookings.bookings
      .filter((item) =>
        filters.status ? item.status?.toLowerCase() === filters.status.toLowerCase() : true
      )
      .filter((item) =>
        filters.paymentStatus
          ? item.payment_status?.toLowerCase() === filters.paymentStatus.toLowerCase()
          : true
      )
      .filter((item) =>
        filters.search
          ? item.user_name?.toLowerCase().includes(filters.search.toLowerCase()) ||
            item.artist_name?.toLowerCase().includes(filters.search.toLowerCase())
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

  // Pagination logic
  const filteredData = getFilteredData();
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const renderTableRows = (data) => {
    return data?.map((item, index) => (
      <tr key={item.booking_id}>
        <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td> {/* Index number column */}
        <td style={{ padding: "15px" }}>{item.booking_id}</td>
        <td style={{ padding: "15px" }}>{item.full_name}</td>
        <td style={{ padding: "15px" }}>{item.organization}</td>
        <td>
          <span
            className={`badge ${
              item.status === "accepted"
                ? "bg-success"
                : item.status === "pending"
                ? "bg-warning"
                : item.status === "rejected"
                ? "bg-danger"
                : "bg-info"
            }`}
          >
            {item.status}
          </span>
        </td>
        <td style={{ padding: "15px" }}>
          {new Date(item.booking_date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}{" "}
          , {item.booking_time}
        </td>
        <td style={{ padding: "15px" }}>
          {item.payment_status === "partial" && (
            <span className="badge bg-warning text-dark">Partial</span>
          )}
          {item.payment_status === "pending" && (
            <span className="badge bg-info">Pending</span>
          )}
          {item.payment_status === "completed" && (
            <span className="badge bg-success">Completed</span>
          )}
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
      <h2 className="mb-4 text-center fw-bold text-dark">Booking List</h2>

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
              <option value="">All Status</option>
              <option value="accepted">Accepted</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
            </Form.Select>
          </Col>
          <Col md={2}>
            <Form.Select
              name="paymentStatus"
              value={filters.paymentStatus}
              onChange={handleFilterChange}
            >
              <option value="">All Payment Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="partial">Partial</option>
            </Form.Select>
          </Col>
          <Col md={2}>
            <Form.Control
              type="date"
              name="from"
              value={filters.dateRange.from}
              onChange={handleDateRangeChange}
            />
          </Col>
          <Col md={2}>
            <Form.Control
              type="date"
              name="to"
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
            overflow: "hidden",
            boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
          }}
        >
          <thead className="bg-primary text-white">
            <tr>
              <th>#</th> {/* Index number column */}
              <th style={{ padding: "15px" }}>Booking ID</th>
              <th style={{ padding: "15px" }}>User Name</th>
              <th style={{ padding: "15px" }}>Artist Name</th>
              <th style={{ padding: "15px" }}>Status</th>
              <th style={{ padding: "15px" }}>Booking Time</th>
              <th style={{ padding: "15px" }}>Payment Status</th>
              <th style={{ padding: "15px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>{renderTableRows(currentItems)}</tbody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="d-flex justify-content-center">
        <Button
          variant="outline-primary"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="me-1"
        >
          &lt;
        </Button>
        {Array.from({ length: totalPages }, (_, index) => (
  <Button
    key={index}
    variant="outline-primary"
    onClick={() => handlePageChange(index + 1)}
    active={currentPage === index + 1}
    size="sm" 
    style={{ fontSize: "10px" }} // Custom font size for page numbers
  >
    {index + 1}
  </Button>
))}

        <Button
          variant="outline-primary"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="me-1 ms-1"
        >
          &gt;
        </Button>
      </div>
    </Container>
  );
};

export default UserList;
