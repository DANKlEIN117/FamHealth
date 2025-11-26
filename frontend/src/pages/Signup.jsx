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
                Join FamHealth
              </h1>
              <p className="text-gray-600 text-sm font-medium">Create your family account today 👨‍👩‍👧‍👦</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Family Name Input */}
              <div className="relative group">
                <input
                  type="text"
                  name="familyName"
                  placeholder="Family Username"
                  value={form.familyName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/50 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 outline-none transition duration-300 placeholder-gray-400 text-gray-800"
                />
                <span className="absolute right-4 top-3.5 text-xl group-focus-within:text-blue-500 transition">
                  👨‍👩‍👧
                </span>
              </div>

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

              {/* Password Requirements */}
              <div className="bg-blue-50/60 backdrop-blur border border-blue-200 rounded-lg p-3 text-xs text-gray-700">
                <p className="font-semibold mb-2">Password Requirements:</p>
                <ul className="space-y-1 text-gray-600">
                  <li>✓ At least 8 characters</li>
                  <li>✓ Mix of uppercase & lowercase</li>
                  <li>✓ Include numbers & special characters</li>
                </ul>
              </div>

              {/* Terms Agreement */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  className="w-4 h-4 mt-1 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer flex-shrink-0"
                />
                <span className="text-gray-700 text-sm">
                  I agree to the{" "}
                  <Link to="/terms" className="text-blue-600 font-semibold hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="text-blue-600 font-semibold hover:underline">
                    Privacy Policy
                  </Link>
                </span>
              </label>

              {/* Error Message */}
              {error && (
                <div className="bg-red-100/80 backdrop-blur border-l-4 border-red-500 p-4 rounded-lg">
                  <p className="text-red-700 text-sm font-semibold">⚠️ {error}</p>
                </div>
              )}

              {/* Sign Up Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 mt-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold text-lg rounded-xl hover:shadow-2xl transform hover:scale-105 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-gray-300"></div>
              <span className="text-gray-500 text-xs font-semibold">OR</span>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            {/* Social Signup */}
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

            {/* Login Link */}
            <p className="text-center text-gray-700 mt-6 text-sm font-medium">
              Already have an account?{" "}
              <Link
                to="/"
                className="text-blue-600 font-bold hover:text-blue-700 transition underline"
              >
                Login here
              </Link>
            </p>
          </div>

          {/* Footer Text */}
          <p className="text-center text-xs text-white/80 mt-6 backdrop-blur px-4">
            Your family's health is our priority. Secure & encrypted. 🔐
          </p>
        </div>
      </div>

      <Footer />
    </>
  );
}
