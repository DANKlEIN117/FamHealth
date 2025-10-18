import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";
import familyImage from "../assets/Family.jpeg";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await API.post("/family/login", form);
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("familyName", res.data.familyName);
    navigate("/profile");  // go straight to profile instead of dashboard
  } catch (err) {
    setError("Invalid email or password");
  }
};


  return (
    <>
      <Navbar />

      <div className="flex min-h-screen">
        {/* Left side image */}
        <div className="hidden md:flex w-1/2 bg-blue-100 items-center justify-center">
          <img
            src={familyImage}
            alt="Happy Family"
            className="w-4/5 rounded-3xl shadow-2xl"
          />
        </div>

        {/* Right side login form */}
        <div className="flex flex-col justify-center w-full md:w-1/2 px-8 bg-white">
          <h1 className="text-3xl font-bold text-center text-blue-700 mb-8">
            FamHealth — Keeping Your Family Healthy 💙
          </h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="email"
              name="email"
              placeholder="Family Email"
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
              Login
            </button>
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}
          </form>
          <p className="text-center text-gray-500 mt-4">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="text-blue-600 font-medium hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>

      <Footer />
    </>
  );
}
