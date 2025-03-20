import axios from "axios";

const Api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
});
export default Api;
