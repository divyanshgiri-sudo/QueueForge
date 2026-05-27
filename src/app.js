import express from 'express'

const app = new express();

app.use(express.json())

import emailRouter from './routes/email.route.js'
app.use('/api/v1/home/sendemail' , emailRouter)



export default app ;