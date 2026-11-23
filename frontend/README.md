# MediQueue - Smart Hospital Queue Management System

A modern, responsive, role-based **Smart Hospital Queue Management System** web application with **Super Admin Multi-Hospital Governance**, **Admin Verification System**, and **Strict 1-to-1 Hospital-Admin Mapping**.

---

## 🌟 Visual Portals & Role Hierarchy

1. 👑 **Super Admin Dashboard (`/super-admin`)** — **Amber/Gold Accent (`#f59e0b` / `#d97706`)**
   - Central National Health Authority.
   - Manages all registered hospitals and hospital administrators nationwide.
   - Enforces strict 1-to-1 mapping and verifies new admin credentials.
2. 🟣 **Hospital Admin Dashboard (`/admin`)** — **Purple Accent (`#7c3aed`)**
   - Single-hospital OPD management (Doctors, Departments, Queue Tokens, Hospital Settings).
   - **Verification Gate**: Access is locked with a "Verification Pending / Access Restricted" screen until approved by Super Admin.
3. 🔵 **Doctor Dashboard (`/doctor`)** — **Healthcare Blue Accent (`#2563eb`)**
   - Doctor consultation desk, patient medical history, queue caller, and weekly availability schedule.
4. 🟢 **Patient / User Dashboard (`/patient`)** — **Emerald Green Accent (`#10b981`)**
   - Patient waiting lounge, online OPD booking with confetti celebration, live queue tracker, and token wait estimation.

---

## 📋 Super Admin & Verification System Architecture

### 1. Database Schema Design (Mongoose / Relational Model)

```javascript
// Hospital Schema
const HospitalSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  code: { type: String, required: true, unique: true, uppercase: true }, // e.g. CCH-01
  city: { type: String, required: true },
  beds: { type: Number, default: 100 },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'HospitalAdmin',
    unique: true, // STRICT 1-TO-1 MAPPING CONSTRAINT
    sparse: true  // Allows unassigned hospitals
  },
  status: { type: String, enum: ['Active', 'Suspended'], default: 'Active' }
}, { timestamps: true });

// Hospital Admin Schema
const HospitalAdminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String, required: true },
  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
    required: true,
    unique: true // STRICT 1-TO-1: One admin cannot manage multiple hospitals
  },
  verificationStatus: {
    type: String,
    enum: ['Pending', 'Verified', 'Rejected'],
    default: 'Pending' // INITIAL STATE UPON REGISTRATION
  },
  licenseNumber: { type: String, required: true },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'SuperAdmin', default: null },
  verifiedAt: { type: Date, default: null },
  rejectionReason: { type: String, default: null }
}, { timestamps: true });
```

---

### 2. Backend Validation Rules (Strict 1-to-1 Mapping Engine)

1. **Hospital Assignment Rule (1 Admin Max)**:
   - When assigning an administrator to `hospitalId`, check:
     ```javascript
     const occupied = await HospitalAdmin.findOne({ 
       hospital: hospitalId, 
       verificationStatus: { $ne: 'Rejected' } 
     });
     if (occupied) {
       return res.status(409).json({ 
         error: 'Strict 1-to-1 Mapping Violation: Hospital already has an assigned administrator.' 
       });
     }
     ```
2. **Admin Single-Hospital Rule (1 Hospital Max)**:
   - When registering an admin email:
     ```javascript
     const existingAdmin = await HospitalAdmin.findOne({ email });
     if (existingAdmin) {
       return res.status(409).json({ 
         error: 'Strict 1-to-1 Mapping Violation: Administrator is already assigned to another hospital.' 
       });
     }
     ```
3. **Verification Security Gate (Middleware)**:
   - Protects hospital OPD endpoints:
     ```javascript
     export const requireVerifiedAdmin = async (req, res, next) => {
       const admin = await HospitalAdmin.findOne({ _id: req.user.id });
       if (!admin || admin.verificationStatus !== 'Verified') {
         return res.status(403).json({
           error: 'Access Restricted: Hospital Admin pending verification by Super Admin.',
           status: admin?.verificationStatus || 'Pending'
         });
       }
       req.hospitalId = admin.hospital;
       next();
     };
     ```

---

### 3. Verification Lifecycle & UI Flow

```
[New Hospital Admin Registration]
              │
              ▼
    (Initial Status: "Pending")
              │
              ├──► [Admin logs into /admin] ──► Shows "Verification Pending" Locked View
              │                                 (OPD features restricted)
              │
              ▼
[Super Admin inspects credentials at /super-admin]
              │
       ┌──────┴──────┐
       ▼             ▼
  [Approve]       [Reject]
       │             │
       ▼             ▼
Status: Verified  Status: Rejected
(Full OPD access) (Access Blocked with Rejection Note)
```

---

## 🛠️ Testing Verification & 1-to-1 Mapping

Quick demo accounts are pre-configured:
1. **Super Admin**: `superadmin@mediqueue.gov.in`
   - Open `/super-admin` or click **Super Admin** on the Landing Page / Navbar.
   - View all 5 hospitals and 3 admins.
   - Go to **Admin Verification** to Approve or Reject pending administrators.
   - Go to **Strict 1-to-1 Mapping** to view or assign admins.
2. **Hospital Admins**:
   - `admin@citycare.com` (**Verified**): Full access to City Care Hospital dashboard.
   - `vikram.admin@metrolife.com` (**Pending**): Demonstrates the restricted verification lockout screen!
   - `suresh@apexcare.com` (**Rejected**): Shows the rejection notice with reason.
   - Switch easily using the **Demo Admin User** switcher in the Navbar dropdown.

---

## 💻 Running the Project

```powershell
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.
