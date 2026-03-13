import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://interview-platform-xdbv.onrender.com/api",
  withCredentials: true,
});


export default axiosInstance;