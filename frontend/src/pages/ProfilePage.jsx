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
      toast.success("Member added successfully!");
    } catch (error) {
      console.error("Failed to add member", error);
      toast.error("Failed to add member");
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

      toast.success("Drug reminder added successfully!");
      setAlerts([...alerts, { ...res.data.reminder, memberName: member.name }]);
    } catch (error) {
      console.error("Error adding reminder:", error);
      toast.error("Error adding reminder");
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
    toast.success("Profile updated successfully!");
  } catch (error) {
    console.error("Error updating profile:", error);
    toast.error("Failed to update profile");
  }
  };

  const handlePasswordChange = async (newPassword) => {
    try {
      await API.put("/family/change-password", { password: newPassword });
      toast.success("Password changed successfully!");
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Could not change password");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your account permanently?")) return;
    try {
      await API.delete("/family/delete-account");
      toast.success("Account deleted successfully");
      localStorage.removeItem("token");
      window.location.href = "/";
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Failed to delete account");
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
      await API.delete(`/members/${memberId}`, config);
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-32 right-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
      </div>

      {/* Header */}
      <header className="relative z-20 flex justify-between items-center bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-5 px-6 shadow-xl backdrop-blur-sm bg-opacity-95">
        <h1 className="text-2xl md:text-3xl font-bold truncate drop-shadow-lg">
           Welcome, {familyName || "Family"}!
        </h1>

        <div className="relative">
          <button
            onClick={() => setShowProfileTab(!showProfileTab)}
            className="transform hover:scale-110 transition duration-300"
          >
            <img
              src={
                family.profilePic ||
                localStorage.getItem("profilePhoto") ||
                "/profile.png"
              }
              alt="Profile"
              className="w-12 h-12 rounded-full border-3 border-white shadow-lg hover:shadow-xl cursor-pointer"
            />
          </button>
          {showProfileTab && (
            <div className="absolute right-0 mt-3 bg-white rounded-2xl shadow-2xl p-6 w-80 z-50 backdrop-blur-lg border border-white/30">
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
      <main className="relative z-10 flex-grow max-w-7xl mx-auto w-full p-4 md:p-6 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden">
        
        {/* Family Members Section */}
        <section className="col-span-2 bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-6 md:p-8 flex flex-col border border-white/30">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              👨‍👩‍👧‍👦 Family Members
            </h2>
            <button
              onClick={handleAddMember}
              className="bg-gradient-to-r from-green-400 to-green-600 text-white font-semibold px-4 py-2 rounded-full hover:shadow-lg transform hover:scale-105 transition duration-300 flex items-center gap-2"
            >
              ➕ Add Member
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {members.length === 0 ? (
              <p className="text-gray-500 col-span-full text-center py-8">No members yet. Add one to get started!</p>
            ) : (
              members.map((member) => (
                <div
                  key={member._id}
                  className="group p-5 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl shadow-md hover:shadow-xl transform hover:scale-105 transition duration-300 text-center border border-blue-200/50"
                >
                  <div className="text-4xl mb-2 group-hover:animate-bounce">👤</div>
                  <h3 className="text-lg font-bold text-gray-800">{member.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{member.role}</p>
                  <button
                    onClick={() => handleDeleteMember(member._id)}
                    className="w-full bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg font-semibold transition transform hover:scale-105"
                  >
                    🗑️ Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Right Widgets */}
        <aside className="flex flex-col gap-6">
          
          {/* Drug Alerts */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-6 flex-1 flex flex-col border border-white/30">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">💊 Drug Alerts</h2>
            <div className="flex-1 overflow-y-auto max-h-48 pr-3 scrollbar-thin scrollbar-thumb-gradient-to-b scrollbar-thumb-blue-500 scrollbar-track-gray-200">
              <ul className="space-y-3">
                {alerts.length === 0 ? (
                  <p className="text-gray-500 text-center py-6">No alerts yet</p>
                ) : (
                  alerts.map((alert) => (
                    <li
                      key={alert._id}
                      className={`p-4 rounded-xl flex flex-col gap-2 font-medium backdrop-blur-sm border-l-4 transition duration-300 ${
                        new Date(alert.time) < Date.now()
                          ? "bg-red-100/80 text-red-700 border-red-500 animate-pulse"
                          : "bg-green-100/80 text-green-700 border-green-500"
                      }`}
                    >
                      <span className="font-bold">👤 {alert.memberName}</span>
                      <span className="text-sm">💊 {alert.medicine} — {alert.dosage}</span>
                      <span className="text-xs">
                        🕒 {new Date(alert.time).toLocaleTimeString([], {
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
              className="mt-4 w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2.5 rounded-xl hover:shadow-lg transform hover:scale-105 transition duration-300 font-semibold"
            >
              + Add Drug Alert
            </button>
          </div>

          {/* Calendar */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-6 flex-1 border border-white/30">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">📅 Calendar</h2>
            <div className="react-calendar-modern">
              <Calendar onChange={setDate} value={date} />
            </div>
          </div>

          {/* Analytics Button */}
          <button
            onClick={() => (window.location.href = "/analytics")}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 rounded-xl hover:shadow-lg transform hover:scale-105 transition duration-300 font-bold text-lg"
          >
            📊 View Health Analytics
          </button>

          {/* Emergency Button */}
          <Link
            to="/emergency"
            className="fixed bottom-6 left-6 bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-full shadow-2xl text-3xl hover:scale-110 transition duration-300 hover:shadow-xl"
          >
            🚨
          </Link>
          <AivanaChat />

        </aside>
      </main>

      <Footer />
      
    </div>

    {/* Custom Calendar Styling */}
    <style>{`
      .react-calendar-modern .react-calendar {
        background: transparent;
        border: none;
        font-family: inherit;
      }

      .react-calendar-modern .react-calendar__month-view__weekdays {
        color: #6b7280;
        font-weight: bold;
      }

      .react-calendar-modern .react-calendar__tile {
        border-radius: 8px;
        padding: 8px;
        margin: 2px;
        transition: all 0.3s ease;
      }

      .react-calendar-modern .react-calendar__tile:hover {
        background: linear-gradient(135deg, #3b82f6, #a855f7);
        color: white;
        transform: scale(1.05);
      }

      .react-calendar-modern .react-calendar__tile--active {
        background: linear-gradient(135deg, #3b82f6, #a855f7);
        color: white;
        border-radius: 12px;
      }

      .react-calendar-modern .react-calendar__tile--now {
        background: linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(168, 85, 247, 0.3));
        border: 2px solid #3b82f6;
      }
    `}</style>
    </>
  );
}
