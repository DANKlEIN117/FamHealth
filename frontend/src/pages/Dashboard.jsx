import { useEffect, useState } from "react";
import API from "../api";

export default function Dashboard() {
  const [family, setFamily] = useState(null);

  /*useEffect(() => {
    const fetchData = async () => {
      const res = await API.get("/family/profile", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setFamily(res.data);
    };
    fetchData();
  }, []);*/

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-semibold text-blue-600 mb-6">
        {family?.familyName} Health Dashboard
      </h1>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-4">Active Reminders</h2>
          <p>Drug and checkup reminders will appear here.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-4">AI Health Alerts</h2>
          <p>FamHealth AI will show recent alerts here 🚨</p>
        </div>
      </div>
    </div>
  );
}
