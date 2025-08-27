  import { Link } from "react-router-dom";
  function Navbar() {
    return (
      <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Attendence Planner</h1>
        <div className="space-x-4 flex">
          <Link to="/">Home</Link>
          <Link to="/attendence">Attendence</Link>
          <Link to="/profile">Profile</Link>
        </div>
      </nav>
    );
  }

  export default Navbar;
