import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AivanaChat from "../components/AivanaChat";


const Emergency = () => {
  useEffect(() => {
    // Load Google Maps Script dynamically
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = initMap;
    document.body.appendChild(script);

    function initMap() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;

            // Create map centered on user's location
            const map = new window.google.maps.Map(document.getElementById("map"), {
              center: { lat: latitude, lng: longitude },
              zoom: 14,
            });

            // Add user marker
            new window.google.maps.Marker({
              position: { lat: latitude, lng: longitude },
              map,
              title: "You are here",
              icon: {
                url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
              },
            });

            // Search for nearby hospitals
            const service = new window.google.maps.places.PlacesService(map);
            const request = {
              location: { lat: latitude, lng: longitude },
              radius: 5000,
              type: ["hospital"],
            };

            service.nearbySearch(request, (results, status) => {
              if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                for (let i = 0; i < results.length; i++) {
                  const place = results[i];
                  new window.google.maps.Marker({
                    map,
                    position: place.geometry.location,
                    title: place.name,
                    icon: {
                      url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                    },
                  });
                }
              }
            });
          },
          () => {
            alert("Unable to access your location. Please enable GPS.");
          }
        );
      } else {
        alert("Geolocation is not supported by this browser.");
      }
    }
  }, []);

  return (
    <>
        <Navbar />
        <div className="p-4">
        <h1 className="text-2xl font-bold text-center mb-4 text-red-600">
            🚨 Emergency Help - Find Nearest Hospitals
        </h1>
        <div
            id="map"
            className="w-full h-[80vh] rounded-lg shadow-lg border border-gray-300"
        ></div>
        </div>
        <AivanaChat />
        <Footer />
    </>
  );
};

export default Emergency;
