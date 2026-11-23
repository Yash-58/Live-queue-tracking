import mongoose from 'mongoose';

const QueueSchema = new mongoose.Schema(
  {
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hospital',
      required: true
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: true
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true
    },
    currentServing: {
      token: { type: String, default: 'None' },
      patientName: { type: String, default: 'None' },
      appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
      startedAt: Date
    },
    activeTokens: [
      {
        token: String,
        patientName: String,
        appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
        status: { type: String, enum: ['Waiting', 'In Consultation'], default: 'Waiting' },
        joinedAt: { type: Date, default: Date.now },
        priority: { type: String, enum: ['Normal', 'Emergency'], default: 'Normal' }
      }
    ],
    averageConsultationMins: {
      type: Number,
      default: 8
    }
  },
  { timestamps: true }
);

export const Queue = mongoose.model('Queue', QueueSchema);
