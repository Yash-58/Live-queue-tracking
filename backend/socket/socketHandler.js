/**
 * MediQueue Real-Time Socket.IO Handler
 * Provides instant live queue updates, token call broadcasts, emergency priority,
 * and Super Admin verification alerts.
 */
export const setupSocketIO = (io) => {
  io.on('connection', (socket) => {
    console.log(`[Socket Connected]: Client ID ${socket.id}`);

    // Join room for a specific hospital / department queue
    socket.on('join_hospital', (hospitalId) => {
      socket.join(`hospital_${hospitalId}`);
      console.log(`Socket ${socket.id} joined hospital_${hospitalId}`);
    });

    socket.on('join_doctor_queue', (doctorId) => {
      socket.join(`doctor_${doctorId}`);
      console.log(`Socket ${socket.id} joined doctor_${doctorId}`);
    });

    // Doctor calls next token
    socket.on('call_token', (data) => {
      io.to(`doctor_${data.doctorId}`).emit('token_called', data);
      io.to(`hospital_${data.hospitalId}`).emit('queue_updated', data);
    });

    // Consultation completed
    socket.on('complete_consultation', (data) => {
      io.to(`doctor_${data.doctorId}`).emit('consultation_completed', data);
      io.to(`hospital_${data.hospitalId}`).emit('queue_updated', data);
    });

    // Super Admin approves or rejects hospital admin
    socket.on('admin_verification_update', (data) => {
      io.emit('admin_verification_status_changed', data);
    });

    socket.on('disconnect', () => {
      console.log(`[Socket Disconnected]: Client ID ${socket.id}`);
    });
  });
};
