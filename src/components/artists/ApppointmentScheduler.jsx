import { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";

const AppointmentScheduler = ({ artist_id }) => {
  const [busyDates, setBusyDates] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(moment());

  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedBookings, setSelectedBookings] = useState([]);

  useEffect(() => {
    const fetchBusyDates = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://35.154.161.226:5000/api/artist/${artist_id}/busy-dates`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setBusyDates(response.data.busy_dates);
      } catch (error) {
        console.error("Error fetching busy dates:", error);
      }
    };

    fetchBusyDates();
  }, [artist_id]);

  const handleBusyDateClick = async (date) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://35.154.161.226:5000/api/busy-date/${artist_id}/${date}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
        
      );
      console.log(response)
      setSelectedDate(date);
      setSelectedBookings(response.data.bookings || []);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const startOfMonth = currentMonth.clone().startOf("month");
  const endOfMonth = currentMonth.clone().endOf("month");
  const firstDayOfWeek = startOfMonth.day();

  const calendar = [];
  let day = startOfMonth.clone();

  const renderWeekRow = (weekDays, key) => (
    <div
      key={key}
      className="mb-2 text-main"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)",
        gap: "10px",
      }}
    >
      {weekDays}
    </div>
  );

  const firstWeek = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    firstWeek.push(
      <div
        key={`empty-${i}`}
        className="border bg-main rounded p-3"
        style={{ height: "70px" }}
      ></div>
    );
  }

  while (firstWeek.length < 7) {
    const dayString = day.format("YYYY-MM-DD");
    const isBusy = busyDates.includes(dayString);

    firstWeek.push(
      <div
        key={dayString}
        className={`p-2 text-center rounded border ${
          isBusy ? "bg-danger text-white" : "bg-main-subtle text-dark"
        }`}
        style={{ height: "70px", cursor: isBusy ? "pointer" : "default" }}
        onClick={() => isBusy && handleBusyDateClick(dayString)}
      >
        <div className="text-main">{day.date()}</div>
        {isBusy && <small>Booked</small>}
      </div>
    );
    day.add(1, "day");
  }

  calendar.push(renderWeekRow(firstWeek, "first-week"));

  while (day.isSameOrBefore(endOfMonth, "day")) {
    const week = [];
    for (let i = 0; i < 7; i++) {
      if (day.month() !== currentMonth.month()) {
        week.push(
          <div
            key={`empty-${day}`}
            className="p-3 bg-main border rounded"
          ></div>
        );
        day.add(1, "day");
        continue;
      }

      const dayString = day.format("YYYY-MM-DD");
      const isBusy = busyDates.includes(dayString);

      week.push(
        <div
          key={dayString}
          className={`p-2 text-center rounded border ${
            isBusy ? "bg-success text-white" : "bg-main-subtle text-dark"
          }`}
          style={{ height: "70px", cursor: isBusy ? "pointer" : "default" }}
          onClick={() => isBusy && handleBusyDateClick(dayString)}
        >
          <div className="text-main mt-2">{day.date()}</div>
          {isBusy && <small>Booked</small>}
        </div>
      );

      day.add(1, "day");
    }
    calendar.push(renderWeekRow(week, day.clone().format("YYYY-MM-DD")));
  }

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => prev.clone().subtract(1, "month"));
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => prev.clone().add(1, "month"));
  };

  return (
    <div className="container-fluid mt-4 px-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <button className="btn bg-main" onClick={handlePrevMonth}>
          &lt; Prev
        </button>
        <h4 className="text-center m-0">{currentMonth.format("MMMM YYYY")}</h4>
        <button className="btn bg-main" onClick={handleNextMonth}>
          Next &gt;
        </button>
      </div>

      <div
        className="mb-2"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "10px",
          fontWeight: "bold",
          textAlign: "center"
        }}
      >
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div className="bg-main rounded py-1" key={day}>
            {day}
          </div>
        ))}
      </div>

      {calendar}

      {/* Booking Details Modal */}
  <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
  <Modal.Header closeButton className="bg-main text-white">
    <Modal.Title className='text-light'>Booking Details</Modal.Title>
  </Modal.Header>

  <Modal.Body className="bg-light text-dark">
    {selectedBookings.length > 0 ? (
      selectedBookings.map((booking, index) => (
        <div key={index} className="mb-4 p-4 bg-white rounded shadow-sm border border-secondary">
          {/* Booking Header */}
          <div className="mb-3 pb-2 border-bottom d-flex justify-content-between align-items-center">
            <h5 className="text-dark mb-0">Booking ID: <span className="text-main">{booking.booking_id}</span></h5>
            <span className={`badge ${booking.status === 'accepted' ? 'bg-success' : 'bg-warning'} text-uppercase`}>
              {booking.status}
            </span>
          </div>

          {/* Personal Info */}
          <h6 className="text-muted">Personal Info</h6>
          <div className="row">
            <div className="col-md-6"><p><strong>Name:</strong> {booking.full_name}</p></div>
            <div className="col-md-6"><p><strong>Phone:</strong> {booking.phone_number}</p></div>
            <div className="col-md-6"><p><strong>Adhaar No:</strong> {booking.adhaar_number}</p></div>
            <div className="col-md-6"><p><strong>Organization:</strong> {booking.organization}</p></div>
            <div className="col-md-6"><p><strong>Purpose:</strong> {booking.purpose}</p></div>
            <div className="col-md-12"><p><strong>Items Required:</strong> {booking.required_items?.join(', ')}</p></div>
          </div>

          {/* Address Info */}
          <hr />
          <h6 className="text-muted">Address</h6>
          <div className="row">
            <div className="col-md-6"><p><strong>Address:</strong> {booking.address}</p></div>
          <div className="col-md-6"><p><strong>State</strong> {booking.state}</p></div>
            <div className="col-md-6"><p><strong>District:</strong> {booking.district}</p></div>
            <div className="col-md-6"><p><strong>Pincode:</strong>{booking.pincode}</p></div>
          </div>
          {/* Schedule Info */}
          <hr />
          <h6 className="text-muted">Schedule</h6>
          <div className="row">
            <div className="col-md-6"><p><strong>Booking Date:</strong> {new Date(booking.booking_date).toLocaleDateString()}</p></div>
          
            <div className="col-md-6"><p><strong>Schedule Start:</strong> {new Date(booking.schedule_date_start).toLocaleDateString()}</p></div>
            {booking.schedule_date_end && (
              <div className="col-md-6"><p><strong>Schedule End:</strong> {new Date(booking.schedule_date_end).toLocaleDateString()}</p></div>
            )}
            <div className="col-md-6"><p><strong>Shift:</strong> {booking.shift}</p></div>
          </div>

          {/* Payment Info */}
          <hr />
          <h6 className="text-muted">💰 Payment</h6>
          <div className="row">
            <div className="col-md-6">
              <p><strong>Status:</strong> <span className={`badge ${booking.payment_status === 'pending' ? 'bg-danger' : 'bg-success'}`}>{booking.payment_status}</span></p>
              <p><strong>Advance:</strong> ₹{booking.advance_price}</p>
              <p><strong>Total:</strong> ₹{booking.total_price}</p>
              <p><strong>Pending:</strong> ₹{booking.pending_price}</p>
            </div>
            <div className="col-md-6">
              {booking.razorpay_order && (
                <>
                  <p><strong>Razorpay Order ID:</strong> {booking.razorpay_order.id}</p>
                  <p><strong>Amount:</strong> ₹{booking.razorpay_order.amount / 100}</p>
                </>
              )}
            </div>
          </div>
        </div>
      ))
    ) : (
      <p>No bookings found for this date.</p>
    )}
  </Modal.Body>

  <Modal.Footer className="bg-light">
    <Button variant="secondary" onClick={() => setShowModal(false)}>
      Close
    </Button>
  </Modal.Footer>
</Modal>


    </div>
  );
};

export default AppointmentScheduler;
