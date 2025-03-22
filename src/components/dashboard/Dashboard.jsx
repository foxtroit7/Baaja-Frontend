import React, { useState } from "react";
import { Container, Row, Col, Card, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faUserFriends,
  faMoneyBill,
  faCancel,
  faStopCircle,
  faBarsProgress,
} from "@fortawesome/free-solid-svg-icons";
import Approved from "./Approved";

const Dashboard = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [timeFilter, setTimeFilter] = useState("Today");
  const [monthFilter, setMonthFilter] = useState("All");

  // Sample dynamic data for the cards
  const initialData = {
    totalUsers: 400,
    totalArtists: 80,
    cancelledBookings: 80,
    activeBookings: 400,
    totalRevenue: 800,
    pendingBookings: 400,
  };

  const [data, setData] = useState(initialData);

  // Handle the filter changes
  const handleTimeFilterChange = (e) => {
    const selectedFilter = e.target.value;
    setTimeFilter(selectedFilter);
    setMonthFilter("All"); // Reset month filter when time filter is used
    updateData(selectedFilter, startDate, endDate);
  };

  const handleMonthFilterChange = (e) => {
    const selectedMonth = e.target.value;
    setMonthFilter(selectedMonth);
    setTimeFilter("All"); // Reset time filter when month filter is used
    updateData(selectedMonth, startDate, endDate);
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    if (name === "startDate") setStartDate(value);
    if (name === "endDate") setEndDate(value);
    setTimeFilter("All"); // Reset other filters when custom dates are used
    setMonthFilter("All");
    if (startDate && endDate) {
      updateData("Custom", value, endDate);
    }
  };

  // Function to update the data dynamically (mocked here with adjustments)
  const updateData = (filter, start, end) => {
    let updatedData = { ...initialData };

    if (filter === "Today") {
      updatedData = {
        totalUsers: 50,
        totalArtists: 10,
        cancelledBookings: 5,
        activeBookings: 30,
        totalRevenue: 200,
        pendingBookings: 15,
      };
    } else if (filter === "Current Week") {
      updatedData = {
        totalUsers: 150,
        totalArtists: 25,
        cancelledBookings: 10,
        activeBookings: 80,
        totalRevenue: 500,
        pendingBookings: 40,
      };
    } else if (filter === "Current Month") {
      updatedData = {
        totalUsers: 300,
        totalArtists: 50,
        cancelledBookings: 20,
        activeBookings: 200,
        totalRevenue: 1000,
        pendingBookings: 80,
      };
    } else if (filter === "January") {
      updatedData = {
        totalUsers: 100,
        totalArtists: 15,
        cancelledBookings: 8,
        activeBookings: 50,
        totalRevenue: 400,
        pendingBookings: 20,
      };
    } else if (filter === "Custom") {
      // Simulate data for custom date ranges
      updatedData = {
        totalUsers: Math.floor(Math.random() * 300) + 50,
        totalArtists: Math.floor(Math.random() * 50) + 10,
        cancelledBookings: Math.floor(Math.random() * 20) + 5,
        activeBookings: Math.floor(Math.random() * 200) + 50,
        totalRevenue: Math.floor(Math.random() * 1500) + 200,
        pendingBookings: Math.floor(Math.random() * 100) + 10,
      };
    }

    setData(updatedData);
  };

  return (
    <>
    <Container>
      <h3 className="text-center my-4">Dashboard</h3>

      {/* Filters Section */}
      <Row className="mb-4 align-items-center">
        <Col md={4}>
          <Form.Group controlId="timeFilter">
            <Form.Label>Time Filter:</Form.Label>
            <Form.Select value={timeFilter} onChange={handleTimeFilterChange}>
              <option value="Today">Today</option>
              <option value="Current Week">Current Week</option>
              <option value="Current Month">Current Month</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group controlId="monthFilter">
            <Form.Label>Month Filter:</Form.Label>
            <Form.Select value={monthFilter} onChange={handleMonthFilterChange}>
              <option value="All">All</option>
              <option value="January">January</option>
              <option value="February">February</option>
              <option value="March">March</option>
              <option value="April">April</option>
              <option value="May">May</option>
              <option value="June">June</option>
              <option value="July">July</option>
              <option value="August">August</option>
              <option value="September">September</option>
              <option value="October">October</option>
              <option value="November">November</option>
              <option value="December">December</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group controlId="customDateRange" className="d-flex gap-2">
            <Form.Label className="mb-0 me-2">Custom Date:</Form.Label>
            <Form.Control
              type="date"
              name="startDate"
              value={startDate}
              onChange={handleDateChange}
            />
            <Form.Control
              type="date"
              name="endDate"
              value={endDate}
              onChange={handleDateChange}
            />
          </Form.Group>
        </Col>
      </Row>

      {/* Cards Section */}
      <Row className="g-4">
        <Col md={4}>
          <Card className="text-center shadow border-0">
            <Card.Body>
              <FontAwesomeIcon
                icon={faUsers}
                className="fs-3 text-primary mb-3"
              />
              <Card.Title>Total Users</Card.Title>
              <Card.Text className="fs-5 fw-bold">{data.totalUsers}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center shadow border-0">
            <Card.Body>
              <FontAwesomeIcon
                icon={faUserFriends}
                className="fs-3 text-success mb-3"
              />
              <Card.Title>Total Artists</Card.Title>
              <Card.Text className="fs-5 fw-bold">{data.totalArtists}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center shadow border-0">
            <Card.Body>
              <FontAwesomeIcon
                icon={faCancel}
                className="fs-3 text-danger mb-3"
              />
              <Card.Title>Cancelled Bookings</Card.Title>
              <Card.Text className="fs-5 fw-bold">
                {data.cancelledBookings}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="g-4 mt-4">
        <Col md={4}>
          <Card className="text-center shadow border-0">
            <Card.Body>
              <FontAwesomeIcon
                icon={faBarsProgress}
                className="fs-3 text-warning mb-3"
              />
              <Card.Title>Active Bookings</Card.Title>
              <Card.Text className="fs-5 fw-bold">
                {data.activeBookings}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center shadow border-0">
            <Card.Body>
              <FontAwesomeIcon
                icon={faMoneyBill}
                className="fs-3 text-success mb-3"
              />
              <Card.Title>Total Revenue</Card.Title>
              <Card.Text className="fs-5 fw-bold">
                ${data.totalRevenue}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center shadow border-0">
            <Card.Body>
              <FontAwesomeIcon
                icon={faStopCircle}
                className="fs-3 text-info mb-3"
              />
              <Card.Title>Pending Bookings</Card.Title>
              <Card.Text className="fs-5 fw-bold">
                {data.pendingBookings}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
    <Approved />
    </>
  );
};

export default Dashboard;
