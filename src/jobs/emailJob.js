import nodemailer from 'nodemailer'

function sendMailJob() {
    console.log(process.env.MAIL_USER);
console.log(process.env.MAIL_PASS);
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: `${process.env.MAIL_USER}`,
            pass: `${process.env.MAIL_PASS}`
        }
    })

    const emailOptions = {
        from: 'divyanshgiri13.9dvbps@gmail.com',
        to: 'divyanshgirivbps@gmail.com',
        subject: 'hii man',
        body: 'hii this is my first text'
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
