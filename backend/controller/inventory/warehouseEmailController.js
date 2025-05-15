
const nodemailer = require('nodemailer');

const sendEmail = async (req, res) => {
  const { to, subject, text } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'ceyloncoirlimited@gmail.com',  
        pass: 'hfpc ylez xzqm hugu',                
      },
    });

    const mailOptions = {
      from: 'ceyloncoirlimited@gmail.com',
      to,
      subject,
      text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent:', info.response);

    res.status(200).json({ message: 'Email sent successfully' });
    
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    res.status(500).json({ message: 'Failed to send email', error: error.message });
  }
};

module.exports = { sendEmail };

