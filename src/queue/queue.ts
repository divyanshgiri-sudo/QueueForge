import {Queue } from 'bullmq'

const connection = {
    'host':'localhost' , 
    port:Number(process.env.QUEUE_PORT) || 6379
}

const universalQueue = new Queue(
    'universal',
    {connection}
)

export {connection , universalQueue}