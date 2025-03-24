import axios from "axios";

const Api = axios.create({
  baseURL: "https://admin-dashboard-api-c2ki.onrender.com/api",
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
