import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      console.error("Local file path is null or undefined");
      return null;
    }

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    console.log("File Uploaded on Cloudinary. File src:", response.url);

    // Remove the local file after successful upload
    fs.unlinkSync(localFilePath);

    return response; // Ensure response is returned
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);

    // Cleanup the local file even in case of an error
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    throw new Error("Failed to upload to Cloudinary");
  }
};


const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log("Deleted From Cloudinary. Public Id: ", publicId);
  } catch (error) {
    console.log("Error deleting from cloudinary");
    return null;
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
