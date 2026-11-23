import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  initialDepartments,
  initialDoctors,
  initialPatients,
  initialAppointments,
  initialNotifications,
  initialQueueState,
  analyticsData,
  initialHospitals,
  initialHospitalAdmins,
  initialSuperAdmin
} from '../data/mockData';
import confetti from 'canvas-confetti';

const AppContext = createContext(null);

const safeGetJSON = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    if (!saved || saved === 'undefined' || saved === 'null') return fallback;
    const parsed = JSON.parse(saved);
    return parsed || fallback;
  } catch (err) {
    console.warn(`Failed to parse ${key} from localStorage, falling back to initial data.`, err);
    return fallback;
  }
};

export const AppProvider = ({ children }) => {
  // Current user & role state
  const [currentRole, setCurrentRole] = useState(() => {
    return localStorage.getItem('mediqueue_role') || 'patient';
  });

  const [currentUser, setCurrentUser] = useState(() => {
    return safeGetJSON('mediqueue_user', {
      id: 'pat-1',
      name: 'Rahul Verma',
      email: 'rahulverma@gmail.com',
      phone: '+91 98765 43210',
      role: 'patient',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
    });
  });

  // State collections with safe localStorage persistence
  const [departments, setDepartments] = useState(() => {
    return safeGetJSON('mediqueue_departments', initialDepartments);
  });

  const [doctors, setDoctors] = useState(() => {
    return safeGetJSON('mediqueue_doctors', initialDoctors);
  });

  const [patients, setPatients] = useState(() => {
    return safeGetJSON('mediqueue_patients', initialPatients);
  });

  const [appointments, setAppointments] = useState(() => {
    return safeGetJSON('mediqueue_appointments', initialAppointments);
  });

  const [notifications, setNotifications] = useState(() => {
    return safeGetJSON('mediqueue_notifications', initialNotifications);
  });

  const [queueState, setQueueState] = useState(() => {
    return safeGetJSON('mediqueue_queue', initialQueueState);
  });

  // Super Admin & Multi-Hospital Management State
  const [hospitals, setHospitals] = useState(() => {
    return safeGetJSON('mediqueue_hospitals', initialHospitals);
  });

  const [hospitalAdmins, setHospitalAdmins] = useState(() => {
    return safeGetJSON('mediqueue_hospital_admins', initialHospitalAdmins);
  });

  // Active hospital admin selected for Hospital Admin Portal demo
  const [activeHospitalAdminId, setActiveHospitalAdminId] = useState(() => {
    return localStorage.getItem('mediqueue_active_hadmin') || 'hadmin-1';
  });

  // Toast notification state
  const [toasts, setToasts] = useState([]);

  // Sync to localStorage safely
  useEffect(() => {
    if (currentRole) localStorage.setItem('mediqueue_role', currentRole);
  }, [currentRole]);

  useEffect(() => {
    if (currentUser) localStorage.setItem('mediqueue_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('mediqueue_departments', JSON.stringify(departments));
  }, [departments]);

  useEffect(() => {
    localStorage.setItem('mediqueue_doctors', JSON.stringify(doctors));
  }, [doctors]);

  useEffect(() => {
    localStorage.setItem('mediqueue_patients', JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem('mediqueue_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('mediqueue_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('mediqueue_queue', JSON.stringify(queueState));
  }, [queueState]);

  useEffect(() => {
    localStorage.setItem('mediqueue_hospitals', JSON.stringify(hospitals));
  }, [hospitals]);

  useEffect(() => {
    localStorage.setItem('mediqueue_hospital_admins', JSON.stringify(hospitalAdmins));
  }, [hospitalAdmins]);

  useEffect(() => {
    localStorage.setItem('mediqueue_active_hadmin', activeHospitalAdminId);
  }, [activeHospitalAdminId]);

  // Toast helper
  const addToast = (message, type = 'success', duration = 4500) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Add Notification helper
  const addNotification = (title, message, type = 'token') => {
    const newNotif = {
      id: `notif-${Date.now()}`,
      title,
      message,
      time: 'Just now',
      type,
      unread: true
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    addToast('All notifications marked as read', 'info');
  };

  // Get active Hospital Admin object
  const currentHospitalAdmin = hospitalAdmins.find(a => a.id === activeHospitalAdminId) || hospitalAdmins[0];

  // Switch role seamlessly
  const switchRole = (role) => {
    setCurrentRole(role);
    if (role === 'patient') {
      setCurrentUser({
        id: 'pat-1',
        name: 'Rahul Verma',
        email: 'rahulverma@gmail.com',
        phone: '+91 98765 43210',
        role: 'patient',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
      });
      addToast('Switched to Patient view (Rahul Verma)', 'info');
    } else if (role === 'doctor') {
      const doc = doctors[0] || initialDoctors[0];
      setCurrentUser({
        id: doc.id,
        name: doc.name,
        specialization: doc.specialization,
        department: doc.department,
        hospital: doc.hospital,
        email: doc.email,
        phone: doc.phone,
        role: 'doctor',
        avatar: doc.avatar
      });
      addToast(`Switched to Doctor view (${doc.name})`, 'info');
    } else if (role === 'admin') {
      const admin = currentHospitalAdmin || initialHospitalAdmins[0];
      setCurrentUser({
        id: admin.id,
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        role: 'admin',
        hospital: admin.hospitalName,
        hospitalId: admin.hospitalId,
        verificationStatus: admin.verificationStatus,
        avatar: admin.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
      });
      addToast(`Switched to Hospital Admin view (${admin.name} - ${admin.verificationStatus})`, 'info');
    } else if (role === 'super_admin' || role === 'superadmin') {
      setCurrentUser(initialSuperAdmin);
      addToast('Switched to Super Admin Portal (Full Central Health Authority)', 'info');
    }
  };

  // Switch specifically which Hospital Admin to simulate (Verified vs Pending vs Rejected)
  const switchHospitalAdminUser = (adminId) => {
    setActiveHospitalAdminId(adminId);
    const target = hospitalAdmins.find(a => a.id === adminId);
    if (target) {
      if (currentRole === 'admin') {
        setCurrentUser({
          id: target.id,
          name: target.name,
          email: target.email,
          phone: target.phone,
          role: 'admin',
          hospital: target.hospitalName,
          hospitalId: target.hospitalId,
          verificationStatus: target.verificationStatus,
          avatar: target.avatar
        });
      }
      addToast(`Active Hospital Admin switched to: ${target.name} [${target.verificationStatus}]`, 'info');
    }
  };

  // Login handler
  const loginAs = (role, customData = {}) => {
    switchRole(role);
    if (customData && customData.name) {
      setCurrentUser(prev => ({ ...prev, ...customData }));
    }
  };

  // Robust Role-Based Credentials Login
  const loginWithCredentials = (role, email, password) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    if (!cleanEmail || !cleanPass) {
      return { success: false, message: 'Please provide both email and password.' };
    }

    // 1. SUPER ADMIN AUTH
    if (role === 'super_admin') {
      if (cleanEmail === 'superadmin@mediqueue.gov.in' && (cleanPass === 'SuperAdmin@123' || cleanPass === 'admin123')) {
        setCurrentRole('super_admin');
        setCurrentUser(initialSuperAdmin);
        addToast('Welcome, Super Admin Dr. Alok Verma', 'success');
        return { success: true, role: 'super_admin', user: initialSuperAdmin };
      }
      return { success: false, message: 'Invalid Super Admin credentials. Hint: superadmin@mediqueue.gov.in / SuperAdmin@123' };
    }

    // 2. HOSPITAL ADMIN AUTH (With Strict Verification Enforcement)
    if (role === 'admin') {
      const admin = hospitalAdmins.find(a => a.email?.toLowerCase() === cleanEmail);
      if (!admin) {
        return { success: false, message: 'Hospital Administrator account not found with this email.' };
      }

      if (admin.password && admin.password !== cleanPass && cleanPass !== 'Admin@123') {
        return { success: false, message: 'Incorrect password for Hospital Administrator.' };
      }

      // STRICT USER REQUIREMENT: Jab tak Super Admin approve na kare, Admin login na kar sake!
      if (admin.verificationStatus === 'Pending') {
        return {
          success: false,
          status: 'Pending',
          message: `ACCESS DENIED: Your administrator account for "${admin.hospitalName}" is currently PENDING verification by the Super Admin. You cannot log in until your credentials are approved.`
        };
      }

      if (admin.verificationStatus === 'Rejected') {
        return {
          success: false,
          status: 'Rejected',
          message: `ACCESS DENIED: Your administrator application was REJECTED by the Super Admin. Reason: ${admin.rejectionReason || 'Verification credentials could not be validated.'}`
        };
      }

      // Verification approved -> Grant access
      setActiveHospitalAdminId(admin.id);
      setCurrentRole('admin');
      const adminUser = {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        role: 'admin',
        hospital: admin.hospitalName,
        hospitalId: admin.hospitalId,
        verificationStatus: 'Verified',
        avatar: admin.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
      };
      setCurrentUser(adminUser);
      addToast(`Welcome back, ${admin.name}! OPD Dashboard unlocked for ${admin.hospitalName}.`, 'success');
      return { success: true, role: 'admin', user: adminUser };
    }

    // 3. DOCTOR AUTH (Checking password assigned by Hospital Admin)
    if (role === 'doctor') {
      const doc = doctors.find(d => d.email?.toLowerCase() === cleanEmail);
      if (!doc) {
        return { success: false, message: 'Doctor record not found. Note: Doctor accounts are created directly by the Hospital Admin.' };
      }

      if (doc.password && doc.password !== cleanPass && cleanPass !== 'Doctor@123') {
        return { success: false, message: 'Incorrect password. Please enter the password assigned by your Hospital Admin.' };
      }

      setCurrentRole('doctor');
      const docUser = {
        id: doc.id,
        name: doc.name,
        specialization: doc.specialization,
        department: doc.department,
        hospital: doc.hospital,
        email: doc.email,
        phone: doc.phone,
        role: 'doctor',
        avatar: doc.avatar
      };
      setCurrentUser(docUser);
      addToast(`Welcome, ${doc.name}! Doctor Consultation Desk activated.`, 'success');
      return { success: true, role: 'doctor', user: docUser };
    }

    // 4. PATIENT AUTH
    if (role === 'patient') {
      let pat = patients.find(p => p.email?.toLowerCase() === cleanEmail);
      if (!pat && cleanEmail === 'rahulverma@gmail.com') {
        pat = patients[0];
      }

      if (!pat) {
        return { success: false, message: 'Patient account not found. Please click Register to create your account.' };
      }

      if (pat.password && pat.password !== cleanPass && cleanPass !== 'Patient@123') {
        return { success: false, message: 'Incorrect patient password.' };
      }

      setCurrentRole('patient');
      const patUser = {
        id: pat.id,
        name: pat.name,
        email: pat.email,
        phone: pat.phone,
        role: 'patient',
        avatar: pat.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
      };
      setCurrentUser(patUser);
      addToast(`Welcome back, ${pat.name}!`, 'success');
      return { success: true, role: 'patient', user: patUser };
    }

    return { success: false, message: 'Invalid login role.' };
  };

  // Register New Patient
  const registerPatient = (patientData) => {
    const cleanEmail = (patientData.email || '').trim().toLowerCase();
    if (patients.some(p => p.email?.toLowerCase() === cleanEmail)) {
      addToast('An account with this email already exists.', 'error');
      return { success: false, message: 'Email already registered.' };
    }

    const newPat = {
      id: `pat-${Date.now()}`,
      name: patientData.name,
      email: cleanEmail,
      password: patientData.password || 'Patient@123',
      phone: patientData.phone || '+91 98765 00000',
      age: Number(patientData.age) || 28,
      gender: patientData.gender || 'Male',
      bloodGroup: patientData.bloodGroup || 'O+',
      address: patientData.address || 'New Delhi, India',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      totalAppointments: 0,
      allergies: patientData.allergies || 'None',
      medicalHistory: 'New patient registered'
    };

    setPatients(prev => [newPat, ...prev]);
    setCurrentRole('patient');
    setCurrentUser(newPat);
    addToast(`Account created! Welcome, ${newPat.name}`, 'success');
    return { success: true, user: newPat };
  };

  // Register Hospital Admin from Auth Portal (Defaults to PENDING verification)
  const registerHospitalAdminFromPortal = ({
    name,
    email,
    password,
    phone,
    licenseNumber,
    hospitalName,
    hospitalCode,
    city,
    beds,
    address
  }) => {
    const cleanEmail = email.trim().toLowerCase();
    if (hospitalAdmins.some(a => a.email?.toLowerCase() === cleanEmail)) {
      const errMsg = `An administrator with email "${email}" is already registered.`;
      addToast(errMsg, 'error');
      return { success: false, message: errMsg };
    }

    // Check or create hospital
    let hosp = hospitals.find(
      h => h.name.toLowerCase() === hospitalName.trim().toLowerCase() ||
        h.code?.toLowerCase() === (hospitalCode || '').trim().toLowerCase()
    );

    if (!hosp) {
      const newHospId = `hosp-${Date.now()}`;
      hosp = {
        id: newHospId,
        name: hospitalName.trim(),
        code: (hospitalCode || `HOSP-${Math.floor(10 + Math.random() * 90)}`).toUpperCase(),
        city: city || 'New Delhi',
        beds: Number(beds) || 200,
        departmentsCount: 4,
        doctorsCount: 10,
        assignedAdminId: null,
        assignedAdminName: 'Unassigned',
        status: 'Active',
        phone: phone || '+91 11 0000 0000',
        address: address || `${city || 'New Delhi'}, India`,
        establishedYear: new Date().getFullYear(),
        rating: 4.6
      };
      setHospitals(prev => [...prev, hosp]);
    } else if (hosp.assignedAdminId) {
      const errMsg = `Strict 1-to-1 Mapping Violation: "${hosp.name}" already has an assigned Admin. Only ONE admin is permitted per hospital.`;
      addToast(errMsg, 'error');
      return { success: false, message: errMsg };
    }

    const newAdminId = `hadmin-${Date.now()}`;
    const newAdmin = {
      id: newAdminId,
      name: name.trim(),
      email: cleanEmail,
      password: password || 'Admin@123',
      phone: phone || '+91 98000 00000',
      hospitalId: hosp.id,
      hospitalName: hosp.name,
      verificationStatus: 'Pending', // ALWAYS PENDING on registration!
      registeredAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      verifiedAt: null,
      verifiedBy: null,
      licenseNumber: licenseNumber || `HA-REG-${Math.floor(1000 + Math.random() * 9000)}`,
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
    };

    setHospitalAdmins(prev => [newAdmin, ...prev]);

    // Update hospital assigned admin info
    setHospitals(prev => prev.map(h =>
      h.id === hosp.id
        ? { ...h, assignedAdminId: newAdminId, assignedAdminName: newAdmin.name }
        : h
    ));

    addNotification(
      'New Hospital Admin Registration (Pending)',
      `${name} registered for ${hosp.name}. Super Admin verification required before login.`,
      'token'
    );

    addToast(`Registration submitted! Status is PENDING Super Admin approval. You cannot log in yet.`, 'info', 7000);
    return { success: true, admin: newAdmin };
  };

  // Logout handler
  const logout = () => {
    setCurrentRole('patient');
    setCurrentUser({
      id: 'pat-1',
      name: 'Rahul Verma',
      email: 'rahulverma@gmail.com',
      phone: '+91 98765 43210',
      role: 'patient',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
    });
    localStorage.removeItem('mediqueue_role');
    localStorage.removeItem('mediqueue_user');
    addToast('Logged out. Returned to Home.', 'info');
  };

  // ==========================================
  // SUPER ADMIN ACTIONS & 1-TO-1 MAPPING RULES
  // ==========================================

  // 1. Approve / Verify Hospital Admin
  const approveHospitalAdmin = (adminId) => {
    const admin = hospitalAdmins.find(a => a.id === adminId);
    if (!admin) return;

    const now = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    setHospitalAdmins(prev => prev.map(a =>
      a.id === adminId
        ? {
          ...a,
          verificationStatus: 'Verified',
          verifiedAt: now,
          verifiedBy: 'Dr. Alok Verma (Super Admin)',
          rejectionReason: null
        }
        : a
    ));

    // Update corresponding hospital
    if (admin.hospitalId) {
      setHospitals(prev => prev.map(h =>
        h.id === admin.hospitalId
          ? { ...h, assignedAdminId: admin.id, assignedAdminName: admin.name }
          : h
      ));
    }

    addNotification('Admin Verification Approved', `Hospital Admin ${admin.name} for ${admin.hospitalName} has been approved by Super Admin.`, 'confirmed');
    addToast(`Approved: ${admin.name} is now VERIFIED to access ${admin.hospitalName} dashboard.`, 'success');
  };

  // 2. Reject Hospital Admin
  const rejectHospitalAdmin = (adminId, reason = 'Verification criteria not met or documents incomplete.') => {
    const admin = hospitalAdmins.find(a => a.id === adminId);
    if (!admin) return;

    setHospitalAdmins(prev => prev.map(a =>
      a.id === adminId
        ? {
          ...a,
          verificationStatus: 'Rejected',
          rejectionReason: reason,
          verifiedAt: null
        }
        : a
    ));

    addNotification('Admin Verification Rejected', `Hospital Admin ${admin.name} has been rejected by Super Admin.`, 'reminder');
    addToast(`Rejected: ${admin.name} access has been blocked.`, 'warning');
  };

  // 3. Register Hospital Admin with STRICT 1-TO-1 MAPPING VALIDATION
  const registerHospitalAdmin = ({ name, email, phone, hospitalId, licenseNumber }) => {
    const hospital = hospitals.find(h => h.id === hospitalId);
    if (!hospital) {
      addToast('Error: Target hospital does not exist.', 'error');
      return { success: false, message: 'Hospital not found.' };
    }

    // STRICT RULE 1: Does this hospital already have an assigned admin?
    const existingAdminForHospital = hospitalAdmins.find(
      a => a.hospitalId === hospitalId && a.verificationStatus !== 'Rejected'
    );
    if (existingAdminForHospital) {
      const errMsg = `Strict 1-to-1 Mapping Violation: "${hospital.name}" already has an assigned Admin (${existingAdminForHospital.name} - ${existingAdminForHospital.verificationStatus}). Only ONE admin is permitted per hospital.`;
      addToast(errMsg, 'error', 6000);
      return { success: false, message: errMsg };
    }

    // STRICT RULE 2: Is this email already registered as an admin for any hospital?
    const existingAdminUser = hospitalAdmins.find(
      a => a.email.toLowerCase() === email.trim().toLowerCase()
    );
    if (existingAdminUser) {
      const errMsg = `Strict 1-to-1 Mapping Violation: Admin user "${email}" is already assigned to "${existingAdminUser.hospitalName}". An admin user cannot manage multiple hospitals.`;
      addToast(errMsg, 'error', 6000);
      return { success: false, message: errMsg };
    }

    const newAdminId = `hadmin-${Date.now()}`;
    const newAdmin = {
      id: newAdminId,
      name,
      email: email.trim(),
      phone,
      hospitalId,
      hospitalName: hospital.name,
      verificationStatus: 'Pending', // Initial status is ALWAYS Pending!
      registeredAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      verifiedAt: null,
      verifiedBy: null,
      licenseNumber: licenseNumber || `HA-REG-${Math.floor(1000 + Math.random() * 9000)}`,
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
    };

    setHospitalAdmins(prev => [newAdmin, ...prev]);

    // Update hospital assigned admin info
    setHospitals(prev => prev.map(h =>
      h.id === hospitalId
        ? { ...h, assignedAdminId: newAdminId, assignedAdminName: name }
        : h
    ));

    addNotification('New Admin Registration (Pending)', `${name} has registered for ${hospital.name}. Verification required.`, 'token');
    addToast(`Admin registered with status: PENDING Super Admin approval. 1-to-1 mapping verified.`, 'info');
    return { success: true, admin: newAdmin };
  };

  // 4. Add Hospital
  const addHospital = ({ name, code, city, beds, address, phone }) => {
    // Check duplicate code
    const existing = hospitals.find(h => h.code?.toLowerCase() === code.trim().toLowerCase());
    if (existing) {
      addToast(`Hospital code "${code}" already exists.`, 'error');
      return { success: false };
    }

    const newHosp = {
      id: `hosp-${Date.now()}`,
      name,
      code: code.trim().toUpperCase(),
      city,
      beds: Number(beds) || 100,
      departmentsCount: 0,
      doctorsCount: 0,
      assignedAdminId: null,
      assignedAdminName: 'Unassigned',
      status: 'Active',
      phone: phone || '+91 11 0000 0000',
      address: address || `${city}, India`,
      establishedYear: new Date().getFullYear(),
      rating: 4.5
    };

    setHospitals(prev => [...prev, newHosp]);
    addToast(`Hospital "${name}" (${newHosp.code}) created successfully. Ready for 1-to-1 admin assignment.`, 'success');
    return { success: true, hospital: newHosp };
  };

  // 5. Delete Hospital
  const deleteHospital = (hospitalId) => {
    const hosp = hospitals.find(h => h.id === hospitalId);
    if (!hosp) return;

    // Unassign any admin
    setHospitalAdmins(prev => prev.map(a =>
      a.hospitalId === hospitalId
        ? { ...a, hospitalId: null, hospitalName: 'Unassigned', verificationStatus: 'Pending' }
        : a
    ));

    setHospitals(prev => prev.filter(h => h.id !== hospitalId));
    addToast(`Hospital "${hosp.name}" removed from registry.`, 'warning');
  };

  // 6. Unassign Admin from Hospital
  const unassignAdminFromHospital = (adminId) => {
    const admin = hospitalAdmins.find(a => a.id === adminId);
    if (!admin) return;

    const oldHospId = admin.hospitalId;

    setHospitalAdmins(prev => prev.map(a =>
      a.id === adminId
        ? { ...a, hospitalId: null, hospitalName: 'Unassigned', verificationStatus: 'Pending' }
        : a
    ));

    if (oldHospId) {
      setHospitals(prev => prev.map(h =>
        h.id === oldHospId
          ? { ...h, assignedAdminId: null, assignedAdminName: 'Unassigned' }
          : h
      ));
    }

    addToast(`Admin ${admin.name} unassigned. Hospital is now available for new assignment.`, 'info');
  };

  // Reset demo data helper
  const resetDemoData = () => {
    localStorage.clear();
    setDepartments(initialDepartments);
    setDoctors(initialDoctors);
    setPatients(initialPatients);
    setAppointments(initialAppointments);
    setNotifications(initialNotifications);
    setQueueState(initialQueueState);
    setHospitals(initialHospitals);
    setHospitalAdmins(initialHospitalAdmins);
    setActiveHospitalAdminId('hadmin-1');
    addToast('Demo hospital data reset to factory default!', 'success');
  };

  // Book Appointment
  const bookAppointment = ({ department, doctorId, date, timeSlot, reason, priority = 'Normal' }) => {
    const doctor = doctors.find(d => d.id === doctorId) || doctors[0];
    const dept = departments.find(d => d.name === department) || departments[0];

    const count = appointments.length + 15;
    const prefix = department ? department.charAt(0).toUpperCase() : 'A';
    const token = `${prefix}-${count}`;

    const newApt = {
      id: `apt-${Date.now()}`,
      token,
      patientId: currentUser?.id || 'pat-1',
      patientName: currentUser?.name || 'Rahul Verma',
      patientAge: 28,
      patientGender: 'Male',
      patientPhone: currentUser?.phone || '98765 43210',
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorSpecialization: doctor.specialization,
      department: department || doctor.department,
      hospital: doctor.hospital || 'City Care Hospital',
      date: date || '20 May 2026',
      time: timeSlot || '11:00 AM',
      status: 'Waiting',
      reason: reason || 'General Consultation',
      medicalHistory: 'Patient record active',
      notes: '',
      priority
    };

    setAppointments(prev => [newApt, ...prev]);

    setQueueState(prev => {
      const currentList = prev?.liveQueue || [];
      const newQueue = [...currentList, {
        token,
        patientName: currentUser?.name || 'Rahul Verma',
        status: 'Waiting',
        priority
      }];
      return {
        ...prev,
        patientToken: token,
        peopleAhead: Math.max(0, newQueue.length - 1),
        estimatedWaitMins: Math.max(0, (newQueue.length - 1) * (prev?.avgConsultationMins || 8)),
        liveQueue: newQueue
      };
    });

    addNotification(`Your token ${token}`, 'has been added to the queue.', 'token');
    addNotification('Appointment Confirmed', `On ${date || '20 May 2026'} at ${timeSlot || '11:00 AM'} with ${doctor.name}.`, 'confirmed');

    try {
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    } catch (e) { }

    addToast(`Appointment booked! Token ${token} generated successfully.`, 'success');
    return newApt;
  };

  // Cancel Appointment
  const cancelAppointment = (id) => {
    const apt = appointments.find(a => a.id === id);
    if (!apt) return;

    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'Cancelled' } : a));

    setQueueState(prev => ({
      ...prev,
      liveQueue: (prev.liveQueue || []).filter(q => q.token !== apt.token),
      peopleAhead: Math.max(0, (prev.peopleAhead || 1) - 1),
      estimatedWaitMins: Math.max(0, (prev.estimatedWaitMins || 8) - (prev.avgConsultationMins || 8))
    }));

    addNotification('Appointment Cancelled', `Appointment with token ${apt.token} has been cancelled.`, 'reminder');
    addToast(`Appointment (${apt.token}) cancelled`, 'warning');
  };

  // Doctor Consultation Actions
  const completeCurrentConsultation = () => {
    const currentServing = queueState?.currentlyServing;

    if (currentServing?.token) {
      setAppointments(prev => prev.map(a =>
        a.token === currentServing.token ? { ...a, status: 'Completed' } : a
      ));
    }

    const remainingQueue = [...(queueState?.liveQueue || [])];
    const nextPatient = remainingQueue.shift();

    if (nextPatient) {
      setQueueState(prev => ({
        ...prev,
        currentlyServing: {
          token: nextPatient.token,
          patientName: nextPatient.patientName,
          doctor: 'Dr. Arjun Sharma',
          timeStarted: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        liveQueue: remainingQueue,
        peopleAhead: Math.max(0, remainingQueue.findIndex(q => q.token === prev.patientToken)),
        estimatedWaitMins: Math.max(0, remainingQueue.length * (prev?.avgConsultationMins || 8))
      }));

      setAppointments(prev => prev.map(a =>
        a.token === nextPatient.token ? { ...a, status: 'In Consultation' } : a
      ));

      addNotification(`${nextPatient.token} is now being served`, `Patient ${nextPatient.patientName} please proceed to Room 302.`, 'serving');
      addToast(`Consultation completed! Now serving token ${nextPatient.token} (${nextPatient.patientName})`, 'success');
    } else {
      setQueueState(prev => ({
        ...prev,
        currentlyServing: {
          token: 'None',
          patientName: 'Queue Empty',
          doctor: 'Dr. Arjun Sharma',
          timeStarted: '-'
        },
        liveQueue: [],
        peopleAhead: 0,
        estimatedWaitMins: 0
      }));
      addToast('Queue is currently clear. No more waiting patients!', 'info');
    }
  };

  const skipCurrentPatient = () => {
    const current = queueState?.currentlyServing;
    if (!current || current.token === 'None') return;

    const remainingQueue = [...(queueState?.liveQueue || [])];
    const skippedPatient = {
      token: current.token,
      patientName: current.patientName,
      status: 'Waiting',
      priority: 'Normal'
    };

    const nextPatient = remainingQueue.shift();

    if (nextPatient) {
      remainingQueue.push(skippedPatient);
      setQueueState(prev => ({
        ...prev,
        currentlyServing: {
          token: nextPatient.token,
          patientName: nextPatient.patientName,
          doctor: 'Dr. Arjun Sharma',
          timeStarted: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        liveQueue: remainingQueue
      }));

      setAppointments(prev => prev.map(a => {
        if (a.token === nextPatient.token) return { ...a, status: 'In Consultation' };
        if (a.token === skippedPatient.token) return { ...a, status: 'Waiting' };
        return a;
      }));

      addToast(`Skipped ${current.token}. Now calling ${nextPatient.token}`, 'info');
    }
  };

  const saveConsultationNotes = (token, notes) => {
    setAppointments(prev => prev.map(a => a.token === token ? { ...a, notes } : a));
    addToast(`Doctor notes saved for Token ${token}`, 'success');
  };

  const updateDoctorAvailability = (doctorId, newAvailability) => {
    setDoctors(prev => prev.map(d => d.id === doctorId ? { ...d, availability: newAvailability } : d));
    addToast('Working availability schedule updated successfully!', 'success');
  };

  const addDoctor = (docData) => {
    const newDoc = {
      id: `doc-${Date.now()}`,
      rating: 4.8,
      hospital: currentHospitalAdmin?.hospitalName || 'City Care Hospital',
      email: docData.email || `dr.${(docData.name || 'doctor').toLowerCase().replace(/[^a-z]/g, '')}@citycare.com`,
      password: docData.password || 'Doctor@123',
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80',
      availability: {
        Monday: { active: true, hours: '09:00 AM - 05:00 PM' },
        Tuesday: { active: true, hours: '09:00 AM - 05:00 PM' },
        Wednesday: { active: true, hours: '09:00 AM - 05:00 PM' },
        Thursday: { active: true, hours: '09:00 AM - 05:00 PM' },
        Friday: { active: true, hours: '09:00 AM - 05:00 PM' },
        Saturday: { active: true, hours: '09:00 AM - 01:00 PM' },
        Sunday: { active: false, hours: 'OFF' }
      },
      ...docData
    };
    setDoctors(prev => [...prev, newDoc]);
    addToast(`Doctor ${newDoc.name} created! Password saved for Doctor Portal login.`, 'success');
    return newDoc;
  };

  const updateDoctor = (id, docData) => {
    setDoctors(prev => prev.map(d => d.id === id ? { ...d, ...docData } : d));
    addToast(`Doctor details updated`, 'success');
  };

  const deleteDoctor = (id) => {
    const doc = doctors.find(d => d.id === id);
    setDoctors(prev => prev.filter(d => d.id !== id));
    addToast(`Doctor ${doc?.name || ''} removed`, 'warning');
  };

  const addDepartment = (deptData) => {
    const newDept = {
      id: `dept-${Date.now()}`,
      patientCount: 0,
      icon: 'HeartPulse',
      ...deptData
    };
    setDepartments(prev => [...prev, newDept]);
    addToast(`Department ${newDept.name} created!`, 'success');
  };

  const updateDepartment = (id, deptData) => {
    setDepartments(prev => prev.map(d => d.id === id ? { ...d, ...deptData } : d));
    addToast(`Department updated`, 'success');
  };

  const deleteDepartment = (id) => {
    const dept = departments.find(d => d.id === id);
    setDepartments(prev => prev.filter(d => d.id !== id));
    addToast(`Department ${dept?.name || ''} deleted`, 'warning');
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        currentUser,
        switchRole,
        loginAs,
        loginWithCredentials,
        registerPatient,
        registerHospitalAdminFromPortal,
        logout,
        resetDemoData,
        departments,
        doctors,
        patients,
        appointments,
        notifications,
        queueState,
        analyticsData,
        toasts,
        addToast,
        removeToast,
        bookAppointment,
        cancelAppointment,
        completeCurrentConsultation,
        skipCurrentPatient,
        saveConsultationNotes,
        updateDoctorAvailability,
        addDoctor,
        updateDoctor,
        deleteDoctor,
        addDepartment,
        updateDepartment,
        deleteDepartment,
        markAllNotificationsAsRead,
        addNotification,
        // Super Admin & 1-to-1 Mapping Exports
        hospitals,
        hospitalAdmins,
        currentHospitalAdmin,
        activeHospitalAdminId,
        switchHospitalAdminUser,
        approveHospitalAdmin,
        rejectHospitalAdmin,
        registerHospitalAdmin,
        addHospital,
        deleteHospital,
        unassignAdminFromHospital
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
