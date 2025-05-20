import React, { useState, useEffect } from "react";
import axios from "axios";

const PushNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    body: "",
    recipientType: "users",
  });
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("users");

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get("http://15.206.194.89:5000/api/admin-notifications");
      setNotifications(res.data.notifications);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://15.206.194.89:5000/api/admin-notifications", formData);
      fetchNotifications();
      setShowModal(false);
      setFormData({ title: "", body: "", recipientType: "users" });
    } catch (err) {
      console.error("Failed to send notification", err);
    }
  };

  const filteredNotifications = notifications.filter(
    (note) => note.recipientType === activeTab
  );

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Push Notifications</h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          Send Notification
        </button>
      </div>

      {/* Tabs for Recipient Types */}
      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            Users
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "artists" ? "active" : ""}`}
            onClick={() => setActiveTab("artists")}
          >
            Artists
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "both" ? "active" : ""}`}
            onClick={() => setActiveTab("both")}
          >
            Both
          </button>
        </li>
      </ul>

      {/* Notification Cards */}
      <div className="row">
        <div className="col-md-12">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((note, idx) => (
              <div key={idx} className="card mb-3 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title fw-bold">{note.title}</h5>
                  <p className="card-text">{note.body}</p>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                      <strong>ID:</strong>{" "}
                      <span className="text-primary fw-bold">{note._id}</span>
                    </li>
                    <li className="list-group-item">
                      <strong>To:</strong>{" "}
                      <span
                        className={`badge ${
                          note.recipientType === "users"
                            ? "bg-info"
                            : note.recipientType === "artists"
                            ? "bg-success"
                            : "bg-warning text-dark"
                        }`}
                      >
                        {note.recipientType}
                      </span>
                    </li>
                    <li className="list-group-item">
                      <strong>Sent To:</strong>{" "}
                      <span className="text-primary fw-bold">{note.sentTo}</span>
                    </li>
                    <li className="list-group-item">
                      <strong>Sent At:</strong>{" "}
                      <span className="badge bg-secondary">
                        <i className="bi bi-clock me-1"></i>
                        {new Date(note.sentAt).toLocaleString()}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            ))
          ) : (
            <p>No notifications found for "{activeTab}".</p>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Send Notification</h5>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="form-group">
                    <label>Title</label>
                    <input
                      type="text"
                      className="form-control"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Body</label>
                    <textarea
                      className="form-control"
                      name="body"
                      value={formData.body}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>
                  <div className="form-group">
                    <label>Send To:</label>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="recipientType"
                        value="users"
                        checked={formData.recipientType === "users"}
                        onChange={handleChange}
                      />
                      <label className="form-check-label">Users</label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="recipientType"
                        value="artists"
                        checked={formData.recipientType === "artists"}
                        onChange={handleChange}
                      />
                      <label className="form-check-label">Artists</label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="recipientType"
                        value="both"
                        checked={formData.recipientType === "both"}
                        onChange={handleChange}
                      />
                      <label className="form-check-label">Both</label>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-success">
                    Send
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PushNotification;
