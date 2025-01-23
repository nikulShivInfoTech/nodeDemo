const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: {
    type: String,
    enum: ['admin', 'customer'], 
    default: 'customer'
  }
});

const userModel = mongoose.model('users', userSchema);

module.exports = userModel;
