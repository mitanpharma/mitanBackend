import mongoose from "mongoose";

export const mongodbConnection = async (connectionUrl) => {
  try {
    const connection = await mongoose.connect(connectionUrl);
    return connection;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};
