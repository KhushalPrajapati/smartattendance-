import { useEffect, useState } from "react";
 import { jwtDecode } from 'jwt-decode';
import API_URL from "../ApiConfig";
// import { ACCESS_TOKEN, REFRESH_TOKEN } from "../Constants";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const [isAuthorized, setAuthorized] = useState(null);
 useEffect(()=>{
              auth().catch((e)=>{
                console.log(e);
                setAuthorized(false)
              })
 },[])
 
 
  const refereshToken = async () => {
    const refereshToken = localStorage.getItem("refresh");
   
    try {
      const res = await API_URL.post("/accounts/token/refresh/", {
        refresh: refereshToken,
      });
      if (res.status === 200) {
              localStorage.setItem("access",res.data.access)
              setAuthorized(true)
             
      }
      else{
              setAuthorized(false)
      }
    } catch (e) {
      localStorage.removeItem("access"); // Clear invalid token
      localStorage.removeItem("refresh");
      console.log(e);
      setAuthorized(false);
    }
  };
  const auth = async () => {
    const token = localStorage.getItem("access");
    if (!token) {
      setAuthorized(false);
      return;
    }
    const decoded =  jwtDecode(token);
    const tokenExp = decoded.exp;
    const now = Date.now() / 1000;
    if (tokenExp < now) {
      await refereshToken();
    } else {
      setAuthorized(true);
    }
  };
  if (isAuthorized === null) {
    return <div>Loading.....</div>;
  }
  return isAuthorized ? children : <Navigate to="/login" />;
}
export default ProtectedRoute;
