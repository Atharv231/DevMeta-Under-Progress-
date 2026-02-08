import axios from "axios";

export const runFile = (filename) =>
  axios.post("http://localhost:5000/api/run", { filename });
