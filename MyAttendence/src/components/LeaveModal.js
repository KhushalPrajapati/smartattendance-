import { useState } from "react";
import api from "../services/api";

function LeaveModal() {
  const [reason, setReason] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!reason.trim()) return;
 

    try {
      const response = await api.post("leaves/", { reason });
      console.log("Leave submitted:", response.data);
      setReason("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Leave request failed:", error);
    }
  };

  return (
    <div className="mt-8 bg-white p-4 rounded shadow-md max-w-md">
      <h3 className="text-lg font-semibold mb-2">Request Leave</h3>
      <form>
      <input
        type="text"
        placeholder="Enter your reason"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        className="border border-gray-300 rounded px-3 py-2 w-full"
      />
      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded mt-3 hover:bg-blue-700"
      >
        Submit
      </button>
      {success && (
        <p className="text-green-600 mt-2">Leave submitted successfully!</p>
      )}
      </form>
    </div>
  );
}

export default LeaveModal;
