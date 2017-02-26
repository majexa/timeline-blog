const mongoose = require('mongoose');

module.exports = mongoose.Schema({
  dt: {
    type: Date,
    default: Date.now,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  postType: {
    type: String
  },
  zsfsadf: {
    type: String,
    required: true
  },
  text: {
    type: String
  }
});
