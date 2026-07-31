// import dotenv from 'dotenv'
// dotenv.config({
//     path:'./.env'
// })
import './config/env.js'

import connectDb from './db/index.js'
import app from './app.js'



const startServer = async function (): Promise<void> {
    try {
        await connectDb();
        const PORT: number = Number(process.env.PORT) || 8000
        app.listen(PORT , 
            ()=>{
                console.log(`Server started on port ${PORT}`)
            }
        )

    } catch (error) {
        console.error('Server coudnt be started - ', error)
    }
}
startServer()
