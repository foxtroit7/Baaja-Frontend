import React, { useState, useEffect } from 'react';
import {
    Container, Row, Col, Table, InputGroup,
    Form, Button, Dropdown, Modal
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faBroom } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const Artist = () => {
    const [data, setData] = useState([]);
    const [search, setSearch] = useState('');
    const [sortOrder, setSortOrder] = useState('default');
    const [showModal, setShowModal] = useState(false);
    const [selectedArtist, setSelectedArtist] = useState(null);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [topBaajaRank, setTopBaajaRank] = useState('');


    useEffect(() => {
        fetchArtists();
        fetchCategories();
    }, []);

    const fetchArtists = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Authentication token is missing");

            const response = await axios.get("http://35.154.161.226:5000/api/artists_details", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setData(response.data);
        } catch (error) {
            console.error("Error fetching artist data:", error);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get("http://35.154.161.226:5000/api/category");
            setCategories(response.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const handleSortChange = (order) => {
        setSortOrder(order);
    };

    const toggleTopBaaja = async (artist) => {
        try {
            const url = artist.top_baaja
                ? `http://35.154.161.226:5000/api/artist/top_baaja/reject/${artist.user_id}`
                : `http://35.154.161.226:5000/api/artist/top_baaja/approve/${artist.user_id}`;
    
            const payload = artist.top_baaja ? {} : { top_baaja_rank: topBaajaRank };
    
            const response = await axios.put(url, payload, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    'Content-Type': 'application/json',
                }
            });
    
            setData(prevData =>
                prevData.map(item =>
                    item.user_id === artist.user_id
                        ? { ...item, top_baaja: !artist.top_baaja, top_baaja_rank: topBaajaRank }
                        : item
                )
            );
            setShowModal(false);
            setTopBaajaRank('');
        } catch (error) {
            alert(error.response?.data?.message || "Failed to update Top Baaja status");
            console.error("Error updating top_baaja:", error);
        }
    };
    

    // Filter by search and category
    const filteredData = data.filter(item => {
        const matchSearch =
            item.owner_name?.toLowerCase().includes(search.toLowerCase()) ||
            item.category_type?.toLowerCase().includes(search.toLowerCase()) ||
            item.location?.toLowerCase().includes(search.toLowerCase());

        const matchCategory = selectedCategory === 'All' || item.category_id === selectedCategory;

        return matchSearch && matchCategory;
    });

    // Sort filtered data
    const sortedData = [...filteredData].sort((a, b) => {
        if (sortOrder === 'bookings') {
            return b.total_bookings - a.total_bookings;
        } else if (sortOrder === 'alphabetical') {
            return a.owner_name.localeCompare(b.owner_name);
        } else {
            return 0;
        }
    });

    return (
        <Container style={{ marginTop: '30px', fontFamily: 'Roboto, sans-serif' }}>
            <Row className="mb-4">
                <Col>
                    <h3 className="text-center fw-bold text-dark">Artists List</h3>
                </Col>
            </Row>
<Row className="mb-4">
  <Col md={5}>
    <InputGroup>
      <Form.Control
        type="text"
        placeholder="Search by name, category, or location"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <InputGroup.Text>
        <FontAwesomeIcon icon={faSearch} className="text-primary" />
      </InputGroup.Text>
    </InputGroup>
  </Col>

  <Col md={3}>
    <Form.Select
      value={selectedCategory}
      onChange={(e) => setSelectedCategory(e.target.value)}
    >
      <option value="All">All Categories</option>
      {categories.map((cat) => (
        <option key={cat.category_id} value={cat.category_id}>
          {cat.category}
        </option>
      ))}
    </Form.Select>
  </Col>

  <Col md={2}>
    <Dropdown className="w-100">
      <Dropdown.Toggle variant="primary" className="w-100" size="md">
        Sort By
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item onClick={() => handleSortChange('default')}>Default</Dropdown.Item>
        <Dropdown.Item onClick={() => handleSortChange('bookings')}>Higher to Lower Bookings</Dropdown.Item>
        <Dropdown.Item onClick={() => handleSortChange('alphabetical')}>Alphabetically A-Z</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  </Col>

  <Col md={2}>
    <Button
      variant="danger"
      onClick={() => {
        setSearch('');
        setSortOrder('default');
        setSelectedCategory('All');
      }}
      className="w-100"
    >
      <FontAwesomeIcon icon={faBroom} className="me-2" />
      Reset
    </Button>
  </Col>
</Row>


            <Row>
                <Col>
                    <ArtistTable
                        data={sortedData}
                        setSelectedArtist={setSelectedArtist}
                        setShowModal={setShowModal}
                    />
                </Col>
            </Row>

            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
    <Modal.Header closeButton>
        <Modal.Title>{selectedArtist?.top_baaja ? "Remove from Baaja List" : "Approve as Top Baaja"}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
        {selectedArtist?.top_baaja ? (
            "Are you sure you want to remove this artist from the Baaja list?"
        ) : (
            <>
                <p>Do you want to add this artist as a Top Baaja?</p>
                <Form.Control
                    type="number"
                    placeholder="Enter rank (e.g. 1, 2, 3)"
                    value={topBaajaRank}
                    onChange={(e) => setTopBaajaRank(e.target.value)}
                    required
                />
            </>
        )}
    </Modal.Body>
    <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
        <Button
            variant={selectedArtist?.top_baaja ? "danger" : "success"}
            onClick={() => toggleTopBaaja(selectedArtist)}
            disabled={!selectedArtist?.top_baaja && !topBaajaRank}
        >
            {selectedArtist?.top_baaja ? "Remove" : "Approve"}
        </Button>
    </Modal.Footer>
</Modal>

        </Container>
    );
};

const ArtistTable = ({ data, setSelectedArtist, setShowModal }) => (
    <Table bordered hover className="text-center table-striped">
        <thead style={{ backgroundColor: '#343a40', color: '#ffffff' }}>
            <tr>
                <th>User ID</th>
                <th>Name</th>
                <th>Total Bookings</th>
                <th>Location</th>
                <th>Category Type</th>
                <th>Rating</th>
                <th>Top Baaja Rank</th>
                <th>Top Baaja</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            {data.length > 0 ? (
                data.map(item => (
                    <tr key={item.user_id} style={{ verticalAlign: 'middle' }}>
                        <td><Link to={`/artist-profile/${item.user_id}`} className="text-decoration-none text-primary fw-bold">{item.user_id}</Link></td>
                        <td className="fw-semibold">{item.owner_name}</td>
                        <td>{item.total_bookings}</td>
                        <td>{item.location}</td>
                        <td className="fw-semibold text-primary">{item.category_type}</td>
                        <td className="text-warning h5">{'★'.repeat(Math.floor(item.rating))}{'☆'.repeat(5 - Math.floor(item.rating))}</td>
                       <td>{item.top_baaja_rank}</td>
                        <td>
                            <Button
                                variant={item.top_baaja ? "success" : "secondary"}
                                size="sm"
                                onClick={() => {
                                    setSelectedArtist(item);
                                    setShowModal(true);
                                }}
                            >
                                {item.top_baaja ? "Top Baaja" : "Not in Baaja"}
                            </Button>
                        </td>
                        <td>
                            <Link to={`/artist-profile/${item.user_id}`} className="btn btn-outline-primary btn-sm">View</Link>
                        </td>
                    </tr>
                ))
            ) : (
                <tr>
                    <td colSpan="8">No artists available</td>
                </tr>
            )}
        </tbody>
    </Table>
);

export default Artist;
