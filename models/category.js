const mongoose = require('mongoose');

// Categories Schema
var categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
      type: String,
      required: true,
      unique: true
    }
});

module.exports = mongoose.model('Category', categorySchema);
