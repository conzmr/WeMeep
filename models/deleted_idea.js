const mongoose = require('mongoose')

var deletedIdeaSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId, /* Object ID for the user administrator */
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: String,
  problem: String,
  category: {
    type: mongoose.Schema.Types.ObjectId, /* Object ID for the category */
    ref: 'Category',
    required:true
  },
   interests: [{
      _id: {
        type: mongoose.Schema.Types.ObjectId, /* Object ID from User */
        ref: 'User' /* User Schema. Remember to define it as this in the export module */
      },
      /* This type could be: money, love, like, dislike */
      type: {
        type: String,
        required: true
      }
  }],
  views: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    unique: true
  }],
  comment: String
});

module.exports = mongoose.model('DeletedIdea', deletedIdeaSchema);
