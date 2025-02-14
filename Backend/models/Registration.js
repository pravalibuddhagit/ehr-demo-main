const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const registrationSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
    maxlength: 35,
    match: /^[A-Za-z]+/,
  },
  last_name: {
    type: String,
    required: true,
    maxlength: 35,
    match: /^[A-Za-z]+/,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  password: {
    type: String,
    required: true,
  
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  updatedDate: {
    type: Date,
    default: Date.now,
  },
});

// Hash the password before saving
registrationSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Update the updatedDate before saving
registrationSchema.pre('findOneAndUpdate', function(next) {
  this._update.updatedDate = Date.now();
  next();
});

module.exports = mongoose.model('Registration', registrationSchema);
