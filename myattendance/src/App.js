import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Attendence from "./pages/Attendence";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import LectureAttended from "./pages/LecturesAttended"
import EditProfile from "./pages/EditProfile";
import EditDaily from "./pages/EditDaily";
import EditDaywise from "./pages/EditDaywise";
import ProtectedRoute from "./components/ProtectedRoutes";
 
function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element = {<Auth/>}></Route>
        <Route path="/profile" element={<Profile />} />
        <Route path="/Home" element=
        {
          <ProtectedRoute>
        <Home />
        </ProtectedRoute>
        } />
        <Route path="/records" element={<LectureAttended />} />
        <Route path="/attendence" element={<Attendence />} />
       <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/edit-attendance" element={<EditDaily />} />
        <Route path="/edit-daywise" element={<EditDaywise />} />
        <Route path="*" element={<h1 className="text-center text-2xl">404 Not Found</h1>} />

      
      </Routes>
    </div>
  );
}
export default App;