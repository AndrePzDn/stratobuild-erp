const sendEmailWithTemplate = require('@/utils/nodeMailer');
const path = require('path');

const sendEmail = async (Model, req, res) => {
  const { id } = req.params;
  const budget = await Model.findById(id);

  if (!budget) {
    return res.status(404).json({ success: false, message: 'Budget not found' });
  }

  try {
    const emailData = {
      to: budget.client.email,
      subject: `Presupuesto para ${budget.client.name} - ${budget.name}`,
      budget,
    };

    const templatePath = path.join(__dirname, '../../../pdf/BudgetEmail.pug');
    await sendEmailWithTemplate(emailData, templatePath);

    return res.status(200).json({ success: true, message: 'Email sent successfully' });
    
  } catch (error) {
    console.error('Error sending email:', error);
    return res
      .status(500)
      .json({ success: false, message: 'Failed to send email', error: error.message });
  }
};

module.exports = sendEmail;
