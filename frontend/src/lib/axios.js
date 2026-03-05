import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
    withCredentials: true, // browser will send cookies to server automatically on every single request
    
});

export default axiosInstance;