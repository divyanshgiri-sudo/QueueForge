import express from 'express'

const app = express();

app.use(express.json())

import emailRouter from './routes/email.route.js'
import imageRouter from './routes/imageOperations.route.js'
app.use('/api/v1/home/sendemail' , emailRouter)
app.use('/api/v1/home/imageOperation' , imageRouter)



export default app ;