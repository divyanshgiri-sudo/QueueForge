import '../config/env.js'
import { Worker } from "bullmq";
import sendMailJob from "../jobs/emailJob.js";
import { setImageSize, changeImageType } from "../jobs/fixImage.js";
import { connection } from "../queue/queue.js";
import { jobModel } from '../models/email.model.js';

import connectDb from '../db/index.js';


connectDb()
.then(()=>{
    console.log(`Worker is connected to mongo db`)
    
})
.catch((err)=>{
    console.log("Server coudnt be started - " , err)
})






const handlers = {
    'sending-email-to-the-client': sendMailJob,
    'change-image-type-operation': changeImageType,
    'setting-image-size': setImageSize
}
const universalWorker = new Worker(
    'universal',
    async (job) => {
        const handler = handlers[job.name]

        if (!handler) {
            console.log(`job NOt present for the cuurent job name - ${job.name}`)
            return;

        }
        const currentJob = await jobModel.findByIdAndUpdate(
            job.data.mongodbId,
            {
                job_id: job.id
            }
            , { new: true }
        )
        if(job.name==='change-image-type-operation' || job.name === 'setting-image-size'){
            
        }
        if (!currentJob) {
            console.log("no job found with this id in mongo db")
            throw new Error
        }

        return await handler(job);
    }
    , { connection }
)

universalWorker.on('completed',
    async (job) => {
        const currentJob = await jobModel.findByIdAndUpdate(
            job.data.mongodbId,
            {
                status: await job.getState()
            }
            , { new: true }
        );
        console.log("Job successfully completed", job.id, job.name, job.data);
    }
)
universalWorker.on('failed', async (job, err) => {
    const currentJob = await jobModel.findByIdAndUpdate(
        job.data.mongodbId,
        {
            status:await  job.getState()
        }
        , { new: true }
    );
    console.log("Job failed", job.id, job.name, job.data, err)
})