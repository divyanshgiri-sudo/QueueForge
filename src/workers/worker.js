import { Worker } from "bullmq";
import sendMailJob from "../jobs/emailJob.js";
import { connection } from "../queue/queue.js";

import dotenv from "dotenv"
dotenv.config({
    path:'./.env'
})

const universalWorker = new Worker(
    'universal',
    sendMailJob
    ,{connection}
)

universalWorker.on('completed',
    (job)=>{
        console.log("sending mail to client failed " , job.id , job.name , job.data);
    }
)
universalWorker.on('failed',(job , err)=>{
    console.log("sending mail failed" , job.id , job.name , job.data ,err)
})