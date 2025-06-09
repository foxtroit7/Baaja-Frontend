import React, { useEffect, useState } from "react";
import { Table, Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";

const Approved = () => {
  const [artistList, setArtistList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedArtistId, setSelectedArtistId] = useState(null);

  const fetchArtists = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://35.154.161.226:5000/api/pending_artists_details", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setArtistList(response.data);
    } catch (error) {
      console.error("Error fetching artist data:", error);
    }
  };

  useEffect(() => {
    fetchArtists();
  }, []);

  const handleApprove = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://35.154.161.226:5000/api/artist/approve/${selectedArtistId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setShowModal(false);
      setSelectedArtistId(null);
      fetchArtists();
    } catch (error) {
      console.error("Error approving artist:", error);
      alert("Approval failed");
    }
  };

  const handleShowModal = (user_id) => {
    setSelectedArtistId(user_id);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedArtistId(null);
  };

  return (
    <div className="mt-4">
      <h3 className="text-center mb-4">Artist Approval Requests</h3>
      <Table striped bordered hover responsive className="text-center">
        <thead>
          <tr>
            <th>Artist Id</th>
            <th>Name</th>
            <th>Request Time</th>
            <th>Profile Name</th>
            <th>Status</th>
            <th>View</th>
            <th>Approval Request</th>
          </tr>
        </thead>
        <tbody>
          {artistList.map((artist) => (
            <tr className="text-center align-middle" key={artist._id}>
              <td>{artist.user_id}</td>
              <td>{artist.owner_name || "N/A"}</td>
              <td>{new Date(artist.createdAt).toLocaleString()}</td>
              <td>{artist.profile_name || "N/A"}</td>
              <td>
                <span className="badge bg-warning text-dark px-3 py-1 rounded-pill" style={{ fontSize: "0.8rem" }}>
                  {artist.status || "Pending"}
                </span>
              </td>
              <td>
                <Link to={`/pending_artists_details/${artist.user_id}`}>
                  <Button variant="primary">Check Profile</Button>
                </Link>
              </td>
              <td>
                <Button variant="success" onClick={() => handleShowModal(artist.user_id)}>
                  Waiting for Approval
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal for approval confirmation */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Approval</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to approve this artist?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleApprove}>
            Yes, Approve
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Approved;
