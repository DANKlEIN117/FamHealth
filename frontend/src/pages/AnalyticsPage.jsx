import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AivanaChat from "../components/AivanaChat";

const diseases = [
  { name: "HIV", data: [5, 7, 6, 8, 9, 10, 8, 7, 6, 8, 9, 11], color: "#ef4444", gradient: "from-red-400 to-red-600" },
  { name: "Malaria", data: [15, 20, 25, 30, 40, 45, 38, 30, 28, 25, 20, 18], color: "#f59e0b", gradient: "from-yellow-400 to-orange-600" },
  { name: "Typhoid", data: [12, 10, 15, 18, 20, 25, 22, 19, 15, 13, 10, 8], color: "#8b5cf6", gradient: "from-purple-400 to-purple-600" },
  { name: "Cholera", data: [8, 6, 5, 9, 12, 15, 14, 10, 8, 7, 5, 4], color: "#06b6d4", gradient: "from-cyan-400 to-cyan-600" },
  { name: "COVID-19", data: [2, 3, 4, 6, 7, 10, 9, 8, 5, 4, 3, 2], color: "#3b82f6", gradient: "from-blue-400 to-blue-600" },
  { name: "Tuberculosis", data: [9, 10, 11, 13, 15, 17, 14, 13, 12, 11, 9, 8], color: "#ec4899", gradient: "from-pink-400 to-pink-600" },
  { name: "Diabetes", data: [20, 21, 23, 25, 28, 30, 29, 27, 26, 25, 24, 23], color: "#14b8a6", gradient: "from-teal-400 to-teal-600" },
  { name: "Hypertension", data: [18, 20, 22, 24, 26, 28, 27, 25, 24, 22, 21, 20], color: "#f97316", gradient: "from-orange-400 to-orange-600" },
  { name: "Asthma", data: [6, 8, 10, 12, 13, 15, 14, 13, 10, 9, 8, 7], color: "#10b981", gradient: "from-emerald-400 to-emerald-600" },
  { name: "Pneumonia", data: [10, 12, 15, 18, 20, 22, 21, 19, 16, 14, 12, 10], color: "#6366f1", gradient: "from-indigo-400 to-indigo-600" },
];

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const DiseaseTrendsPage = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6 relative overflow-hidden">
        
        {/* Animated Background Elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
          <div className="absolute -bottom-32 right-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        </div>

        {/* Header */}
        <div className="relative z-10 max-w-7xl mx-auto mb-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-lg mb-2">
              📊 Disease Trends Analytics 2024
            </h1>
            <p className="text-gray-600 text-lg font-medium">Track major disease patterns throughout the year</p>
          </div>
        </div>

        {/* Grid */}
        <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {diseases.map((disease, index) => {
            const chartData = months.map((month, i) => ({
              month,
              value: disease.data[i],
            }));

            return (
              <div
                key={index}
                className={`bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl hover:shadow-2xl p-6 border border-white/30 transform hover:scale-105 transition duration-300 overflow-hidden group`}
              >
                {/* Card Header with Gradient */}
                <div className={`bg-gradient-to-r ${disease.gradient} -mx-6 -mt-6 mb-4 px-6 py-4 rounded-t-3xl`}>
                  <h2 className="text-2xl font-bold text-white drop-shadow-lg">{disease.name}</h2>
                  <p className="text-white/90 text-sm font-semibold">Monthly Statistics</p>
                </div>

                {/* Chart Container */}
                <div className="bg-gradient-to-b from-gray-50 to-white rounded-2xl p-3">
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                      <defs>
                        <linearGradient id={`grad-${index}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={disease.color} stopOpacity={0.8}/>
                          <stop offset="95%" stopColor={disease.color} stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="month" stroke="#9ca3af" />
                      <YAxis stroke="#9ca3af" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(255, 255, 255, 0.95)",
                          border: `2px solid ${disease.color}`,
                          borderRadius: "12px",
                          boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
                        }}
                        cursor={{ stroke: disease.color, strokeWidth: 2 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke={disease.color}
                        strokeWidth={3}
                        dot={{ fill: disease.color, r: 4, strokeWidth: 2, stroke: "white" }}
                        activeDot={{ r: 6, strokeWidth: 2 }}
                        fill={`url(#grad-${index})`}
                        isAnimationActive={true}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Card Footer Stats */}
                <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center text-sm">
                  <div className="text-center flex-1">
                    <div className="text-gray-600 font-semibold">Peak</div>
                    <div className="text-xl font-bold text-gray-800">{Math.max(...disease.data)}</div>
                  </div>
                  <div className="h-8 w-px bg-gray-200"></div>
                  <div className="text-center flex-1">
                    <div className="text-gray-600 font-semibold">Average</div>
                    <div className="text-xl font-bold text-gray-800">
                      {(disease.data.reduce((a, b) => a + b, 0) / disease.data.length).toFixed(1)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Footer />
      <AivanaChat />
    </>
  );
};

export default DiseaseTrendsPage;
