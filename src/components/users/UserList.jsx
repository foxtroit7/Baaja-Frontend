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
    bookingType: "",
    dateRange: { from: "", to: "" },
       artistRejected: false,
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

    const fetchBookings = async (customFilters = filters) => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get(
          "http://35.154.161.226:5000/api/all-bookings",
          {
            headers: { Authorization: `Bearer ${token}` },
            params: {
              status: customFilters.status,
              paymentStatus: customFilters.paymentStatus,
              search: customFilters.search,
              from: customFilters.dateRange.from,
              to: customFilters.dateRange.to,
              artistRejected: customFilters.artistRejected, // 👈 send to API
            },
          }
        );

        setBookings(response.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    }


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
      bookingType: "",
      dateRange: { from: "", to: "" },
    });
  };

  // 4. Pagination logic
  let allData = bookings.bookings || [];

if (filters.bookingType) {
  allData = allData.filter((item) => {
    const type = (item.booking_type || "Online Booking").toLowerCase();
    return type === filters.bookingType.toLowerCase();
  });
}

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = allData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(allData.length / itemsPerPage);
  // 👇 new handler for rejection button
  const handleShowRejections = () => {
    setFilters((prev) => ({
      ...prev,
      artistRejected: true,
    }));
  };

  // 👇 reset back to normal list
  const handleShowAllBookings = () => {
    setFilters((prev) => ({
      ...prev,
      artistRejected: false,
    }));
  };
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
  {new Date(item.createdAt).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })}
</td>

   <td style={{ padding: "15px" }}>
  {(!item.booking_type || item.booking_type === "Online Booking") ? (
    <span className="badge bg-success">Online Booking</span>
  ) : (
    <span className="badge bg-secondary">Offline Booking</span>
  )}
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
              <Button  className="me-2 text-light bg-main">
                <FontAwesomeIcon icon={faEye} />
              </Button>
            </Link>
          </div>
        </td>
      </tr>
    ));

  return (
    <Container style={{ fontFamily: "'Roboto', sans-serif", padding: "30px" }}>
     <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-main">Booking List</h2>
        <div>
          <Button
            variant={filters.artistRejected ? "secondary" : "danger"}
            onClick={
              filters.artistRejected ? handleShowAllBookings : handleShowRejections
            }
          >
            {filters.artistRejected ? "Back to Bookings" : "Artist Rejection List"}
          </Button>
        </div>
      </div>
      {/* Filters */}
      <Form className="mb-4">
        <Row className="align-items-center">
          <Col md={3} className="mb-1">
            <InputGroup>
              <InputGroup.Text>
                <FontAwesomeIcon icon={faSearch} className="text-dark" />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search by Booking Id"
                name="search"
                value={filters.search}
                className="custom-placeholder"
                onChange={handleFilterChange}
              />
            </InputGroup>
          </Col>
          <Col md={2}  className="mb-1">
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
          <Col md={2} className="mb-1">
  <Form.Select
    name="bookingType"
    value={filters.bookingType}
    onChange={handleFilterChange}
  >
    <option value="">All Booking Types</option>
    <option value="Online Booking">Online Booking</option>
    <option value="Offline Booking">Offline Booking</option>
  </Form.Select>
</Col>

          <Col md={2}  className="mb-1">
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
          <Col md={1}  className="mb-1">
            <Form.Control
              type="date"
              name="from"
                 className="text-main"
              value={filters.dateRange.from}
              onChange={handleDateRangeChange}
            />
          </Col>
          <Col md={1}  className="mb-1">
            <Form.Control
              type="date"
              name="to"
              value={filters.dateRange.to}
              className="text-main"
              onChange={handleDateRangeChange}
            />
          </Col>
          <Col md={1}  className="mb-1">
            <Button variant="danger" onClick={handleResetFilters}>
              <FontAwesomeIcon icon={faBroom} />
            </Button>
          </Col>
        </Row>
      </Form>

      {/* Table */}
      <div className="table-responsive">
        <Table responsive
          className="text-center table-striped"
          style={{
            borderRadius: "10px"
          }}
        >
          <thead className="bg-main text-white">
            <tr>
              <th>#</th>
              <th>Booking ID</th>
              <th>User Name</th>
              <th>Artist Name</th>
              <th>Status</th>
              <th>Booking Time</th>
              <th>Booking Type</th>
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
        
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="me-1 bg-main"
          size="sm"
        >
          &lt;
        </Button>
        {Array.from({ length: totalPages }, (_, index) => (
          <Button
            key={index}
         className="bg-main m-1"
            onClick={() => handlePageChange(index + 1)}
            active={currentPage === index + 1}
            size="sm"
            style={{ fontSize: "10px" }}
          >
            {index + 1}
          </Button>
        ))}
        <Button
          
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="me-1 ms-1 bg-main"
          size="sm"
        >
          &gt;
        </Button>
      </div>
    </Container>
  );
};

export default UserList;
