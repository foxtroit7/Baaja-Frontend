import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faUserFriends,
  faMoneyBill,
  faCancel,
  faStopCircle,
  faBarsProgress,
} from "@fortawesome/free-solid-svg-icons";

const Dashboard = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [timeFilter, setTimeFilter] = useState("All");
  const [monthFilter, setMonthFilter] = useState("All");
  const [data, setData] = useState(null);

  // Fetch data from API
  const fetchData = async (filter = "All", start = "", end = "") => {
    const token = localStorage.getItem("token"); // Retrieve token from localStorage

    if (!token) {
      console.error("No token found. User might be logged out.");
      return;
    }

    let url = "http://35.154.161.226:5000/api/dashboard-stats";
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // Include Bearer token in Authorization header
    };

    if (filter !== "All") {
      if (["today", "week", "month"].includes(filter.toLowerCase())) {
        url += `?range=${filter.toLowerCase()}`;
      } else {
        // Handle month names
        const monthMap = {
          January: 0,
          February: 1,
          March: 2,
          April: 3,
          May: 4,
          June: 5,
          July: 6,
          August: 7,
          September: 8,
          October: 9,
          November: 10,
          December: 11,
        };
        const monthIndex = monthMap[filter];
        if (monthIndex !== undefined) {
          const now = new Date();
          const year = now.getFullYear();
          const startOfMonth = new Date(year, monthIndex, 1);
          const endOfMonth = new Date(year, monthIndex + 1, 0);
          const start = startOfMonth.toISOString().split("T")[0];
          const end = endOfMonth.toISOString().split("T")[0];
          url += `?range=custom&startDate=${start}&endDate=${end}`;
        }
      }
    } else if (start && end) {
      url += `?range=custom&startDate=${start}&endDate=${end}`;
    }

    try {
      const response = await fetch(url, { headers });
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTimeFilterChange = (e) => {
    const selectedFilter = e.target.value;
    setTimeFilter(selectedFilter);
    setMonthFilter("All"); // Reset month filter when time filter is used
    setStartDate("");
    setEndDate("");
    fetchData(selectedFilter);
  };

  const handleMonthFilterChange = (e) => {
    const selectedMonth = e.target.value;
    setMonthFilter(selectedMonth);
    setTimeFilter("All"); // Reset time filter when month filter is used
    setStartDate("");
    setEndDate("");
    fetchData(selectedMonth);
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
  
    // Update the corresponding date state
    if (name === "startDate") {
      setStartDate(value);
    } else if (name === "endDate") {
      setEndDate(value);
  
      // Only fetch data when both dates are selected
      if (startDate && value) {
        fetchData("custom", startDate, value);
      }
    }
  
    // Reset other filters when custom dates are used
    setTimeFilter("All");
    setMonthFilter("All");
  };
  
  
  

  useEffect(() => {
    if (startDate && endDate) {
      setTimeFilter("All");
      setMonthFilter("All");
      fetchData("custom", startDate, endDate);
    }
  }, [startDate, endDate]);

  const handleReset = () => {
    setStartDate("");
    setEndDate("");
    setTimeFilter("All");
    setMonthFilter("All");
    fetchData();
  };

  if (!data) return <div>Loading...</div>;

  return (
    <Container>
      <h3 className="text-center my-4">Dashboard</h3>

      {/* Filters Section */}
      <Row className="mb-4 align-items-center">
        <Col md={2}>
          <Form.Group controlId="timeFilter">
            <Form.Label>Time Filter:</Form.Label>
            <Form.Select value={timeFilter} onChange={handleTimeFilterChange}>
              <option value="All">All</option>
              <option value="today">Today</option>
              <option value="week">Current Week</option>
              <option value="month">Current Month</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={2}>
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
        <Col md={6}>
          <Form.Group controlId="customDateRange" className="d-flex gap-2">
            <Form.Label className="mt-2">Date</Form.Label>
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
        <Col md={2}>
          <Button variant="secondary" onClick={handleReset} className="w-100">
            Reset
          </Button>
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
                {data.totalRevenue}
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
  );
};

export default Dashboard;
