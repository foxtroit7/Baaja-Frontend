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
        `http://localhost:5000/api/artist/approve/${selectedArtistId}`,
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
      <Table responsive className="text-center table-striped">
        <thead>
          <tr>
            <th>Artist Id</th>
            <th>Name</th>
      
            <th>Profile Name</th>
       
            <th>View</th>
            <th>Approval Request</th>
          </tr>
        </thead>
        <tbody>
          {artistList.map((artist) => (
            <tr className="text-center align-middle" key={artist._id}>
              <td>{artist.user_id}</td>
              <td>{artist.name || "N/A"}</td>
              <td>{artist.profile_name || "N/A"}</td>
              
              <td>
                <Link to={`/pending_artists_details/${artist.user_id}`}>
                  <Button className="bg-main">Check Profile</Button>
                </Link>
              </td>
              <td>
                <Button className="bg-main" onClick={() => handleShowModal(artist.user_id)}>
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
          <Modal.Title className='text-dark'>Confirm Approval</Modal.Title>
        </Modal.Header>
         <Modal.Body className='text-dark'>
          Are you sure you want to approve this artist?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button className="bg-main" onClick={handleApprove}>
            Yes, Approve
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Approved;
