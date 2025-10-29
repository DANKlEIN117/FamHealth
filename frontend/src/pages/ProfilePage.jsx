import { useState, useEffect } from "react";
import Footer from "../components/Footer";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import API from "../api";
import AivanaChat from "../components/AivanaChat";
import ProfileTab from "../components/ProfileTab";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import Spinner from "../components/Spinner";


export default function ProfilePage() {
  const [familyName, setFamilyName] = useState("");
  const [familyEmail, setFamilyEmail] = useState("");
  const [members, setMembers] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [date, setDate] = useState(new Date());
  const [showProfileTab, setShowProfileTab] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const famRes = await API.get("/family/profile", config);
        setFamilyName(famRes.data.familyName);
        setFamilyEmail(famRes.data.email);
        setMembers(famRes.data.members || []);

        const reminderPromises = (famRes.data.members || []).map(async (member) => {
          const res = await API.get(`/reminders/${member._id}`, config);
          return res.data.map((r) => ({
            ...r,
            memberName: member.name,
          }));
        });

        const remindersArrays = await Promise.all(reminderPromises);
        setAlerts(remindersArrays.flat());
      } catch (error) {
        console.error("Error fetching data:", error);
      }finally {
      setLoading(false);
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
    const timeInput = prompt("Enter time (HH:MM, 24hr format):");
    if (!timeInput) return alert("Time is required.");

    const [hours, minutes] = timeInput.split(":");
    const now = new Date();
    const localTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      parseInt(hours),
      parseInt(minutes)
    );
    const note = prompt("Add note (optional):");

    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await API.post(
        "/reminders/add",
        {
          memberId: member._id,
          medicine,
          dosage,
          time: localTime.toISOString(),
          note,
        },
        config
      );

      alert("Drug reminder added successfully!");
      setAlerts([...alerts, { ...res.data.reminder, memberName: member.name }]);
    } catch (error) {
      console.error("Error adding reminder:", error);
    }
  };

  // ProfileTab handlers
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };
  const handleUpdate = async (updatedData) => {
  try {
    const res = await API.put("/family/update", updatedData);
    setFamilyName(res.data.familyName);
    setFamilyEmail(res.data.email);
    alert("Profile updated successfully!");
  } catch (error) {
    console.error("Error updating profile:", error);
    alert("Failed to update profile. Try again later.");
  }
  };

  const handlePasswordChange = async (newPassword) => {
    try {
      await API.put("/family/change-password", { password: newPassword });
      alert("Password changed successfully!");
    } catch (error) {
      console.error("Error changing password:", error);
      alert("Could not change password.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your account permanently?")) return;
    try {
      await API.delete("/family/delete-account");
      alert("Account deleted successfully.");
      localStorage.removeItem("token");
      window.location.href = "/";
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Failed to delete account.");
    }
  };


  const family = {
    name: familyName || "Loading...",
    email: familyEmail || "No email available",
  };

  const handleDeleteMember = async (memberId) => {
  if (window.confirm("Are you sure you want to remove this member?")) {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await API.delete(`/family/members/${memberId}`, config);
      toast.success("Member deleted successfully");
      setMembers(members.filter((m) => m._id !== memberId));
    } catch (err) {
      toast.error(err.response?.data?.message || "Error deleting member");
    }
  }
};



  return (
    <>
    {loading && <Spinner show={loading}/>}
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="flex justify-between items-center bg-blue-700 text-white py-4 px-6 relative">
        <h1 className="text-xl md:text-2xl font-semibold truncate">
          Welcome| {familyName || "Loading Family..."}
        </h1>

        <div className="relative">
          <img
            src={
              family.profilePic || // ✅ from backend
              localStorage.getItem("profilePhoto") ||
              "/profile.png"
            }
            alt="Profile"
            onClick={() => setShowProfileTab(!showProfileTab)}
            className="w-10 h-10 rounded-full border-2 border-white cursor-pointer hover:scale-105 transition"
          />
          {showProfileTab && (
            <div className="absolute right-0 mt-3 bg-white rounded-xl shadow-xl p-4 w-78 z-50">
              <ProfileTab
                family={family}
                onLogout={handleLogout}
                onUpdate={handleUpdate}
                onPasswordChange={handlePasswordChange}
                onDelete={handleDelete}
              />
            </div>
          )}
        </div>
      </header>

      {/* Main */}
      <main className="flex-grow max-w-7xl mx-auto w-full p-4 md:p-6 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden">
        {/* Family Members */}
        <section className="col-span-2 bg-white rounded-2xl shadow p-4 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg md:text-xl font-semibold text-gray-800">Family Members</h2>
            <button
              onClick={handleAddMember}
              className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition"
            >
              + Add Member
            </button>
            
            

          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {members.map((member) => (
              <div
                key={member._id}
                className="p-4 bg-blue-50 rounded-xl shadow hover:shadow-lg transition text-center"
              >
                <h3 className="text-lg font-semibold text-gray-700">{member.name}</h3>
                <p className="text-gray-500">{member.role}</p>
                <button
                  onClick={() => handleDeleteMember(member._id)}
                  className="mt-2 bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                >
                  Delete
                </button>

              </div>
            ))}

          </div>
        </section>

        {/* Right Widgets */}
        <aside className="flex flex-col gap-4">
          {/* Drug Alerts */}
          <div className="bg-white rounded-2xl shadow p-4 flex-1 flex flex-col">
            <h2 className="text-lg font-semibold mb-2 text-gray-800">Drug Alerts</h2>
            <div className="flex-1 overflow-y-auto max-h-40 pr-2 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-100">
              <ul className="space-y-2">
                {alerts.length === 0 ? (
                  <p className="text-gray-500">No alerts yet</p>
                ) : (
                  alerts.map((alert) => (
                    <li
                      key={alert._id}
                      className={`p-3 rounded-lg flex flex-col gap-1 ${
                        new Date(alert.time) < Date.now()
                          ? "bg-red-100 text-red-600 animate-pulse"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      <span className="font-semibold">👤 {alert.memberName}</span>
                      <span>
                        💊 {alert.medicine} — {alert.dosage}
                      </span>
                      <span>
                        🕒{" "}
                        {new Date(alert.time).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </li>
                  ))
                )}
              </ul>
            </div>
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

          <button
            onClick={() => (window.location.href = "/analytics")}
            className="mt-3 w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
          >
            View Family Health Analytics
          </button>

          <Link
            to="/emergency"
            className="fixed bottom-4 left-4 bg-red-600 text-white p-3 rounded-full shadow-lg text-xl hover:bg-red-700"
          >
            🚨
          </Link>

        </aside>
      </main>

      <Footer />
      <AivanaChat />
    </div>
    </>
  );
}
