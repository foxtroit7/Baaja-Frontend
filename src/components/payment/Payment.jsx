import React, { useState } from "react";
import {
  Container,
  Table,
  Form,
  Row,
  Col,
  Button,
  InputGroup,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faBroom, faDownload} from "@fortawesome/free-solid-svg-icons";
import { Link} from "react-router-dom";
// import html2pdf from "html2pdf.js";

const Payment = () => {
  const data = [
    {
      transactionId: "TXN001",
      name: "John Doe",
      booking_id: "BID123",
      amount: 200,
      status: "Paid",
      date: "2025-01-08",
    },
    {
      transactionId: "TXN002",
      name: "Alice Johnson",
      booking_id: "BID124",
      amount: 150,
      status: "Pending",
      date: "2025-01-07",
    },
    {
      transactionId: "TXN003",
      name: "Alice Johnson",
      booking_id: "BID124",
      amount: 150,
      status: "Refunded",
      date: "2025-01-07",
    },
  ];

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState(""); 
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSearchChange = (e) => setSearch(e.target.value);
  const handleStatusChange = (e) => setStatusFilter(e.target.value);
  const handleDateFilterChange = (e) => setDateFilter(e.target.value);

  const isWithinDateRange = (itemDate) => {
    if (!startDate || !endDate) return true;
    const date = new Date(itemDate);
    return date >= new Date(startDate) && date <= new Date(endDate);
  };

  const getFilteredData = () => {
    const today = new Date();
    const filteredData = data
      .filter(
        (item) =>
          item.transactionId.toLowerCase().includes(search.toLowerCase()) ||
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.booking_id.toLowerCase().includes(search.toLowerCase())
      )
      .filter((item) => (statusFilter ? item.status === statusFilter : true));

    if (dateFilter === "Today") {
      return filteredData.filter(
        (item) => new Date(item.date).toDateString() === today.toDateString()
      );
    } else if (dateFilter === "Weekly") {
      const oneWeekAgo = new Date(today);
      oneWeekAgo.setDate(today.getDate() - 7);
      return filteredData.filter(
        (item) => new Date(item.date) >= oneWeekAgo && new Date(item.date) <= today
      );
    } else if (dateFilter === "Monthly") {
      const oneMonthAgo = new Date(today);
      oneMonthAgo.setMonth(today.getMonth() - 1);
      return filteredData.filter(
        (item) => new Date(item.date) >= oneMonthAgo && new Date(item.date) <= today
      );
    } else if (startDate && endDate) {
      return filteredData.filter((item) => isWithinDateRange(item.date));
    }
    return filteredData;
  };

  const renderTableRows = (filteredData) => {
    return filteredData.map((item) => (
      <tr
        key={item.transactionId}
        
        style={{ cursor: "pointer" }}
      >
        <td>
          <Link
                to={`/payment-details/${item.transactionId}`}
                style={{ textDecoration: "none", color: "inherit" }}
                className="text-primary fw-bold"
              >
                {item.transactionId}
              </Link></td>
        <td>{item.name}</td>
        <td>{item.booking_id}</td>
        <td>${item.amount}</td>
        <td>{item.date}</td>
        <td
          style={{
            fontWeight: "bold",
            color:
              item.status === "Paid"
                ? "#28a745"
                : item.status === "Pending"
                  ? "#ffc107"
                  : "#dc3545",
          }}
        >
          {item.status}
        </td>
      </tr>
    ));
  };

  const downloadPDF = () => {
    // const element = document.getElementById("table-section");
    // const options = {
    //   margin: 1,
    //   filename: "Transaction_Table.pdf",
    //   html2canvas: { scale: 2 },
    //   jsPDF: { unit: "in", format: "letter", orientation: "landscape" },
    // };
    // html2pdf().set(options).from(element).save();
  };

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4 mt-4">
        <h3 className="mb-3">All User Transactions</h3>
        <Link to='/artist-payments'>
        <Button variant="primary">
        All Artists Transactions
        </Button>
        </Link>
      </div>
      <Form className="mb-4">
        <Row>
          <Col md={2}>
            <Form.Select value={statusFilter} onChange={handleStatusChange}>
              <option value="">All Status</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Refunded">Refunded</option>
            </Form.Select>
          </Col>
          <Col md={2}>
            <Form.Select value={dateFilter} onChange={handleDateFilterChange}>
              <option value="">All Dates</option>
              <option value="Today">Today</option>
              <option value="Weekly">Last 7 Days</option>
              <option value="Monthly">Last 30 Days</option>
            </Form.Select>
          </Col>
          <Col md={1}>
            <InputGroup style={{ width: '45px' }}>
              <Form.Control
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </InputGroup>
          </Col>
          <Col md={1}>
            <InputGroup style={{ width: '45px' }}>

              <Form.Control
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </InputGroup>
          </Col>
          <Col md={1} className="d-flex justify-content-end">
            <Button
              variant="danger"
              onClick={() => {
                setSearch("");
                setStatusFilter("");
                setDateFilter("");
                setStartDate("");
                setEndDate("");
              }}
            >
              <FontAwesomeIcon icon={faBroom} />
            </Button>
          </Col>

          <Col md={4}>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Search"
                value={search}
                onChange={handleSearchChange}
              />
              <InputGroup.Text>
                <FontAwesomeIcon icon={faSearch} />
              </InputGroup.Text>
            </InputGroup>
          </Col>
          <Col md={1}>
            <Button variant="primary" className="ms-2" onClick={downloadPDF}>
              <FontAwesomeIcon icon={faDownload} />
            </Button>
          </Col>
        </Row>
      </Form>
      <div id="table-section" className="table-responsive">
        <Table bordered hover>
          <thead>
            <tr>
              <th>Transaction Id</th>
              <th>User Name</th>
              <th>Booking Id</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>{renderTableRows(getFilteredData())}</tbody>
        </Table>
      </div>
    </Container>
  );
};

export default Payment;
