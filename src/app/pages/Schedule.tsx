import React, { useEffect, useState } from 'react';
import { fetchSchedule, addSchedule } from '../../config/scheduleAPI';
const SchedulePage = () => {
  const [schedule, setSchedule] = useState([]);
  const [newSchedule, setNewSchedule] = useState({p
    className: '',
    trainerId: '',
    startTime: '',
    endTime: '',
  });

  // Load schedule data on component mount
  useEffect(() => {
    const loadSchedule = async () => {
      try {
        const data = await fetchSchedule();
        setSchedule(data);
      } catch (error) {
        console.error(error.message);
      }
    };

    loadSchedule();
  }, []);

  // Handle adding a new schedule
  const handleAddSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addSchedule(newSchedule);
      const updatedSchedule = await fetchSchedule();
      setSchedule(updatedSchedule); // Update the schedule list after adding
      setNewSchedule({ className: '', trainerId: '', startTime: '', endTime: '' }); // Reset the form
    } catch (error) {
      console.error(error.message);
      alert(error.message); // Notify the user about errors
    }
  };

  return (
    <div>
      <h1>Schedule</h1>
      <ul>
        {schedule.map((item, index) => (
          <li key={index}>
            {item.class_name} - {item.start_time} to {item.end_time} (Trainer ID: {item.trainer_id})
          </li>
        ))}
      </ul>
      <h2>Add Schedule</h2>
      <form onSubmit={handleAddSchedule}>
        <input
          type="text"
          placeholder="Class Name"
          value={newSchedule.className}
          onChange={(e) => setNewSchedule({ ...newSchedule, className: e.target.value })}
        />
        <input
          type="number"
          placeholder="Trainer ID"
          value={newSchedule.trainerId}
          onChange={(e) => setNewSchedule({ ...newSchedule, trainerId: +e.target.value })}
        />
        <input
          type="datetime-local"
          value={newSchedule.startTime}
          onChange={(e) => setNewSchedule({ ...newSchedule, startTime: e.target.value })}
        />
        <input
          type="datetime-local"
          value={newSchedule.endTime}
          onChange={(e) => setNewSchedule({ ...newSchedule, endTime: e.target.value })}
        />
        <button type="submit">Add</button>
      </form>
    </div>
  );
};

export default SchedulePage;