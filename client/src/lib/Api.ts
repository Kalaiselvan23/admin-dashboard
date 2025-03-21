import axios from "axios";

const Api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  headers:{
    "Content-Type":"application/json"
  }
});

Api.interceptors.request.use(
  (config)=>{
    const token=localStorage.getItem("token");
    if(token){
      config.headers.Authorization=token;
    }
    return config;
  },
  (error)=>{
    return Promise.reject(error)
  }
)
export default Api;
