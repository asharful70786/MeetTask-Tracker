import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.mongoDb_url);
    console.log(`MongoDB Connected successfully `);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default connectDB;