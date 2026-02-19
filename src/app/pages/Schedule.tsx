
import { Calendar, Clock, MapPin, Filter } from "lucide-react";
import { motion } from "motion/react";
import { useState, useEffect } from "react";

export function Schedule() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3001/api/schedules")
      .then((res) => res.json())
      .then((data) => {
        setSchedules(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Class Schedules</h1>
      <ul>
        {schedules.map((schedule) => (
          <li key={schedule.schedule_id}>
            {schedule.class_id} with {schedule.trainer_id} on {schedule.day_of_week} at {schedule.start_time} - {schedule.end_time} ({schedule.room_location})
          </li>
        ))}
      </ul>
    </div>
  );
}


