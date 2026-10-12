import sharp from 'sharp'
import uploadOnCloudinary from '../utils/cloudinary.js';
import fs from 'fs'
import { Job } from 'bullmq';
import { FormatEnum } from 'sharp';
const uploadImageOnCloudinary = async (path:string) => {
    // const LocalPath = req.files?.userImage[0]?.path ;
    const LocalPath = path;
    if(!LocalPath){
        console.log("give image")
        throw new Error();
    }
    const uploadedImage = await uploadOnCloudinary(LocalPath);
    return uploadedImage;
}
interface setImageSizeBody{
    userHeight:number,
    userWidth:number,
    userImageLocalPath:string
}
async function setImageSize (job : Job<setImageSizeBody>)  {
    const {userHeight , userWidth , userImageLocalPath}  = job.data ;
    const filePath = `public/temp/${Date.now()}.jpg` ;
    const LocalPath = userImageLocalPath;
    
    //check if userheight and width aai na 
    if(!userHeight || !userWidth){
        throw new Error("Image dimensions not recieved in the job")
    }
    if(!userImageLocalPath){
        throw new Error("Image local path not recieved in the job")
    }

    await sharp(LocalPath).resize({
        height: userHeight , 
        width : userWidth
    }).toFile(filePath)
    const uploadedImage = await uploadImageOnCloudinary(filePath)
    if(fs.existsSync(LocalPath)){
        fs.unlinkSync(LocalPath)
    }
    if(fs.existsSync(filePath)){
        fs.unlinkSync(filePath)
    }
    if(uploadedImage){
        console.log('image seccessfully resized and uploadede on cloudinary')
        return uploadedImage.url;
    }else{
        console.log("image coudnt be uploadede on cloudinary after processing")
        throw new Error("image coudnt be uploaded in cloudinary")
    }
    
}

interface changeImageTypeBody{
    userImageType:keyof FormatEnum,
    userImageLocalPath:string
}
async  function changeImageType (job :Job<changeImageTypeBody>){

    const {userImageType , userImageLocalPath} = job.data;
    const filePath = `public/temp/${Date.now()}.jpg` 
    const LocalPath =  userImageLocalPath;
    //checks 
    if(!filePath){
        throw new Error("file path is missing in the job")
    }
    if(!LocalPath){
        throw new Error("local path is missing in the job")
    }

    await sharp(LocalPath).toFormat(userImageType).toFile(filePath) 
    const uploadedImage = await uploadOnCloudinary(filePath)
    if(fs.existsSync(filePath)){
        fs.unlinkSync(filePath)
    }
    if(fs.existsSync(LocalPath)){
        fs.unlinkSync(LocalPath)
    }
    if(uploadedImage){
        console.log('image seccessfully converted into the format user mentioned and uploaded on cloudinary')
        return uploadedImage.url;
    }else{
        console.log("image coudnt be uploaded on cloudinary after processing")
        throw new Error()
    }
    
    

    
}
export {setImageSize , changeImageType}