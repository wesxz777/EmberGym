  import { useState, useEffect } from "react";

  const mockSchedules = [
    {
      id: 1,
      className: "Yoga",
      trainer: "Sarah Johnson",
      date: "2026-02-20",
      time: "08:00 AM",
      location: "Studio A"
    },
    {
      id: 2,
      className: "HIIT",
      trainer: "Mike Chen",
      date: "2026-02-21",
      time: "10:00 AM",
      location: "Studio B"
    }
    // Add more mock schedules as needed
  ];

  export function Schedule() {
    const [schedules, setSchedules] = useState([]);

    useEffect(() => {
      setSchedules(mockSchedules);
    }, []);

    return (
      <div>
        <h1>Class Schedules</h1>
        <ul>
          {schedules.map((schedule) => (
            <li key={schedule.id}>
              {schedule.className} with {schedule.trainer} on {schedule.date} at {schedule.time} ({schedule.location})
            </li>
          ))}
        </ul>
      </div>
    );
  }

  