import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AivanaChat from "../components/AivanaChat";

const diseases = [
  { name: "HIV", data: [5, 7, 6, 8, 9, 10, 8, 7, 6, 8, 9, 11] },
  { name: "Malaria", data: [15, 20, 25, 30, 40, 45, 38, 30, 28, 25, 20, 18] },
  { name: "Typhoid", data: [12, 10, 15, 18, 20, 25, 22, 19, 15, 13, 10, 8] },
  { name: "Cholera", data: [8, 6, 5, 9, 12, 15, 14, 10, 8, 7, 5, 4] },
  { name: "COVID-19", data: [2, 3, 4, 6, 7, 10, 9, 8, 5, 4, 3, 2] },
  { name: "Tuberculosis", data: [9, 10, 11, 13, 15, 17, 14, 13, 12, 11, 9, 8] },
  { name: "Diabetes", data: [20, 21, 23, 25, 28, 30, 29, 27, 26, 25, 24, 23] },
  { name: "Hypertension", data: [18, 20, 22, 24, 26, 28, 27, 25, 24, 22, 21, 20] },
  { name: "Asthma", data: [6, 8, 10, 12, 13, 15, 14, 13, 10, 9, 8, 7] },
  { name: "Pneumonia", data: [10, 12, 15, 18, 20, 22, 21, 19, 16, 14, 12, 10] },
];

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const DiseaseTrendsPage = () => {
  return (
    <>
    <Navbar />
      <div className="p-6 bg-gray-50 min-h-screen overflow-y-scroll scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-200">
        <h1 className="text-3xl font-bold mb-6 text-center"> Major Diseases Trends 2024</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {diseases.map((disease, index) => {
            const chartData = months.map((month, i) => ({
              month,
              value: disease.data[i],
            }));

            return (
              
              <div key={index} className="bg-white p-4 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
                <h2 className="text-xl font-semibold mb-2 text-center text-blue-700">{disease.name}</h2>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
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
