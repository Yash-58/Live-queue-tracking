import mongoose from 'mongoose';

const AppointmentSchema = new mongoose.Schema(
  {
    tokenNumber: {
      type: String,
      required: true
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    patientName: {
      type: String,
      required: true
    },
    patientPhone: String,
    patientAge: Number,
    patientGender: String,
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true
    },
    doctorName: {
      type: String,
      required: true
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: true
    },
    departmentName: {
      type: String,
      required: true
    },
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hospital',
      required: true
    },
    hospitalName: {
      type: String,
      required: true
    },
    date: {
      type: String,
      required: true
    },
    timeSlot: {
      type: String,
      required: true
    },
    reason: {
      type: String,
      default: 'General Consultation'
    },
    medicalHistory: {
      type: String,
      default: 'No known allergies.'
    },
    doctorNotes: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['Waiting', 'In Consultation', 'Completed', 'Cancelled', 'Skipped'],
      default: 'Waiting'
    },
    priority: {
      type: String,
      enum: ['Normal', 'Emergency'],
      default: 'Normal'
    },
    estimatedWaitMins: {
      type: Number,
      default: 15
    }
  },
  { timestamps: true }
);

export const Appointment = mongoose.model('Appointment', AppointmentSchema);
