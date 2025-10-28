import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AivanaChat from "../components/AivanaChat";

const EmergencyPage = () => {
  const [position, setPosition] = useState(null);
  const [hospitals, setHospitals] = useState([]);

  // Use browser geolocation
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
  (pos) => {
    const { latitude, longitude } = pos.coords;
    console.log("Precise location:", latitude, longitude);
    setPosition([latitude, longitude]);
    fetchHospitals(latitude, longitude);
  },
  (err) => {
    console.error(err);
    alert("Unable to get your precise location. Please enable GPS.");
  },
  { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
 // ✅ add this option
);

  }, []);

  // Fetch nearby hospitals from OpenStreetMap
  const fetchHospitals = async (lat, lon) => {
    try {
      const query = `
        [out:json];
        node["amenity"="hospital"](around:7000, ${lat}, ${lon});
        out;
      `;
      const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
      const res = await axios.get(url);
      const hospitalsData = res.data.elements.map((el) => ({
        id: el.id,
        name: el.tags.name || "Unnamed Hospital",
        lat: el.lat,
        lon: el.lon,
      }));
      setHospitals(hospitalsData);
    } catch (error) {
      console.error("Error fetching hospitals:", error);
    }
  };

  const userIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    iconSize: [40, 40],
  });

  const hospitalIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/2966/2966327.png",
    iconSize: [35, 35],
  });

  return (
    <>
    <Navbar />
    <div className="h-screen w-full">
      <h2 className="text-center text-2xl font-bold p-4">
        Emergency — Nearest Hospitals
      </h2>

      {position ? (
        <MapContainer center={position} zoom={13} className="h-[90vh] w-full">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          />

          <Marker position={position} icon={userIcon}>
            <Popup>You are here</Popup>
          </Marker>

          {hospitals.map((h) => (
            <Marker key={h.id} position={[h.lat, h.lon]} icon={hospitalIcon}>
              <Popup>
                🏥 {h.name}
                <br />
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${h.lat},${h.lon}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Get Directions
                </a>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      ) : (
        <p className="text-center text-gray-600 mt-10">Fetching your location...</p>
      )}
    </div>
    <AivanaChat />
    <Footer />
    </>
  );
};

export default EmergencyPage;
