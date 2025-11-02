import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
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
      <div className="h-screen w-full">
        <div className="p-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Emergency — Nearest Hospitals</h2>

          <div className="flex items-center gap-3">
            <button
              onClick={() => sendSOS(hospitals[0] ?? null)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-lg"
              disabled={sosSending || !position}
            >
              {sosSending ? "Sending SOS..." : "Send SOS Now 🚨"}
            </button>
          </div>
        </div>

        {loading && <div className="px-4"><Spinner /></div>}

        {error && <p className="text-center text-red-500">{error}</p>}
        {msg && <p className="text-center text-green-600">{msg}</p>}

        <div className="md:flex md:gap-4 p-4">
          <div className="md:w-2/3 h-[70vh]">
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
                  <Popup>You are here</Popup>
                </Marker>
                {hospitals.map(h => (
                  <Marker key={h.id} position={[h.lat, h.lon]} icon={hospitalIcon}>
                    <Popup>
                      <div className="text-left">
                        <strong>🏥 {h.name}</strong>
                        <div>{h.distanceKm} km</div>
                        <a
                          className="text-blue-600 underline"
                          target="_blank"
                          rel="noreferrer"
                          href={`https://www.google.com/maps/dir/?api=1&destination=${h.lat},${h.lon}`}
                        >
                          Directions
                        </a>
                        <div className="mt-2">
                          <button
                            onClick={() => sendSOS(h)}
                            className="bg-red-500 text-white px-2 py-1 rounded"
                          >
                            Send SOS to this hospital
                          </button>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            ) : (
              <p className="text-center text-gray-600 mt-10">Fetching your location...</p>
            )}
          </div>

          <aside className="md:w-1/3 mt-4 md:mt-0">
            <div className="bg-white rounded-xl shadow p-4 h-[60vh] md:h-[70vh] overflow-y-auto mb-24 md:mb-0">

              <h3 className="font-semibold mb-2">Nearest hospitals</h3>
              {hospitals.length === 0 ? (
                <p className="text-sm text-gray-500">No hospitals found nearby.</p>
              ) : (
                hospitals.map(h => (
                  <div key={h.id} className="mb-3 border-b pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">{h.name}</div>
                        <div className="text-xs text-gray-500">{h.distanceKm} km away</div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <a
                          className="text-sm underline"
                          target="_blank"
                          rel="noreferrer"
                          href={`https://www.google.com/maps/dir/?api=1&destination=${h.lat},${h.lon}`}
                        >
                          Directions
                        </a>
                        <button
                          onClick={() => sendSOS(h)}
                          className="text-sm bg-red-500 text-white px-2 py-1 rounded"
                        >
                          SOS
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </aside>
        </div>
      </div>

      <AivanaChat />
      <Footer />
    </>
  );
}
