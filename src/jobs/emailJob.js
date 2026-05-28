import nodemailer from 'nodemailer'

function sendMailJob(job) {

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

    transporter.sendMail(emailOptions, (err, info) => {
        if (err) {
            console.log(err);
        } else {
            console.log("Email sent:", info.response);
        }
    });
}

export default sendMailJob;
