import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const EditDaywise = () => {
    const { state } = useLocation();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        Day: "",
        "Total Lectures": 0,
        Subject: "",
        "Lectures Attended": 0,
        "Lectures Not Attended": 0,
    });

    useEffect(() => {
        if (state && state.record) {
            setFormData(state.record);
        }
    }, [state]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name.includes("Lectures") ? parseInt(value) : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // send data to backend here
        console.log("Updated DayWise Record:", formData);
        alert("Day-wise record updated successfully!");

        navigate("/profile");
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded shadow-md w-full max-w-lg"
            >
                <h2 className="text-2xl font-bold mb-6 text-center">Edit Day-wise Record</h2>

                <div className="grid grid-cols-1 gap-4">
                    <InputField label="Day" name="Day" onChange={handleChange} />
                    <InputField label="Total Lectures" name="Total Lectures" type="number"onChange={handleChange} />
                    <InputField label="Subject" name="Subject" onChange={handleChange} />
                    <InputField label="Lectures Attended" name="Lectures Attended" type="number" onChange={handleChange} />
                    <InputField label="Lectures Not Attended" name="Lectures Not Attended" type="number" onChange={handleChange} />
                </div>

                <div className="flex justify-between mt-6">
                    <button
                        type="button"
                        onClick={() => navigate("/profile")}
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
};

const InputField = ({ label, name, value, onChange, type = "text" }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
        />
    </div>
);

export default EditDaywise;
