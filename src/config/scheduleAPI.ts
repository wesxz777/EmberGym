import axios from 'axios';

// Base URL of your backend API
const API_BASE = 'http://localhost:3001/api';

// Function to fetch all schedule data
export const fetchSchedule = async () => {
  try {
    const response = await axios.get(`${API_BASE}/schedule`);
    return response.data; // Return the fetched schedule data
  } catch (error) {
    console.error('Error fetching schedule:', error);
    throw new Error('Failed to fetch schedule. Please try again later.');
  }
};

// Function to add a new schedule
export const addSchedule = async (scheduleData: {
  className: string;
  trainerId: number;
  startTime: string;
  endTime: string;
}) => {
  if (!scheduleData.className || !scheduleData.trainerId || !scheduleData.startTime || !scheduleData.endTime) {
    throw new Error('All fields are required: className, trainerId, startTime, endTime.');
  }

  try {
    const response = await axios.post(`${API_BASE}/schedule`, scheduleData);
    return response.data; // Return the server's response
  } catch (error) {
    console.error('Error adding schedule:', error);
    throw new Error('Failed to add schedule. Please try again later.');
  }
};