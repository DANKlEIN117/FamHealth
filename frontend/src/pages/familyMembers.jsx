import { useState, useEffect } from "react";
import API from "../api";

export default function FamilyMembers() {
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState({ name: "", age: "", relation: "", healthStatus: "" });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/members", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMembers(res.data);
    } catch (err) {
      console.error("Failed to fetch members:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      if (editingId) {
        await API.put(`/members/${editingId}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await API.post("/members", form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setForm({ name: "", age: "", relation: "", healthStatus: "" });
      setEditingId(null);
      fetchMembers();
    } catch (err) {
      console.error("Error adding/updating member:", err);
    }
  };

  const handleEdit = (member) => {
    setForm(member);
    setEditingId(member._id);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await API.delete(`/members/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchMembers();
    } catch (err) {
      console.error("Error deleting member:", err);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-8 bg-blue-50 rounded-xl shadow-xl">
      <h1 className="text-2xl font-bold text-center text-blue-700">
        👨‍👩‍👧 Family Members
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 justify-center">
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="p-2 border rounded-lg"
        />
        <input
          type="number"
          placeholder="Age"
          value={form.age}
          onChange={(e) => setForm({ ...form, age: e.target.value })}
          className="p-2 border rounded-lg"
        />
        <input
          type="text"
          placeholder="Relation"
          value={form.relation}
          onChange={(e) => setForm({ ...form, relation: e.target.value })}
          className="p-2 border rounded-lg"
        />
        <input
          type="text"
          placeholder="Health Status"
          value={form.healthStatus}
          onChange={(e) => setForm({ ...form, healthStatus: e.target.value })}
          className="p-2 border rounded-lg"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {editingId ? "Update Member" : "Add Member"}
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map((m) => (
          <div key={m._id} className="p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-lg font-bold">{m.name}</h2>
            <p>Age: {m.age}</p>
            <p>Relation: {m.relation}</p>
            <p>Status: {m.healthStatus}</p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => handleEdit(m)}
                className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(m._id)}
                className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
