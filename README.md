# FamHealth — Connecting Families to Health Services

[FamHealth](https://famhealthlife.netlify.app/) is a **full-stack health and wellness platform** built using the **MERN stack (MongoDB, Express, React, Node.js)**.  
It empowers families and communities by connecting them with health services, nearby hospitals, and emergency support in real time.

---

## Core Features

### User System
- Secure **JWT authentication** (register, login, logout)
- User **profile management** with photo uploads (via **Cloudinary**)
- Role-based access for members, doctors, and admins

### Emergency SOS
- Real-time **GPS tracking** using browser geolocation
- Fetches **nearest hospitals** using **OpenStreetMap Overpass API**
- One-tap **SOS alert** sends distress signal + location to backend
- Direct **Google Maps navigation links** to hospitals

### Aivana Chat (AI Assistant)
- Built-in **AI health assistant** that answers user health queries
- React component integrated in-app (AivanaChat)

### Wellness Content
- All media stored securely in **Cloudinary**
- Accessible from both desktop and mobile devices

### Member Dashboard
- Personalized dashboard for each family member
- Profile picture, health info, and emergency features in one place
- Fully responsive and optimized for small screens

---

## Tech Stack

| Category | Technology |
|-----------|-------------|
| **Frontend** | React (Vite) + TailwindCSS |
| **Backend** | Node.js + Express.js |
| **Database** | MongoDB (Mongoose ORM) |
| **Media Storage** | Cloudinary |
| **Maps & Location** | Leaflet + Overpass API + Google Maps |
| **Auth** | JSON Web Tokens (JWT) |
| **Deployment** | Render / Vercel / Railway |

---

## Setup Guide

### Prerequisites
You’ll need:
- **Node.js (v18+)**
- **MongoDB** installed locally or a cloud instance (MongoDB Atlas)
- **Cloudinary account** for media uploads

---

### Clone the Project
```bash
git clone hhtps://github.com/DANKlEIN117/FamHealth.git
cd FamHealth
cd backend
npm install
npm install -D nodemon
npm run dev

Create .env file
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

The server will start at: http://localhost:5000


cd frontend
npm install
npm start

The server will open at: http://localhost:3000
```
### Deployment
FamHealth was deployed easily using:
Frontend: Netlify
Backend: Render
Database: MongoDB Atlas
