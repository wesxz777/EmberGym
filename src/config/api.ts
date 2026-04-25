import axios from "axios";

const api = axios.create({
  baseURL: "https://embergym.onrender.com/api", 
  withCredentials: true, 
  headers: { 
    "Accept": "application/json", 
    "Content-Type": "application/json" 
  },
});

api.defaults.xsrfCookieName = "XSRF-TOKEN";
api.defaults.xsrfHeaderName = "X-XSRF-TOKEN";

export default api;