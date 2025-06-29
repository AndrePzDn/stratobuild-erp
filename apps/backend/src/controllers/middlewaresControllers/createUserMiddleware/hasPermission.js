const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const UserModel = mongoose.model('Admin');
const PermissionsLevels = require('@/utils/permissionsList');

const hasPermission = async (req, res, next, { entityModel, action }) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  const verified = jwt.verify(token, process.env.JWT_SECRET);

  const user = await UserModel.findOne({ _id: verified.id, removed: false });

  if (!user) {
    return res.status(401).json({
      success: false,
      result: null,
      message: "User doesn't exist, authorization denied.",
      jwtExpired: true,
    });
  }
  const { role } = user;
  const permissions = PermissionsLevels[role] || {};

  if (!permissions[entityModel] || !permissions[entityModel].includes(action)) {
    return res.status(403).json({
      success: false,
      result: null,
      message: "User doesn't have permission to perform this action.",
    });
  }

  next();
};

module.exports = hasPermission;
