const pug = require('pug');
const nodemailer = require('nodemailer');

const sendEmailWithTemplate = (emailData, pugTemplatePath) => {
  const trasporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'andyperdur62@gmail.com',
      pass: 'olmeswvuhracmrhn',
    },
  });

  const compiledFunction = pug.compileFile(pugTemplatePath);
  const html = compiledFunction(emailData);

  const mailOptions = {
    from: 'andyperdur62@gmail.com',
    to: emailData.to,
    subject: emailData.subject,
    html,
  };

  return trasporter.sendMail(mailOptions)
};

module.exports = sendEmailWithTemplate;
