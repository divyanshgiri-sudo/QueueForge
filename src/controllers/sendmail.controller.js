import { jobModel } from "../models/email.model.js";
import { universalQueue } from "../queue/queue.js"
const sendEmail = async (req,res) => {
    const priorityMap = {
        low: 1000000 , 
        med : 500000,
        high:1
    }
    try {
        const {to , sub , body , userPriority} = req.body;

        const priorityNo = priorityMap[userPriority]
        if(!to ||!sub||!body|| !userPriority){
            return res.status(400).json({
                message:"Sending All the required details"
            })
        }
        const jobmodel = await jobModel.create({
            job_name:'sending-email-to-the-client',
            payload:{
                email_reciever:to,
                email_subject:sub,
                email_body:body
            }
            ,status:'pending'
        })
        if(!jobmodel){
            return res.status(500).json({
                message:"cannot save data in mongo db"
            })
        }
        const job = await universalQueue.add(
            'sending-email-to-the-client',{
                mongodbId:jobmodel._id,
                to:to,
                subject: sub|| "",
                body: body|| ""
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
        if(!job){
            res.status(500).json({
                message:"job coudnt be created"
            })
        }
        res.status(200).json({
            message:"Email succesfuly sent to the client"
        })
    } catch (error) {
        res.status(404).json({
            message:'failed',
            error_caused  :error
        })
    }
}

export {sendEmail};