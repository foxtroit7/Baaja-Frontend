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
import { faSearch, faBroom, faEye } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { Link } from "react-router-dom";
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
          <Col md={5} className="mb-1">
            <Form.Select value={statusFilter} onChange={handleStatusChange}>
              <option value="">All Status</option>
              <option value="partial">partial</option>
              <option value="completed">completed</option>
            </Form.Select>
          </Col>

       

          <Col md={5} className="mb-1">
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Search Booking ID, Razorpay Order id"
                value={search}
                className="custom-placeholder"
                onChange={handleSearchChange}
              />
              <InputGroup.Text>
                <FontAwesomeIcon icon={faSearch} />
              </InputGroup.Text>
            </InputGroup>
          </Col>
             <Col md={2} className="mb-1">
            <Button
              variant="danger"
              onClick={() => {
                setSearch("");
                setStatusFilter("");
              }}
              className="ps-5 pe-5"
            >
              <FontAwesomeIcon icon={faBroom} />
            </Button>
          </Col>
        </Row>
      </Form>

      <div className="table-responsive">
        <Table responsive
                  className="text-center table-striped"
                  style={{
                    borderRadius: "10px"
                  }}
                >
          <thead>
            <tr>
              <th className="align-middle">Razorpay Order ID</th>
              <th className="align-middle">Razorpay Payment ID</th>
              <th className="align-middle">Payment Status</th>
              <th className="align-middle">Total Price</th>
              <th className="align-middle">Advance Paid</th>
              <th className="align-middle">Pending Amount</th>
              <th className="align-middle">Time</th>
              <th className="align-middle">Booking ID</th>
              <th className="align-middle">Booking Details</th>
              
          </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, index) => (
              <tr key={index}>
                <td className="fw-bold align-middle text-main">{item.razorpay_order_id}</td>
                <td className="fw-bold align-middle text-main">{item.razorpay_payment_id}</td>
                <td className="align-middle">{getStatusBadge(item.payment_status)}</td>
                <td className="align-middle">₹{item.total_price}</td>
                <td className="align-middle">₹{item.advance_price}</td>
                <td className="align-middle">₹{item.pending_price}</td>
                <td className="fw-bold text-main">{new Date(item.createdAt).toLocaleString()}</td>
                <td className="align-middle">{item.booking_id}</td>
                <td className="align-middle">      <Link to={`/user-profile/${item.booking_id}`}>
                              <Button  className="me-2 text-light bg-main">
                                <FontAwesomeIcon icon={faEye} />
                              </Button>
                            </Link></td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Pagination Buttons */}
      <div className="d-flex justify-content-center mt-3">
        <Button
       
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="me-1 bg-main"
           size="sm" 
        >
         &lt;
        </Button>

        {[...Array(totalPages)].map((_, index) => (
          <Button
             key={index}
  
    onClick={() => handlePageChange(index + 1)}
    className="bg-main m-1"
    active={currentPage === index + 1}
    size="sm" 
    style={{ fontSize: "10px" }} // Custom font size for page numbers
          >
            {index + 1}
          </Button>
        ))}

        <Button
        
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
          className="ms-1 bg-main"
          size="sm" 

        >
           &gt;
        </Button>
      </div>
    </Container>
  );
};

export default Payment;
