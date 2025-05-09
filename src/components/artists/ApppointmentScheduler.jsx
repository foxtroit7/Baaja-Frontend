import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import "bootstrap/dist/css/bootstrap.min.css";

const AppointmentScheduler = ({ artist_id }) => {
  const [busyDates, setBusyDates] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(moment());

  useEffect(() => {
    const fetchBusyDates = async () => {
      try {
        const response = await axios.get(
          `http://15.206.194.89:5000/api/artist/${artist_id}/busy-dates`
        );
        setBusyDates(response.data.busy_dates);
      } catch (error) {
        console.error("Error fetching busy dates:", error);
      }
    };

    fetchBusyDates();
  }, [artist_id]);

  const startOfMonth = currentMonth.clone().startOf("month");
  const endOfMonth = currentMonth.clone().endOf("month");
  const firstDayOfWeek = startOfMonth.day();

  const calendar = [];
  let day = startOfMonth.clone();

  // Helper function for week row
  const renderWeekRow = (weekDays, key) => (
    <div
      key={key}
      className="mb-2"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)",
        gap: "10px",
      }}
    >
      {weekDays}
    </div>
  );

  // First week with blanks
  const firstWeek = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    firstWeek.push(
      <div
        key={`empty-${i}`}
        className="border bg-light rounded p-3"
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
          isBusy ? "bg-danger text-white" : "bg-primary-subtle text-dark"
        }`}
        style={{ height: "70px" }}
      >
        <div>{day.date()}</div>
        {isBusy && <small>Booked</small>}
      </div>
    );
    day.add(1, "day");
  }

  calendar.push(renderWeekRow(firstWeek, "first-week"));

  // Remaining weeks
  while (day.isSameOrBefore(endOfMonth, "day")) {
    const week = [];
    for (let i = 0; i < 7; i++) {
      if (day.month() !== currentMonth.month()) {
        week.push(<div key={`empty-${day}`} className="p-3 bg-light border rounded"></div>);
        day.add(1, "day");
        continue;
      }

      const dayString = day.format("YYYY-MM-DD");
      const isBusy = busyDates.includes(dayString);

      week.push(
        <div
          key={dayString}
          className={`p-2 text-center rounded border ${
            isBusy ? "bg-danger text-white" : "bg-primary-subtle text-dark"
          }`}
          style={{ height: "70px" }}
        >
          <div>{day.date()}</div>
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
        <button className="btn btn-outline-primary" onClick={handlePrevMonth}>
          &lt; Prev
        </button>
        <h4 className="text-center m-0">{currentMonth.format("MMMM YYYY")}</h4>
        <button className="btn btn-outline-primary" onClick={handleNextMonth}>
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
          textAlign: "center",
        }}
      >
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div className="bg-secondary text-white rounded py-2" key={day}>
            {day}
          </div>
        ))}
      </div>

      {calendar}
    </div>
  );
};

export default AppointmentScheduler;
