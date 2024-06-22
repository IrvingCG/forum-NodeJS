const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, default: 'user' },
  image: { type: String },
  password: { type: String, required: true }
});

module.exports = mongoose.model('User', UserSchema);
