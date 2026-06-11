import { universalQueue } from "../queue/queue.js";
import { jobModel } from "../models/email.model.js";

const changingImageType = async (req , res) => {
    const {imgTypeUserWants , userPriority} = req.body;
    const userImageLocalPath = req.file?.path
    if(!userImageLocalPath){
        return res.status(400).json({
            message:'enter a image'
        })
    }
    const priorityMap = {
        low: 1000000 , 
        med : 500000,
        high:1
    }
    const priorityNo = priorityMap[userPriority]
    if(!priorityNo){
        return res.status(400).json({
            message:"Please provide a valid priority for this job"
        })
    }
    if(!imgTypeUserWants){
        return res.status(400).json({
            message:"Enter a valid img type in which you want to transform the current image"
        })
    }
    const jobmodel = await jobModel.create({
        job_name:'change-image-type-operation',
        payload:{
            userImageLocalPath:imgTypeUserWants

        },
        status:'pending'
    })

    try {
        await universalQueue.add(
            'change-image-type-operation',{
                mongodbId:jobmodel._id,
                userImageType:imgTypeUserWants,
                userImageLocalPath : userImageLocalPath
            },
            {   
                priority:priorityNo,
                attempts:3,
                backoff:{
                    type:'exponential',
                    delay:1000
                }
            }
        )
        return res.status(200).json({
            message:"The image type successfully changed "
        })
    } catch (error) {
        console.log("some error occurrred while trying the change the image type - " , error)
        return;
    }

}

const settingImageSize = async (req , res) => {

    const priorityMap = {
        low: 1000000 , 
        med : 500000,
        high:1
    }
    const {userHeight , userWidth , userPriority} = req.body;
    const priorityNo = priorityMap[userPriority]
    const userImageLocalPath = req.file?.path
    if(!userImageLocalPath){
        return res.status(400).json({
            message:'Please enter the image'
        })
    }


    if(!userHeight || !userWidth || !priorityNo){
        return res.status(400).json({
            message:"please send all the info necessary"
        })
    }
    const temp1 = Number(userHeight);
    const temp2 = Number(userWidth);
    const jobmodel = await jobModel.create({
        job_name:'change-image-type-operation',
        payload:{
            userHeight:temp1,
            userWidth:temp2

        },
        status:'pending'
    })
    try {
        await universalQueue.add(
            'setting-image-size' , {
                mongodbId:jobmodel._id,
                userHeight:temp1 , 
                userWidth:temp2 , 
                userImageLocalPath:userImageLocalPath
            },{
                priority:priorityNo ,
                attempts:3,
                backoff:{
                    type:'exponential',
                    delay:1000
                }
            }
        )
        return res.status(200).json({
            message:'The dimensions of the image changed according to the user wished'
        })
    } catch (error) {
        console.log("Some error occured while trying to change the dimnesion of the image - " , error)
        return;
    }
    
}

export {changingImageType , settingImageSize}