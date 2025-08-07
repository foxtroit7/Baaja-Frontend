import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Table,
  Card,
  Spinner,
  Alert,
  Badge,
  Form,
  Button,
  Modal,
} from 'react-bootstrap';
import Select from 'react-select'; 
const Featured = () => {
  const [featuredData, setFeaturedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rankChanges, setRankChanges] = useState({});


  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [allArtists, setAllArtists] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState('');
  const [newRank, setNewRank] = useState('');

  const fetchFeaturedData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication token is missing');

      const response = await axios.get(
        'http://35.154.161.226:5000/api/feautured/list',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFeaturedData(response.data || []);
    } catch (err) {
      setError('Failed to fetch featured data');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllArtists = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://35.154.161.226:5000/api/artists_details', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllArtists(response.data);
    } catch (error) {
      alert('Failed to fetch artist list');
    }
  };

  const handleAddToFeatured = async () => {
    if (!selectedArtist || !newRank) {
      alert('Please select an artist and enter a rank');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://35.154.161.226:5000/api/artist/feautured/approve/${selectedArtist}`,
        { featured_rank: Number(newRank) },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setShowModal(false);
      setSelectedArtist('');
      setNewRank('');
      fetchFeaturedData();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to add artist to featured list');
    }
  };

  const handleRankChange = (user_id, newRank) => {
    setRankChanges((prev) => ({
      ...prev,
      [user_id]: newRank,
    }));
  };

  const handleRemove = async (user_id) => {
    const token = localStorage.getItem('token');
    if (!window.confirm('Are you sure you want to remove this artist from featured list?')) return;

    try {
      await axios.put(
        `http://35.154.161.226:5000/api/artist/feautured/remove/${user_id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchFeaturedData();
    } catch (error) {
      alert('Failed to remove artist from featured list');
    }
  };

  const handleUpdateRank = async (user_id) => {
    const token = localStorage.getItem('token');
    const updatedRank = rankChanges[user_id];

    if (!updatedRank || isNaN(updatedRank)) {
      alert('Please enter a valid numeric rank.');
      return;
    }

    try {
      await axios.put(
        `http://35.154.161.226:5000/api/artist/feautured/approve/${user_id}`,
        { featured_rank: Number(updatedRank) },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setRankChanges((prev) => {
        const updated = { ...prev };
        delete updated[user_id];
        return updated;
      });

      fetchFeaturedData();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update rank');
    }
  };

  useEffect(() => {
    fetchFeaturedData();
  }, []);

  return (
    <Container className="py-5">
      <Card className="shadow-lg border-0">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <Card.Title className="display-6 fw-bold">
              Featured Artists
            </Card.Title>
            <Button
              className='bg-main'
              onClick={() => {
                fetchAllArtists();
                setShowModal(true);
              }}
            >
              Add Artist to Featured
            </Button>
          </div>

          {loading ? (
            <div className="text-center my-5">
              <Spinner animation="border" className='bg-main' />
              <p className="mt-2">Loading data...</p>
            </div>
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : (
            <Table responsive className="table-striped text-center">
              <thead className="">
                <tr>
                  <th>#</th>
                  <th>User ID</th>
                  <th>Owner Name</th>
                  <th>Poster</th>
                  <th>Profile Name</th>
                  <th>Category ID</th>
                  <th>Featured Rank</th>
                  <th>Featured</th>
                  <th>Change Rank</th>
                  <th>Remove</th>
                </tr>
              </thead>
              <tbody>
                {featuredData.map((item, index) => (
                  <tr key={item._id || index}>
                    <td className="text-center align-middle">{index + 1}</td>
                    <td className="text-center align-middle">{item.user_id}</td>
                    <td className="text-center align-middle">{item.owner_name}</td>
                    <td className="text-center align-middle">
                      <img
                        src={`http://35.154.161.226:5000/${item.poster}`}
                        alt="Banner"
                        className="rounded shadow"
                        style={{
                          width: '110px',
                          height: '120px',
                          objectFit: 'cover',
                          border: '2px solid #007bff',
                        }}
                      />
                    </td>
                    <td className="text-center align-middle">{item.profile_name}</td>
                    <td className="text-center align-middle">{item.category_id}</td>
                    <td className="text-center align-middle fw-bold text-main" >{item.featured_rank}</td>
                    <td className="text-center align-middle">
                      {item.featured ? (
                        <Badge bg="success">Yes</Badge>
                      ) : (
                        <Badge bg="secondary">No</Badge>
                      )}
                    </td>
                    <td className="text-center align-middle">
                      <Form.Control
                        type="number"
                        placeholder="Enter rank"

                        value={rankChanges[item.user_id] || ''}
                        onChange={(e) => handleRankChange(item.user_id, e.target.value)}
                        className="mb-2 custom-placeholder"
                      />
                      <Button
                      className='bg-main'
                        size="sm"
                        onClick={() => handleUpdateRank(item.user_id)}
                      >
                        Change Rank
                      </Button>
                    </td>
                    <td className="text-center align-middle">
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleRemove(item.user_id)}
                      >
                        Remove
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* ➕ Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className='text-dark'>Add Artist to Featured</Modal.Title>
        </Modal.Header>
        <Modal.Body className='text-dark'>

  {/* Artist Dropdown */}
 <Form.Group className="mb-3">
  <Form.Label className='text-dark'>Select Artist</Form.Label>
  <Select
    options={allArtists.map((artist) => ({
      value: artist.user_id,
      label: `${artist.user_id} - ${artist.profile_name}`,
    }))}
    value={
      selectedArtist
        ? {
            value: selectedArtist,
            label: `${selectedArtist} - ${
              allArtists.find((a) => a.user_id === selectedArtist)?.profile_name || ''
            }`,
          }
        : null
    }
    className= "text-dark"
    onChange={(selected) => setSelectedArtist(selected?.value || '')}
    isClearable
    placeholder="Search and select artist..."

  />
</Form.Group>

  {/* Rank Input */}
  <Form.Group>
    <Form.Label className='text-dark bg-main'>Enter Rank</Form.Label>
    <Form.Control
      type="number"
      placeholder="Enter featured rank"
      className='custom-placeholder'
      value={newRank}
      onChange={(e) => setNewRank(e.target.value)}
    />
  </Form.Group>
</Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button className="bg-main" onClick={handleAddToFeatured}>
            Add to Featured
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Featured;
