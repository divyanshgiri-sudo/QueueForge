import {Queue } from 'bullmq'

const connection = {
    'host':'localhost' , 
    port:process.env.QUEUE_PORT
}

const universalQueue = new Queue(
    'universal',
    {connection}
)

export {connection , universalQueue}