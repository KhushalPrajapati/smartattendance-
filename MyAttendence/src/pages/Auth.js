import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../ApiConfig";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../Constants";
export default function Auth() {
    const navigate = useNavigate()
    const [isSignup, setIsSignup] = useState(true);
    const [messages, setMessages] = useState([]);
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
     const [signupData, setSignupData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        branch: "",
        enrollment_number: "",
        semester: ""
    });

//  const handleLoginChange = (e) => {
//     const { name, value } = e.target;
//     setLoginData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

const handleSubmit = async (e) => {
  e.preventDefault();
  setMessages([]); // Clear any previous messages

  if (!email || !password) {
    setMessages(["Please fill in all fields."]);
    return;
  }

  const formData = {
    email: email,
    password: password,
  };

  try {
    const response = await API_URL.post('/api/login/', formData, {
      headers: {
        "Content-Type": "application/json"
      }
    });

    console.log("Login response:", response.data);

    if (response.data && response.data.token) {
      // Store tokens and user ID in localStorage
      localStorage.setItem("access", response.data.token.access);
      localStorage.setItem("refresh", response.data.token.refresh);
      localStorage.setItem("user_id", response.data.id);

      setMessages(["Logged in successfully!"]);
      navigate('/records')
    } else {
      setMessages(["Unexpected response. Please try again."]);
    }
  } catch (error) {
    console.error("Login failed:", error.response?.data || error.message);
    if (error.response?.data?.error) {
      setMessages([error.response.data.error]);
    } else {
      setMessages(["Invalid credentials or server error."]);
    }
  }
};




    const handleChange = (e) => {
        setSignupData({ ...signupData, [e.target.name]: e.target.value });
    };

    const handleSignup = async (e) => {
  e.preventDefault();

  try {
       const formDataToSend = new FormData();
    formDataToSend.append("first_name", signupData.first_name);
    formDataToSend.append("last_name", signupData.last_name);
    formDataToSend.append("email", signupData.email);
    formDataToSend.append("password", signupData.password);
    formDataToSend.append("branch", signupData.branch || "");
    formDataToSend.append("enrollment_number", parseInt(signupData.enrollment_number)); // ✅ ensure it's an int
    formDataToSend.append("semester", signupData.semester || "");

    const res = await API_URL.post('api/user/', formDataToSend, {
      headers: {
        // No need to set 'Content-Type' explicitly with FormData
      }
    });

    console.log("User registered:", res.data);
    alert("User registered successfully!");
    setIsSignup(false);
    // navigate('/records')
    } catch (e) {
    console.error("Signup Error:", e.response ? e.response.data : e.message);
    alert("Signup failed. Check console for details.");
  }
};



    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
                <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
                    {isSignup ? "Student Signup" : "Login"}
                </h2>

                {isSignup ? (
                    // Signup Form
                    <form onSubmit={handleSignup} className="space-y-4">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="First Name"
                                name="first_name" 
                                onChange={handleChange}
                                className="w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                type="text"
                                placeholder="Last Name"
                                name="kast_name"
                                onChange={handleChange}
                                className="w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <input
                            type="email"
                            placeholder="Email"
                            name="email"
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            name="password"
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="text"
                            placeholder="Branch"
                            name="branch"
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="text"
                            placeholder="Enrollment Number"
                            name="enrollment_number"
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="text"
                            placeholder="Semester"
                            name="semester"
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition"
                        >
                            Sign Up
                        </button>
                    </form>
                ) : (
                    // Login Form
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="email"
                            name="email"
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="password"
                            name="password"
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition"
                        >
                            Login
                        </button>
                        
                    </form>
                )}

                <p className="text-center text-gray-600 mt-4">
                    {isSignup ? "Already have an account?" : "Don't have an account?"}
                    <button
                        type="button"
                        className="text-blue-600 ml-1 hover:underline"
                        onClick={() => setIsSignup(!isSignup)}
                    >
                        {isSignup ? "Login" : "Sign Up"}
                    </button>
                </p>
            </div>
        </div>
    );
}
