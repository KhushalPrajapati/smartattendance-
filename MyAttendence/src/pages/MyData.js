import React, { useState, useEffect } from "react";
// Assuming your API_URL instance is exported as default
import Tables from "./Tables";
// import { ACCESS_TOKEN } from "../Constants";
import API_URL from "../ApiConfig";
import { user_id } from "../Constants";
// import axios from "axios";


const MyData = () => {
  // State to hold API data
  const [attendanceTillNow, setAttendanceTillNow] = useState([]);
  // const [subjectWise, setSubjectWise] = useState([]);
  // const [weekData, setWeekData] = useState([]);
  // const [holidayData, setHolidayData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from API when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get user ID from localStorage
        const userId = localStorage.getItem(user_id);
        if (!userId) {
          throw new Error("User ID not found. Please log in.");
        }

        // Fetch Daily Records
        const dailyResponse = await API_URL.get("/api/dailyRecord/",
             {
          params:{
            id:userId
          }
          }
        
        );
        setAttendanceTillNow(dailyResponse.data.data);

  //       // Fetch Subject Wise Attendance
  //       const subjectResponse = await API_URL.get("/subjects/", {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
  //         },
  //       });
  //       setSubjectWise(subjectResponse.data);

  //       // Note: You may need to adjust the endpoint for weekData and holidayData
  //       // Assuming you have similar endpoints for WeeklyRecord and HolidayForecast
  //       const weekResponse = await API_URL.get("/weeklyRecord/", {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
  //         },
  //       });
  //       setWeekData(weekResponse.data.data);

  //       const holidayResponse = await API_URL.get("/holidayForecast/", {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
  //         },
  //       });
  //       setHolidayData(holidayResponse.data.data);

  //       setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to fetch data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Render loading state
  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  // Render error state
  if (error) {
    return <div className="text-center p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-4 max-w-screen-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Attendance Dashboard</h1>

      <Tables
        title="Your Attendance Till Now"
        headers={["User", "Day", "Date", "Subject", "Lec Count", "Attended", "Not Attended", "Actions"]}
        data={attendanceTillNow}
      />

     
    </div>
  );
};

export default MyData;