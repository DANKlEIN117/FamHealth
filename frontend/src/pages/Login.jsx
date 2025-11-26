import { useState } from "react";
import API from "../api";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Spinner from "../components/Spinner";
import familyImage from "../assets/Family.jpeg";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "", rememberMe: false });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/family/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("familyName", res.data.familyName);
      if (form.rememberMe) {
        localStorage.setItem("rememberEmail", form.email);
      }
      navigate("/profile");
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Spinner show={loading} />}
      <Navbar />

      {/* Full Page Background with Overlay */}
      <div
        className="min-h-screen flex flex-col justify-center items-center relative overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(59, 130, 246, 0.65) 0%, rgba(139, 92, 246, 0.65) 50%, rgba(236, 72, 153, 0.65) 100%), url(${familyImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        {/* Animated Background Gradient Orbs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>

        {/* Content Container */}
        <div className="relative z-10 w-full max-w-md px-6">
          
          {/* Card with Glass Morphism Effect */}
          <div className="backdrop-blur-2xl bg-white/90 rounded-3xl shadow-2xl p-8 md:p-10 border border-white/30">
            
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                Welcome Back
              </h1>
              <p className="text-gray-600 text-sm font-medium">FamHealth — Keeping Your Family Healthy 💙</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Email Input */}
              <div className="relative group">
                <input
                  type="email"
                  name="email"
                  placeholder="family@email.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/50 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 outline-none transition duration-300 placeholder-gray-400 text-gray-800"
                />
                <span className="absolute right-4 top-3.5 text-xl group-focus-within:text-blue-500 transition">
                  ✉️
                </span>
              </div>

              {/* Password Input */}
              <div className="relative group">
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/50 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 outline-none transition duration-300 placeholder-gray-400 text-gray-800"
                />
                <span className="absolute right-4 top-3.5 text-xl group-focus-within:text-blue-500 transition">
                  🔒
                </span>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={form.rememberMe}
                    onChange={handleChange}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  />
                  <span className="text-gray-700 group-hover:text-gray-900 transition font-medium">
                    Remember me
                  </span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-blue-600 hover:text-blue-700 font-semibold transition"
                >
                  Forgot?
                </Link>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-100/80 backdrop-blur border-l-4 border-red-500 p-4 rounded-lg">
                  <p className="text-red-700 text-sm font-semibold">⚠️ {error}</p>
                </div>
              )}

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 mt-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold text-lg rounded-xl hover:shadow-2xl transform hover:scale-105 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-gray-300"></div>
              <span className="text-gray-500 text-xs font-semibold">OR</span>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            {/* Social Login */}
            <div className="flex gap-4">
              <button
                type="button"
                className="flex-1 py-2.5 px-4 rounded-lg bg-white hover:bg-gray-50 transition transform hover:scale-105 flex items-center justify-center gap-2 text-gray-700 font-semibold shadow-md"
              >
                <span>🔵</span> Google
              </button>
              <button
                type="button"
                className="flex-1 py-2.5 px-4 rounded-lg bg-white hover:bg-gray-50 transition transform hover:scale-105 flex items-center justify-center gap-2 text-gray-700 font-semibold shadow-md"
              >
                <span>🍎</span> Apple
              </button>
            </div>

            {/* Sign Up Link */}
            <p className="text-center text-gray-700 mt-6 text-sm font-medium">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-blue-600 font-bold hover:text-blue-700 transition underline"
              >
                Create one
              </Link>
            </p>
          </div>

          {/* Footer Text */}
          <p className="text-center text-xs text-white/80 mt-6 backdrop-blur px-4">
            By signing in, you agree to our{" "}
            <Link to="/terms" className="text-white hover:text-blue-200 underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-white hover:text-blue-200 underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>

      <Footer />
    </>
  );
}