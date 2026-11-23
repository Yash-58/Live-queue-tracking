# MediQueue - Smart Hospital Queue Management System

A modern, role-based healthcare web application with automated queue management, estimated waiting times, digital tokens, strict 1-to-1 hospital administrator governance, and a centralized Super Admin oversight system.

## Project Structure
```
MediQueue/
├── frontend/                # React.js + Vite + Tailwind CSS Frontend
│   ├── src/
│   │   ├── components/      # Common UI components (Navbar, Sidebar, StatCard, etc.)
│   │   ├── pages/           # Role-based dashboards (Patient, Doctor, Admin, Super Admin)
│   │   ├── context/         # AppContext (State management & local storage fallback)
│   │   ├── services/        # Axios API client
│   │   └── data/            # Realistic sample healthcare data
│   ├── package.json
│   └── vite.config.js
│
├── backend/                 # Node.js + Express + MongoDB + Socket.IO Backend
│   ├── config/              # MongoDB connection
│   ├── models/              # Mongoose models (User, Hospital, HospitalAdmin, Doctor, etc.)
│   ├── middleware/          # JWT auth, strict verifyAdmin guard, error handling
│   ├── controllers/         # Role-based controllers
│   ├── routes/              # Express REST endpoints
│   ├── socket/              # Socket.IO real-time queue synchronization
│   ├── seed.js              # Database seed script
│   ├── server.js            # Express server entry point
│   └── package.json
│
├── package.json             # Root monorepo scripts
└── .gitignore               # Multi-level gitignore
```

---

## Quick Start

### 1. Run the Frontend
```bash
cd frontend
npm run dev
```
Open [http://localhost:5173/](http://localhost:5173/) to explore:
- **Landing Page**: `/`
- **Patient Dashboard**: `/patient`
- **Doctor Consultation Desk**: `/doctor`
- **Hospital Admin Dashboard**: `/admin`
- **Super Admin Central Portal**: `/super-admin`

### 2. Run the Backend (API & Sockets)
```bash
cd backend
npm install
npm run seed      # (Optional) Populates sample hospitals, admins & doctors
npm run dev       # Starts server on port 5000
```

### 3. Root Commands (From project root)
- `npm run dev:frontend` - Starts Vite dev server
- `npm run dev:backend`  - Starts Express backend server
- `npm run build:frontend` - Creates optimized production build
- `npm run seed:backend` - Populates MongoDB with realistic data
