import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState, useEffect } from 'react';
import { Dropdown, Card, Row, Col, Button, Container, Modal, Form } from 'react-bootstrap';

const AppointmentScheduler = () => {
  const [month, setMonth] = useState(1);
  const [selectedDates, setSelectedDates] = useState([]);
  const [scheduledDates, setScheduledDates] = useState([]);
  const [daysInMonth, setDaysInMonth] = useState([]);
  const [isUnavailable, setIsUnavailable] = useState({});
  const [hoveredDay, setHoveredDay] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelDay, setCancelDay] = useState(null);
  const [showManualBookingModal, setShowManualBookingModal] = useState(false);
  const [manualBooking, setManualBooking] = useState({ month: 1, day: '', time: '' });

  useEffect(() => {
    generateDaysInMonth(month);
    initializeUnavailableDates();
  }, []);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const preBookedDates = [
    { month: 1, day: 10 },
    { month: 1, day: 15 },
    { month: 2, day: 5 },
  ];

  const initializeUnavailableDates = () => {
    const unavailable = {};
    preBookedDates.forEach(({ month: bookedMonth, day }) => {
      if (bookedMonth === month) unavailable[day] = true;
    });
    setIsUnavailable(unavailable);
  };

  const generateDaysInMonth = (month) => {
    const days = new Date(2024, month, 0).getDate();
    const daysArray = [];
    for (let i = 1; i <= days; i++) {
      const date = new Date(2024, month - 1, i);
      const dayOfWeek = daysOfWeek[date.getDay()];
      daysArray.push({ day: i, dayOfWeek });
    }
    setDaysInMonth(daysArray);
  };

  const handleMonthChange = (month) => {
    setMonth(month);
    setSelectedDates([]);
  };

  const handleDaySelect = (day) => {
    if (isUnavailable[day] || scheduledDates.some(schedule => schedule.day === day)) return;

    setSelectedDates(prevSelectedDates => {
      if (prevSelectedDates.includes(day)) {
        return prevSelectedDates.filter(selectedDay => selectedDay !== day);
      }
      return [...prevSelectedDates, day];
    });
  };

  const handleScheduleAppointment = (time) => {
    const lastSelectedDay = selectedDates[selectedDates.length - 1];
    if (lastSelectedDay) {
      setScheduledDates(prevScheduledDates => [
        ...prevScheduledDates,
        { day: lastSelectedDay, time },
      ]);
      setSelectedDates(prevSelectedDates => prevSelectedDates.filter(day => day !== lastSelectedDay));
    }
  };

  const handleCancelSchedule = () => {
    setScheduledDates(prevScheduledDates =>
      prevScheduledDates.filter(schedule => schedule.day !== cancelDay)
    );
    setShowCancelModal(false);
  };

  const handleManualBooking = () => {
    const { month: manualMonth, day, time } = manualBooking;
    if (day && time) {
      setScheduledDates(prevScheduledDates => [
        ...prevScheduledDates,
        { day: parseInt(day), time, month: manualMonth },
      ]);
      setIsUnavailable(prev => ({ ...prev, [parseInt(day)]: true }));
      setShowManualBookingModal(false);
      setManualBooking({ month: 1, day: '', time: '' });
    }
  };

  const generateTimeSlots = () => {
    const times = [
      '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM',
      '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM',
    ];
    return times;
  };

  const getDateStatus = (day) => {
    if (isUnavailable[day]) return { status: 'Unavailable', reason: 'Fully booked for the day' };
    if (scheduledDates.some(schedule => schedule.day === day)) return { status: 'Unavailable', reason: 'Already scheduled' };
    return { status: 'Available', reason: 'You can book this' };
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{
        fontFamily: 'Roboto, sans-serif',
      }}
    >
      <div
        className="rounded shadow-lg"
        style={{
          backgroundColor: '#f8f9fa',
          padding: '1rem',
        }}
      >
        <div className="d-flex justify-content-between">
          <Button variant="success" onClick={() => setShowManualBookingModal(true)}>
            Manual Booking
          </Button>
          <Dropdown onSelect={(month) => handleMonthChange(Number(month))}>
            <Dropdown.Toggle variant="primary" id="monthDropdown" style={{ fontWeight: 500 }}>
              {months[month - 1]}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {months.map((monthName, index) => (
                <Dropdown.Item key={index} eventKey={index + 1}>
                  {monthName}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>

        <h2 className="mt-4 mb-4 text-center" style={{ fontWeight: 600 }}>
          Schedule Appointment
        </h2>
        <Row className="mt-3 fw-bold">
          {daysInMonth.map(({ day, dayOfWeek }) => {
            const { status, reason } = getDateStatus(day);
            const isSelected = selectedDates.includes(day);
            const isScheduled = scheduledDates.some(schedule => schedule.day === day);

            return (
              <Col xs={1} key={day} className="mb-3">
                <Card
                  onClick={() => handleDaySelect(day)}
                  onMouseEnter={() => setHoveredDay(day)}
                  onMouseLeave={() => setHoveredDay(null)}
                  style={{
                    cursor: status === 'Available' ? 'pointer' : 'not-allowed',
                    border: `2px solid ${
                      isScheduled
                        ? '#28a745'
                        : isSelected
                        ? '#007bff'
                        : status === 'Unavailable'
                        ? '#d9534f'
                        : '#6c757d'
                    }`,
                    padding: '1px',
                    textAlign: 'center',
                    backgroundColor: isScheduled
                      ? '#d4edda'
                      : isSelected
                      ? '#f0f8ff'
                      : status === 'Unavailable'
                      ? 'rgba(217, 83, 79, 0.1)'
                      : 'white',
                    borderRadius: '10px',
                    position: 'relative',
                  }}
                >
                  <Card.Body>
                    <div
                      style={{
                        fontSize: '0.7em',
                        fontWeight: 'bold',
                        color: status === 'Unavailable' ? '#d9534f' : '#212529',
                      }}
                    >
                      {dayOfWeek}
                    </div>
                    <div
                      style={{
                        fontSize: '0.7em',
                        fontWeight: '500',
                        color: status === 'Unavailable' ? '#d9534f' : '#212529',
                      }}
                    >
                      {day}
                    </div>
                  </Card.Body>
                  {hoveredDay === day && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '100%',
                        left: '50%',
                        width: '100px',
                        transform: 'translateX(-50%)',
                        backgroundColor: 'white',
                        border: '1px solid #6c757d',
                        borderRadius: '5px',
                        padding: '5px 10px',
                        fontSize: '0.8rem',
                        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                        zIndex: 10,
                      }}
                    >
                      {reason}
                    </div>
                  )}
                  {isScheduled && (
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setCancelDay(day);
                        setShowCancelModal(true);
                      }}
                      style={{
                        position: 'absolute',
                        top: 5,
                        right: 5,
                        fontSize: '0.8rem',
                        backgroundColor: 'red',
                        borderRadius: '3px',
                        padding: '2px',
                        color: 'white',
                        cursor: 'pointer',
                      }}
                    >
                      <FontAwesomeIcon icon={faXmark} />
                    </div>
                  )}
                </Card>
              </Col>
            );
          })}
        </Row>

        {selectedDates.length > 0 && (
          <div className="time-slots mt-4 text-center">
            {generateTimeSlots().map((time, index) => (
              <Button
                key={index}
                variant="outline-primary"
                className="mb-2 mx-1"
                onClick={() => handleScheduleAppointment(time)}
                style={{
                  padding: '10px 20px',
                  fontWeight: 500,
                  fontSize: '1rem',
                  borderRadius: '50px',
                }}
              >
                {time}
              </Button>
            ))}
          </div>
        )}

        <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Cancel Appointment</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to cancel this appointment?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowCancelModal(false)}>
              No
            </Button>
            <Button variant="danger" onClick={handleCancelSchedule}>
              Yes, Cancel
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showManualBookingModal} onHide={() => setShowManualBookingModal(false)} centered>
  <Modal.Header closeButton>
    <Modal.Title>Manual Booking</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form>
      <Row className="mb-3">
        <Col>
          <Form.Group>
            <Form.Label>Month</Form.Label>
            <Form.Select
              value={manualBooking.month}
              onChange={(e) => setManualBooking({ ...manualBooking, month: Number(e.target.value) })}
            >
              {months.map((monthName, index) => (
                <option key={index} value={index + 1}>
                  {monthName}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group>
            <Form.Label>Day</Form.Label>
            <Form.Control
              type="number"
              value={manualBooking.day}
              onChange={(e) => setManualBooking({ ...manualBooking, day: e.target.value })}
              placeholder="Enter day"
            />
          </Form.Group>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col>
          <Form.Group>
            <Form.Label>Time</Form.Label>
            <Form.Control
              type="text"
              value={manualBooking.time}
              onChange={(e) => setManualBooking({ ...manualBooking, time: e.target.value })}
              placeholder="Enter time (e.g., 10:00 AM)"
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group>
            <Form.Label>User Name</Form.Label>
            <Form.Control
              type="text"
              value={manualBooking.userName}
              onChange={(e) => setManualBooking({ ...manualBooking, userName: e.target.value })}
              placeholder="Enter user name"
            />
          </Form.Group>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col>
          <Form.Group>
            <Form.Label>User Address</Form.Label>
            <Form.Control
              type="text"
              value={manualBooking.userAddress}
              onChange={(e) => setManualBooking({ ...manualBooking, userAddress: e.target.value })}
              placeholder="Enter user address"
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group>
            <Form.Label>Purpose</Form.Label>
            <Form.Control
              type="text"
              value={manualBooking.purpose}
              onChange={(e) => setManualBooking({ ...manualBooking, purpose: e.target.value })}
              placeholder="Enter purpose"
            />
          </Form.Group>
        </Col>
      </Row>
    </Form>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowManualBookingModal(false)}>
      Cancel
    </Button>
    <Button variant="primary" onClick={handleManualBooking}>
      Book
    </Button>
  </Modal.Footer>
</Modal>

      </div>
    </Container>
  );
};

export default AppointmentScheduler;
