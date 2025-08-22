import React, { useState, useEffect } from "react";
import axios from "axios";

const PushNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    body: "",
    recipientType: "users",
    image: null,
  });
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("users");

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get("http://35.154.161.226:5000/api/admin-notifications");
      setNotifications(res.data.notifications);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      image: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("body", formData.body);
      data.append("recipientType", formData.recipientType);
      if (formData.image) {
        data.append("image", formData.image);
      }

      await axios.post("http://35.154.161.226:5000/api/admin-notifications", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      fetchNotifications();
      setShowModal(false);
      setFormData({
        title: "",
        body: "",
        recipientType: "users",
        image: null,
      });
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
        <button className="btn bg-main" onClick={() => setShowModal(true)}>
          Send Notification
        </button>
      </div>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-3">
        {["users", "artists", "both"].map((type) => (
          <li className="nav-item" key={type}>
            <button
              className={`nav-link ${activeTab === type ? "active" : ""}`}
              onClick={() => setActiveTab(type)}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          </li>
        ))}
      </ul>

      {/* Notifications List */}
      <div className="row">
        <div className="col-md-12">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((note, idx) => (
              <div key={idx} className="card mb-3 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title fw-bold">{note.title}</h5>
                  <p className="card-text">{note.body}</p>
                  {note.imageUrl && (
                    <img
                      src={note.imageUrl}
                      alt="notification"
                      className="img-fluid mb-2"
                      style={{ maxHeight: "200px" }}
                    />
                  )}
                  <ul className="list-group list-group-flush bg-main">
                    <li className="list-group-item bg-main">
                      <strong>ID:</strong> <span>{note._id}</span>
                    </li>
                    <li className="list-group-item bg-main">
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
                    <li className="list-group-item bg-main">
                      <strong>Sent To:</strong>{" "}
                      <span className="fw-bold">{note.sentTo}</span>
                    </li>
                    <li className="list-group-item bg-main">
                      <strong>Sent At:</strong>{" "}
                      <span className="badge bg-secondary">
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
                <h5 className="modal-title text-dark">Send Notification</h5>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="form-group mb-2">
                    <label className="text-dark">Title</label>
                    <input
                      type="text"
                      className="form-control"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group mb-2">
                    <label  className="text-dark">Body</label>
                    <textarea
                      className="form-control"
                      name="body"
                      value={formData.body}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>
                  <div className="form-group mb-2">
                    <label  className="text-dark">Image</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </div>
                  <div className="form-group mb-2">
                    <label  className="text-dark">Send To:</label>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="recipientType"
                        value="users"
                        checked={formData.recipientType === "users"}
                        onChange={handleChange}
                      />
                      <label className="form-check-label text-dark">Users</label>
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
                      <label className="form-check-label text-dark">Artists</label>
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
                  <button type="submit" className="btn bg-main">
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
