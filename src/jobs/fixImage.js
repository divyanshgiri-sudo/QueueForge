import sharp from 'sharp'
import uploadOnCloudinary from '../utils/cloudinary.js';

const uploadImageOnCloudinary = async () => {
    const LocalPath = req.files?.userImage[0]?.path ;
    if(LocalPath){
        res.status(400).json({
            message :"Please enter an image"
        })
    }
    const uploadedImage = await uploadOnCloudinary(LocalPath);
    return uploadedImage;
}

async function setImageSize (job)  {
    const {userHeight , userWidth}  = job.data ;
    const filePath = `public/temp/${Date.now()}.jpg` ;
    const LocalPath = req.files?.userImage[0]?.path ;
    await sharp(LocalPath).resize({
        height: userHeight , 
        width : userWidth
    }).toFile(filePath)
    const uploadedImage = uploadImageOnCloudinary(filePath)
    console.log('image seccessfully resized and uploadede on cloudinary')
}

async  function changeImageType (job){

    const {userImageType} = job.data;
    const filePath = `public/temp/${Date.now()}.jpg` 
    const LocalPath =  req.files?.userImage[0]?.path ;

    await sharp(LocalPath).toFormat(userImageType).toFile(filePath) 

    uploadImageOnCloudinary(filePath)
    
    console.log('image seccessfully converted into the format user mentioned and uploaded on cloudinary')

    
}
export {setImageSize , changeImageType}