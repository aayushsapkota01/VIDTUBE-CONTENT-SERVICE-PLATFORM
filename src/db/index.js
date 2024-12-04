import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

export const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONDODB_URI}/${DB_NAME}`
    );

    console.log(
      `\nMongoDB Connected ! DB host : ${connectionInstance.connection.host} `
    );
  } catch (error) {
    console.log("MongoDB Connection Error", error);
    process.exit(1);
  }
};
