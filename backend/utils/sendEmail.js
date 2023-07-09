const nodeMailer = require('nodemailer');

const sendEmail = async (options) => {
    // object destructuring
    const { email, subject, message } = options;
    const transporter = nodeMailer.createTransport({ // creating a transport object for sending email messages

        // email service (ex: gmail)
        service: process.env.SMTP_SERVICE,

        // username and password of the mail which we want to use to send the emails
        auth: {
            user: process.env.SMTP_MAIL,
            pass: process.env.SMTP_PASSWORD,
        }
    });

    // options to be filled in the mail body for sending mail
    const mailOptions = {
        from: process.env.SMTP_MAIL,
        to: email,
        subject: subject,
        text: message
    }

    // sending mail using the configured transport object to the mail in the mailOptions object
    await transporter.sendMail(mailOptions);
};

// exporting function
module.exports = sendEmail;