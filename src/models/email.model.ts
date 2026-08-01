import mongoose , {Schema} from 'mongoose'

interface job {
    job_id:number,
    job_name:string,
    payload?:unknown,
    status:string,
    result?:string
}

const jobSchema = new Schema<job>({
    job_id:{
        type:Number,
        required:true
    },
    job_name:{
        type:String ,
        trim:true,
        required:true
    },
    payload:{
        type:mongoose.Schema.Types.Mixed,
        required:false
    },
    status:{
        type:String ,
        trim:true,
        required:true,
        default:"pending"
    },
    result:{
        type:String ,
        trim:true,
        required:false
    }
}, {timestamps:true})

export const jobModel =  mongoose.model<job>("jobModel" , jobSchema) 