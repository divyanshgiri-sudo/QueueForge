import { universalQueue } from "../queue/queue.js";
import { jobModel } from "../models/email.model.js";
import {  type Request, type Response } from "express";
interface ImageOperationBody {
    imgTypeUserWants: string,
    userPriority: "low" | "med" | "high"
}
const priorityMap = {
    low: 1000000,
    med: 500000,
    high: 1
}
const changingImageType = async (
    req: Request<{}, {}, ImageOperationBody>,
    res: Response
) => {
    const { imgTypeUserWants, userPriority } = req.body;
    const userImageLocalPath = req.file?.path
    if (!userImageLocalPath) {
        return res.status(400).json({
            message: 'enter a image'
        })
    }
    if (!imgTypeUserWants || !userPriority || (userPriority != "low" && userPriority != "med" && userPriority != "high")) {
        return res.status(400).json({
            message: "please provide all the details in the req format "
        })
    }

    const priorityNo = priorityMap[userPriority]


    const jobmodel = await jobModel.create({
        job_name: 'change-image-type-operation',
        payload: {
            userImageLocalPath: imgTypeUserWants

        },
        status: 'pending'
    })

    try {
        await universalQueue.add(
            'change-image-type-operation', {
            mongodbId: jobmodel._id,
            userImageType: imgTypeUserWants,
            userImageLocalPath: userImageLocalPath
        },
            {
                priority: priorityNo,
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 1000
                }
            }
        )
        return res.status(200).json({
            message: "The image type successfully changed "
        })
    } catch (error) {
        console.log("some error occurrred while trying the change the image type - ", error)
        return;
    }

}

interface SettingImageSizeBody {
    userHeight: number,
    userWidth: number,
    userPriority: "low" | "med" | "high"
}

const settingImageSize = async (
    req: Request<{}, {}, SettingImageSizeBody>
    , res: Response
) => {


    const { userHeight, userWidth, userPriority } = req.body;
        if (!userHeight || !userWidth || !userPriority || (userPriority != "low" && userPriority != "med" && userPriority != "high")) {
        return res.status(400).json({
            message: "please send all the info necessary"
        })
    }
    const priorityNo = priorityMap[userPriority]
    const userImageLocalPath = req.file?.path

    if (!userImageLocalPath) {
        return res.status(400).json({
            message: 'Please enter the image'
        })
    }



    const temp1 = Number(userHeight);
    const temp2 = Number(userWidth);
    const jobmodel = await jobModel.create({
        job_name: 'change-image-size-operation',
        payload: {
            userHeight: temp1,
            userWidth: temp2

        },
        status: 'pending'
    })
    try {
        await universalQueue.add(
            'setting-image-size', {
            mongodbId: jobmodel._id,
            userHeight: temp1,
            userWidth: temp2,
            userImageLocalPath: userImageLocalPath
        }, {
            priority: priorityNo,
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 1000
            }
        }
        )
        return res.status(200).json({
            message: 'The dimensions of the image changed according to the user wished'
        })
    } catch (error) {
        console.log("Some error occured while trying to change the dimnesion of the image - ", error)
        return;
    }

}

export { changingImageType, settingImageSize }