import React, { useState, useEffect } from "react";
import {
  Table, Container, Form, InputGroup,
  Spinner, Pagination,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faEye } from "@fortawesome/free-solid-svg-icons";

const CustomerList = () => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 15;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://35.154.161.226:5000/api/user/details");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const result = await response.json();
        setData(result.users || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredData = data.filter((customer) => {
    const nameMatch = customer.name?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    const placeMatch = customer.place?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    return nameMatch || placeMatch;
  });

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredData.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredData.length / usersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const renderPagination = () => {
    let items = [];
    for (let number = 1; number <= totalPages; number++) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === currentPage}
          onClick={() => paginate(number)}
          className=""
        >
          {number}
        </Pagination.Item>
      );
    }
    return (
      <Pagination className="justify-content-center mt-4">
        <Pagination.Prev onClick={() => currentPage > 1 && paginate(currentPage - 1)} disabled={currentPage === 1} />
        {items}
        <Pagination.Next onClick={() => currentPage < totalPages && paginate(currentPage + 1)} disabled={currentPage === totalPages} />
      </Pagination>
    );
  };

  return (
    <Container>
      <h2 className="text-center text-main my-4">
        User List
      </h2>

      <div className="d-flex justify-content-between align-items-center mb-3">
      <div><h2>Users</h2></div>
       
        {/* right‑aligned search box */}
<div>
  <InputGroup style={{ maxWidth: "300px" }}>
    <InputGroup.Text>
      <FontAwesomeIcon icon={faSearch} className="text-dark" />
    </InputGroup.Text>
    <Form.Control
      type="text"
      placeholder="Search Name or Location"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="custom-placeholder"
    />
  </InputGroup>
</div>

      </div>

      {loading ? (
        <div className="align-middle">
          <Spinner animation="border" className="bg-main" />
        </div>
      ) : error ? (
        <div className="text-center text-danger">{error}</div>
      ) : (
        <>
          <div className="table-responsive">
            <Table responsive className="shadow-sm table-striped" style={{ borderRadius: "10px", overflow: "hidden" }}>
              <thead className="bg-main text-white" style={{ fontSize: "1.1rem" }}>
                <tr>
                  <th className="align-middle">User ID</th>
                  <th className="align-middle">Name</th>
                  <th className="align-middle">Phone</th>
                  <th className="align-middle">Location</th>
                  <th className="text-center">View Profile</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((customer) => (
                  <tr key={customer.user_id} style={{ fontSize: "1rem" }}>
                    <td className="align-middle">{customer.user_id}</td>
                    <td className="align-middle">{customer.name}</td>
                    <td className="align-middle">{customer.phone_number}</td>
                    <td className="align-middle">{customer.place || customer.location}</td>
                    <td className="align-middle d-flex justify-content-center">
                      <Link to={`/customer-profile/${customer.user_id}`} className="btn bg-main text-light btn-md">
                        <FontAwesomeIcon icon={faEye} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          {renderPagination()}
        </>
      )}
    </Container>
  );
};

export default CustomerList;
