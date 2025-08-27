import AttendenceTable from "../components/AttendenceTable";
import LeaveModal from "../components/LeaveModal";

 function Attendence() {
  return (
    <div className="p-4 space-y-8">
      <h2 className="text-xl font-bold">Attendence Overview</h2>
      <AttendenceTable />
      <LeaveModal />
    </div>
  );
}

export default Attendence;
