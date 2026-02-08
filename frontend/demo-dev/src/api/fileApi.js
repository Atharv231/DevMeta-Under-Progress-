import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api/files", // 👈 EXPRESS PORT
});

export const getFiles = () => api.get("/");
export const getFile = (file) => api.get(`/${file}`);
export const saveFile = (file, content) => api.post(`/${file}`, { content });

export const createFile = (file) => api.post(`/create/${file}`);

export const deleteFile = (file) => api.delete(`/${file}`);
