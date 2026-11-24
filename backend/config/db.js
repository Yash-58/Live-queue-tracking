import mongoose from 'mongoose';

let connected = false;

export const isConnectedToDB = () => connected;

export const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/mediqueue';
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000 // Quick timeout if MongoDB is offline
    });
    connected = true;
    console.log(`✅ [MongoDB Connected]: ${conn.connection.host}`);
  } catch (error) {
    connected = false;
    mongoose.set('bufferCommands', false); // Avoid blocking requests
    console.warn(`⚠️  [MongoDB Offline Notice]: ${error.message}`);
    console.log(`⚡ [Backend Resilient Fallback Active]: In-memory mock/demo mode ready so APIs don't hang!`);
  }
};
