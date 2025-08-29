import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const EditDaily = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const record = location.state?.record;

    const [formData, setFormData] = useState(record || {
        name: "",
        user: "",
        day: "",
        date: "",
        subject: "",
        lecCount: "",
        attended: "",
        notAttended: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdate = () => {
        // add backend update logic here
        console.log("Updated Record:", formData);
        navigate("/profile");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-xl">
                <h2 className="text-2xl font-bold mb-6 text-center">Edit Attendance Record</h2>

                <div className="grid grid-cols-2 gap-4">
                    <InputField label="Name" name="name" value={formData.name} onChange={handleChange} />
                    <InputField label="User" name="user" value={formData.user} onChange={handleChange} />
                    <InputField label="Day" name="day" value={formData.day} onChange={handleChange} />
                    <InputField label="Date" name="date" value={formData.date} onChange={handleChange} />
                    <InputField label="Subject" name="subject" value={formData.subject} onChange={handleChange} />
                    <InputField label="Lec Count" name="lecCount" value={formData.lecCount} onChange={handleChange} />
                    <InputField label="Attended" name="attended" value={formData.attended} onChange={handleChange} />
                    <InputField label="Not Attended" name="notAttended" value={formData.notAttended} onChange={handleChange} />
                </div>

                <button
                    onClick={handleUpdate}
                    className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    Update Record
                </button>
            </div>
        </div>
    );
};

const InputField = ({ label, name, value, onChange }) => (
    <div>
        <label className="text-sm text-gray-600">{label}</label>
        <input
            type="text"
            name={name}
            value={value}
            onChange={onChange}
            className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
        />
    </div>
);

export default EditDaily;
