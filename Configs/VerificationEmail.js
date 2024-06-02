const nodemailer = require('nodemailer');

// Function to send verification email
const sendVerificationEmail = async (email, verificationToken) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'FDRS1697@gmail.com',
        pass: process.env.pass, // Use process.env.PASSWORD to access environment variable securely
      },
    });

    const mailOptions = {
      from: 'FDRS1697@gmail.com',
      to: email,
      subject: 'Email Verification',
      html: `
                <p>Please click the button below to verify your email:</p>
                <a href="http://localhost:3000/verify/${verificationToken}" style="display:inline-block;padding:10px 20px;background-color:#007bff;color:#ffffff;text-decoration:none;border-radius:5px;">Verify Email</a>
            `,
    }; //Change the http://YouDomain/...

    // Send mail with defined transport object
    let info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error; // Rethrow the error to handle it outside this function
  }
};

module.exports = sendVerificationEmail;
