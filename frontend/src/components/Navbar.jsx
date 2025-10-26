import { Link } from "react-router-dom";

export default function Navbar() {
  const token = localStorage.getItem("token");
  const familyName = localStorage.getItem("familyName");

  

  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-blue-700 text-white">
      <h1 className="text-xl font-bold">
        FamHealth
        {token && familyName ? (
          <span className="ml-3 text-sm font-normal text-blue-200">
            | Welcome, {familyName}
          </span>
        ) : null}
      </h1>

      <div className="flex gap-4">
        {!token ? (
          <>
            <Link to="/" className="hover:text-blue-200">
              Login
            </Link>
            <Link to="/signup" className="hover:text-blue-200">
              Signup
            </Link>
          </>
        ) : (
          <>
            <Link to="/profile" className="hover:text-blue-200">
              Profile
            </Link>
            
          </>
        )}
      </div>
    </nav>
  );
}
