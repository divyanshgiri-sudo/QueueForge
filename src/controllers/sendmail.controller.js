import { emailQueue } from "../../../email-queue-with-reddis-list/src/queue.js"
import { universalQueue } from "../queue/queue.js"
const sendEmail = async (req,res) => {
    try {
        const job = await universalQueue.add(
            'sending-email-to-the-client',
            {},
            {
                attempts:3,
                backoff:{
                    type:'exponential',
                    delay:1000
                }
            }
        )
        res.status(200).json({
            message:"Email succesfuly sent to the client"
        })
    } catch (error) {
        res.status(404).json({
            message:'failed',
            error_caused  :error
        })
    }
}

export {sendEmail};