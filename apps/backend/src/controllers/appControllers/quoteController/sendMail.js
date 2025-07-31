const path = require('path');
const sendEmailWithTemplate = require('@/utils/nodeMailer');

const sendEmail = async (Model, req, res) => {
  const { id } = req.params;
  const quote = await Model.findById(id);

  if (!quote) {
    return res.status(404).json({ success: false, message: 'Quote not found' });
  }

  try {
    const emailData = {
      to: quote.client.email,
      subject: `Cotizacion para ${quote.client.name} - ${quote.name}`,
      quote,
    };

    const templatePath = path.join(__dirname, '../../../pdf/QuoteEmail.pug');
    await sendEmailWithTemplate(emailData, templatePath);

    return res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: 'Failed to send email', error: error.message });
  }
};

module.exports = sendEmail;
