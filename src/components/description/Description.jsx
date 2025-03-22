import React, { useState } from 'react';
import { Card, Button, Badge, Tab, Nav, Modal, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle, faBell, faStopwatch, faEye } from '@fortawesome/free-solid-svg-icons';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { EmailShareButton, WhatsappShareButton, EmailIcon, WhatsappIcon } from 'react-share';
import { Link } from 'react-router-dom';

const NotificationPage = () => {

  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Change Description Request for Artist Id ABCD1234', type: 'Request', status: null, timestamp: '2025-02-14 10:30 AM' },
    { id: 2, message: 'Request to add new clip of Artist Id ABCD1234', type: 'Request', status: null, timestamp: '2025-02-14 11:00 PM' },
    { id: 3, message: 'Approve request of a new Artist', type: 'Request', status: null, timestamp: '2025-02-14 11:30 AM' },
    { id: 4, message: 'payment Id AQWE34RT45 is cancelled', type: 'Alert', status: null, timestamp: '2025-02-14 12:00 PM' },
    { id: 5, message: 'payment Id AQWE34RT45 is Refunded', type: 'Alert', status: null, timestamp: '2025-02-14 12:30 AM' },
    { id: 6, message: 'payment Id AQWE34RT45 is Accepted', type: 'Alert', status: null, timestamp: '2025-02-14 13:00 PM' },
  ]);

  const [isApproved, setIsApproved] = useState({
    changeDesc: false,
    addClip: false,
  });

  const [showModal, setShowModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [selectedNotifId, setSelectedNotifId] = useState(null);

  const handleAccept = (id) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, status: 'Accepted' } : notif
      )
    );

    if (id === 1) setIsApproved((prev) => ({ ...prev, changeDesc: true }));
    if (id === 2) setIsApproved((prev) => ({ ...prev, addClip: true }));

    toast.success(`Request has been accepted.`, {
      position: "top-right",
      autoClose: 3000,
    });
  };

  const handleCancel = (id) => {
    setSelectedNotifId(id);
    setShowModal(true);
  };

  const handleSubmitCancel = () => {
    if (!cancelReason.trim()) {
      toast.error("Please provide a reason for cancellation.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === selectedNotifId ? { ...notif, status: 'Cancelled', reason: cancelReason } : notif
      )
    );
    setShowModal(false);
    setCancelReason('');
    toast.error(`Request has been cancelled.`, {
      position: "top-right",
      autoClose: 3000,
    });
  };

  const countNotificationsByType = (type) => {
    return notifications.filter((notif) => notif.type === type).length;
  };

  return (
    <div
      className="notification-page-container p-5"
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        backgroundColor: '#f8f9fa',
        borderRadius: '15px',
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
      }}
    >
      <ToastContainer />
      <h3 className="mb-4 text-center">
        <FontAwesomeIcon icon={faBell} className="me-2" />
        Admin Notifications
      </h3>
 <div className='d-flex justify-content-end align-items-end'><Link to='/push'><Button>Push Notifications</Button></Link></div>
      <Tab.Container defaultActiveKey="all">
        <Nav variant="tabs" className="mb-4 justify-content-center" style={{ fontSize: '1.1rem' }}>
          <Nav.Item>
            <Nav.Link eventKey="all">
              All Notifications ({notifications.length})
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="requests">
              Requests ({countNotificationsByType('Request')})
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="alerts">
              Alerts ({countNotificationsByType('Alert')})
            </Nav.Link>
          </Nav.Item>
        </Nav>
        <Tab.Content>
          <Tab.Pane eventKey="all">
            {notifications.map((notif) => (
              <Card
                key={notif.id}
                className={`shadow-sm mb-4 border-0 rounded-3 ${notif.status ? (notif.status === 'Accepted' ? 'bg-success' : 'bg-danger') : 'bg-white'}`}
                style={{ transition: 'background-color 0.3s ease' }}
              >
                <Card.Body>
                  {/* Timestamp Badge */}
                  <div className='d-flex justify-content-end mb-3'>
                    <Badge bg="primary">
                      <FontAwesomeIcon icon={faStopwatch} /> {notif.timestamp}
                    </Badge>
                  </div>
                  <div className="">
                    <div className="d-flex flex-column flex-grow-1">
                      <h5 className="mb-2 text-dark" style={{ fontWeight: '600' }}>
                        {notif.message}
                      </h5>
                    </div>

                    <div className="d-flex gap-3 justify-content-end align-items-center">
                      <Badge bg={notif.type === 'Request' ? 'primary' : 'warning'} className="me-2">
                        {notif.type}
                      </Badge>

                      <div className="d-flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleAccept(notif.id)}
                          className="d-flex align-items-center"
                          style={{ backgroundColor: 'green', border: 'none' }}
                        >
                          <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleCancel(notif.id)}
                          className="d-flex align-items-center"
                          style={{ backgroundColor: 'red', border: 'none' }}
                        >
                          <FontAwesomeIcon icon={faTimesCircle} className="me-2" />
                          Cancel
                        </Button>
                        <Button size="sm" variant="primary" className="d-flex align-items-center">
                          <FontAwesomeIcon icon={faEye} className="me-2" />
                          View
                        </Button>
                      </div>

                      <div className="d-flex gap-2">
                        <WhatsappShareButton url="https://example.com" title={notif.message}>
                          <WhatsappIcon size={32} round />
                        </WhatsappShareButton>
                        <EmailShareButton url="https://example.com" subject="Notification" body={notif.message}>
                          <EmailIcon size={32} round />
                        </EmailShareButton>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </Tab.Pane>
          <Tab.Pane eventKey="requests">
  {notifications
    .filter((notif) => notif.type === 'Request') // Filter by 'Request' type
    .map((notif) => (
      <Card
        key={notif.id}
        className={`shadow-sm mb-4 border-0 rounded-3 ${notif.status ? (notif.status === 'Accepted' ? 'bg-success' : 'bg-danger') : 'bg-white'}`}
        style={{ transition: 'background-color 0.3s ease' }}
      >
        <Card.Body>
          {/* Timestamp Badge */}
          <div className='d-flex justify-content-end mb-3'>
            <Badge bg="primary">
              <FontAwesomeIcon icon={faStopwatch} /> {notif.timestamp}
            </Badge>
          </div>
          <div className="">
            <div className="d-flex flex-column flex-grow-1">
              <h5 className="mb-2 text-dark" style={{ fontWeight: '600' }}>
                {notif.message}
              </h5>
            </div>

            <div className="d-flex gap-3 justify-content-end align-items-center">
              <Badge bg="primary" className="me-2">
                {notif.type}
              </Badge>

              <div className="d-flex gap-2">
                <Button
                  size="sm"
                  onClick={() => handleAccept(notif.id)}
                  className="d-flex align-items-center"
                  style={{ backgroundColor: 'green', border: 'none' }}
                >
                  <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
                  Accept
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleCancel(notif.id)}
                  className="d-flex align-items-center"
                  style={{ backgroundColor: 'red', border: 'none' }}
                >
                  <FontAwesomeIcon icon={faTimesCircle} className="me-2" />
                  Cancel
                </Button>
                <Button size="sm" variant="primary" className="d-flex align-items-center">
                  <FontAwesomeIcon icon={faEye} className="me-2" />
                  View
                </Button>
              </div>

              <div className="d-flex gap-2">
                <WhatsappShareButton url="https://example.com" title={notif.message}>
                  <WhatsappIcon size={32} round />
                </WhatsappShareButton>
                <EmailShareButton url="https://example.com" subject="Notification" body={notif.message}>
                  <EmailIcon size={32} round />
                </EmailShareButton>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    ))}
</Tab.Pane>

<Tab.Pane eventKey="alerts">
  {notifications
    .filter((notif) => notif.type === 'Alert') // Filter by 'Alert' type
    .map((notif) => (
      <Card
        key={notif.id}
        className={`shadow-sm mb-4 border-0 rounded-3 ${notif.status ? (notif.status === 'Accepted' ? 'bg-success' : 'bg-danger') : 'bg-white'}`}
        style={{ transition: 'background-color 0.3s ease' }}
      >
        <Card.Body>
          {/* Timestamp Badge */}
          <div className='d-flex justify-content-end mb-3'>
            <Badge bg="primary">
              <FontAwesomeIcon icon={faStopwatch} /> {notif.timestamp}
            </Badge>
          </div>
          <div className="">
            <div className="d-flex flex-column flex-grow-1">
              <h5 className="mb-2 text-dark" style={{ fontWeight: '600' }}>
                {notif.message}
              </h5>
            </div>

            <div className="d-flex gap-3 justify-content-end align-items-center">
              <Badge bg="warning" className="me-2">
                {notif.type}
              </Badge>

              <div className="d-flex gap-2">
                <Button
                  size="sm"
                  onClick={() => handleAccept(notif.id)}
                  className="d-flex align-items-center"
                  style={{ backgroundColor: 'green', border: 'none' }}
                >
                  <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
                  Accept
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleCancel(notif.id)}
                  className="d-flex align-items-center"
                  style={{ backgroundColor: 'red', border: 'none' }}
                >
                  <FontAwesomeIcon icon={faTimesCircle} className="me-2" />
                  Cancel
                </Button>
                <Button size="sm" variant="primary" className="d-flex align-items-center">
                  <FontAwesomeIcon icon={faEye} className="me-2" />
                  View
                </Button>
              </div>

              <div className="d-flex gap-2">
                <WhatsappShareButton url="https://example.com" title={notif.message}>
                  <WhatsappIcon size={32} round />
                </WhatsappShareButton>
                <EmailShareButton url="https://example.com" subject="Notification" body={notif.message}>
                  <EmailIcon size={32} round />
                </EmailShareButton>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    ))}
</Tab.Pane>

        </Tab.Content>
      </Tab.Container>

      {/* Modal for cancel reason */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Cancel Reason</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="cancelReason">
            <Form.Label>Please provide a reason for cancellation:</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="danger" onClick={handleSubmitCancel}>
            Submit Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default NotificationPage;
