// src/config/api.ts
import axios from 'axios';

const api = axios.create({
    // 🔥 Make sure this points to Render, NOT http://localhost:8000
    baseURL: 'https://embergym.onrender.com', 
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

export default api;