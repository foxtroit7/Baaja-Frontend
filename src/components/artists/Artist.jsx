import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Tab, Tabs, Badge, Dropdown, Form, InputGroup, Button, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faBroom } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const predefinedCategories = ['Sitar', 'Tabla', 'Band', 'HandTaal', 'Manjira', 'Flute'];

const Artist = () => {
    const [data, setData] = useState([]);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [filterTopPerformers, setFilterTopPerformers] = useState(false);
    const [sortOrder, setSortOrder] = useState('default');
    const [activeTab, setActiveTab] = useState('All');
    const [showModal, setShowModal] = useState(false);
    const [selectedArtist, setSelectedArtist] = useState(null);
    useEffect(() => {
        fetchArtists();
    }, []);

    const fetchArtists = async () => {
        try {
            const token = localStorage.getItem("token"); // Get token from localStorage
    
            if (!token) {
                console.error("No token found. User might be logged out.");
                throw new Error("Authentication token is missing");
            }
    
            const response = await axios.get(
                "http://15.206.194.89:5000/api/artists_details",
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // ✅ Pass token in the headers
                    },
                }
            );
    
            setData(response.data);
        } catch (error) {
            console.error("Error fetching artist data:", error);
        }
    };
    

    const handleStatusChange = (id, newStatus) => {
        setData((prevData) =>
            prevData.map((item) =>
                item.user_id === id ? { ...item, status: newStatus } : item
            )
        );
    };

    const filteredData = data.filter((item) => {
        const matchesSearch =
            item.profile_name?.toLowerCase().includes(search.toLowerCase()) ||
            item.category_type?.toLowerCase().includes(search.toLowerCase()) ||
            item.location?.toLowerCase().includes(search.toLowerCase());

        const matchesStatus = filterStatus === 'All' || item.status === filterStatus;
        const matchesTopPerformers = !filterTopPerformers || item.rating >= 4;

        return matchesSearch && matchesStatus && matchesTopPerformers;
    });

    const handleSortChange = (order) => {
        setSortOrder(order);
    };

    const sortedData = () => {
        let sorted = [...filteredData];
        if (sortOrder === 'bookings') {
            sorted = sorted.sort((a, b) => b.total_bookings - a.total_bookings);
        } else if (sortOrder === 'alphabetical') {
            sorted = sorted.sort((a, b) => a.name.localeCompare(b.name));
        }
        return sorted;
    };
    const toggleTopBaaja = async (artist) => {
        try {
            const url = artist.top_baaja 
                ? `http://localhost:5000/api/artist/top_baaja/reject/${artist.user_id}`
                : `http://15.206.194.89:5000/api/artist/top_baaja/approve/${artist.user_id}`;

            await axios.put(url, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });

            setData(prevData =>
                prevData.map(item =>
                    item.user_id === artist.user_id ? { ...item, top_baaja: !artist.top_baaja } : item
                )
            );
            setShowModal(false);
        } catch (error) {
            console.error("Error updating top_baaja:", error);
        }
    };
    return (
        <Container style={{ marginTop: '30px', fontFamily: 'Roboto, sans-serif' }}>
            <Row className="mb-4">
                <Col>
                    <h3 className="text-center" style={{ fontWeight: 'bold', color: 'black', letterSpacing: '2px' }}>
                        Artists List
                    </h3>
                </Col>
            </Row>
            <Row className="mb-4">
                <Col md={4}>
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
                <Col md={2}>
                    <Form.Select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="All">All Status</option>
                        <option value="Active">Active</option>
                        <option value="Approval">Approval</option>
                        <option value="Suspend">Suspend</option>
                    </Form.Select>
                </Col>
                <Col md={2}>
                    <Button variant="danger" className='btn-md' onClick={() => {
                        setSearch('');
                        setFilterStatus('All');
                        setFilterTopPerformers(false);
                        setSortOrder('default');
                    }}>
                        <FontAwesomeIcon icon={faBroom} />
                    </Button>
                </Col>
                <Col md={4}>
                    <Dropdown>
                        <Dropdown.Toggle variant="primary" size="md">
                            Sort By
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => handleSortChange('default')}>Default</Dropdown.Item>
                            <Dropdown.Item onClick={() => handleSortChange('bookings')}>Higher to Lower Bookings</Dropdown.Item>
                            <Dropdown.Item onClick={() => handleSortChange('alphabetical')}>Alphabetically A-Z</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Col>
            </Row>
            <Row>
                <Col>
                    {/* <Tabs
                        activeKey={activeTab}
                        onSelect={(key) => setActiveTab(key)}
                        className="mb-4"
                        justify
                    >
                        <Tab
                            eventKey="All"
                            title={<span style={{ color: '#007bff', fontWeight: 'bold' }}>All <Badge bg="primary">{filteredData.length}</Badge></span>}
                        >
                            <ArtistTable data={sortedData()} handleStatusChange={handleStatusChange} />
                        </Tab>

                        {predefinedCategories.map((category) => {
                            const categoryData = sortedData().filter(item => item.category_type === category);
                            return (
                                <Tab
                                    eventKey={category}
                                    title={<span style={{ color: '#007bff', fontWeight: 'bold' }}>{category} <Badge bg="primary">{categoryData.length}</Badge></span>}
                                    key={category}
                                >
                                    <ArtistTable data={categoryData} handleStatusChange={handleStatusChange} />
                                </Tab>
                            );
                        })}
                    </Tabs> */}
                       <Tabs activeKey={activeTab} onSelect={(key) => setActiveTab(key)} className="mb-4" justify>
                                            <Tab eventKey="All" title={`All (${data.length})`} >
                                                <ArtistTable data={data} setSelectedArtist={setSelectedArtist} setShowModal={setShowModal} />
                                            </Tab>
                                            {predefinedCategories.map((category) => (
                                                <Tab eventKey={category} title={`${category} (${data.filter(item => item.category_type === category).length})`} key={category}>
                                                    <ArtistTable data={data.filter(item => item.category_type === category)} setSelectedArtist={setSelectedArtist} setShowModal={setShowModal} />
                                                </Tab>
                                            ))}
                                        </Tabs>
                </Col>
            </Row>
        
     {/* Modal for Confirmation */}
     <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{selectedArtist?.top_baaja ? "Remove from Baaja List" : "Approve as Top Baaja"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedArtist?.top_baaja 
                        ? "Are you sure you want to remove this artist from the Baaja list?"
                        : "Do you want to add this artist as a Top Baaja?"}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                    <Button variant={selectedArtist?.top_baaja ? "danger" : "success"} onClick={() => toggleTopBaaja(selectedArtist)}>
                        {selectedArtist?.top_baaja ? "Remove" : "Approve"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

const ArtistTable = ({ data, handleStatusChange, setSelectedArtist, setShowModal }) => (
    <Table bordered hover className="text-center table-striped">
        <thead style={{ color: '#ffffff' }}>
            <tr>
                <th>User ID</th>
                <th>Name</th>
                <th>Total Bookings</th>
                <th>Location</th>
                <th>Category Type</th>
                <th>Category Image</th>
                <th>Status</th>
                <th>Rating</th>
                <th>Top Baaja</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            {data.length > 0 ? (
                data.map(item => (
                    <tr key={item.user_id} style={{ verticalAlign: 'middle' }}>
                        <td><Link to={`/artist-profile/${item.user_id}`} className="text-decoration-none" style={{ color: '#007bff', fontWeight: '500' }}>{item.user_id}</Link></td>
                        <td style={{ fontWeight: '500' }}>{item.owner_name}</td>
                        <td>{item.total_bookings}</td>
                        <td>{item.location}</td>
                        <td style={{ fontWeight: '500', color: '#007bff' }}>{item.category_type}</td>
                        <td><img src={item.photo} alt="" className="rounded-circle shadow-sm" style={{ width: '50px', height: '50px', objectFit: 'cover', border: '3px solid #007bff' }} /></td>
                        <td>
                            <Dropdown>
                                <Dropdown.Toggle variant={item.status === 'Active' ? 'success' : item.status === 'Suspend' ? 'danger' : 'warning'} size="sm">
                                    {item.status}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => handleStatusChange(item.user_id, 'Approval')}>Change to Approval</Dropdown.Item>
                                    <Dropdown.Item onClick={() => handleStatusChange(item.user_id, 'Suspend')}>Change to Suspend</Dropdown.Item>
                                    <Dropdown.Item onClick={() => handleStatusChange(item.user_id, 'Active')}>Change to Active</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </td>
                        <td className='text-warning h5'>{'★'.repeat(Math.floor(item.rating))}{'☆'.repeat(5 - Math.floor(item.rating))}</td>
                        <td>
                            <Button variant={item.top_baaja ? "success" : "secondary"} size="sm" onClick={() => {
                                setSelectedArtist(item);
                                setShowModal(true);
                            }}>
                                {item.top_baaja ? "Top Baaja" : "Not in Baaja"}
                            </Button>
                        </td>
                        <td><Link to={`/artist-profile/${item.user_id}`} className="btn btn-outline-primary btn-sm">View</Link></td>
                    </tr>
                ))
            ) : (
                <tr><td colSpan="9">No artists available</td></tr>
            )}
        </tbody>
    </Table>
);

export default Artist;
