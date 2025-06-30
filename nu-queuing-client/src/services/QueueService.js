import axios from "axios";
import constants from "../constants";

const API = axios.create({
  baseURL: `${constants.HOST}/queue`,
});

export const fetchQueues = () => API.get("/");

export const createQueue = (queue) => API.post("/", queue);

export const fetchQueuesByDepartment = (department) =>
  API.get(`/${encodeURIComponent(department)}`);

export const updateQueueStatus = (id, status) =>
  API.put(`/${id}/status`, { status });

export const deleteQueue = (id) => API.delete(`/${id}`);
