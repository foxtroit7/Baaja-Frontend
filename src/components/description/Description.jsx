import { useEffect, useState } from 'react';
import axios from 'axios';
import { faEye, faThumbsDown, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';

const AdminArtistUpdates = () => {
  const [updates, setUpdates] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [loading, setLoading] = useState(false);
  const [updateType, setUpdateType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [resetTrigger, setResetTrigger] = useState(false);
  const navigate = useNavigate();

  const fetchUpdates = async (tab = activeTab, type = updateType, start = startDate, end = endDate) => {
    setLoading(true);
    try {
      const params = { status: tab };

      if (type) params.update_type = type;
      if (start) params.startDate = start;
      if (end) params.endDate = end;

      const response = await axios.get('http://35.154.161.226:5000/api/admin/pending-updates', { params });
      setUpdates(response.data);
    } catch (error) {
      console.error('Error fetching updates:', error);
      setUpdates([]);
    }
    setLoading(false);
  };

  const handleApprove = async (id) => {
    try {
      await axios.post(`http://35.154.161.226:5000/api/admin-pending-updates-approve/${id}`);
      alert('Update approved successfully!');
      fetchUpdates();
    } catch (error) {
      console.error('Error approving update:', error);
      alert('Failed to approve update.');
    }
  };

  const handleReject = async (id) => {
    const adminRemarks = prompt('Enter rejection reason:');
    if (!adminRemarks || adminRemarks.trim() === '') {
      alert('Rejection reason is required.');
      return;
    }

    try {
      const res = await axios.post(`http://35.154.161.226:5000/api/admin-pending-updates-reject/${id}`, {
        admin_remarks: adminRemarks,
      });
      alert(res.data.message || 'Update rejected successfully.');
      fetchUpdates();
    } catch (error) {
      console.error('Error rejecting update:', error);
      alert('Failed to reject update.');
    }
  };

  const handleViewProfile = (userId) => {
    navigate(`/artist-profile/${userId}`);
  };

  const handleFilterChange = () => {
    fetchUpdates();
  };

  const handleResetFilters = () => {
    setUpdateType('');
    setStartDate('');
    setEndDate('');
    setResetTrigger(true);
  };

  useEffect(() => {
    fetchUpdates();
  }, [activeTab]);

  useEffect(() => {
    if (resetTrigger) {
      fetchUpdates(activeTab, '', '', '');
      setResetTrigger(false);
    }
  }, [resetTrigger]);

  const statusTabs = ['pending', 'approved', 'rejected'];

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
      }}
    >
      <p>
        Artist <span className="badge bg-warning">{update.update_type}</span> Data
      </p>
      <p>
        <strong>{update.fields_changed.join(', ')}</strong> added for artist id{' '}
        <strong>{update.user_id}</strong>
      </p>

      {update.update_type === 'clip' ? (
        update.fields_changed.map((field) => (
          <div key={field}>
            <p>
              <strong>New {field.charAt(0).toUpperCase() + field.slice(1)}:</strong>{' '}
              {field === 'video' ? (
                <video
                  src={`http://35.154.161.226:5000/${update.updated_data?.[field]}`}
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
          <div key={field}>
            <p>
              <strong>Old {field.charAt(0).toUpperCase() + field.slice(1)}:</strong>{' '}
              {update.original_data?.[field] ??
                'No old data is available because first time artist has added data.'}
            </p>
            <p>
              <strong>New {field.charAt(0).toUpperCase() + field.slice(1)}:</strong>{' '}
              {update.updated_data?.[field] ?? 'N/A'}
            </p>
          </div>
        ))
      )}

      {update.admin_remarks && (
        <p style={{ color: '#b30000', fontWeight: 'bold' }}>Remarks: {update.admin_remarks}</p>
      )}

      <div>
        <strong>Date: </strong>
        {new Date(update.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </div>

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
            }}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem', justifyContent: 'center' }}>
        <select
          value={updateType}
          onChange={(e) => setUpdateType(e.target.value)}
          style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc' }}
        >
          <option value="">All Types</option>
          <option value="clip">Clip</option>
          <option value="details">Details</option>
          <option value="payment">Payment</option>
        </select>

        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc' }}
        />

        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc' }}
        />

        <button
          onClick={handleFilterChange}
          disabled={loading}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          Apply Filters
        </button>

        <button
          onClick={handleResetFilters}
          disabled={loading}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          Reset Filters
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <p style={{ textAlign: 'center' }}>Loading...</p>
      ) : updates.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#777' }}>
          {activeTab === 'pending'
            ? 'No waiting updates are available.'
            : activeTab === 'approved'
            ? 'No approved updates are available.'
            : 'No rejected updates are available.'}
        </p>
      ) : (
        updates.map((update) => renderUpdateCard(update))
      )}
    </div>
  );
};

export default AdminArtistUpdates;
