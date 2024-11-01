import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NODE_ENV === 'development' 
        ? 'http://localhost:5000'  // Development server
        : '',                      // Production will use relative paths
    withCredentials: true,         // Important for cookies
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

export default api;