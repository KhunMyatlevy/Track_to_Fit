// utils/sendEmail.js
const transporter = require('./emailConfig');

const sendVerificationEmail = (mailOptions, res) => {
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        reject({ message: 'Failed to send verification email', error: error });
      } else {
        console.log('Verification email sent:', info.response);
        resolve({ message: 'Verification email sent successfully' });
      }
    });
  });
};

module.exports = sendVerificationEmail;
