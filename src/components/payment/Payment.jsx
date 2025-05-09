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
import { Link } from "react-router-dom";
import axios from "axios";

const Payment = () => {
  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://15.206.194.89:5000/api/payments", {
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
          item.artist_id?.toLowerCase().includes(search.toLowerCase()) ||
          item.user_id?.toLowerCase().includes(search.toLowerCase())
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

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4 mt-4">
        <h3 className="mb-3">All User Transactions</h3>
        {/* <Link to="/artist-payments">
          <Button variant="primary">All Artists Transactions</Button>
        </Link> */}
      </div>

      <Form className="mb-4">
        <Row>
          <Col md={2}>
            <Form.Select value={statusFilter} onChange={handleStatusChange}>
              <option value="">All Status</option>
              <option value="partial">partial</option>
              <option value="completed">completed</option>
            </Form.Select>
          </Col>

          <Col md={1}>
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

          <Col md={5}>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Search Booking ID, Artist ID, User ID"
                value={search}
                onChange={handleSearchChange}
              />
              <InputGroup.Text>
                <FontAwesomeIcon icon={faSearch} />
              </InputGroup.Text>
            </InputGroup>
          </Col>
        </Row>
      </Form>

      <div className="table-responsive">
        <Table bordered hover striped className="text-center align-middle">
          <thead className="">
            <tr>
              <th className="py-3">Razorpay Order ID</th>
              <th className="py-3">Payment Status</th>
              <th className="py-3">Total Price</th>
              <th className="py-3">Advance Paid</th>
              <th className="py-3">pending Amount</th>
              <th className="py-3">Booking ID</th>
              <th className="py-3">Artist ID</th>
              <th className="py-3">User ID</th>
            </tr>
          </thead>
          <tbody>
            {getFilteredData().map((item, index) => (
              <tr key={index}>
                <td className="fw-bold text-primary">{item.razorpay_order_id}</td>
                <td>{getStatusBadge(item.payment_status)}</td>
                <td>₹{item.total_price}</td>
                <td>₹{item.advance_price}</td>
                <td>₹{item.pending_price}</td>
                <td>{item.booking_id}</td>
                <td>{item.artist_id}</td>
                <td>{item.user_id}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Container>
  );
};

export default Payment;
