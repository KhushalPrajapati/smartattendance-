import { useState,useEffect } from "react";
import API_URL from "../ApiConfig";
import { useNavigate } from "react-router-dom";


export default function AttendanceForms() {
    const navigate = useNavigate()
    const [activeForm, setActiveForm] = useState("daywise");
    const [dayOptions, setDayOptions] = useState([]);
    const [day, setDay] = useState("");
    const [lectureCount, setLectureCount] = useState("");
    const [subject, setSubject] = useState("");
    const [dailyDay, setDailyDay] = useState("");
const [totalLectures, setTotalLectures] = useState("");
const [dailySubject, setDailySubject] = useState("");
const [attended, setAttended] = useState("");
const [notAttended, setNotAttended] = useState("");
const [subjectOptions, setSubjectOptions] = useState([]);
  useEffect(() => {
        async function fetchDays() {
            try {
                const response = await API_URL.get("/api/day/"); // Replace with your actual endpoint
                  const formattedDays = response.data.data.map((d) => ({
        value: d.did,
        label: d.day,
      }));
            setDayOptions(formattedDays);
            } catch (error) {
                console.error("Error fetching days:", error);
            }
        }


         async function fetchSubjects() {
        try {
            const res = await API_URL.get("/api/subjects/");
            const formatted = res.data.map((s) => ({
                value: s.sid,
                label: s.sub_name,
            }));
            setSubjectOptions(formatted);
        } catch (error) {
            console.error("Error fetching subjects:", error);
        }
    }


        fetchDays();
        fetchSubjects()
    }, []);

    const handleSubmitDaywiseLec = async (e) => {
        e.preventDefault();
        const user_id = localStorage.getItem("user_id");
console.log(user_id)
         const formData = {
        day: day, // day ID
        lec_count: lectureCount,
        subject: subject,
        user:user_id
    };
        try {
            const response = await API_URL.post(
                "/api/dayWiseLec/", // replace with your actual endpoint
              formData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status === 200) {
                alert("Day-wise lecture record saved successfully!");
                setDay("");
                setLectureCount("");
                setSubject("");
            }
            navigate('/records')
        } catch (error) {
            console.error("Error saving day-wise lecture record:", error);
            alert("Failed to save the record.");
        }
    };

const handleSubmitDailyRecord = async (e) => {
    e.preventDefault();
    const user_id = localStorage.getItem("user_id");

   const formData = {
    day: dailyDay,
    subject: dailySubject,
     day_lec_count: parseInt(totalLectures),
    attended_count: parseInt(attended),
    not_attended_count: parseInt(notAttended),
    user: parseInt(user_id),
};

    try {
        const response = await API_URL.post("/api/dailyRecord/", formData, {
            headers: { "Content-Type": "application/json" },
        });

        if (response.status === 201 || response.status === 200) {
            alert("Daily record saved successfully!");
            setDailyDay("");
            setTotalLectures("");
            setDailySubject("");
            setAttended("");
            setNotAttended("");
        }
        navigate("/records")
    } catch (error) {
        console.error("Error saving daily record:", error.response);
        alert("Failed to save daily record.");
    }
};
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
                <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
                    {activeForm === "daywise" ? "Day-wise Lecture Form" : "Daily Record Form"}
                </h2>

                {/* Toggle Buttons */}
                <div className="flex justify-center mb-6 space-x-4">
                    <button
                        className={`px-4 py-2 rounded-md border ${activeForm === "daywise"
                                ? "bg-blue-600 text-white border-blue-600"
                                : "bg-white text-gray-700 border-gray-300"
                            }`}
                        onClick={() => setActiveForm("daywise")}
                    >
                        Day-wise Lec
                    </button>
                    <button
                        className={`px-4 py-2 rounded-md border ${activeForm === "dailyrecord"
                                ? "bg-blue-600 text-white border-blue-600"
                                : "bg-white text-gray-700 border-gray-300"
                            }`}
                        onClick={() => setActiveForm("dailyrecord")}
                    >
                        Daily Record
                    </button>
                </div>

                {/* Day-wise Lec Form */}
                {activeForm === "daywise" && (
                           <form className="space-y-4" onSubmit={handleSubmitDaywiseLec}>
                        <select
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={day}
                            onChange={(e) => setDay(e.target.value)}
                        >
                            <option value="">Select Day</option>
  {dayOptions.map((d, idx) => (
    <option key={idx} value={d.value}>{d.label}</option>
  ))}
                              </select>

                        <input
                            type="number"
                            placeholder="Lecture Count"
                            value={lectureCount}
                            onChange={(e) => setLectureCount(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <input
                            type="text"
                            placeholder="Subject"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition"
                        >
                            Save
                        </button>
                    </form>
              
                )}

                {/* Daily Record Form */}
                {activeForm === "dailyrecord" && (
                    <form className="space-y-4" onSubmit={handleSubmitDailyRecord}>
                        {/* Day Dropdown */}
                        <select
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onChange={(e) => setDailyDay(e.target.value)}

                        >
                           <option value="">Select Day</option>
        {dayOptions.map((d, idx) => (
            <option key={idx} value={d.value}>{d.label}</option>
        ))}
                        </select>

                        {/* Total Lectures of the Day */}
                        <input
                            type="number"
                            placeholder="Total Lectures of Day"
                              onChange={(e) => setTotalLectures(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        {/* Subject */}
                        <select
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                         onChange={(e) => setDailySubject(e.target.value)}
                        >
                            <option value="">Select Subject</option>
        {subjectOptions.map((s, idx) => (
            <option key={idx} value={s.value}>{s.label}</option>
        ))}
                        </select>

                        {/* Lectures Attended */}
                        <input
                            type="number"
                            placeholder="Lectures Attended"
                            onChange={(e) => setAttended(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        {/* Lectures Not Attended */}
                        <input
                            type="number"
                            placeholder="Lectures Not Attended"
                             onChange={(e) => setNotAttended(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition"
                        >
                            Save Record
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
