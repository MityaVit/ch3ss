import axios from "axios";
const client = axios.create({
  baseURL: "http://localhost:3307/api", // corrected backend URL
  headers: {
    "Content-Type": "application/json",
  },
});
export default client;