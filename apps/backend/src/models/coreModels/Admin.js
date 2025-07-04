const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RolesEnum = [
  'Admin',
  'ProjectManager',
  'SiteSupervisor',
  'Accountant',
  'InventoryManager',
  'GeneralDirector',
];

const adminSchema = new Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: false,
  },

  email: {
    type: String,
    lowercase: true,
    trim: true,
    required: true,
    unique: true,
  },
  name: { type: String, required: true },
  surname: { type: String },
  photo: {
    type: String,
    trim: true,
  },
  haveToUpdatePassword: {
    type: Boolean,
    default: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  role: {
    type: String,
    default: 'Admin',
    enum: RolesEnum,
  },
});

module.exports = mongoose.model('Admin', adminSchema);
