const { email } = require('@/locale/translation/en_us');
const mongoose = require('mongoose');
const { generate } = require('shortid');

const create = async (userModel, req, res) => {
  const AdminModel = mongoose.model(userModel);
  const AdminPasswordModel = mongoose.model(userModel + 'Password');
  const newAdminPassword = new AdminPasswordModel();

  const salt = generate();
  const passwordHash = newAdminPassword.generateHash(
    salt,
    req.body.name.toLowerCase() + req.body.surname.toLowerCase()
  );

  console.log('Creating user with salt:', salt, passwordHash);

  const { body } = req;

  const newUser = await new AdminModel({
    enabled: true,
    ...body,
  }).save();

  await new AdminPasswordModel({
    password: passwordHash,
    emailVerified: true,
    salt: salt,
    user: newUser._id,
  }).save();

  return res.status(200).json({
    success: true,
    result: newUser,
    message: 'Successfully created the user',
  });
};

module.exports = create;
