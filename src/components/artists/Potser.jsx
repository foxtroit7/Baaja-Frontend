import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Card, Table, Form, Button, Spinner, Alert, Image } from 'react-bootstrap';

const Potser = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [selectedFiles, setSelectedFiles] = useState({}); // store selected files per artist

  const fetchArtists = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://35.154.161.226:5000/api/artists_details', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setArtists(res.data);
    } catch (err) {
      setError('Failed to fetch artist details');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e, user_id) => {
    const file = e.target.files[0];
    setSelectedFiles((prev) => ({ ...prev, [user_id]: file }));
  };

  const handleUpload = async (user_id) => {
    const file = selectedFiles[user_id];
    if (!file) {
      alert('Please select a file first');
      return;
    }

    const formData = new FormData();
    formData.append('poster', file);

    setUploading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://35.154.161.226:5000/api/artist/poster/${user_id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Poster uploaded successfully!');
      fetchArtists(); // refresh list
    } catch (err) {
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    fetchArtists();
  }, []);

  return (
    <Container className="py-4">
      <Card className="shadow border-0">
        <Card.Body>
          <h3 className="text-dark mb-4">Upload Artist Posters</h3>

          {loading ? (
            <div className="text-center my-5">
              <Spinner animation="border" />
              <p>Loading artists...</p>
            </div>
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : (
            <Table bordered hover responsive>
              <thead className="table-primary text-center">
                <tr>
                  <th>#</th>
                  <th>User ID</th>
                  <th>Owner Name</th>
                  <th>Profile Name</th>
                  <th>Current Poster</th>
                  <th>Upload New Poster</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {artists.map((artist, index) => (
                  <tr key={artist.user_id}>
                     <td className="text-center align-middle">{index + 1}</td>
                     <td className="text-center align-middle">{artist.user_id}</td>
                     <td className="text-center align-middle">{artist.owner_name}</td>
                     <td className="text-center align-middle">{artist.profile_name}</td>
                     <td className="text-center align-middle">
                      {artist.poster ? (
                        <Image
                          src={`http://35.154.161.226:5000/${artist.poster}`}
                          width={100}
                          height={120}
                          rounded
                          style={{ objectFit: 'cover', border: '2px solid #007bff' }}
                        />
                      ) : (
                        <span>No poster</span>
                      )}
                    </td>
                     <td className="text-center align-middle">
                      <Form.Control
                        type="file"
                        onChange={(e) => handleFileChange(e, artist.user_id)}
                        accept="image/*"
                      />
                    </td>
                     <td className="text-center align-middle">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleUpload(artist.user_id)}
                        disabled={uploading}
                      >
                        {uploading ? 'Uploading...' : 'Upload'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Potser;
