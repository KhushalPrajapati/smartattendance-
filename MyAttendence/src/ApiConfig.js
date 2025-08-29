import axios from 'axios'
import {ACCESS_TOKEN} from './Constants'
// const API_URL = 'http:///127.0.0.1:8000'
const API_URL = axios.create({
              baseURL:'http://127.0.0.1:8000',
               headers: {
    'Content-Type': 'application/json',
  },
              withCredentials: true,

})
API_URL.interceptors.request.use(
              (config)=>{
                            const token = localStorage.getItem("access");
                            if (token) {
                                     config.headers.Authorization = `Bearer ${token}`     
                            }
                            return config

              },
              (error)=>{
                            return Promise.reject(error)
              }

)
export default API_URL