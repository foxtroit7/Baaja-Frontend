import { useEffect, useState } from 'react';
import axios from 'axios';
import { faEye, faThumbsDown, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
const AdminArtistUpdates = () => {
  const [updates, setUpdates] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchUpdates = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://15.206.194.89:5000/api/admin/pending-updates');
      setUpdates(response.data);
    } catch (error) {
      console.error('Error fetching updates:', error);
    }
    setLoading(false);
  };

const handleApprove = async (id) => {
  try {
    await axios.post(
      `http://15.206.194.89:5000/api/admin-pending-updates-approve/${id}`
    );
    alert("Update approved successfully!");
    fetchUpdates(); // This will re-fetch the list to reflect the approved status
  } catch (error) {
    console.error("Error approving update:", error);
    alert("Failed to approve update.");
  }
};

const handleReject = async (id) => {
  const adminRemarks = prompt('Enter rejection reason:');
  if (!adminRemarks || adminRemarks.trim() === '') {
    alert('Rejection reason is required.');
    return;
  }

  try {
    const res = await axios.post(`http://15.206.194.89:5000/api/admin-pending-updates-reject/${id}`, {
      admin_remarks: adminRemarks,
    });

    alert(res.data.message || 'Update rejected successfully.');
    fetchUpdates(); // Refresh the list
  } catch (error) {
    console.error('Error rejecting update:', error);
    alert('Failed to reject update.');
  }
};

  const handleViewProfile = (userId) => {
    navigate(`/artist-profile/${userId}`);
  };
  const renderUpdateCard = (update) => (
    <div
      key={update._id}
      style={{
        backgroundColor: '#fff',
        border: '1px solid #e0e0e0',
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '1.5rem',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        position: 'relative',
        transition: 'transform 0.3s ease',
      }}
    >
    <p>
  Artist <span class="badge bg-warning">{update.update_type}</span> Data
</p>

      <p style={{ marginBottom: '0.5rem' }}>
        <strong>{update.fields_changed.join(', ')}</strong> added for artist id <strong>{update.user_id}</strong>
      </p>
   
   {update.update_type === 'clip' ? (
  update.fields_changed.map((field) => (
    <div key={field} style={{ marginBottom: '0.5rem' }}>
      <p>
      <strong>New {field.charAt(0).toUpperCase() + field.slice(1)}:</strong>{' '}
      {field === 'video' ? (
        <video
          src={`http://15.206.194.89:5000/${update.updated_data?.[field]}`}
          controls
          style={{ borderRadius: '12px', width: '100%', maxWidth: '400px' }}
        />
      ) : (
        update.updated_data?.[field] ?? 'N/A'
      )}
    </p>
    </div>
  ))
) : (
  update.fields_changed.map((field) => (
    <div key={field} style={{ marginBottom: '0.5rem' }}>
      <p>
        <strong>Old {field.charAt(0).toUpperCase() + field.slice(1)}:</strong>{' '}
        {update.original_data?.[field] ?? 'No old data is available because first time artist has added data.'}
      </p>
      <p>
        <strong>New {field.charAt(0).toUpperCase() + field.slice(1)}:</strong>{' '}
        {update.updated_data?.[field] ?? 'N/A'}
      </p>
    </div>
  ))
)}



      {update.admin_remarks && (
        <p style={{ color: '#b30000', fontWeight: 'bold' }}>
          Remarks: {update.admin_remarks}
        </p>
      )}

      {activeTab === 'pending' && (
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
          <button
            onClick={() => handleApprove(update._id)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'background 0.3s',
            }}
          >
            <FontAwesomeIcon icon={faThumbsUp} /> Approve
          </button>
          <button
            onClick={() => handleReject(update._id)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'background 0.3s',
            }}
          >
            <FontAwesomeIcon icon={faThumbsDown} /> Reject
          </button>
        </div>
      )}

      <button
      onClick={() => handleViewProfile(update.user_id)}
    
        style={{
          position: 'absolute',
          bottom: '15px',
          right: '15px',
          padding: '0.4rem 0.8rem',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
        }}
      >
        <FontAwesomeIcon icon={faEye} /> View
      </button>
    </div>
  );

  useEffect(() => {
    fetchUpdates();
  }, []);

  const statusTabs = ['pending', 'approved', 'rejected'];

  return (
    <div style={{ padding: '2rem', margin: '0 auto', backgroundColor: '#f9f9f9' }}>
      <h2 style={{ marginBottom: '1.5rem', textAlign: 'center', color: '#333' }}>Artist Notifications</h2>

      {/* Tabs */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
        {statusTabs.map((status) => (
          <div
            key={status}
            onClick={() => setActiveTab(status)}
            style={{
              padding: '0.75rem 1.5rem',
              margin: '0 0.5rem',
              cursor: 'pointer',
              borderBottom: activeTab === status ? '3px solid #007bff' : '3px solid transparent',
              color: activeTab === status ? '#007bff' : '#555',
              fontWeight: activeTab === status ? 'bold' : 'normal',
              transition: 'color 0.3s',
            }}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </div>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <p style={{ textAlign: 'center' }}>Loading...</p>
      ) : (
        <div>
         {(() => {
  const filtered = updates.filter((u) => u.status === activeTab);
  if (filtered.length === 0) {
    let message = '';
    if (activeTab === 'pending') message = 'No waiting updates are available.';
    else if (activeTab === 'approved') message = 'No approved updates are available.';
    else if (activeTab === 'rejected') message = 'No rejected updates are available.';
    return <p style={{ textAlign: 'center', color: '#777' }}>{message}</p>;
  }
  return filtered.map((update) => renderUpdateCard(update));
})()}

        </div>
      )}
    </div>
  );
};

export default AdminArtistUpdates;
