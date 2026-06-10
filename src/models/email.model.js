import mongoose , {Schema} from 'mongoose'

const jobSchema = new Schema({
    job_id:Number,
    job_name:String,
    payload:mongoose.Schema.Types.Mixed,
    status:String
}, {timestamps:true})

export const jobModel = new mongoose.model("jobModel" , jobSchema) 