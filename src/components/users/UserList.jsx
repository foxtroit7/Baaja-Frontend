import { useState, useEffect } from "react";
import {
  Container,
  Table,
  Form,
  Row,
  Col,
  Button,
  InputGroup,
} from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faBroom, faEye } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const UserList = () => {
  const [bookings, setBookings] = useState([]);
  const [initialized, setInitialized] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    paymentStatus: "",
    dateRange: { from: "", to: "" },
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const location = useLocation();

  // 1. Get initial status from query param
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const statusFromURL = params.get("status");

    setFilters((prev) => ({
      ...prev,
      status: statusFromURL || "",
    }));

    setInitialized(true); // Flag when filters are initialized
  }, []);

  // 2. Fetch bookings when filters change and initialized
  useEffect(() => {
    if (!initialized) return;

    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found in localStorage");
          return;
        }

        const response = await axios.get("http://35.154.161.226:5000/api/all-bookings", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            status: filters.status,
            paymentStatus: filters.paymentStatus,
            search: filters.search,
            from: filters.dateRange.from,
            to: filters.dateRange.to,
          },
        });

        setBookings(response.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, [filters, initialized]);

  // 3. Handle input filters
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

  const handleResetFilters = () => {
    setFilters({
      search: "",
      status: "",
      paymentStatus: "",
      dateRange: { from: "", to: "" },
    });
  };

  // 4. Pagination logic
  const allData = bookings.bookings || [];
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = allData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(allData.length / itemsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  // 5. Render table
  const renderTableRows = (data) =>
    data?.map((item, index) => (
      <tr key={item.booking_id}>
        <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
        <td style={{ padding: "15px" }}>{item.booking_id}</td>
        <td style={{ padding: "15px" }}>{item.full_name}</td>
        <td style={{ padding: "15px" }}>{item.artist_details?.owner_name}</td>
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
          {new Date(item.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
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
          </div>
        </td>
      </tr>
    ));

  return (
    <Container style={{ fontFamily: "'Roboto', sans-serif", padding: "30px" }}>
      <h2 className="mb-4 text-center fw-bold text-dark">Booking List</h2>

      {/* Filters */}
      <Form className="mb-4">
        <Row className="align-items-center">
          <Col md={3}>
            <InputGroup>
              <InputGroup.Text>
                <FontAwesomeIcon icon={faSearch} className="text-primary" />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search by Booking Id"
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
            <Button variant="outline-danger" onClick={handleResetFilters}>
              <FontAwesomeIcon icon={faBroom} />
            </Button>
          </Col>
        </Row>
      </Form>

      {/* Table */}
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
              <th>#</th>
              <th>Booking ID</th>
              <th>User Name</th>
              <th>Artist Name</th>
              <th>Status</th>
              <th>Booking Time</th>
              <th>Payment Status</th>
              <th>View</th>
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
          size="sm"
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
            style={{ fontSize: "10px" }}
          >
            {index + 1}
          </Button>
        ))}
        <Button
          variant="outline-primary"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="me-1 ms-1"
          size="sm"
        >
          &gt;
        </Button>
      </div>
    </Container>
  );
};

export default UserList;
