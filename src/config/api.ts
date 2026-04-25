/// <reference types="vite/client" />
// API Configuration
// This file determines which backend URL to use based on the environment

const getApiUrl = (): string => {
  // If running in production (GitHub Pages)
  if (import.meta.env.PROD) {
    // Use environment variable if set, otherwise use deployed backend
    return import.meta.env.VITE_API_URL || 'https://your-railway-app.railway.app/api';
  }
  
  // Local development
  return 'http://localhost:3001/api';
};

export const API_URL = "http://localhost:3001";

import axios from "axios";

const api = axios.create({
  // IMPORTANT: Make sure this says localhost, not 127.0.0.1!
  baseURL: "https://embergym.onrender.com/api", 
  withCredentials: true, 
});

api.defaults.xsrfCookieName = "XSRF-TOKEN";
api.defaults.xsrfHeaderName = "X-XSRF-TOKEN";

export default api;