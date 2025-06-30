import axios from "axios";
import constants from "../constants";

const API = axios.create({
  baseURL: `${constants.HOST}/window`,
});

export const fetchWindows = () => API.get("/");
export const createWindow = (window) => API.post("/", window);
export const updateWindow = (id, window) => API.put(`/${id}`, window);
export const deleteWindow = (id) => API.delete(`/${id}`);
export const fetchWindowsByDepartment = (department) =>
  API.get(`/${encodeURIComponent(department)}`);
