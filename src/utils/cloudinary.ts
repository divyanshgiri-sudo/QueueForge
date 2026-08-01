import { v2 as cloudinary } from "cloudinary"
import fs from 'fs'

const cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
const api_key = process.env.CLOUDINARY_API_KEY;
const api_secret = process.env.CLOUDINARY_API_SECRET;
if(!cloud_name || !api_key || !api_secret){
  throw new Error("The cloudinary credentials are missing.. ")
}
cloudinary.config({
  cloud_name,
  api_key,
  api_secret
});

const uploadOnCloudinary = async (localFilePath:string)  => {
  try {

    if (!localFilePath) {
      console.log("Local File Path not found")
      return null;
    }
    const fileUploaded = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto'
    })
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    return fileUploaded

  } catch (error) {
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    throw error
  }
}
export default uploadOnCloudinary