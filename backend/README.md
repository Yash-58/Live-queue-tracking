# MediQueue - Smart Hospital Queue Management System Backend

Full-featured RESTful API and real-time Socket.IO backend for the MediQueue Smart Hospital Queue Management System with role-based access control (Super Admin, Hospital Admin, Doctor, Patient).

## Features
- **Central Super Admin Control**: Multi-hospital registration and nationwide oversight.
- **Hospital Admin Verification System**: Newly registered hospital admins start in `Pending` state. Only `Verified` admins are granted access to hospital OPD management.
- **Strict 1-to-1 Mapping**:
  - Each hospital can only have 1 administrator (1-to-1 unique constraint).
  - Each administrator can only be assigned to 1 hospital.
- **Real-Time Queue Management**: Live Socket.IO event synchronization for digital tokens, currently serving patient, and estimated wait times.
- **Role-based JWT Security**: BCrypt password hashing, route protection middleware, and verification guards.

---

## Setup & Running

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment (.env)
Create a `.env` file in the `backend/` folder (or copy from `.env.example`):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mediqueue
JWT_SECRET=mediqueue_super_secret_jwt_key_2026_production
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### 3. Seed Sample Data (Optional)
```bash
npm run seed
```

### 4. Start Server
- Development mode (with auto-reload):
  ```bash
  npm run dev
  ```
- Production mode:
  ```bash
  npm start
  ```

---

## Default Seed Accounts
| Role | Email | Password | Status |
|---|---|---|---|
| **Super Admin** | `superadmin@mediqueue.gov.in` | `SuperAdmin@123` | Verified |
| **Hospital Admin (Verified)** | `ramesh.gupta@citycare.org` | `AdminPassword@123` | Verified (City Care Hospital) |
| **Hospital Admin (Pending)** | `sunita.mehra@apexmemorial.org` | `AdminPassword@123` | Pending (Apex Memorial) |
| **Hospital Admin (Rejected)** | `anil.deshmukh@metrohealth.in` | `AdminPassword@123` | Rejected (Metro Health) |
| **Doctor** | `doctor@citycare.com` | `DoctorPassword@123` | Verified (Cardiology) |
| **Patient** | `rahulverma@gmail.com` | `PatientPassword@123` | Active |

---

## API Endpoints Reference

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Register Patient or Hospital Admin (with 1-to-1 mapping checks)
- `POST /api/auth/login` - Authenticate & obtain JWT
- `GET /api/auth/me` - Get current user profile & role

### Super Admin (`/api/super-admin`) [Requires `super_admin` token]
- `GET /api/super-admin/hospitals` - List all hospitals & their assigned admin
- `POST /api/super-admin/hospitals` - Register a new hospital
- `DELETE /api/super-admin/hospitals/:id` - Delete hospital
- `GET /api/super-admin/admins` - List all hospital admins & verification status
- `POST /api/super-admin/assign-admin` - Assign admin to hospital (Strict 1-to-1 validation)
- `POST /api/super-admin/unassign-admin/:adminId` - Release / unassign admin
- `PUT /api/super-admin/admins/:id/verify` - Approve & verify hospital admin
- `PUT /api/super-admin/admins/:id/reject` - Reject hospital admin with reason

### Hospital Admin (`/api/admin`) [Requires `admin` token + `Verified` status]
- `GET /api/admin/overview` - Hospital overview stats & wait times
- `GET /api/admin/doctors` - Get doctors in hospital
- `POST /api/admin/doctors` - Add new doctor
- `DELETE /api/admin/doctors/:id` - Remove doctor
- `GET /api/admin/departments` - Get hospital departments
- `POST /api/admin/departments` - Add department
- `DELETE /api/admin/departments/:id` - Remove department
- `GET /api/admin/appointments` - Filter appointments
- `GET /api/admin/patients` - Hospital patient registry

### Doctor (`/api/doctor`) [Requires `doctor` token]
- `GET /api/doctor/queue` - Today's live queue, waiting list, and statistics
- `PUT /api/doctor/appointments/:id/start` - Call token & begin consultation
- `PUT /api/doctor/appointments/:id/complete` - Complete consultation & save notes
- `PUT /api/doctor/appointments/:id/skip` - Skip patient
- `PUT /api/doctor/availability` - Save weekly working hours

### Patient (`/api/patient`) [Requires `patient` token]
- `POST /api/patient/appointments` - Book appointment & auto-generate digital token
- `GET /api/patient/appointments` - Patient's appointments (Upcoming, Completed, Cancelled)
- `PUT /api/patient/appointments/:id/cancel` - Cancel appointment
- `GET /api/patient/notifications` - Patient notifications

### Live Queue (`/api/queue`)
- `GET /api/queue/live` - Public live queue tracker (Serving token, wait time, queue list)
