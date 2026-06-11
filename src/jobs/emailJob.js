import nodemailer from 'nodemailer'

async function sendMailJob(job) {

    const {to , subject , body} = job.data;
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: `${process.env.MAIL_USER}`,
            pass: `${process.env.MAIL_PASS}`
        }
    })

    const emailOptions = {
        from: 'divyanshgiri13.9dvbps@gmail.com',
        to: to,
        subject: subject,
        text: body
    }
    
    const mail = await transporter.sendMail(emailOptions);
    if(mail){
        return "Email successfully sent"
    }else{
        return "Email coudnt be sent"
    }
}

export default sendMailJob;
