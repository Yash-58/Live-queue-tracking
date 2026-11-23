import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mediqueue');
    console.log(`[MongoDB Connected]: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[MongoDB Connection Error]: ${error.message}`);
    // Don't kill process immediately in dev so API routes still display friendly warnings
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};
