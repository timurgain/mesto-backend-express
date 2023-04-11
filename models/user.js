const mongoose = require('mongoose');
const { isEmail } = require('validator');

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value) => isEmail(value),
      message: 'Invalid email format',
    },
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    minLength: 2,
    maxLength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minLength: 2,
    maxLength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    validate: {
      validator: (value) => /^(ftp|http|https):\/\/[^ "]+$/.test(value),
      message: 'Invalid URL format',
    },
  },
  __v: { type: Number, select: false },
});

module.exports = mongoose.model('user', userSchema);
