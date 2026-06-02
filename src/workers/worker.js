import { Worker } from "bullmq";
import sendMailJob from "../jobs/emailJob.js";
import { settingImageSize , changingImageType } from "../controllers/imageOperation.controller.js";
import { connection } from "../queue/queue.js";

import dotenv from "dotenv"
dotenv.config({
    path:'./.env'
})
const handlers = {
    'sending-email-to-the-client':sendMailJob , 
    'change-image-type-operation':changingImageType,
    'setting-image-size':settingImageSize
}
const universalWorker = new Worker(
    'universal',
    async (job) => {
        const handler = handlers[job.name]

        if(!handler){
            console.log(`job NOt present for the cuurent job name - ${job.name}`)
            return ;

        }
        return await handler(job);
    }
    ,{connection}
)

universalWorker.on('completed',
    (job)=>{
        console.log("Job successfully completed" , job.id , job.name , job.data);
    }
)
universalWorker.on('failed',(job , err)=>{
    console.log("Job failed" , job.id , job.name , job.data ,err)
})