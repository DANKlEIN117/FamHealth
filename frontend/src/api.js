import axios from "axios";

const API = axios.create({
  baseURL: "https://famhealth-0ag0.onrender.com/api",
});

export default API;
