import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";
import familyImage from "../assets/Family.jpeg";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Spinner from "../components/Spinner";

export default function Signup() {
  const [form, setForm] = useState({
    familyName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/family/register", form);
      navigate("/");
    } catch (err) {
      setError("Registration failed. Try again.");
    }finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      {loading && <Spinner show={loading}/>}

      <div className="flex h-screen">
        {/* Left side image */}
        <div className="hidden md:flex w-1/2 bg-blue-100 items-center justify-center">
          <img
            src={familyImage}
            alt="Happy Family"
            className="w-4/5 rounded-3xl shadow-2xl"
          />
        </div>

        {/* Right side signup form */}
        <div className="flex flex-col justify-center w-full md:w-1/2 px-8 bg-white">
          <h1 className="text-3xl font-bold text-center text-blue-700 mb-8">
            Create Family Account
          </h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              name="familyName"
              placeholder="Family Username"
              onChange={handleChange}
              className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="email"
              name="email"
              placeholder="Family Email e.g example.example@family.ac.ke"
              onChange={handleChange}
              className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Sign Up
            </button>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          </form>
          <p className="text-center text-gray-500 mt-4">
            Already have an account?{" "}
            <Link to="/" className="text-blue-600 font-medium hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}
