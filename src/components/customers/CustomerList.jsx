import React, { useState, useEffect } from "react";
import { Table, Container, Dropdown, Form, InputGroup, Button, Collapse, Spinner } from "react-bootstrap";
import { Link , useParams} from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter, faBroom, faEye, faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
const CustomerList = () => {
  const { user_id } = useParams();
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [minBookings, setMinBookings] = useState("");
  const [maxBookings, setMaxBookings] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("https://baaja-backend-2.onrender.com/api/user/details");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (user_id) => {
    try {
      const response = await axios.delete(`https://baaja-backend-2.onrender.com/api/user/details/${user_id}`);
  
      if (response.status === 200) {
        setData((prevData) => prevData.filter((user) => user.user_id !== user_id));
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };
  

  const handleStatusChange = (id, newStatus) => {
    setData((prevData) =>
      prevData.map((item) => (item.user_id === id ? { ...item, status: newStatus } : item))
    );
  };

  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter("");
    setStartDate("");
    setEndDate("");
    setMinBookings("");
    setMaxBookings("");
  };

  // Filter data based on search query and filters
  const filteredData = data.filter((customer) => {
    const matchesSearchQuery =
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.place.includes(searchQuery)

    const matchesStatus = !statusFilter || customer.status === statusFilter;

    const matchesDateRange =
      (!startDate || new Date(customer.date) >= new Date(startDate)) &&
      (!endDate || new Date(customer.date) <= new Date(endDate));

    const matchesBookings =
      (!minBookings || customer.total_bookings >= parseInt(minBookings)) &&
      (!maxBookings || customer.total_bookings <= parseInt(maxBookings));

    return matchesSearchQuery && matchesStatus && matchesDateRange && matchesBookings;
  });

  return (
    <Container>
      <h2 className="text-center my-4" style={{ fontFamily: "Roboto, sans-serif", fontWeight: "bold", color: "#333" }}>
        User List
      </h2>

      {/* Search Bar */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <span style={{ fontSize: "1.9rem", fontWeight: "bold" }}>Users</span>
        <InputGroup style={{ width: "300px" }}>
          <InputGroup.Text>
            <FontAwesomeIcon icon={faSearch} className="text-primary" />
          </InputGroup.Text>
          <Form.Control
            type="text"
            placeholder="Search by Name or Location"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </InputGroup>
      </div>

      {/* Filter Button */}
      <div className="d-flex justify-content-between mb-2">
        <Button
          variant="outline-primary"
          onClick={() => setFiltersVisible(!filtersVisible)}
          aria-controls="filters"
          aria-expanded={filtersVisible}
        >
          <FontAwesomeIcon icon={faFilter} />
        </Button>
        <Button variant="outline-danger" onClick={resetFilters} style={{ fontWeight: "bold" }}>
          <FontAwesomeIcon icon={faBroom} />
        </Button>
      </div>

      {/* Filter Options */}
      <Collapse in={filtersVisible}>
        <div id="filters" className="border p-3 rounded mb-3">
          <Form>
            <Form.Group controlId="statusFilter" className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="">All</option>
                <option value="Active">Active</option>
                <option value="Suspend">Suspend</option>
              </Form.Select>
            </Form.Group>

            <Form.Group controlId="dateFilter" className="mb-3">
              <Form.Label>Registration Date Range</Form.Label>
              <div className="d-flex gap-3">
                <Form.Control type="date" placeholder="Start Date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                <Form.Control type="date" placeholder="End Date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
            </Form.Group>

            <Form.Group controlId="bookingsFilter" className="mb-3">
              <Form.Label>Total Bookings Range</Form.Label>
              <div className="d-flex gap-3">
                <Form.Control type="number" placeholder="Min Bookings" value={minBookings} onChange={(e) => setMinBookings(e.target.value)} />
                <Form.Control type="number" placeholder="Max Bookings" value={maxBookings} onChange={(e) => setMaxBookings(e.target.value)} />
              </div>
            </Form.Group>
          </Form>
        </div>
      </Collapse>

      {/* Loading & Error Handling */}
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : error ? (
        <div className="text-center text-danger">{error}</div>
      ) : (
        <div className="table-responsive">
          <Table bordered hover className="shadow-sm table-striped" style={{ borderRadius: "10px", overflow: "hidden" }}>
            <thead className="bg-primary text-white" style={{ fontSize: "1.1rem" }}>
              <tr>
                <th className="text-center">User ID</th>
                <th className="text-center">Name</th>
                <th className="text-center">Phone</th>
                <th className="text-center">Total Bookings</th>
                <th className="text-center">Registration Date</th>
                <th className="text-center">Location</th>
                <th className="text-center">Status</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((customer) => (
                <tr key={customer.user_id} style={{ fontSize: "1rem" }}>
                  <td className="text-center">{customer.user_id}</td>
                  <td className="text-center">{customer.name}</td>
                  <td className="text-center">{customer.phone_number}</td>
                  <td className="text-center">{customer.total_bookings}</td>
                  <td className="text-center">{customer.registration_date}</td>
                  <td className="text-center">{customer.location}</td>
                  <td className="text-center">
                    <Dropdown>
                      <Dropdown.Toggle variant={customer.status === "Active" ? "success" : "danger"} size="sm">
                        {customer.status}
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item onClick={() => handleStatusChange(customer.user_id, customer.status === "Active" ? "Suspend" : "Active")}>
                          Change to {customer.status === "Active" ? "Suspend" : "Active"}
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                  <td className="text-center">
                    <Link to={`/customer-profile/${customer.user_id}`} className="btn btn-primary text-light btn-md">
                    <FontAwesomeIcon icon={faEye} />
                    </Link>
                    <Link to='' className="btn btn-danger text-light ms-2 btn-md" onClick={() => handleDelete(customer.user_id)}>
                    <FontAwesomeIcon icon={faTrash} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </Container>
  );
};

export default CustomerList;
