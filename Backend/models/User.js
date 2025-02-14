const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true, maxlength: 35, match: /^[A-Za-z]+/ },
  last_name: { type: String, required: true, maxlength: 35, match: /^[A-Za-z]+/ },
  email: { type: String, unique: true, required: true, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  mobile_phone: { type: String, required: true, maxlength: 10 },
  address_line_1: { type: String, required: true, maxlength: 40 },
  address_line_2: { type: String, maxlength: 100 },
  city: { type: String, required: true, maxlength: 35 },
  state: { type: String, required: true, maxlength: 20 },
  zipcode: { type: String, required: true, match: /^\d{5}(\d{4})?$/ },
  country: { type: String, default: 'UK' },
  dob: { type: Date, required: true },
  notes: { type: String },
  gender: { type: String, enum: ['male', 'female', 'other'], required: true },
  agreeToTerms: { type: Boolean, required: true },
  allowNotifications: { type: Boolean, default: false },
  deleted: { type: Boolean, default: false },
});

module.exports = mongoose.model('User', userSchema);
