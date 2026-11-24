import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { User } from './models/User.js';
import { Hospital } from './models/Hospital.js';
import { HospitalAdmin } from './models/HospitalAdmin.js';
import { Department } from './models/Department.js';
import { Doctor } from './models/Doctor.js';
import { Appointment } from './models/Appointment.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mediqueue');
    console.log('[Seed] Connected to MongoDB');

    // Clear existing collections
    await Promise.all([
      User.deleteMany(),
      Hospital.deleteMany(),
      HospitalAdmin.deleteMany(),
      Department.deleteMany(),
      Doctor.deleteMany(),
      Appointment.deleteMany()
    ]);
    console.log('[Seed] Cleared existing data');

    // 1. Create Super Admin User
    const superAdmin = await User.create({
      name: 'Dr. Alok Verma',
      email: 'superadmin@mediqueue.gov.in',
      password: 'SuperAdmin@123',
      role: 'super_admin',
      phone: '+91 11 2334 5566',
      avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200&auto=format&fit=crop&q=80',
      verificationStatus: 'Verified'
    });
    console.log(`[Seed] Created Super Admin: ${superAdmin.email}`);

    // 2. Create Hospitals
    const hospitals = await Hospital.create([
      {
        name: 'City Care Hospital',
        code: 'CCH-01',
        city: 'New Delhi',
        beds: 350,
        address: '14, Barakhamba Road, Connaught Place, New Delhi',
        phone: '+91 11 2345 6789'
      },
      {
        name: 'Apex Memorial Hospital',
        code: 'AMH-02',
        city: 'Gurugram',
        beds: 420,
        address: 'Sector 29, Golf Course Road, Gurugram',
        phone: '+91 124 456 7890'
      },
      {
        name: 'Metro Health Institute',
        code: 'MHI-03',
        city: 'Noida',
        beds: 280,
        address: 'Plot 4, Knowledge Park III, Greater Noida',
        phone: '+91 120 789 0123'
      },
      {
        name: 'Fortis Multi-Specialty',
        code: 'FMS-04',
        city: 'Bangalore',
        beds: 500,
        address: 'Bannerghatta Road, Bengaluru, Karnataka',
        phone: '+91 80 4455 6677'
      },
      {
        name: 'Apollo Health Center',
        code: 'AHC-05',
        city: 'Mumbai',
        beds: 300,
        address: 'Navi Mumbai, CBD Belapur, Mumbai',
        phone: '+91 22 8899 0011'
      }
    ]);
    console.log(`[Seed] Created ${hospitals.length} Hospitals`);

    // 3. Create Hospital Admins with STRICT 1-TO-1 MAPPING
    // Admin 1: Verified (City Care Hospital)
    const userAdmin1 = await User.create({
      name: 'Dr. Ramesh Gupta',
      email: 'ramesh.gupta@citycare.org',
      password: 'AdminPassword@123',
      role: 'admin',
      phone: '+91 98111 22334',
      hospital: hospitals[0]._id,
      verificationStatus: 'Verified'
    });

    const admin1 = await HospitalAdmin.create({
      user: userAdmin1._id,
      name: 'Dr. Ramesh Gupta',
      email: 'ramesh.gupta@citycare.org',
      phone: '+91 98111 22334',
      licenseNumber: 'HA-DEL-2024-001',
      hospital: hospitals[0]._id,
      hospitalName: hospitals[0].name,
      verificationStatus: 'Verified',
      verifiedBy: superAdmin._id,
      verifiedAt: new Date()
    });
    hospitals[0].assignedAdmin = admin1._id;
    await hospitals[0].save();

    // Admin 2: Pending Verification (Apex Memorial Hospital)
    const userAdmin2 = await User.create({
      name: 'Sunita Mehra',
      email: 'sunita.mehra@apexmemorial.org',
      password: 'AdminPassword@123',
      role: 'admin',
      phone: '+91 98222 33445',
      hospital: hospitals[1]._id,
      verificationStatus: 'Pending'
    });

    const admin2 = await HospitalAdmin.create({
      user: userAdmin2._id,
      name: 'Sunita Mehra',
      email: 'sunita.mehra@apexmemorial.org',
      phone: '+91 98222 33445',
      licenseNumber: 'HA-HRY-2026-089',
      hospital: hospitals[1]._id,
      hospitalName: hospitals[1].name,
      verificationStatus: 'Pending'
    });
    hospitals[1].assignedAdmin = admin2._id;
    await hospitals[1].save();

    // Admin 3: Rejected Verification (Metro Health Institute)
    const userAdmin3 = await User.create({
      name: 'Anil Deshmukh',
      email: 'anil.deshmukh@metrohealth.in',
      password: 'AdminPassword@123',
      role: 'admin',
      phone: '+91 98333 44556',
      hospital: hospitals[2]._id,
      verificationStatus: 'Rejected'
    });

    const admin3 = await HospitalAdmin.create({
      user: userAdmin3._id,
      name: 'Anil Deshmukh',
      email: 'anil.deshmukh@metrohealth.in',
      phone: '+91 98333 44556',
      licenseNumber: 'HA-UP-2025-412',
      hospital: hospitals[2]._id,
      hospitalName: hospitals[2].name,
      verificationStatus: 'Rejected',
      rejectionReason: 'Invalid medical administrative registration certificate.'
    });
    hospitals[2].assignedAdmin = admin3._id;
    await hospitals[2].save();

    console.log('[Seed] Created Hospital Admins (Verified, Pending, Rejected) with strict 1-to-1 mapping');

    // 4. Create Departments for City Care Hospital
    const departments = await Department.create([
      { name: 'Cardiology', hospital: hospitals[0]._id, head: 'Dr. Arjun Sharma', floor: '3rd Floor', icon: 'HeartPulse' },
      { name: 'Neurology', hospital: hospitals[0]._id, head: 'Dr. Neha Verma', floor: '4th Floor', icon: 'Activity' },
      { name: 'Orthopedics', hospital: hospitals[0]._id, head: 'Dr. Rohan Mehta', floor: '2nd Floor', icon: 'Shield' },
      { name: 'General Medicine', hospital: hospitals[0]._id, head: 'Dr. Pooja Singh', floor: '1st Floor', icon: 'Stethoscope' },
      { name: 'Dental', hospital: hospitals[0]._id, head: 'Dr. Kunal Patel', floor: 'Ground Floor', icon: 'HeartPulse' }
    ]);

    // 5. Create Doctor
    const doctorUser = await User.create({
      name: 'Dr. Arjun Sharma',
      email: 'doctor@citycare.com',
      password: 'DoctorPassword@123',
      role: 'doctor',
      phone: '+91 98765 43210',
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80',
      hospital: hospitals[0]._id
    });

    const doctor = await Doctor.create({
      user: doctorUser._id,
      name: 'Dr. Arjun Sharma',
      specialization: 'Cardiologist',
      department: departments[0]._id,
      departmentName: departments[0].name,
      hospital: hospitals[0]._id,
      phone: '+91 98765 43210',
      email: 'doctor@citycare.com',
      avatar: doctorUser.avatar,
      room: 'Room 304',
      currentServingToken: 'A-19'
    });

    // 6. Create Patient
    const patientUser = await User.create({
      name: 'Rahul Verma',
      email: 'rahulverma@gmail.com',
      password: 'PatientPassword@123',
      role: 'patient',
      phone: '+91 98765 43210',
      age: 28,
      gender: 'Male',
      bloodGroup: 'B+'
    });

    // 7. Create Appointments
    await Appointment.create([
      {
        tokenNumber: 'A-19',
        patient: patientUser._id,
        patientName: 'Amit Verma',
        patientPhone: '+91 98765 43210',
        doctor: doctor._id,
        doctorName: doctor.name,
        department: departments[0]._id,
        departmentName: departments[0].name,
        hospital: hospitals[0]._id,
        hospitalName: hospitals[0].name,
        date: 'Today',
        timeSlot: '11:15 AM',
        status: 'In Consultation',
        reason: 'Chest pain & discomfort'
      },
      {
        tokenNumber: 'A-20',
        patient: patientUser._id,
        patientName: 'Priya Patel',
        patientPhone: '+91 98765 43211',
        doctor: doctor._id,
        doctorName: doctor.name,
        department: departments[0]._id,
        departmentName: departments[0].name,
        hospital: hospitals[0]._id,
        hospitalName: hospitals[0].name,
        date: 'Today',
        timeSlot: '11:30 AM',
        status: 'Waiting',
        reason: 'Follow-up ECG'
      },
      {
        tokenNumber: 'A-24',
        patient: patientUser._id,
        patientName: 'Rahul Verma',
        patientPhone: '+91 98765 43210',
        doctor: doctor._id,
        doctorName: doctor.name,
        department: departments[0]._id,
        departmentName: departments[0].name,
        hospital: hospitals[0]._id,
        hospitalName: hospitals[0].name,
        date: 'Today',
        timeSlot: '11:45 AM',
        status: 'Waiting',
        reason: 'General cardiology consultation'
      }
    ]);

    console.log('[Seed] Database successfully populated with initial data!');
    process.exit(0);
  } catch (err) {
    console.error('[Seed Error]:', err);
    process.exit(1);
  }
};

seedDatabase();
