import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import Navbar from "../components/Navbar";
import AivanaChat from "../components/AivanaChat";
import Spinner from "../components/Spinner";
import API from "../api";

// small helper to re-center map when position changes
function Recenter({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.setView(position, 13);
  }, [position, map]);
  return null;
}

const userIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
  iconSize: [40, 40],
});

const hospitalIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/2966/2966327.png",
  iconSize: [35, 35],
});

export default function EmergencyPage() {
  const [position, setPosition] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sosSending, setSosSending] = useState(false);
  const [msg, setMsg] = useState(null);
  const [error, setError] = useState(null);
  const mapRef = useRef(null);

  // get precise position
  useEffect(() => {
    setLoading(true);
    if (!navigator.geolocation) {
      setError("Geolocation not supported by your browser.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        console.log("Precise location:", latitude, longitude);
        setPosition([latitude, longitude]);
        fetchHospitals(latitude, longitude);
      },
      (err) => {
        console.error(err);
        setError("Unable to get your precise location. Please enable GPS.");
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  }, []);

  // fetch hospitals using Overpass
  const fetchHospitals = async (lat, lon) => {
    try {
      setLoading(true);
      const query = `
        [out:json][timeout:25];
        (
          node["amenity"="hospital"](around:8000, ${lat}, ${lon});
          way["amenity"="hospital"](around:8000, ${lat}, ${lon});
          relation["amenity"="hospital"](around:8000, ${lat}, ${lon});
        );
        out center;
      `;
      const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(
        query
      )}`;
      const res = await axios.get(url);
      const elements = res.data.elements || [];

      const mapped = elements.map((el) => {
        const latVal = el.lat ?? el.center?.lat;
        const lonVal = el.lon ?? el.center?.lon;
        const name = el.tags?.name || "Unnamed Hospital";
        return {
          id: el.id,
          name,
          lat: latVal,
          lon: lonVal,
          tags: el.tags || {},
        };
      }).filter(h => h.lat && h.lon);

      // compute distance to each hospital
      const withDistance = mapped.map(h => ({
        ...h,
        distanceKm: haversineDistance(lat, lon, h.lat, h.lon)
      })).sort((a,b) => a.distanceKm - b.distanceKm);

      setHospitals(withDistance);
    } catch (err) {
      console.error("Error fetching hospitals:", err);
      setError("Failed to fetch nearby hospitals. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Haversine formula (km)
  const haversineDistance = (lat1, lon1, lat2, lon2) => {
    function toRad(x) { return x * Math.PI / 180; }
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return +(R * c).toFixed(2);
  };

  // Send SOS to backend (records event + optional SMS)
  const sendSOS = async (targetHospital = null) => {
    if (!position) return alert("Cannot determine your location");
    if (!window.confirm("Send SOS to emergency contacts & nearest hospital?")) return;

    setSosSending(true);
    setMsg(null);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const payload = {
        location: { lat: position[0], lon: position[1] },
        hospitals: hospitals.slice(0,5), // top 5
        targetHospital,
        note: "Emergency SOS sent from FamHealth app"
      };

      const res = await API.post("/emergency/sos", payload, config);
      setMsg(res.data.message || "SOS sent");
    } catch (err) {
      console.error("SOS error:", err);
      setError(err.response?.data?.message || "Failed to send SOS");
    } finally {
      setSosSending(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-red-50 to-pink-50 flex flex-col relative overflow-hidden">
        
        {/* Animated Background Orbs */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 bg-red-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
          <div className="absolute -bottom-32 right-0 w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        </div>

        {/* Header */}
        <div className="relative z-10 p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-r from-red-600 via-orange-600 to-red-700 text-white shadow-2xl">
          <h2 className="text-2xl md:text-3xl font-bold drop-shadow-lg">🏥 Emergency — Nearest Hospitals</h2>

          <button
            onClick={() => sendSOS(hospitals[0] ?? null)}
            className="bg-gradient-to-r from-red-700 to-red-900 hover:from-red-800 hover:to-black text-white px-6 py-3 rounded-full shadow-2xl font-bold text-lg transform hover:scale-110 hover:shadow-red-500/50 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed animate-pulse"
            disabled={sosSending || !position}
          >
            {sosSending ? "🚨 Sending SOS..." : "🚨 Send SOS Now"}
          </button>
        </div>

        {loading && <div className="relative z-10 px-4 mt-6"><Spinner /></div>}

        {error && <p className="relative z-10 text-center text-red-600 font-bold text-lg mt-4 backdrop-blur bg-red-100/80 py-3 rounded-lg mx-4">⚠️ {error}</p>}
        {msg && <p className="relative z-10 text-center text-green-600 font-bold text-lg mt-4 backdrop-blur bg-green-100/80 py-3 rounded-lg mx-4">✅ {msg}</p>}

        <div className="relative z-10 flex-grow md:flex md:gap-4 p-4 overflow-hidden">
          <div className="md:w-2/3 h-[70vh] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/50 backdrop-blur-sm">
            {position ? (
              <MapContainer
                center={position}
                zoom={13}
                className="h-full w-full"
                whenCreated={map => (mapRef.current = map)}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; OpenStreetMap contributors'
                />
                <Recenter position={position} />
                <Marker position={position} icon={userIcon}>
                  <Popup>
                    <div className="font-bold text-blue-600">📍 You are here</div>
                  </Popup>
                </Marker>
                {hospitals.map(h => (
                  <Marker key={h.id} position={[h.lat, h.lon]} icon={hospitalIcon}>
                    <Popup>
                      <div className="text-left space-y-3">
                        <strong className="text-lg text-red-600">🏥 {h.name}</strong>
                        <div className="text-sm font-semibold text-gray-700">📏 {h.distanceKm} km away</div>
                        <a
                          className="text-blue-600 underline font-semibold hover:text-blue-800 block"
                          target="_blank"
                          rel="noreferrer"
                          href={`https://www.google.com/maps/dir/?api=1&destination=${h.lat},${h.lon}`}
                        >
                          🗺️ Get Directions
                        </a>
                        <button
                          onClick={() => sendSOS(h)}
                          className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-2 rounded-lg font-bold hover:shadow-lg transform hover:scale-105 transition"
                        >
                          🚨 Send SOS
                        </button>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                <p className="text-gray-600 font-semibold text-lg">📍 Fetching your location...</p>
              </div>
            )}
          </div>

          <aside className="md:w-1/3 mt-4 md:mt-0">
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 h-[60vh] md:h-[70vh] overflow-y-auto border border-white/30">

              <h3 className="font-bold text-xl mb-4 text-gray-800 bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">🏥 Nearest Hospitals</h3>
              {hospitals.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-8">No hospitals found nearby.</p>
              ) : (
                hospitals.map((h, idx) => (
                  <div key={h.id} className="mb-4 border-b-2 border-gradient-to-r from-red-200 to-orange-200 pb-4 hover:bg-red-50/50 p-3 rounded-xl transition duration-300">
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-grow">
                        <div className="font-bold text-gray-800 text-lg">{idx + 1}. {h.name}</div>
                        <div className="text-xs text-gray-600 font-semibold mt-1">📏 {h.distanceKm} km away</div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <a
                          className="text-sm text-blue-600 underline font-bold hover:text-blue-800"
                          target="_blank"
                          rel="noreferrer"
                          href={`https://www.google.com/maps/dir/?api=1&destination=${h.lat},${h.lon}`}
                        >
                          🗺️
                        </a>
                        <button
                          onClick={() => sendSOS(h)}
                          className="text-sm bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1.5 rounded-lg font-bold hover:shadow-lg transform hover:scale-105 transition"
                        >
                          🚨
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <AivanaChat />
          </aside>
        </div>
      </div>

      
    </>
  );
}
