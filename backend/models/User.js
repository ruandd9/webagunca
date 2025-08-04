const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nomeCompleto: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  senha: {
    type: String,
    required: true
  },
  criadoEm: {
    type: Date,
    default: Date.now
  },
  profileImage: {
    type: String,
    default: '' // base64 ou url
  },
  profileImageType: {
    type: String,
    default: '' // ex: 'image/png', 'image/jpeg'
  }
});

module.exports = mongoose.model('User', userSchema); 