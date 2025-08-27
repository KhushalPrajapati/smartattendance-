import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Tables from "./Tables";
import API_URL from "../ApiConfig";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../Constants";
const Profile = () => {
  const navigate = useNavigate();
   const [profile, setProfile] = useState(null); // Initially null
 // Get user_id from localStorage
useEffect(() => {
  const fetchProfile = async () => {
    const user_id = localStorage.getItem("user_id");
    
    try {
      const response = await API_URL.get(`api/user/`,{ params: {
          id: user_id,
        }},);

      setProfile(response.data.data);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }
  };

  fetchProfile();
}, []);


  const handleLogout = () => {
    // Clear tokens
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    // Redirect to logout page, then home
    navigate("/");
  };
  const handleEdit = () => {
    navigate("/edit-profile");
  };

  const handleDelete = () => {
    const confirm = window.confirm("Are you sure you want to delete your profile?");
    if (confirm) {
      alert("Profile deleted!");
    }
  };

  const dayWiseRecord = [
    {
      Day: "Monday",
      "Total Lectures": 2,
      Subject: "Python-2",
      "Lectures Attended": 2,
      "Lectures Not Attended": 0,
    },
    {
      Day: "Tuesday",
      "Total Lectures": 2,
      Subject: "FSD-2",
      "Lectures Attended": 1,
      "Lectures Not Attended": 1,
    },
  ];

  return (
    <div className="flex flex-col lg:flex-row justify-center items-start min-h-screen bg-gray-100 gap-10 p-8">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Student Profile</h2>
  {profile ? (

        <div className="space-y-4">
          <ProfileItem label="First Name" value={profile.first_name} />
          <ProfileItem label="Last Name" value={profile.last_name} />
          <ProfileItem label="Email" value={profile.email} />
          <ProfileItem label="Password" value={profile.password} />
          <ProfileItem label="Branch" value={profile.branch} />
          <ProfileItem label="Enrollment Number" value={profile.enrollment_number} />
          <ProfileItem label="Semester" value={profile.semester} />
        </div>
 ) : (
    <p className="text-center text-gray-500">Loading profile...</p>
  )}
        <div className="flex justify-between mt-8">
          <button
            onClick={handleEdit}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Edit
          </button>
           <button
                            type="button"
                            className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition"
                          onClick={handleLogout} 
                        >
                            logout
                        </button>
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="w-full lg:w-[60%]">
        <Tables
          title="Day Wise Record"
          headers={[
            "Day",
            "Total Lectures",
            "Subject",
            "Lectures Attended",
            "Lectures Not Attended",
            "Actions",
          ]}
          data={dayWiseRecord}
          onEdit={(row) => navigate("/edit-daywise", { state: { record: row } })}
        />
      </div>
    </div>
  );
};

const ProfileItem = ({ label, value }) => (
  <div>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-base font-semibold text-gray-800">{value}</p>
  </div>
);

export default Profile;
