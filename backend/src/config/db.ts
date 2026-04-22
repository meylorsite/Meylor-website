import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI is not defined');
    process.exit(1);
  }
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log('MongoDB connected successfully');
  } catch (error: any) {
    console.error('MongoDB connection error:', error.message || error);
    console.log('Retrying connection in 5 seconds...');
    setTimeout(() => connectDB(), 5000);
  }
};
