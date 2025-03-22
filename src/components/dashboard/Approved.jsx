import React, { useState } from "react";
import { Table, Button, Image, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";

const Approved = () => {
  const [artistList, setArtistList] = useState([
    {
      id: 1,
      name: "Arjun Verma",
      phone: "9876543210",
      image: "https://randomuser.me/api/portraits/men/1.jpg",
      category: "Singer",
      status: "Pending",
    },
    {
      id: 2,
      name: "Neha Kapoor",
      phone: "9123456789",
      image: "https://randomuser.me/api/portraits/women/2.jpg",
      category: "Dancer",
      status: "Accepted",
    },
    {
      id: 3,
      name: "Rajesh Singh",
      phone: "8765432109",
      image: "https://randomuser.me/api/portraits/men/3.jpg",
      category: "Guitarist",
      status: "Pending",
    },
    {
      id: 4,
      name: "Priya Sharma",
      phone: "9988776655",
      image: "https://randomuser.me/api/portraits/women/4.jpg",
      category: "Painter",
      status: "Rejected",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [actionType, setActionType] = useState(""); // "Accept" or "Reject"

  const handleOpenModal = (artist, action) => {
    setSelectedArtist(artist);
    setActionType(action);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedArtist(null);
    setActionType("");
  };

  const handleUpdateArtistList = (id, action) => {
    setArtistList((prevList) =>
      prevList.map((artist) =>
        artist.id === id
          ? { ...artist, status: action === "Accept" ? "Accepted" : "Rejected" }
          : artist
      )
    );
    handleCloseModal();
  };

  return (
    <div className="mt-4">
      <h3 className="text-center mb-4">Artist Approval Requests</h3>
      <Table striped bordered hover responsive className="text-center">
        <thead>
          <tr>
            <th>Artist Id</th>
            <th>Name</th>
            <th>Phone Number</th>
            <th>Image</th>
            <th>Category</th>
            <th>View</th>
            <th>Approval Request</th>
          </tr>
        </thead>
        <tbody>
          {artistList.map((artist) => (
            <tr key={artist.id}>
              <td>{artist.id}</td>
              <td>{artist.name}</td>
              <td>{artist.phone}</td>
              <td>
                <Image
                  src={artist.image}
                  alt={artist.name}
                  roundedCircle
                  style={{ width: "50px", height: "50px" }}
                />
              </td>
              <td>{artist.category}</td>
              <td>
                <Link to="/new-artist">
                  <Button variant="primary">View</Button>
                </Link>
              </td>
              <td>
                {artist.status === "Accepted" ? (
                  <Button variant="success" disabled>
                    Accepted
                  </Button>
                ) : artist.status === "Rejected" ? (
                  <Button variant="danger" disabled>
                    Rejected
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="success"
                      className="me-2"
                      onClick={() => handleOpenModal(artist, "Accept")}
                    >
                      Accept
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleOpenModal(artist, "Reject")}
                    >
                      Reject
                    </Button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Confirmation Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {actionType === "Accept" ? "Accept Artist" : "Reject Artist"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to {actionType.toLowerCase()} this artist?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button
            variant={actionType === "Accept" ? "success" : "danger"}
            onClick={() => handleUpdateArtistList(selectedArtist.id, actionType)}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Approved;
