import React, { useState, useEffect } from "react";
import {
  Container,
  Table,
  Form,
  Row,
  Col,
  Button,
  InputGroup,
  Badge,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faBroom } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const Payment = () => {
  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://35.154.161.226:5000/api/payments", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPayments(res.data.all_verified_payments);
      } catch (err) {
        console.error("Error fetching payments:", err);
      }
    };
    fetchPayments();
  }, []);

  const handleSearchChange = (e) => setSearch(e.target.value);
  const handleStatusChange = (e) => setStatusFilter(e.target.value);

  const getFilteredData = () => {
    return payments
      .filter(
        (item) =>
          item.booking_id?.toLowerCase().includes(search.toLowerCase()) ||
          item.razorpay_order_id?.toLowerCase().includes(search.toLocaleLowerCase()) ||
          item.razorpay_payment_id?.toLowerCase().includes(search.toLowerCase())
      )
      .filter((item) =>
        statusFilter ? item.payment_status === statusFilter : true
      );
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return <Badge bg="success">completed</Badge>;
      case "partial":
        return <Badge bg="warning" text="dark">partial</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  const filteredData = getFilteredData();

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4 mt-4">
        <h3 className="mb-3">All Transactions</h3>
      </div>

      <Form className="mb-4">
        <Row>
          <Col md={4}>
            <Form.Select value={statusFilter} onChange={handleStatusChange}>
              <option value="">All Status</option>
              <option value="partial">partial</option>
              <option value="completed">completed</option>
            </Form.Select>
          </Col>

       

          <Col md={6}>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Search Booking ID, Razorpay Order id"
                value={search}
                onChange={handleSearchChange}
              />
              <InputGroup.Text>
                <FontAwesomeIcon icon={faSearch} />
              </InputGroup.Text>
            </InputGroup>
          </Col>
             <Col md={2}>
            <Button
              variant="danger"
              onClick={() => {
                setSearch("");
                setStatusFilter("");
              }}
            >
              <FontAwesomeIcon icon={faBroom} />
            </Button>
          </Col>
        </Row>
      </Form>

      <div className="table-responsive">
        <Table bordered hover striped className="text-center align-middle">
          <thead>
            <tr>
              <th className="py-3">Razorpay Order ID</th>
              <th className="py-3">Razorpay Payment ID</th>
              <th className="py-3">Payment Status</th>
              <th className="py-3">Total Price</th>
              <th className="py-3">Advance Paid</th>
              <th className="py-3">Pending Amount</th>
              <th className="py-3">Time</th>
              <th className="py-3">Booking ID</th>
              
          </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, index) => (
              <tr key={index}>
                <td className="fw-bold text-primary">{item.razorpay_order_id}</td>
                <td className="fw-bold text-primary">{item.razorpay_payment_id}</td>
                <td>{getStatusBadge(item.payment_status)}</td>
                <td>₹{item.total_price}</td>
                <td>₹{item.advance_price}</td>
                <td>₹{item.pending_price}</td>
                <td className="fw-bold text-primary">{new Date(item.createdAt).toLocaleString()}</td>
                <td>{item.booking_id}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Pagination Buttons */}
      <div className="d-flex justify-content-center mt-3">
        <Button
       variant="outline-primary"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="me-1"
           size="sm" 
        >
         &lt;
        </Button>

        {[...Array(totalPages)].map((_, index) => (
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
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
          className="ms-1"
          size="sm" 

        >
           &gt;
        </Button>
      </div>
    </Container>
  );
};

export default Payment;
