import nodemailer from 'nodemailer'

const sendMail = (user, htmlMsg, subject) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: "therealrambo08@gmail.com",
            pass: 'fcpu ksiq naol ladr'
        }
    });

    async function mailSend() {
        // send mail with defined transport object
        const info = await transporter.sendMail({
            from: "therealrambo08@gmail.com", // sender address
            to: user.email, // list of receivers
            subject: subject, // Subject line
            html: htmlMsg, // html body
        });
    }
    mailSend().catch(console.error)
}

export default sendMail ;