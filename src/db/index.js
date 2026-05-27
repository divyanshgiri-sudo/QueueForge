import mongoose from 'mongoose'
import { DB_NAME } from '../constants.js'

const connectDb = async (params) => {
    try{
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log("MONGO DB CONNECTED")
    }catch{
        console.log("MONGO DB DIDNT CONNECT" , err)
        process.exit(1)
    }

}

export default connectDb