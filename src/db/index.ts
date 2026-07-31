import mongoose from 'mongoose'
import { DB_NAME } from '../constants.js'

const connectDb = async (): Promise<void> => {
    try{
        const uri = (process.env.MONGODB_URI)
        const dbName = (DB_NAME)
        const connectionInstance = await mongoose.connect(`${uri}${dbName}`)
        console.log("MONGO DB CONNECTED")
    } catch (err: unknown) {
        console.error("MONGO DB DIDNT CONNECT", err)
        process.exit(1)
    }

}

export default connectDb