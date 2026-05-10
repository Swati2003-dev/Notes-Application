import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function testUpload() {
  try {
    const result = await cloudinary.uploader.upload("test.pdf", {
      resource_type: "auto",
      folder: "notes-attachments"
    });
    console.log("Success:", result);
  } catch (error) {
    console.error("Cloudinary Error:", error);
  }
}

// Create a dummy pdf file
import fs from "fs";
fs.writeFileSync("test.pdf", "dummy pdf content");

testUpload().then(() => fs.unlinkSync("test.pdf"));
