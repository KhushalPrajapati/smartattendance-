 function AttendenceTable() {
  const attendanceData = [
    { date: "2025-07-01", subject: "Math", status: "Present" },
    { date: "2025-07-02", subject: "Physics", status: "Absent" },
    { date: "2025-07-03", subject: "Chemistry", status: "Present" },
  ];

  return (
    <div className=" bg-white rounded shadow-md">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-200 text-left">
          <tr>
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">Subject</th>
            <th className="px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {attendanceData.map((record, index) => (
            <tr
              key={index}
              className="border-b hover:bg-gray-50 transition-colors"
            >
              <td className="px-4 py-2">{record.date}</td>
              <td className="px-4 py-2">{record.subject}</td>
              <td
                className={`px-4 py-2 font-medium ${
                  record.status === "Present"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {record.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default AttendenceTable;