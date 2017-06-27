const mongoose = require('mongoose');

//Feedback Schema
var feedbackSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId, /* Object ID for the user creator */
    ref: 'User',
    required: true
  },
  stars: [{
    type: mongoose.Schema.Types.ObjectId, /* Object ID from user */
    ref: 'User', /* User Schema. Remember to define it as this in the export module */
    unique: true
  }],
  comment: {
    type: String,
    required: true
  },
  pivot: { /* Bi-directional relation */
    type: mongoose.Schema.Types.ObjectId, /* Object ID for the user creator */
    ref: 'Pivot',
    required: true
  }
});

module.exports = mongoose.model('Feedback', feedbackSchema);
