import React, { useState } from "react";

const EditProfile = () => {
    const [formData, setFormData] = useState({
        firstName: "Kartik",
        lastName: "Upadhyay",
        email: "kartik@india.in",
        password: "",
        branch: "CS",
        enrollment: "12345678",
        semester: "4",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Submit logic here (API call)
        console.log("Updated Profile:", formData);
        alert("Profile Updated Successfully!");
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
            >
                <h2 className="text-2xl font-bold text-center mb-6">Edit Profile</h2>

                <div className="grid grid-cols-2 gap-4">
                    <input
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        className="border p-2 rounded"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        className="border p-2 rounded"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                    />
                </div>

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="border p-2 rounded w-full mt-4"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="border p-2 rounded w-full mt-4"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />

                <input
                    type="text"
                    name="branch"
                    placeholder="Branch"
                    className="border p-2 rounded w-full mt-4"
                    value={formData.branch}
                    onChange={handleChange}
                    required
                />

                <input
                    type="text"
                    name="enrollment"
                    placeholder="Enrollment Number"
                    className="border p-2 rounded w-full mt-4"
                    value={formData.enrollment}
                    onChange={handleChange}
                    required
                />

                <input
                    type="number"
                    name="semester"
                    placeholder="Semester"
                    className="border p-2 rounded w-full mt-4"
                    value={formData.semester}
                    onChange={handleChange}
                    required
                />

                <button
                    type="submit"
                    className="bg-blue-600 text-white w-full mt-6 py-2 rounded hover:bg-blue-700"
                >
                    Save Changes
                </button>
            </form>
        </div>
    );
};

export default EditProfile;
