import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Image, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
const ArtistTable = () => {
  const [sessionNames, setSessionNames] = useState([]);
  const [sessionData, setSessionData] = useState({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [newSessionRank, setNewSessionRank] = useState('');
  const [showRankModal, setShowRankModal] = useState(false);
const [selectedArtist, setSelectedArtist] = useState(null); // { sessionName, artistId }
const [newRank, setNewRank] = useState('');

  useEffect(() => {
    fetchSessionNames();
  }, []);
 
  const handleUpdateArtistRank = async () => {
    if (!newRank) return alert("Please enter a new rank.");
    if (!selectedArtist) return;
  
    try {
      const res = await axios.put(
        `http://35.154.161.226:5000/api/update-artist-rank/${selectedArtist.sessionName}/${selectedArtist.artistId}`,
        { artist_rank: newRank }
      );
      console.log("Updated:", res.data);
  
      // 🔄 Update artist rank in local state
      setSessionData((prevData) => {
        const updatedArtists = prevData[selectedArtist.sessionName].categoryRankModel.map((artist) => {
          if (artist.artist_id === selectedArtist.artistId) {
            return {
              ...artist,
              artist_rank: newRank  // ← Update the rank locally
            };
          }
          return artist;
        });
  
        return {
          ...prevData,
          [selectedArtist.sessionName]: {
            ...prevData[selectedArtist.sessionName],
            categoryRankModel: updatedArtists,
          }
        };
      });
  
      // 🔒 Reset modal and state
      setShowRankModal(false);
      setNewRank('');
      setSelectedArtist(null);
  
    } catch (err) {
      console.error("Failed to update:", err);
      alert("Update failed.");
    }
  };
  
  const openRankModal = (sessionName, artistId) => {
    setSelectedArtist({ sessionName, artistId });
    setShowRankModal(true);
  };
  
  const handleRemoveArtist = async (sessionName, artistId) => {
    try {
      const res = await axios.delete(
        `http://35.154.161.226:5000/api/artist-rank/${sessionName}/${artistId}`
      );
      console.log("Artist Removed:", res.data);
  
      // ✅ Update sessionData state
      setSessionData((prevData) => {
        const updatedArtists = prevData[sessionName].categoryRankModel.filter(
          (artist) => artist.artist_id !== artistId
        );
  
        // ✅ If no artist left, remove the entire session
        if (updatedArtists.length === 0) {
          const newData = { ...prevData };
          delete newData[sessionName]; // remove the session
          return newData;
        }
  
        // ✅ Otherwise, just update that session’s artist list
        return {
          ...prevData,
          [sessionName]: {
            ...prevData[sessionName],
            categoryRankModel: updatedArtists,
          },
        };
      });
  
    } catch (err) {
      console.error("Failed to remove artist:", err);
      alert("Failed to remove artist.");
    }
  };
  
   
  const handleUpdateRank = async () => {
    try {
      await axios.put(`http://35.154.161.226:5000/api/session-rank/${selectedSession.session_name}`, {
        session_rank: parseInt(newSessionRank),
      });
      console.log(selectedSession)
      setShowModal(false);
      fetchSessionNames(); // Refresh updated data
    } catch (error) {
      console.error('Failed to update session rank:', error);
      alert('Error updating session rank');
    }
  };
  
  const handleDeleteSession = async (sessionName) => {
    if (!window.confirm(`Are you sure you want to delete the session "${sessionName}"?`)) return;
    try {
      await axios.delete(`http://35.154.161.226:5000/api/delete-session-rank/${encodeURIComponent(sessionName)}`);
      fetchSessionNames(); 
    } catch (error) {
      console.error('Error deleting session:', error);
      alert('Failed to delete session');
    }
  };
  
  const fetchSessionNames = async () => {
    try {
      const response = await axios.get('http://35.154.161.226:5000/api/session-rank');
      const names = response.data.map((session) => session.session_name);
      setSessionNames(names);
      await fetchSessionData(names);
    } catch (error) {
      console.error('Error fetching session names:', error);
      setLoading(false);
    }
  };

  const fetchSessionData = async (names) => {
    try {
      const dataObj = {};
      for (let name of names) {
        const res = await axios.get(`http://35.154.161.226:5000/api/session-rank/by-session-name?name=${encodeURIComponent(name)}`);
        dataObj[name] = res.data;  // Assuming res.data contains the correct session data
      }
      setSessionData(dataObj);
      console.log(dataObj);  // This will show you the structure of the session data.
    } catch (error) {
      console.error('Error fetching session data:', error);
    } finally {
      setLoading(false);
    }
  };
  

  if (loading) return <p className="text-center text-lg mt-10 font-semibold">Loading...</p>;

  return (
    <div className=" mx-4 mt-6">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold ">Category Artist List</h2>
        <Link to="/category-artist-add">
          <Button className="btn bg-main shadow">Add Category Artist</Button>
        </Link>
      </div>

      {sessionNames.map((sessionName, index) => (
  <div key={index} className="mb-8">
    <div className="d-flex justify-content-between align-items-center  mt-3">
      <h4 className="text-xl font-bold text-main">{sessionName}</h4>
      <div>
      <Button
 
  size="sm"
  className="me-2 bg-main"
  onClick={() => {
    const session = sessionData[sessionName];  // Access the full session data object
    setSelectedSession({
      session_name: sessionName,
      currentRank: session ? session.session_rank : null, // Ensure session exists before accessing session_rank
    });
    setNewSessionRank(session ? session.session_rank : '');  // Set the current session rank if it exists
    setShowModal(true);
  }}
>
  Update Session Rank
</Button>

<Button
  variant="danger"
  size="sm"
  onClick={() => handleDeleteSession(sessionName)}
>
  Delete Session
</Button>

      </div>
    </div>

    <div className="">
      <Table responsive className="w-full text-sm text-center table-striped">
        <thead className="font-semibold">
          <tr>
            <th className="text-center align-middle">Session Name</th>
            <th className="text-center align-middle">Session Rank</th>
            <th className="text-center align-middle">Artist ID</th>
            <th className="text-center align-middle">Artist Rank</th>
            <th className="text-center align-middle">Artist Name</th>
            <th className="text-center align-middle">Category</th>
            <th className="text-center align-middle">Category ID</th>
            <th className="text-center align-middle">Poster</th>
            <th className="text-center align-middle">Profile Name</th>
            <th className="text-center align-middle">Actions</th>
         
          </tr>
        </thead>
        <tbody>
  {sessionData[sessionName]?.categoryRankModel?.map((artist, i) => (
    <tr key={i} className="hover:bg-gray-50 transition">
      <td className="text-center align-middle">{sessionName}</td>
      {/* Corrected to ensure session_rank is displayed correctly */}
      <td className="text-center align-middle fw-bold text-main">
        {sessionData[sessionName]?.session_rank || 'N/A'}  {/* Use fallback for undefined */}
      </td>
      <td className="text-center align-middle">{artist.artist_id}</td>
      <td className="text-center align-middle fw-bold text-main">{artist.artist_rank}</td>
      <td className="text-center align-middle">{artist.artistDetails?.owner_name}</td>
      <td className="text-center align-middle">{artist.artistDetails?.category_type}</td>
      <td className="text-center align-middle">{artist.category_id}</td>
      <td className="text-center align-middle">
        {artist.artistDetails?.poster ? (
          <Image
            src={`http://35.154.161.226:5000/${artist.artistDetails.poster}`}
            width={80}
            height={100}
            rounded
            style={{
              objectFit: 'cover',
              borderRadius: '8px',
            }}
          />
        ) : (
          <span className="text-gray-500 italic">No poster</span>
        )}
      </td>
      <td className="text-center align-middle">{artist.artistDetails?.profile_name || 'N/A'}</td>
      <td className="text-center align-middle">
      <Button
  variant="warning"
  size="sm"
  className="mb-2"
  onClick={() => openRankModal(sessionName, artist.artist_id)}
>
  Update Artist Rank
</Button>


<Button
  variant="danger"
  size="sm"
  onClick={() => handleRemoveArtist(sessionName, artist.artist_id)}
>
  Remove Artist
</Button>

      </td>
    </tr>
  ))}
</tbody>

      </Table>
    </div>
    {selectedSession && (
  <div className={`modal fade ${showModal ? 'show d-block' : ''}`} tabIndex="-1">
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Edit Session Rank</h5>
          <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
        </div>
        <div className="modal-body">
          <label className="form-label">New Session Rank</label>
          <input
            type="number"
            className="form-control"
            value={newSessionRank}
            onChange={(e) => setNewSessionRank(e.target.value)}
          />
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
          <button className="btn bg-main" onClick={handleUpdateRank}>Update</button>
        </div>
      </div>
    </div>
  </div>
)}


  </div>
))}
{showRankModal && (
  <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
    <div className="modal-dialog modal-dialog-centered" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Update Artist Rank</h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => setShowModal(false)}
            aria-label="Close"
          ></button>
        </div>
        <div className="modal-body">
          <input
            type="number"
            value={newRank}
            onChange={(e) => setNewRank(e.target.value)}
            placeholder="Enter new rank"
            className="form-control"
          />
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setShowRankModal(false)}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn bg-main"
            onClick={handleUpdateArtistRank}
          >
            Update
          </button>
        </div>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default ArtistTable;
