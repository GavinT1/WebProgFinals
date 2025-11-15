const nodeMailer = require('nodemailer');

const sendEmail = async (options) => {

    const transporter = nodeMailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: 'GadgeetzDB <${process.env.EMAIL_USER}>',
        to: options.to, 
        subject: options.subject,
        text: options.html
    }; 

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;