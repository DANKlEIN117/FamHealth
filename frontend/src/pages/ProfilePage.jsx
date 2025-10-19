import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import API from "../api";

export default function ProfilePage() {
  const [familyName, setFamilyName] = useState("");
  const [members, setMembers] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [date, setDate] = useState(new Date());

  // Fetch family info and members
  // Fetch family info and members
useEffect(() => {
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      // Fetch family + members
      const famRes = await API.get("/family/profile", config);
      setFamilyName(famRes.data.familyName);
      setMembers(famRes.data.members || []);

      // Fetch reminders for all members
      const reminderPromises = (famRes.data.members || []).map(async (member) => {
        const res = await API.get(`/reminders/${member._id}`, config);
        return res.data.map((r) => ({
          ...r,
          memberName: member.name,
        }));
      });

      const remindersArrays = await Promise.all(reminderPromises);
      setAlerts(remindersArrays.flat()); // flatten all member reminders

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  fetchData();
}, []);


  const handleAddMember = async () => {
    const name = prompt("Enter member name:");
    const role = prompt("Enter member role:");
    if (!name || !role) return;

    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await API.post("/members", { name, role }, config);
      setMembers([...members, res.data]);
    } catch (error) {
      console.error("Failed to add member", error);
    }
  };
  const handleAddDrugAlert = async () => {
  if (members.length === 0) return alert("No members available");

  const memberOptions = members.map((m, i) => `${i + 1}. ${m.name}`).join("\n");
  const selected = prompt(`Select member by number:\n${memberOptions}`);
  const memberIndex = parseInt(selected) - 1;
  const member = members[memberIndex];
  if (!member) return alert("Invalid member selected.");

  const medicine = prompt("Enter medicine name:");
  const dosage = prompt("Enter dosage:");
  const time = prompt("Enter time (e.g. 2025-10-18T10:00:00Z):");
  const note = prompt("Add note (optional):");

  try {
    const token = localStorage.getItem("token");
    const config = { headers: { Authorization: `Bearer ${token}` } };

    const res = await API.post("/reminders/add", {
      memberId: member._id,
      medicine,
      dosage,
      time,
      note,
    }, config);

    alert("Drug reminder added successfully!");
    setAlerts([...alerts, { ...res.data.reminder, memberName: member.name }]);
  } catch (error) {
    console.error("Error adding reminder:", error);
  }
};

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <header className="bg-blue-700 text-white text-center py-4 text-2xl font-semibold">
        {familyName || "Loading Family..."}
      </header>

      <main className="flex-grow grid grid-cols-3 gap-4 p-6">
        {/* Family Members */}
        <section className="col-span-2 bg-white rounded-2xl shadow p-4 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Family Members</h2>
            <div className="flex gap-2">
              <button
                onClick={handleAddMember}
                className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition"
              >
                + Add Member
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {members.map((member) => (
              <div
                key={member._id}
                className="p-4 bg-blue-50 rounded-xl shadow hover:shadow-lg transition"
              >
                <h3 className="text-lg font-semibold text-gray-700">{member.name}</h3>
                <p className="text-gray-500">{member.role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Right side widgets */}
        <aside className="flex flex-col gap-4">
          {/* Drug Alerts */}
          <div className="bg-white rounded-2xl shadow p-4 flex-1">
            <h2 className="text-lg font-semibold mb-2 text-gray-800">Drug Alerts</h2>
            <ul className="space-y-2">
              {alerts.length === 0 ? (
                <p className="text-gray-500">No alerts yet</p>
              ) : (
                alerts.map((alert) => (
                  <li
                    key={alert._id}
                    className={`p-2 rounded-lg ${
                      new Date(alert.time) < new Date()
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    💊 {alert.medicine} ({alert.dosage}) — {alert.memberName}
                    <br />
                    <span className="text-sm text-gray-500">
                      {new Date(alert.time).toLocaleString()}
                    </span>
                  </li>
                ))
              )}
            </ul>

            <button
              onClick={handleAddDrugAlert}
              className="mt-3 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              + Add Drug Alert
            </button>

          </div>

          {/* Calendar */}
          <div className="bg-white rounded-2xl shadow p-4 flex-1">
            <h2 className="text-lg font-semibold mb-2 text-gray-800">Calendar</h2>
            <Calendar onChange={setDate} value={date} />
          </div>
        </aside>
      </main>

      <Footer />
    </div>
  );
}
