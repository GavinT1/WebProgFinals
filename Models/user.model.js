const mongoose = require('mongoose');

//cart item schema
const CartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  variantId: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
});


const userSchema = new mongoose.Schema({
  // User fields
  name: {
    type: String,
    required: [true, 'Please provide a name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    match: [/.+\@.+\..+/, 'Please fill a valid email address'],
  },
  passwordHash: {
    type: String,
    required: [true, 'Please provide a password'],
  },

  // Admin Fields

  isAdmin:{
    type: Boolean,
    default: false,
  },
  
  //Cart Fields
  cart: [CartItemSchema],

  // Reset Password Fields
  resetPasswordToken: {
    type: String,
    required: false,
  },
  resetPasswordExpires: {
    type: Date,
    required: false,
  },
}, {
  timestamps: true 
});

module.exports = mongoose.model('User', userSchema);