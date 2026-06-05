import sharp from 'sharp'
import uploadOnCloudinary from '../utils/cloudinary.js';
import fs from 'fs'

const uploadImageOnCloudinary = async (path) => {
    // const LocalPath = req.files?.userImage[0]?.path ;
    const LocalPath = path;
    if(!LocalPath){
        console.log("give image")
        throw new error;
    }
    const uploadedImage = await uploadOnCloudinary(LocalPath);
    return uploadedImage;
}

async function setImageSize (job)  {
    const {userHeight , userWidth , userImageLocalPath}  = job.data ;
    const filePath = `public/temp/${Date.now()}.jpg` ;
    const LocalPath = userImageLocalPath;
  
    await sharp(LocalPath).resize({
        height: userHeight , 
        width : userWidth
    }).toFile(filePath)
    const uploadedImage = await uploadImageOnCloudinary(filePath)
    if(uploadedImage){
        console.log('image seccessfully resized and uploadede on cloudinary')
        return;
    }else{
        console.log("image coudnt be uploadede on cloudinary after processing")
        throw new error
    }
    
}

async  function changeImageType (job){
    const {userImageType , userImageLocalPath} = job.data;
    const filePath = `public/temp/${Date.now()}.jpg` 
    const LocalPath =  userImageLocalPath;

    await sharp(LocalPath).toFormat(userImageType).toFile(filePath) 
    const uploadedImage = await uploadOnCloudinary(filePath)
    if(fs.existsSync(filePath)){
        fs.unlinkSync(filePath)
    }
    if(uploadedImage){
        console.log('image seccessfully converted into the format user mentioned and uploaded on cloudinary')
        return;
    }else{
        console.log("image coudnt be uploaded on cloudinary after processing")
        throw new error
    }
    
    

    
}
export {setImageSize , changeImageType}