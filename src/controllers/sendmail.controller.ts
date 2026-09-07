import { jobModel } from "../models/email.model.js";

import { universalQueue } from "../queue/queue.js";
import type { Request, Response } from "express";

const priorityMap = {
        low: 1000000,
        med: 500000,
        high: 1
    }
    interface SendEmailBody {
        to: string,
        sub: string,
        body: string,
        userPriority: "low" | "med" | "high"
    }
const sendEmail = async (
    req: Request<{} , {} , SendEmailBody>,
    res: Response
) => {
    
    try {
        const { to, sub, body, userPriority } = req.body;

        if (!to || !sub || !body || !userPriority || (userPriority!=="low" && userPriority!=="med" && userPriority!=="high")) {
            return res.status(400).json({
                message: "Send All the required details properly in corect format"
            })
        }

        const priorityNo = priorityMap[userPriority]
        
        const jobmodel = await jobModel.create({
            job_name: 'sending-email-to-the-client',
            payload: {
                email_reciever: to,
                email_subject: sub,
                email_body: body
            }
            , status: 'pending'
        })
        if (!jobmodel) {
            return res.status(500).json({
                message: "cannot save data in mongo db"
            })
        }
        const job = await universalQueue.add(
            'sending-email-to-the-client', {
            mongodbId: jobmodel._id,
            to: to,
            subject: sub ,
            body: body 
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
        if (!job) {
            return res.status(500).json({
                message: "job coudnt be created"
            })
        }
        res.status(200).json({
            message: "Email succesfuly sent to the client"
        })
    } catch (error) {
        res.status(404).json({
            message: 'failed',
            error_caused: error
        })
    }
}

export { sendEmail };